<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { api, ApiError, type CharacterDto, type GaugeDto, type StoryStatus } from '$lib/api';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import type { TreeNode } from '$lib/components/story-tree.svelte';
  import Step1Upload from './steps/Step1Upload.svelte';
  import Step2Characters from './steps/Step2Characters.svelte';
  import Step3Gauges from './steps/Step3Gauges.svelte';
  import Step4Ending from './steps/Step4Ending.svelte';
  import Step5Tree from './steps/Step5Tree.svelte';
  import Step6Generating from './steps/Step6Generating.svelte';
  import Step7Complete from './steps/Step7Complete.svelte';
  
  // 단계 상태
  let currentStep = $state(1);
  let storyId = $state('');
  
  // 1단계: 소설 텍스트 입력
  let title = $state('');
  let novelText = $state('');
  let genre = $state('');
  let uploadedFile = $state<File | null>(null);
  let uploadProgress = $state(0);
  let uploading = $state(false);
  
  // 2단계: 등장인물 & 요약 (자동 추출)
  let summary = $state('');
  let characters = $state<CharacterDto[]>([]);
  let expandedCharacters = $state<Set<string>>(new Set());
  let loadingAnalysis = $state(false);
  
  // 3단계: 게이지 선택 (5개 → 2개 선택)
  let proposedGauges = $state<GaugeDto[]>([]);
  let selectedGaugeIds = $state<string[]>([]);
  let loadingGauges = $state(false);
  let selectingGauges = $state(false);
  
  // 4단계: 엔딩 설계
  let description = $state('');
  let endingConfig = $state<{ [key: string]: number }>({
    happy: 2,
    tragic: 1,
    neutral: 1,
    open: 1,
    bad: 0
  });
  let numEpisodes = $state(5);
  let maxDepth = $state(3);
  let numEpisodeEndings = $state(3);
  let configuringStory = $state(false);
  
  // 5-6단계: 스토리 생성 중 (동기 방식)
  let generating = $state(false);
  let progressMessage = $state('');
  let currentEpisode = $state(1);  // 현재 생성 중인 에피소드
  let totalEpisodesGenerated = $state(0);  // 생성 완료된 에피소드 수
  let actualTotalEpisodes = $state(0);  // 설정된 총 에피소드 수
  
  // 5단계: 트리 편집 관련
  let currentEpisodeTree = $state<TreeNode | null>(null);  // 현재 에피소드의 트리 데이터
  let currentEpisodeTitle = $state('');  // 현재 에피소드 제목
  let selectedNode = $state<TreeNode | null>(null);  // 선택된 노드
  let regenerating = $state(false);  // 서브트리 재생성 중
  let treeEditMode = $state(false);  // 트리 편집 모드 여부
  
  // 7단계: 완료
  let storyDataId = $state<number | null>(null);
  let metadata = $state<any>(null);
  let error = $state('');
  
  // 상태 저장/복원 키
  const STORAGE_KEY = 'wizard-state';
  
  // 상태 저장 함수 (sessionStorage 사용 - 탭이 열려있는 동안만 유지)
  function saveState() {
    try {
      const state = {
        currentStep,
        storyId,
        title,
        description,
        genre,
        summary,
        characters: characters.map(c => ({ ...c })),
        selectedGaugeIds: [...selectedGaugeIds],
        endingConfig: { ...endingConfig },
        numEpisodes,
        maxDepth,
        numEpisodeEndings,
        currentEpisode,
        totalEpisodesGenerated,
        actualTotalEpisodes,
        currentEpisodeTitle,
        storyDataId,
        metadata,
        // 트리 편집 관련 상태 추가
        treeEditMode,
        currentEpisodeTree: currentEpisodeTree ? JSON.parse(JSON.stringify(currentEpisodeTree)) : null,
        proposedGauges: proposedGauges.map(g => ({ ...g }))
      };
      // sessionStorage: F5 새로고침 시 유지, 탭/브라우저 닫으면 초기화
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('상태 저장 실패:', err);
    }
  }
  
  // 상태 복원 함수
  function restoreState() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      
      const state = JSON.parse(saved);
      if (state.currentStep) currentStep = state.currentStep;
      if (state.storyId) storyId = state.storyId;
      if (state.title) title = state.title;
      if (state.description) description = state.description;
      if (state.genre) genre = state.genre;
      if (state.summary) summary = state.summary;
      if (state.characters) characters = state.characters;
      if (state.selectedGaugeIds) selectedGaugeIds = state.selectedGaugeIds;
      if (state.endingConfig) endingConfig = state.endingConfig;
      if (state.numEpisodes) numEpisodes = state.numEpisodes;
      if (state.maxDepth) maxDepth = state.maxDepth;
      if (state.numEpisodeEndings) numEpisodeEndings = state.numEpisodeEndings;
      if (state.currentEpisode) currentEpisode = state.currentEpisode;
      if (state.totalEpisodesGenerated) totalEpisodesGenerated = state.totalEpisodesGenerated;
      if (state.actualTotalEpisodes) actualTotalEpisodes = state.actualTotalEpisodes;
      if (state.currentEpisodeTitle) currentEpisodeTitle = state.currentEpisodeTitle;
      if (state.storyDataId) storyDataId = state.storyDataId;
      if (state.metadata) metadata = state.metadata;
      // 트리 편집 관련 상태 복원
      if (state.treeEditMode !== undefined) treeEditMode = state.treeEditMode;
      if (state.currentEpisodeTree) currentEpisodeTree = state.currentEpisodeTree;
      if (state.proposedGauges) proposedGauges = state.proposedGauges;
    } catch (err) {
      console.warn('상태 복원 실패:', err);
    }
  }
  
  // 상태 초기화 함수 (로그아웃 시 호출용)
  function clearWizardState() {
    sessionStorage.removeItem(STORAGE_KEY);
  }
  
  // 상태 변경 감지 및 저장 - 모든 상태 변수 추적
  $effect(() => {
    // 모든 상태를 추적
    const _ = currentStep;
    const __ = storyId;
    const ___ = title;
    const ____ = description;
    const _____ = summary;
    const ______ = characters.length;
    const _______ = selectedGaugeIds.length;
    const ________ = numEpisodes;
    const _________ = maxDepth;
    const __________ = currentEpisode;
    const ___________ = storyDataId;
    // 트리 편집 관련 상태 추적
    const ____________ = treeEditMode;
    const _____________ = currentEpisodeTree;
    const ______________ = proposedGauges.length;
    
    // 약간의 지연 후 저장 (성능 최적화)
    const timeoutId = setTimeout(() => {
      saveState();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  });
  
  // 인증 확인 및 상태 복원
  onMount(() => {
    if (!api.auth.isAuthenticated()) {
      alert('로그인이 필요합니다.');
      goto('/login');
      return;
    }
    
    // 기존 localStorage의 wizard-state 삭제 (마이그레이션)
    localStorage.removeItem(STORAGE_KEY);
    
    // 상태 복원 (sessionStorage에서)
    restoreState();
    
    // 페이지 언로드 시 상태 저장
    const handleBeforeUnload = () => {
      saveState();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // 컴포넌트 언마운트 시에도 저장
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveState();
    };
  });
  
  const steps = [
    { number: 1, title: '소설 텍스트', desc: '전문 입력' },
    { number: 2, title: '등장인물', desc: '자동 추출' },
    { number: 3, title: '게이지', desc: '5개 → 2개 선택' },
    { number: 4, title: '엔딩', desc: '예상 엔딩 설계' },
    { number: 5, title: '트리 편집', desc: '노드 수정/검토' },
    { number: 6, title: '에피소드 생성', desc: '순차 생성' },
    { number: 7, title: '완료', desc: '체크/등록' },
  ];
  
  function canGoNext(): boolean {
    switch (currentStep) {
      case 1: 
        // 파일이 있어야 함
        return uploadedFile !== null && title.length > 0;
      case 2: return characters.length > 0 && summary.length > 0;
      case 3: return selectedGaugeIds.length === 2;
      case 4: return true;
      case 5: case 6: return false; // 자동 진행
      case 7: return storyDataId !== null;
      default: return false;
    }
  }
  
  function setTitleValue(value: string) {
    title = value;
  }

  function setDescriptionValue(value: string) {
    description = value;
  }

  function setGenreValue(value: string) {
    genre = value;
  }

  function clearUploadedFile() {
    uploadedFile = null;
  }

  function toggleGauge(gaugeId: string) {
    if (selectedGaugeIds.includes(gaugeId)) {
      selectedGaugeIds = selectedGaugeIds.filter(id => id !== gaugeId);
    } else if (selectedGaugeIds.length < 2) {
      selectedGaugeIds = [...selectedGaugeIds, gaugeId];
    } else {
      // 이미 2개 선택됨: 첫 번째를 제거하고 새로운 것 추가
      selectedGaugeIds = [selectedGaugeIds[1], gaugeId];
    }
  }

  function toggleCharacter(name: string) {
    const next = new Set(expandedCharacters);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    expandedCharacters = next;
  }

  function truncate(text: string, maxLength = 140) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  }

  function handleEndingChange(key: string, value: number) {
    endingConfig = { ...endingConfig, [key]: value };
  }

  function handleNumEpisodesChange(value: number) {
    numEpisodes = value;
  }

  function handleMaxDepthChange(value: number) {
    maxDepth = value;
  }

  function handleNumEpisodeEndingsChange(value: number) {
    numEpisodeEndings = value;
  }
  
  // 1단계: 소설 업로드
  async function uploadNovel() {
    console.log('uploadNovel 호출됨');
    console.log('canGoNext:', canGoNext());
    console.log('title:', title);
    console.log('uploadedFile:', uploadedFile);
    console.log('novelText length:', novelText.length);
    
    if (!canGoNext()) {
      alert('제목과 소설 파일을 입력해주세요');
      return;
    }
    
    uploading = true;
    uploadProgress = 0;
    error = '';
    
    try {
      let response;
      
      // 파일이 있는 경우: S3 업로드 방식 사용
      if (uploadedFile) {
        console.log('S3 업로드 방식 사용...');
        
        // 1. S3에 파일 업로드
        const fileKey = await api.upload.uploadStoryFile(uploadedFile, (progress) => {
          uploadProgress = progress;
          console.log(`업로드 진행률: ${progress.toFixed(1)}%`);
        });
        
        console.log('S3 업로드 완료, fileKey:', fileKey);
        
        // 2. 백엔드에 분석 요청
        response = await api.story.uploadNovelFromS3({
          title,
          description,
          genre,
          fileKey
        });
      } else {
        throw new Error('파일을 선택해주세요');
      }
      
      console.log('업로드 성공:', response);
      
      // 업로드 직후 status 체크
      if (response.status === 'FAILED') {
        throw new Error('파일 분석에 실패했습니다. 파일 형식이나 내용을 확인해주세요.');
      }
      
      storyId = response.storyId;
      currentStep = 2;
      
      // 2단계로 이동 후 자동으로 분석 데이터 로드
      loadAnalysisData();
    } catch (err: any) {
      console.error('업로드 실패:', err);
      if (err instanceof ApiError) {
        error = err.data?.message || '소설 업로드에 실패했습니다.';
        alert('업로드 실패: ' + error);
      } else {
        error = '네트워크 오류가 발생했습니다.';
        alert('네트워크 오류: ' + err.message);
      }
    } finally {
      uploading = false;
      uploadProgress = 0;
    }
  }
  
  // 2단계: 분석 데이터 로드 (폴링)
  async function loadAnalysisData() {
    loadingAnalysis = true;
    
    try {
      // 진행률 폴링: CHARACTERS_READY가 될 때까지
      const checkProgress = async (): Promise<void> => {
        const progressData = await api.story.getProgress(storyId);
        
        if (progressData.status === 'CHARACTERS_READY' || progressData.status === 'GAUGES_READY') {
          // 요약과 캐릭터 로드
          const [summaryData, charactersData] = await Promise.all([
            api.story.getSummary(storyId),
            api.story.getCharacters(storyId)
          ]);
          
          summary = summaryData.summary;
          characters = charactersData.characters;
          loadingAnalysis = false;
        } else if (progressData.status === 'FAILED') {
          const errorMsg = progressData.progress?.error || '분석에 실패했습니다';
          console.error('분석 실패 상세:', progressData);
          throw new Error(`파일 분석 실패: ${errorMsg}\n\n파일 형식이나 내용을 확인해주세요.`);
        } else {
          // 3초 후 다시 체크
          setTimeout(() => checkProgress(), 3000);
        }
      };
      
      await checkProgress();
    } catch (err: any) {
      console.error('분석 데이터 로드 실패:', err);
      error = err.message || '분석에 실패했습니다.';
      loadingAnalysis = false;
    }
  }
  
  async function nextStep() {
    console.log('nextStep 호출됨, currentStep:', currentStep);
    
    try {
      if (currentStep === 1) {
        console.log('1단계: uploadNovel 호출');
        await uploadNovel();
      } else if (currentStep === 2) {
        console.log('2단계: 게이지 로드');
        // 2단계 → 3단계: 게이지 로드
        currentStep = 3;
        await loadGauges();
      } else if (currentStep === 3) {
        console.log('3단계: 게이지 선택 제출');
        // 3단계 → 4단계: 게이지 선택 제출
        await submitGaugeSelection();
      } else if (currentStep === 4) {
        console.log('4단계: 설정 제출 & 생성 시작');
        // 4단계 → 5단계: 설정 제출 & 생성 시작
        await submitConfig();
      } else if (canGoNext()) {
        console.log('일반 다음 단계');
        currentStep++;
      }
    } catch (error) {
      console.error('nextStep 에러:', error);
      alert('에러 발생: ' + error);
    }
  }
  
  // 3단계: 게이지 제안 로드
  async function loadGauges() {
    loadingGauges = true;
    error = '';
    
    try {
      const response = await api.story.getGauges(storyId);
      proposedGauges = response.gauges;
    } catch (err: any) {
      console.error('게이지 로드 실패:', err);
      if (err instanceof ApiError) {
        error = err.data?.message || '게이지 로드에 실패했습니다.';
      } else {
        error = '네트워크 오류가 발생했습니다.';
      }
    } finally {
      loadingGauges = false;
    }
  }
  
  // 3단계: 게이지 선택 제출
  async function submitGaugeSelection() {
    if (selectedGaugeIds.length !== 2) {
      alert('게이지를 정확히 2개 선택해주세요.');
      return;
    }
    
    selectingGauges = true;
    error = '';
    
    try {
      await api.story.selectGauges(storyId, {
        selectedGaugeIds
      });
      
      currentStep = 4;
    } catch (err: any) {
      console.error('게이지 선택 실패:', err);
      if (err instanceof ApiError) {
        error = err.data?.message || '게이지 선택에 실패했습니다.';
      } else {
        error = '네트워크 오류가 발생했습니다.';
      }
    } finally {
      selectingGauges = false;
    }
  }
  
  // 4단계: 설정 제출 & 생성 시작 (동기 방식)
  async function submitConfig() {
    configuringStory = true;
    generating = true;
    error = '';
    currentEpisode = 1;
    totalEpisodesGenerated = 0;
    actualTotalEpisodes = numEpisodes;
    currentStep = 5;
    progressMessage = '에피소드 1 생성 중... (약 1-2분 소요)';
    
    try {
      // 설정 저장
      await api.story.configureStory(storyId, {
        description,
        numEpisodes,
        maxDepth,
        endingConfig,
        numEpisodeEndings
      });
      
      // 에피소드 1 생성 (동기 - 완료될 때까지 대기)
      console.log('EP1 생성 시작 (동기 방식)...');
      console.log('StoryId:', storyId);
      
      const episodeData = await api.story.startEpisodeGeneration(storyId);
      console.log('EP1 생성 완료:', episodeData);
      console.log('EpisodeData 구조:', {
        hasNodes: !!episodeData.nodes,
        nodesLength: episodeData.nodes?.length || 0,
        title: episodeData.title,
        order: episodeData.order,
        keys: Object.keys(episodeData)
      });
      
      if (episodeData.nodes && episodeData.nodes.length > 0) {
        console.log('첫 번째 노드:', episodeData.nodes[0]);
      }
      
      // 트리 편집 모드로 진입
      enterTreeEditMode(episodeData);
      
    } catch (err: any) {
      console.error('생성 실패:', err);
      if (err instanceof ApiError) {
        error = err.data?.message || err.message || '스토리 생성에 실패했습니다.';
        console.error('API 에러 상세:', {
          status: err.status,
          data: err.data,
          message: err.message
        });
      } else {
        error = err.message || '네트워크 오류가 발생했습니다.';
        console.error('일반 에러:', err);
      }
      generating = false;
      // 에러 발생 시 Step 4에 머물도록 (사용자가 다시 시도할 수 있게)
      currentStep = 4;
    } finally {
      configuringStory = false;
    }
  }
  
  // NOTE: 폴링 함수 제거됨 - 동기 방식 API로 변경되어 더 이상 필요 없음
  
  // 결과 직접 조회 (재시도 로직 포함)
  async function loadResultDirectly() {
    const maxRetries = 5;
    let retryCount = 0;
    
    const tryLoad = async (): Promise<void> => {
      try {
        retryCount++;
        console.log(`결과 조회 시도 ${retryCount}/${maxRetries}... storyId:`, storyId);
        
        const result = await api.story.getResult(storyId);
        console.log('✅ 결과 조회 성공:', result);
        
        storyDataId = result.storyDataId;
        metadata = result.metadata;
        
        currentStep = 7;
        generating = false;
        
        alert('🎉 스토리 생성이 완료되었습니다!');
        
      } catch (err: any) {
        console.error(`결과 조회 실패 (${retryCount}/${maxRetries}):`, err);
        
        if (retryCount < maxRetries) {
          // 재시도
          console.log(`⏳ 5초 후 다시 시도...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          await tryLoad();
        } else {
          // 최대 재시도 초과
          console.error('=== 최종 에러 정보 ===');
          console.error('storyId:', storyId);
          console.error('에러 객체:', err);
          if (err instanceof ApiError) {
            console.error('API Error Status:', err.status);
            console.error('API Error Data:', err.data);
          }
          
          if (err instanceof ApiError && err.status === 404) {
            error = '❌ 스토리를 찾을 수 없습니다 (404)\n\n' + 
                    `storyId: ${storyId}\n` +
                    '백엔드에서 생성은 완료되었지만 결과를 저장하지 못했을 수 있습니다.\n\n' +
                    '백엔드 콘솔 로그를 확인해주세요.';
          } else if (err instanceof ApiError && err.status === 500) {
            error = `❌ 백엔드 서버 내부 오류 (500)\n\n` +
                    `storyId: ${storyId}\n` +
                    `에러 메시지: ${err.data?.message || err.message}\n\n` +
                    '백엔드 콘솔에서 다음을 확인하세요:\n' +
                    '1. Exception 스택 트레이스\n' +
                    '2. /api/stories/${storyId}/result 관련 로그\n' +
                    '3. 데이터베이스 연결 상태\n' +
                    '4. AI 서버 응답 데이터';
          } else if (err instanceof ApiError) {
            error = `❌ API 에러 (${err.status})\n\n` +
                    `storyId: ${storyId}\n` +
                    `메시지: ${err.data?.message || err.message}`;
          } else {
            error = `❌ 네트워크 오류\n\n` +
                    `storyId: ${storyId}\n` +
                    `메시지: ${err.message}`;
          }
          
          generating = false;
        }
      }
    };
    
    await tryLoad();
  }
  
  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }
  
  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    // 파일 타입 검증 (.txt, .pdf, .doc, .docx)
    const allowedTypes = ['.txt', '.pdf', '.doc', '.docx'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      alert('지원하는 파일 형식: .txt, .pdf, .doc, .docx');
      input.value = '';
      return;
    }
    
    // 파일 크기 검증 (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      input.value = '';
      return;
    }
    
    try {
      uploadedFile = file;
      novelText = ''; // 파일 선택 시 텍스트 입력 초기화
      
      // 제목이 없으면 파일명으로 자동 설정
      if (!title) {
        title = file.name.replace(/\.(txt|pdf|doc|docx)$/i, '');
      }
      
      console.log('파일 선택됨:', file.name, `(${(file.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error('파일 처리 실패:', err);
      error = '파일을 처리할 수 없습니다.';
      uploadedFile = null;
    }
  }
  
  // 5-6단계: 진행률 폴링 (현재 사용 안 함 - 에러 발생으로 임시 비활성화)
  /*
  async function pollProgress() {
    generating = true;
    error = '';
    let pollCount = 0;
    const maxPolls = 200; // 최대 10분 (3초 * 200)
    
    const poll = async (): Promise<void> => {
      try {
        pollCount++;
        console.log(`폴링 ${pollCount}회차, storyId:`, storyId);
        
        const progressData = await api.story.getProgress(storyId);
        console.log('진행률 데이터:', progressData);
        
        progress = progressData.progress?.percentage || 0;
        progressMessage = progressData.progress?.message || '';
        currentPhase = progressData.progress?.currentPhase || '';
        
        // 5단계 (스토리 트리 생성): progress < 50
        if (progress < 50 && currentStep === 5) {
          // 계속 5단계 유지
        } 
        // 6단계 (디테일 추정): progress >= 50 && progress < 100
        else if (progress >= 50 && progress < 100 && currentStep === 5) {
          currentStep = 6;
        }
        
        if (progressData.status === 'COMPLETED') {
          // 완료: 결과 로드
          console.log('생성 완료! 결과 로드 중...');
          progress = 100;
          await loadResult();
        } else if (progressData.status === 'FAILED') {
          const errorMsg = progressData.progress?.error || '알 수 없는 오류';
          console.error('백엔드에서 FAILED 상태 반환:', errorMsg);
          console.error('전체 진행률 데이터:', JSON.stringify(progressData, null, 2));
          
          // 에러 메시지 상세히 표시
          error = `생성 실패: ${errorMsg}\n\n` +
                  `현재 단계: ${currentPhase}\n` +
                  `진행률: ${progress}%\n` +
                  `메시지: ${progressMessage}`;
          
          generating = false;
        } else if (pollCount >= maxPolls) {
          console.error('폴링 타임아웃');
          error = '생성 시간이 너무 오래 걸립니다. 잠시 후 다시 시도해주세요.';
          generating = false;
        } else {
          // 3초 후 다시 체크
          setTimeout(() => poll(), 3000);
        }
      } catch (err: any) {
        console.error('진행률 조회 중 예외 발생:', err);
        if (err instanceof ApiError) {
          error = `API 에러: ${err.status} - ${err.data?.message || err.message}`;
        } else {
          error = `네트워크 에러: ${err.message}`;
        }
        generating = false;
      }
    };
    
    await poll();
  }
  */
  
  // 7단계: 완료 결과 로드 (구버전 - 사용 안 함)
  /*
  async function loadResult() {
    try {
      const result = await api.story.getResult(storyId);
      
      storyDataId = result.storyDataId;
      metadata = result.metadata;
      
      currentStep = 7;
      generating = false;
    } catch (err: any) {
      console.error('결과 로드 실패:', err);
      error = '결과 로드에 실패했습니다.';
      generating = false;
    }
  }
  */
  
  function startPlaying() {
    if (storyDataId) {
      goto(`/play/${storyDataId}`);
    }
  }
  
  // === 트리 편집 관련 함수 ===
  
  // 노드 선택 핸들러
  function handleNodeSelect(event: CustomEvent<{ node: TreeNode }>) {
    selectedNode = event.detail.node;
    console.log('노드 선택됨:', selectedNode?.id);
  }
  
  // 노드 수정 적용 (서브트리 재생성) - 백엔드 동기 API 사용
  async function handleApplyChanges(event: CustomEvent<{ 
    nodeId: string; 
    newText: string; 
    newChoices: Array<{ text: string; tags: string[] }>;
    newImagePrompt?: string;
  }>) {
    if (!selectedNode || !currentEpisodeTree) return;
    
    const { nodeId, newText, newChoices, newImagePrompt } = event.detail;
    
    regenerating = true;
    error = '';
    
    try {
      console.log('서브트리 재생성 요청:', { nodeId, newText, newImagePrompt });
      
      // 이미지 프롬프트 업데이트 (트리에 직접 반영)
      if (newImagePrompt !== undefined) {
        updateNodeImagePrompt(nodeId, newImagePrompt);
      }
      
      // 백엔드 API를 통한 서브트리 재생성 (동기 방식)
      const response = await api.story.regenerateSubtree(
        storyId,
        currentEpisode,
        nodeId,
        {
          nodeText: newText,
          choices: newChoices.map(c => c.text),
          situation: selectedNode.details?.situation || '',
          npcEmotions: selectedNode.details?.npc_emotions || {},
          tags: newChoices.flatMap(c => c.tags)
        }
      );
      
      console.log('서브트리 재생성 완료:', response.totalNodesRegenerated, '개 노드');
      
      // 트리 업데이트 (재생성된 노드들로 교체)
      updateTreeWithRegeneratedNodes(nodeId, response.regeneratedNodes);
      
      // 재생성 후 이미지 프롬프트 다시 설정 (재생성으로 노드가 교체될 수 있음)
      if (newImagePrompt !== undefined) {
        updateNodeImagePrompt(nodeId, newImagePrompt);
      }
      
      selectedNode = null;
      alert(`✅ 서브트리 재생성 완료! ${response.totalNodesRegenerated}개 노드가 업데이트되었습니다.`);
      
    } catch (err: any) {
      console.error('서브트리 재생성 실패:', err);
      if (err instanceof ApiError) {
        error = err.data?.message || '서브트리 재생성에 실패했습니다.';
      } else {
        error = err.message || '서브트리 재생성에 실패했습니다.';
      }
      alert('❌ 서브트리 재생성 실패: ' + error);
    } finally {
      regenerating = false;
    }
  }
  
  // 노드의 이미지 프롬프트 업데이트 (트리 내부)
  function updateNodeImagePrompt(nodeId: string, imagePrompt: string) {
    if (!currentEpisodeTree) return;
    
    function updateNode(node: TreeNode): boolean {
      if (node.id === nodeId) {
        node.imagePrompt = imagePrompt;
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (updateNode(child)) {
            return true;
          }
        }
      }
      return false;
    }
    
    updateNode(currentEpisodeTree);
    
    // selectedNode도 업데이트
    if (selectedNode && selectedNode.id === nodeId) {
      selectedNode.imagePrompt = imagePrompt;
    }
  }
  
  // 트리에서 특정 노드를 재생성된 노드로 교체
  function updateTreeWithRegeneratedNodes(parentNodeId: string, regeneratedNodes: any[]) {
    if (!currentEpisodeTree || regeneratedNodes.length === 0) return;
    
    // 재귀적으로 트리를 순회하며 해당 노드를 찾아 교체
    function findAndReplace(node: TreeNode): TreeNode {
      if (node.id === parentNodeId) {
        // 재생성된 첫 번째 노드로 교체 (부모 노드 포함)
        const newNode = convertToTreeNode(regeneratedNodes[0]);
        return newNode;
      }
      
      if (node.children && node.children.length > 0) {
        node.children = node.children.map(child => findAndReplace(child));
      }
      
      return node;
    }
    
    currentEpisodeTree = findAndReplace({ ...currentEpisodeTree });
  }
  
  // API 응답을 TreeNode 형식으로 변환
  function convertToTreeNode(apiNode: any): TreeNode {
    if (!apiNode) {
      console.warn('convertToTreeNode: apiNode is null or undefined');
      return {
        id: 'unknown',
        text: 'Unknown node',
        depth: 0,
        choices: [],
        children: []
      };
    }
    
    // 백엔드 StoryNodeDto 구조:
    // - id, depth, text, details (situation, npc_emotions, relations_update)
    // - choices (StoryChoiceDto[])
    // - children (StoryNodeDto[])
    // - parent_id
    
    const node: TreeNode = {
      id: apiNode.id || apiNode.nodeId || String(Math.random()),
      text: apiNode.text || 'No text',
      depth: apiNode.depth ?? 0,
      choices: [],
      children: [],
      details: {},
      imagePrompt: apiNode.imagePrompt || apiNode.image_prompt || undefined,
      imageUrl: apiNode.imageUrl || apiNode.image_url || undefined
    };
    
    // choices 변환 (StoryChoiceDto -> { text, tags }[])
    if (apiNode.choices && Array.isArray(apiNode.choices)) {
      node.choices = apiNode.choices.map((choice: any) => ({
        text: choice.text || '',
        tags: choice.tags || []
      }));
    }
    
    // details 변환
    if (apiNode.details) {
      node.details = {
        situation: apiNode.details.situation,
        npc_emotions: apiNode.details.npc_emotions || apiNode.details.npcEmotions || {},
        relations_update: apiNode.details.relations_update || apiNode.details.relationsUpdate || {}
      };
    } else {
      // details가 없으면 직접 필드에서 추출
      node.details = {
        situation: apiNode.situation,
        npc_emotions: apiNode.npc_emotions || apiNode.npcEmotions || {},
        relations_update: apiNode.relations_update || apiNode.relationsUpdate || {}
      };
    }
    
    // children 재귀 변환
    if (apiNode.children && Array.isArray(apiNode.children) && apiNode.children.length > 0) {
      node.children = apiNode.children.map((child: any) => convertToTreeNode(child));
    }
    
    return node;
  }
  
  // 다음 에피소드 생성 (동기 방식)
  async function generateNextEpisodeFromTree() {
    // 현재 에피소드 완료 처리
    totalEpisodesGenerated = currentEpisode;
    
    // 모든 에피소드 완료 확인
    if (totalEpisodesGenerated >= actualTotalEpisodes) {
      console.log('🎉 모든 에피소드 생성 완료!');
      await loadResultDirectly();
      return;
    }
    
    generating = true;
    treeEditMode = false;
    error = '';
    currentEpisode++;
    progressMessage = `에피소드 ${currentEpisode}/${actualTotalEpisodes} 생성 중... (약 1-2분 소요)`;
    
    try {
      // 다음 에피소드 생성 (동기 - 완료될 때까지 대기)
      console.log(`EP${currentEpisode} 생성 시작 (동기 방식)...`);
      const episodeData = await api.story.generateNextEpisode(storyId);
      console.log(`EP${currentEpisode} 생성 완료:`, episodeData);
      
      // 트리 편집 모드로 진입
      enterTreeEditMode(episodeData);
      
    } catch (err: any) {
      console.error('다음 에피소드 생성 실패:', err);
      if (err instanceof ApiError) {
        error = err.data?.message || '다음 에피소드 생성에 실패했습니다.';
      } else {
        error = err.message || '네트워크 오류가 발생했습니다.';
      }
      generating = false;
    }
  }
  
  // 에피소드 생성 완료 후 트리 편집 모드로 전환
  function enterTreeEditMode(episodeData: any) {
    console.log('트리 편집 모드 진입:', episodeData);
    
    // 에피소드 데이터에서 트리 추출
    if (episodeData.nodes && episodeData.nodes.length > 0) {
      // nodes 리스트의 첫 번째 노드를 루트로 사용
      // 백엔드에서 반환하는 nodes는 평면 리스트일 수 있으므로,
      // children 관계를 재구성해야 할 수도 있음
      const rootNode = episodeData.nodes[0];
      currentEpisodeTree = convertToTreeNode(rootNode);
      
      // 만약 nodes가 여러 개라면, children 관계를 재구성
      if (episodeData.nodes.length > 1) {
        // parent_id를 기준으로 트리 구조 재구성
        const nodeMap = new Map<string, any>();
        episodeData.nodes.forEach((node: any) => {
          nodeMap.set(node.id || node.nodeId, node);
        });
        
        // 루트 노드의 children 재구성
        function buildTree(node: any): TreeNode {
          const treeNode = convertToTreeNode(node);
          if (node.children && Array.isArray(node.children)) {
            treeNode.children = node.children.map((child: any) => buildTree(child));
          } else {
            // children이 없으면 parent_id로 찾기
            const children = episodeData.nodes.filter((n: any) => 
              (n.parent_id || n.parentId) === (node.id || node.nodeId)
            );
            if (children.length > 0) {
              treeNode.children = children.map((child: any) => buildTree(child));
            }
          }
          return treeNode;
        }
        
        currentEpisodeTree = buildTree(rootNode);
      }
    } else if (episodeData.startNode) {
      currentEpisodeTree = convertToTreeNode(episodeData.startNode);
    } else {
      console.warn('에피소드 데이터에 노드가 없습니다:', episodeData);
      // 빈 트리로라도 편집 모드 진입
      currentEpisodeTree = null;
    }
    
    currentEpisodeTitle = episodeData.title || `에피소드 ${currentEpisode}`;
    treeEditMode = true;
    currentStep = 5;
    generating = false;
    selectedNode = null;
    
    console.log('트리 편집 모드 설정 완료:', {
      title: currentEpisodeTitle,
      hasTree: currentEpisodeTree !== null,
      treeNodeCount: currentEpisodeTree ? countNodes(currentEpisodeTree) : 0
    });
  }
  
  // 트리 노드 개수 세기 (디버깅용)
  function countNodes(node: TreeNode): number {
    let count = 1;
    if (node.children) {
      node.children.forEach(child => {
        count += countNodes(child);
      });
    }
    return count;
  }

  function createNew() {
    currentStep = 1;
    storyId = '';
    title = '';
    novelText = '';
    uploadedFile = null;
    uploadProgress = 0;
    description = '';
    genre = '';
    summary = '';
    characters = [];
    proposedGauges = [];
    selectedGaugeIds = [];
    endingConfig = { happy: 2, tragic: 1, neutral: 1, open: 1, bad: 0 };
    numEpisodes = 5;
    maxDepth = 3;
    numEpisodeEndings = 3;
    storyDataId = null;
    metadata = null;
    error = '';
    progressMessage = '';
    // 에피소드별 생성 관련 초기화
    currentEpisode = 1;
    totalEpisodesGenerated = 0;
    actualTotalEpisodes = 0;
    // 트리 편집 관련 초기화
    currentEpisodeTree = null;
    currentEpisodeTitle = '';
    selectedNode = null;
    regenerating = false;
    treeEditMode = false;
  }
</script>

<div class="wizard-page">
  <div class="wizard-container">
    <!-- 헤더 -->
    <div class="wizard-header">
      <h1 class="wizard-title">인터랙티브 스토리 생성</h1>
      <p class="wizard-subtitle">
        소설을 입력하면 AI가 자동으로 인터랙티브 게임으로 변환합니다
      </p>
    </div>

    <!-- 진행 단계 표시 -->
    <div class="progress-bar-container">
      <div class="steps-container">
        {#each steps as step, index}
          <div class="step-wrapper">
            <div class="step-item">
              <div 
                class="step-circle"
                class:active={currentStep === step.number}
                class:completed={currentStep > step.number}
              >
                {#if currentStep > step.number}
                  ✓
                {:else}
                  {step.number}
                {/if}
              </div>
              <div class="step-info">
                <div 
                  class="step-title" 
                  class:active-title={currentStep === step.number}
                  class:completed-title={currentStep > step.number}
                >
                  {step.title}
                </div>
                <div 
                  class="step-desc" 
                  class:active-desc={currentStep === step.number}
                  class:completed-desc={currentStep > step.number}
                >
                  {step.desc}
                </div>
              </div>
            </div>
            {#if index < steps.length - 1}
              <div 
                class="step-connector" 
                class:completed={currentStep > step.number}
                class:active={currentStep === step.number || currentStep === step.number + 1}
              ></div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- 현재 단계 콘텐츠 -->
    <div class="step-content">
      {#if currentStep === 1}
        <Step1Upload
          title={title}
          description={description}
          genre={genre}
          uploadedFile={uploadedFile}
          uploading={uploading}
          uploadProgress={uploadProgress}
          canGoNext={canGoNext()}
          error={error}
          onTitleChange={setTitleValue}
          onDescriptionChange={setDescriptionValue}
          onGenreChange={setGenreValue}
          onFileChange={handleFileUpload}
          onRemoveFile={clearUploadedFile}
        />

      {:else if currentStep === 2}
        <Step2Characters
          loadingAnalysis={loadingAnalysis}
          summary={summary}
          characters={characters}
        >
          {#each characters as character}
            <button 
              type="button" 
              class="character-card"
              class:expanded={expandedCharacters.has(character.name)}
              onclick={() => toggleCharacter(character.name)}
            >
              <div class="character-avatar">
                {character.name.charAt(0)}
              </div>
              <div class="character-details">
                <div class="character-name">{character.name}</div>
                {#if character.aliases && character.aliases.length > 0}
                  <div class="character-aliases">별칭: {character.aliases.join(', ')}</div>
                {/if}
                <div class="character-description" class:expanded={expandedCharacters.has(character.name)}>
                  {expandedCharacters.has(character.name) 
                    ? character.description 
                    : truncate(character.description, 140)}
                </div>
                <div class="character-toggle">
                  {expandedCharacters.has(character.name) ? '접기' : '더보기'}
                </div>
              </div>
            </button>
          {/each}
        </Step2Characters>

      {:else if currentStep === 3}
        <Step3Gauges
          proposedGauges={proposedGauges}
          selectedGaugeIds={selectedGaugeIds}
          loadingGauges={loadingGauges}
          selectingGauges={selectingGauges}
          toggleGauge={toggleGauge}
        />

      {:else if currentStep === 4}
        <Step4Ending
          endingConfig={endingConfig}
          numEpisodes={numEpisodes}
          maxDepth={maxDepth}
          onEndingChange={handleEndingChange}
          onNumEpisodesChange={handleNumEpisodesChange}
          onMaxDepthChange={handleMaxDepthChange}
        />

      {:else if currentStep === 5}
        <Step5Tree
          treeEditMode={treeEditMode}
          currentEpisodeTree={currentEpisodeTree}
          selectedNode={selectedNode}
          regenerating={regenerating}
          currentEpisodeTitle={currentEpisodeTitle}
          currentEpisode={currentEpisode}
          actualTotalEpisodes={actualTotalEpisodes}
          generating={generating}
          progressMessage={progressMessage}
          totalEpisodesGenerated={totalEpisodesGenerated}
          numEpisodes={numEpisodes}
          error={error}
          maxDepth={maxDepth}
          onSelectNode={handleNodeSelect}
          onApplyChanges={handleApplyChanges}
          onCancelSelect={() => { selectedNode = null; }}
          onGenerateNextEpisodeFromTree={generateNextEpisodeFromTree}
          onBackToSettings={() => { currentStep = 4; error = ''; }}
        />

      {:else if currentStep === 6}
        <Step6Generating
          generating={generating}
          progressMessage={progressMessage}
          currentEpisode={currentEpisode}
          actualTotalEpisodes={actualTotalEpisodes}
          numEpisodes={numEpisodes}
          totalEpisodesGenerated={totalEpisodesGenerated}
          error={error}
          onBackToStep4={() => { currentStep = 4; error = ''; }}
        />

      {:else if currentStep === 7}
        <Step7Complete
          metadata={metadata}
          storyDataId={storyDataId}
          startPlaying={startPlaying}
          createNew={createNew}
        />
      {/if}
    </div>

    <!-- 네비게이션 버튼 -->
    <div class="navigation">
      <Button
        onclick={prevStep}
        disabled={currentStep === 1 || generating}
        variant="outline"
        size="lg"
      >
        ← 이전
      </Button>

      <div class="step-indicator">
        {currentStep} / 7 단계
      </div>

      <Button
        onclick={async () => await nextStep()}
        disabled={!canGoNext() || currentStep >= 5 || uploading || loadingAnalysis || loadingGauges || selectingGauges || configuringStory || generating}
        size="lg"
      >
        {#if currentStep === 1}
          {uploading ? '업로드 중...' : '소설 업로드 →'}
        {:else if currentStep === 3}
          {selectingGauges ? '선택 중...' : '게이지 선택 →'}
        {:else if currentStep === 4}
          {configuringStory ? '시작 중...' : '생성 시작 →'}
        {:else}
          다음 →
        {/if}
      </Button>
    </div>
  </div>
</div>

<svelte:head>
<style>
  .wizard-page {
    min-height: calc(100vh - 60px);
    background: hsl(0 0% 4%);
    padding: 2.5rem 1.5rem;
  }

  .wizard-container {
    max-width: 1200px;
    width: min(1200px, 96vw);
    margin: 0 auto;
  }

  /* 헤더 */
  .wizard-header {
    text-align: center;
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .wizard-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    color: hsl(var(--foreground));
    letter-spacing: -0.02em;
  }

  .wizard-subtitle {
    font-size: 1rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.6;
  }

  /* 진행 단계 */
  .progress-bar-container {
    background: linear-gradient(135deg, hsl(var(--card) / 0.9), hsl(var(--card) / 0.8));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.75rem;
    margin-bottom: 2rem;
    box-shadow:
      0 4px 18px hsl(var(--foreground) / 0.15),
      0 0 0 1px hsl(var(--card) / 0.7);
    backdrop-filter: blur(6px);
  }

  .steps-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .step-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .step-circle {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid hsl(var(--border));
    background: radial-gradient(circle, hsl(var(--muted) / 0.2) 0%, hsl(var(--muted) / 0.05) 60%, transparent 100%);
    color: hsl(var(--foreground));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9375rem;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .step-circle.active {
    background: radial-gradient(circle at 50% 40%, #ff4d4f, #d9353a);
    border-color: #ff4d4f;
    color: white;
    transform: scale(1.15);
    box-shadow: 
      0 0 0 4px #ff4d4f44,
      0 0 20px #ff4d4f88,
      0 0 40px #ff4d4f66;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 
        0 0 0 4px hsl(var(--primary) / 0.2),
        0 0 20px hsl(var(--primary) / 0.6),
        0 0 40px hsl(var(--primary) / 0.4);
    }
    50% {
      box-shadow: 
        0 0 0 8px hsl(var(--primary) / 0.3),
        0 0 30px hsl(var(--primary) / 0.8),
        0 0 60px hsl(var(--primary) / 0.6);
    }
  }

  .step-circle.completed {
    background: hsl(142 76% 36%);
    border-color: hsl(142 76% 36%);
    color: white;
  }

  .step-info {
    text-align: center;
    width: 100%;
  }

  .step-title {
    font-weight: 700;
    font-size: 0.9rem;
    color: hsl(var(--foreground));
    margin-bottom: 0.35rem;
    transition: all 0.3s ease;
  }

  .step-title.active-title {
    color: #ff4d4f;
    text-shadow: 0 0 8px #ff4d4fcc;
  }

  .step-title.completed-title {
    color: hsl(142 76% 45%);
  }

  .step-desc {
    transition: all 0.3s ease;
    color: hsl(var(--muted-foreground));
  }

  .step-desc.active-desc {
    color: #ffd7d8;
    text-shadow: 0 0 6px #ff4d4fcc;
  }

  .step-desc.completed-desc {
    color: hsl(142 76% 45%);
  }

  .step-desc {
    font-size: 0.6875rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.4;
  }

  .step-connector {
    flex: 1;
    height: 2px;
    background: hsl(var(--border));
    margin: 0 0.25rem;
    margin-top: -1.25rem;
    transition: all 0.3s ease;
  }

  .step-connector.completed {
    background: hsl(142 76% 36%);
  }

  .step-connector.active {
    background: linear-gradient(90deg, hsl(142 76% 36%), hsl(var(--primary)));
    animation: connector-flow 2s ease-in-out infinite;
  }

  @keyframes connector-flow {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  /* 콘텐츠 카드 */
  .step-content {
    margin-bottom: 2rem;
  }

  .content-card {
    background: hsl(var(--card));
    border: none;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 2px 8px hsl(var(--foreground) / 0.05);
  }

  .card-header {
    padding: 1.75rem 2rem;
    border-bottom: 2px solid hsl(0 0% 50% / 0.3);
    background: hsl(var(--muted) / 0.3);
  }

  .card-title {
    font-size: 1.375rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .card-desc {
    color: hsl(var(--muted-foreground));
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  .card-body {
    padding: 2rem;
    background: hsl(var(--card));
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* 섹션 블록 */
  .section-block {
    margin-bottom: 2.5rem;
    background: hsl(var(--muted) / 0.4);
    border: 3px solid hsl(0 0% 50% / 0.5);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 4px 12px hsl(var(--foreground) / 0.15);
  }

  .section-block:last-child {
    margin-bottom: 0;
  }

  .section-header {
    padding: 1.25rem 1.5rem;
    background: hsl(var(--muted) / 0.6);
    border-bottom: 2px solid hsl(0 0% 50% / 0.3);
  }

  .section-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0 0 0.25rem 0;
  }

  .section-subtitle {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin: 0;
  }

  .section-content {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.1);
  }

  /* 폼 요소 */
  .form-group {
    margin-bottom: 0;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 0;
  }

  .form-group-half {
    margin-bottom: 0;
  }

  .form-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.625rem;
    color: hsl(var(--foreground));
    font-size: 0.9375rem;
  }

  .form-input {
    width: 100%;
    padding: 0.875rem 1rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 0.9375rem;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
  }

  .form-textarea {
    width: 100%;
    min-height: 300px;
    padding: 1rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    resize: vertical;
    line-height: 1.6;
    transition: all 0.2s ease;
  }

  .input-method-card .form-textarea {
    min-height: 280px;
  }

  .form-textarea:focus {
    outline: none;
    border-color: hsl(var(--primary));
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
  }

  .form-textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: hsl(var(--muted) / 0.3);
  }

  .textarea-info {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }

  /* 파일 업로드 */
  .file-upload-wrapper {
    position: relative;
    width: 100%;
  }

  .file-input-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .file-upload-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    padding: 1rem 1.5rem;
    background: hsl(var(--primary));
    color: white;
    border: 3px solid hsl(0 0% 50% / 0.5);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .file-upload-button:hover:not(:disabled) {
    background: hsl(var(--primary) / 0.9);
    border-color: hsl(0 0% 50% / 0.7);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px hsl(var(--primary) / 0.3);
  }

  .file-upload-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .file-upload-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .file-upload-icon {
    font-size: 1.25rem;
  }

  .file-upload-text {
    font-size: 1rem;
  }

  .file-input {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
    cursor: pointer;
  }

  .file-info {
    margin-top: 0.75rem;
    padding: 1rem 1.25rem;
    background: hsl(var(--muted) / 0.2);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 0.875rem;
    transition: all 0.2s ease;
  }

  .file-info:hover {
    background: hsl(var(--muted) / 0.3);
  }

  .file-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .file-name {
    flex: 1;
    font-weight: 600;
    color: hsl(var(--foreground));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.9375rem;
  }

  .file-size {
    font-size: 0.8125rem;
    color: hsl(var(--muted-foreground));
    flex-shrink: 0;
  }

  .file-remove {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1px solid hsl(var(--border));
    background: hsl(var(--background));
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .file-remove:hover:not(:disabled) {
    background: hsl(0 84.2% 60.2% / 0.1);
    border-color: hsl(0 84.2% 60.2%);
    color: hsl(0 84.2% 60.2%);
    transform: scale(1.1);
  }

  .file-remove:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* 입력 방법 레이아웃 */
  .input-methods {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .input-method-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: hsl(var(--background));
    border: none;
    border-radius: var(--radius-md);
  }

  .method-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .divider-vertical {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    position: relative;
  }

  .divider-vertical::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background: hsl(var(--border));
    transform: translateX(-50%);
  }

  .divider-vertical span {
    position: relative;
    z-index: 1;
    padding: 0.5rem 0.75rem;
    background: hsl(var(--card));
    color: hsl(var(--muted-foreground));
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: var(--radius-full);
    border: 1px solid hsl(var(--border));
  }

  /* 구분선 (기존 - 사용 안 함) */
  .divider-or {
    position: relative;
    text-align: center;
    margin: 2rem 0;
  }

  .divider-or::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: hsl(var(--border));
    z-index: 0;
  }

  .divider-or span {
    position: relative;
    z-index: 1;
    padding: 0 1rem;
    background: hsl(var(--card));
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
    font-weight: 600;
  }

  /* 업로드 진행률 */
  .upload-status {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .upload-icon {
    font-size: 2rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .upload-info {
    flex: 1;
  }

  .upload-text {
    font-weight: 600;
    color: hsl(var(--primary));
    margin-bottom: 0.5rem;
  }

  .upload-processing {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: hsl(var(--foreground));
    font-weight: 700;
  }

  .inline-spinner {
    width: 1rem;
    height: 1rem;
    border: 3px solid #ffffff44;
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    flex-shrink: 0;
  }

  .upload-progress-bar {
    width: 100%;
    height: 0.5rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: 0.25rem;
  }

  .upload-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)));
    transition: width 0.3s ease;
  }

  .upload-percentage {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--primary));
    text-align: right;
  }

  .text-success {
    color: hsl(142 76% 36%);
  }

  .text-muted {
    color: hsl(var(--muted-foreground));
  }

  .file-input {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
  }

  .success-banner {
    padding: 1rem 1.25rem;
    background: hsl(142 76% 36% / 0.1);
    border: 1px solid hsl(142 76% 36% / 0.3);
    border-radius: var(--radius-md);
    color: hsl(142 76% 36%);
    font-weight: 600;
    text-align: center;
    font-size: 0.9375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .error-banner {
    padding: 1rem 1.25rem;
    background: hsl(0 84.2% 60.2% / 0.1);
    border: 1px solid hsl(0 84.2% 60.2% / 0.3);
    border-radius: var(--radius-md);
    color: hsl(0 84.2% 60.2%);
    font-weight: 600;
    text-align: center;
    font-size: 0.9375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .info-banner {
    padding: 1rem 1.25rem;
    background: hsl(var(--primary) / 0.1);
    border: 1px solid hsl(var(--primary) / 0.3);
    border-radius: var(--radius-md);
    color: hsl(var(--primary));
    font-weight: 600;
    text-align: center;
    font-size: 0.9375rem;
  }

  /* 슬라이더 */
  .slider-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .slider {
    flex: 1;
    height: 0.5rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    outline: none;
    appearance: none;
  }

  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    background: hsl(var(--primary));
    border-radius: 50%;
    cursor: pointer;
  }

  .slider-value {
    min-width: 5rem;
    font-weight: 600;
    color: hsl(var(--primary));
  }

  .field-hint {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .required {
    color: hsl(0 84.2% 60.2%);
    font-weight: 700;
  }

  .gauge-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    margin-top: 1rem;
    padding: 1rem;
    background: hsl(var(--muted) / 0.1);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .gauge-option {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1.25rem;
    background: hsl(var(--card));
    border: 2px solid hsl(var(--border));
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .gauge-option:hover {
    border-color: hsl(var(--primary) / 0.5);
    background: hsl(var(--muted) / 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px hsl(var(--foreground) / 0.05);
  }

  .gauge-option.selected {
    border-color: hsl(var(--primary));
    background: hsl(var(--primary) / 0.1);
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
  }

  .gauge-check {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid hsl(var(--border));
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: hsl(var(--primary));
    flex-shrink: 0;
  }

  .gauge-option.selected .gauge-check {
    border-color: hsl(var(--primary));
    background: hsl(var(--primary));
    color: white;
  }

  .gauge-info {
    flex: 1;
  }

  .gauge-name {
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-bottom: 0.25rem;
  }

  .gauge-desc {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .selection-count {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
  }

  .info-card {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.2);
    border: 2px solid hsl(var(--primary) / 0.3);
    border-radius: var(--radius-md);
  }

  .info-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
  }

  .info-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-list li {
    color: hsl(var(--muted-foreground));
  }

  .info-list strong {
    color: hsl(var(--foreground));
  }

  /* 생성 중 상태 */
  .generating-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 3rem 0;
  }

  .spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid hsl(var(--muted));
    border-top-color: hsl(var(--primary));
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .progress-info {
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .progress-bar {
    width: 100%;
    height: 0.75rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: 0.75rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)));
    transition: width 0.5s;
  }

  .progress-text {
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .generating-steps {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    max-width: 400px;
  }

  .gen-step {
    padding: 0.75rem 1rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-md);
    color: hsl(var(--muted-foreground));
    transition: all 0.3s;
  }

  .gen-step.active {
    background: hsl(var(--primary) / 0.1);
    color: hsl(var(--primary));
    font-weight: 600;
  }

  /* 에러 상태 */
  .error-state {
    text-align: center;
    padding: 3rem 0;
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .error-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(0 84.2% 60.2%);
    margin-bottom: 0.5rem;
  }

  .error-message {
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
  }

  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  /* 성공 상태 */
  .success-state {
    text-align: center;
    padding: 2rem 0;
  }

  .success-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .success-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .success-desc {
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
  }

  .story-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-bottom: 2rem;
    padding: 2rem 0;
    border-top: 1px solid hsl(var(--border));
    border-bottom: 1px solid hsl(var(--border));
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(var(--foreground));
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  /* 네비게이션 */
  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 0;
    border-top: 1px solid hsl(var(--border));
    margin-top: 2rem;
  }

  .step-indicator {
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    font-size: 0.9375rem;
  }

  /* 등장인물 */
  .extracting-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 3rem;
  }

  .extracting-text {
    font-size: 1.125rem;
    color: hsl(var(--muted-foreground));
  }

  .characters-list {
    padding: 1rem;
  }

  .list-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: hsl(var(--foreground));
  }

  .character-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .character-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
  }

  .character-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: hsl(var(--primary));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .character-name {
    font-weight: 700;
    color: hsl(var(--foreground));
    text-align: left;
    font-size: 1rem;
  }

  /* 설정 레이아웃 */
  .config-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
    align-items: start;
  }

  .config-main {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.1);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .config-sidebar {
    position: sticky;
    top: 2rem;
  }

  /* 엔딩 설정 */
  .ending-config {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
    padding: 1rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .ending-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ending-item label {
    font-weight: 600;
    color: hsl(var(--foreground));
    font-size: 0.875rem;
  }

  .ending-input {
    padding: 0.5rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    font-size: 1rem;
    text-align: center;
    font-weight: 600;
  }

  .ending-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
  }

  /* 분석 결과 */
  .analysis-results {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .analysis-layout {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .summary-section {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.15);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    max-height: 360px;
    overflow: auto;
  }

  .characters-section {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.15);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .section-subtitle-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .section-subtitle {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
  }

  .section-hint {
    font-size: 0.85rem;
    color: hsl(var(--muted-foreground));
  }

  .count-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-left: 0.5rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    background: hsl(var(--primary) / 0.15);
    color: hsl(var(--primary));
    font-size: 0.85rem;
    font-weight: 700;
  }

  .summary-box {
    padding: 1.25rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    line-height: 1.8;
    color: hsl(var(--foreground));
    margin-top: 1rem;
  }

  .character-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
    margin-top: 1rem;
  }

  .character-card {
    display: flex;
    gap: 1rem;
    padding: 1rem 1rem 0.75rem 1rem;
    background: hsl(var(--background));
    border: 1.5px solid hsl(var(--border));
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
    cursor: pointer;
    text-align: left;
    box-shadow: 0 2px 8px hsl(var(--foreground) / 0.08);
  }

  .character-card:hover {
    border-color: hsl(var(--primary) / 0.3);
    box-shadow: 0 4px 12px hsl(var(--foreground) / 0.08);
    background: hsl(var(--muted) / 0.1);
  }

  .character-card.expanded {
    border-color: hsl(var(--primary));
    box-shadow: 0 6px 16px hsl(var(--primary) / 0.15);
    background: hsl(var(--muted) / 0.15);
  }

  .character-details {
    flex: 1;
  }

  .character-aliases {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.25rem;
  }

  .character-description {
    margin-top: 0.35rem;
    line-height: 1.55;
    color: hsl(var(--foreground));
    max-height: 4.6rem;
    overflow: hidden;
    position: relative;
  }

  .character-description:not(.expanded)::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 55%, hsl(var(--background)) 100%);
    pointer-events: none;
  }

  .character-description.expanded {
    max-height: none;
  }

  .character-toggle {
    margin-top: 0.6rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: hsl(var(--primary));
  }

  .extracting-hint {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.5rem;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 3rem;
  }

  .gauge-range {
    font-size: 0.75rem;
    color: hsl(var(--primary));
    margin-top: 0.25rem;
    font-weight: 600;
  }

  .selection-count.complete {
    color: hsl(var(--primary));
    font-weight: 700;
  }

  /* 트리 편집 레이아웃 */
  .tree-edit-card {
    min-height: 600px;
    overflow: visible;
  }

  .tree-edit-layout {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 1.5rem;
    min-height: 500px;
    overflow: visible;
    padding-bottom: 0.5rem;
  }

  .tree-panel {
    background: hsl(var(--muted) / 0.2);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    overflow: visible;
    min-width: 360px;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: hsl(var(--muted) / 0.3);
    border-bottom: 1px solid hsl(var(--border));
  }

  .panel-title {
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .episode-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    background: hsl(var(--primary));
    color: white;
    border-radius: var(--radius-full);
    font-weight: 600;
  }

  .tree-scroll-container {
    flex: 1;
    overflow-x: auto !important;
    overflow-y: auto;
    padding: 1rem;
    max-height: 70vh;
    min-width: 0;
    width: 100%;
    position: relative;
  }
  
  .tree-scroll-container::-webkit-scrollbar {
    height: 12px;
    width: 12px;
  }
  
  .tree-scroll-container::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.3);
    border-radius: 6px;
  }
  
  .tree-scroll-container::-webkit-scrollbar-thumb {
    background: hsl(var(--primary) / 0.5);
    border-radius: 6px;
    border: 2px solid hsl(var(--muted) / 0.3);
  }
  
  .tree-scroll-container::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary));
  }

  .editor-panel-container {
    min-height: 400px;
    min-width: 320px;
  }

  .tree-edit-footer {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid hsl(var(--border));
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .edit-instructions {
    flex: 1;
  }

  .edit-instructions p {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 0.25rem;
  }

  .edit-instructions strong {
    color: hsl(var(--foreground));
  }

  .edit-actions {
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    .tree-edit-layout {
      grid-template-columns: 1fr;
    }

    .editor-panel-container {
      min-height: 300px;
    }
  }

  .progress-message {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.5rem;
  }

  .progress-hint {
    font-size: 0.875rem;
    color: hsl(var(--primary));
    margin-top: 1rem;
    font-weight: 500;
  }

  /* 에피소드 진행 표시 */
  .episode-progress {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
  }

  .episode-label {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .episode-count {
    font-size: 1.25rem;
    font-weight: 700;
    color: hsl(var(--primary));
  }

  .episode-list {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }

  .episode-item {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid hsl(var(--border));
    background: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.3s;
  }

  .episode-item.completed {
    background: hsl(142 76% 36%);
    border-color: hsl(142 76% 36%);
    color: white;
  }

  .episode-item.active {
    background: hsl(var(--primary));
    border-color: hsl(var(--primary));
    color: white;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .error-detail {
    margin: 1.5rem 0;
    padding: 1rem;
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
    text-align: left;
    max-height: 300px;
    overflow-y: auto;
  }

  .error-line {
    margin: 0.5rem 0;
    color: hsl(var(--foreground));
    font-family: monospace;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  /* 빈 트리 상태 */
  .empty-tree-state {
    text-align: center;
    padding: 3rem;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
  }

  .empty-message {
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
  }

  .empty-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  @media (max-width: 1024px) {
    .input-methods {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .divider-vertical {
      display: none;
    }

    .analysis-layout {
      flex-direction: column;
    }

    .character-list {
      grid-template-columns: 1fr;
    }

    .config-layout {
      grid-template-columns: 1fr;
    }

    .config-sidebar {
      position: static;
    }
  }

  @media (max-width: 768px) {
    .wizard-page {
      padding: 1.5rem 1rem;
    }

    .wizard-title {
      font-size: 2rem;
    }

    .wizard-header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
    }

    .progress-bar-container {
      padding: 1.25rem;
    }

    .steps-container {
      flex-wrap: wrap;
      gap: 1rem;
    }

    .step-wrapper {
      flex: 0 0 calc(50% - 0.5rem);
      min-width: 0;
    }

    .step-connector {
      display: none;
    }

    .card-header {
      padding: 1.5rem;
    }

    .card-body {
      padding: 1.5rem;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .story-stats {
      flex-direction: column;
      gap: 1rem;
    }

    .navigation {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .step-indicator {
      text-align: center;
    }

    .gauge-grid {
      grid-template-columns: 1fr;
    }

    .ending-config {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
</svelte:head>

