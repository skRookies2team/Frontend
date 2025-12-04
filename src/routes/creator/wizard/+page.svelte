<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { api, ApiError, type CharacterDto, type GaugeDto, type StoryStatus } from '$lib/api';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import StoryTree from '$lib/components/story-tree.svelte';
  import NodeEditor from '$lib/components/node-editor.svelte';
  import type { TreeNode } from '$lib/components/story-tree.svelte';
  
  // 단계 상태
  let currentStep = $state(1);
  let storyId = $state('');
  
  // 1단계: 소설 텍스트 입력
  let title = $state('');
  let novelText = $state('');
  let uploadedFile = $state<File | null>(null);
  let uploadProgress = $state(0);
  let uploading = $state(false);
  
  // 2단계: 등장인물 & 요약 (자동 추출)
  let summary = $state('');
  let characters = $state<CharacterDto[]>([]);
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
  
  // 인증 확인
  onMount(() => {
    if (!api.auth.isAuthenticated()) {
      alert('로그인이 필요합니다.');
      goto('/login');
    }
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
        // 파일이 있거나 텍스트가 100자 이상 입력되어야 함
        const hasValidInput = uploadedFile !== null || novelText.length >= 100;
        return hasValidInput && title.length > 0;
      case 2: return characters.length > 0 && summary.length > 0;
      case 3: return selectedGaugeIds.length === 2;
      case 4: return true;
      case 5: case 6: return false; // 자동 진행
      case 7: return storyDataId !== null;
      default: return false;
    }
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
  
  // 1단계: 소설 업로드
  async function uploadNovel() {
    console.log('uploadNovel 호출됨');
    console.log('canGoNext:', canGoNext());
    console.log('title:', title);
    console.log('uploadedFile:', uploadedFile);
    console.log('novelText length:', novelText.length);
    
    if (!canGoNext()) {
      alert('제목과 소설 파일 또는 텍스트를 입력해주세요');
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
          fileKey
        });
      } 
      // 텍스트가 있는 경우: 기존 방식 사용
      else if (novelText) {
        console.log('텍스트 직접 전송 방식 사용...');
        response = await api.story.uploadNovel({
          title,
          novelText
        });
      } else {
        throw new Error('파일 또는 텍스트를 입력해주세요');
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
  }>) {
    if (!selectedNode || !currentEpisodeTree) return;
    
    const { nodeId, newText, newChoices } = event.detail;
    
    regenerating = true;
    error = '';
    
    try {
      console.log('서브트리 재생성 요청:', { nodeId, newText });
      
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
      details: {}
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
      <h1 class="wizard-title">🧙‍♂️ 인터랙티브 스토리 마법사</h1>
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
                <div class="step-title">{step.title}</div>
                <div class="step-desc">{step.desc}</div>
              </div>
            </div>
            {#if index < steps.length - 1}
              <div class="step-connector" class:completed={currentStep > step.number}></div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- 현재 단계 콘텐츠 -->
    <div class="step-content">
      {#if currentStep === 1}
        <!-- 1단계: 소설 텍스트 입력 -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">📝 1단계: 소설 텍스트 입력</h2>
            <p class="card-desc">인터랙티브 게임으로 만들 소설의 전문을 입력하세요</p>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">소설 제목 *</label>
              <input
                type="text"
                class="form-input"
                bind:value={title}
                placeholder="예: 파리대왕"
              />
            </div>

            <div class="form-group">
              <label class="form-label">설명 (선택)</label>
              <input
                type="text"
                class="form-input"
                bind:value={description}
                placeholder="소설에 대한 간단한 설명"
              />
            </div>

            <div class="form-group">
              <label class="form-label">파일 업로드 (권장)</label>
              <p class="field-hint">
                지원 형식: .txt, .pdf, .doc, .docx (최대 10MB)
              </p>
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                class="file-input"
                onchange={handleFileUpload}
                disabled={uploading}
              />
              {#if uploadedFile}
                <div class="file-info">
                  <span class="file-icon">📄</span>
                  <span class="file-name">{uploadedFile.name}</span>
                  <span class="file-size">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                  <button 
                    type="button" 
                    class="file-remove"
                    onclick={() => { uploadedFile = null; }}
                    disabled={uploading}
                  >
                    ✕
                  </button>
                </div>
              {/if}
            </div>

            <div class="divider-or">
              <span>또는</span>
            </div>

            <div class="form-group">
              <label class="form-label">텍스트 직접 입력</label>
              <textarea
                class="form-textarea"
                bind:value={novelText}
                placeholder="소설 전체 텍스트를 여기에 붙여넣기 하세요...

최소 100자 이상 입력해주세요. 더 긴 텍스트일수록 더 풍부한 스토리가 생성됩니다."
                disabled={uploadedFile !== null || uploading}
              />
              <div class="textarea-info">
                {#if uploadedFile}
                  <span class="text-muted">파일이 선택되어 텍스트 입력이 비활성화되었습니다</span>
                {:else if novelText.length > 0}
                  <span class="text-success">
                    ✓ {novelText.length.toLocaleString()}자 입력됨
                    {#if novelText.length < 1000}
                      (최소 1000자 권장)
                    {/if}
                  </span>
                {:else}
                  <span class="text-muted">소설 텍스트를 입력해주세요 (최소 100자)</span>
                {/if}
              </div>
            </div>

            {#if error}
              <div class="error-banner">
                ❌ {error}
              </div>
            {/if}
            
            {#if uploading}
              <div class="info-banner">
                <div class="upload-status">
                  <div class="upload-icon">⏳</div>
                  <div class="upload-info">
                    {#if uploadProgress > 0 && uploadProgress < 100}
                      <p class="upload-text">S3에 파일 업로드 중...</p>
                      <div class="upload-progress-bar">
                        <div class="upload-progress-fill" style="width: {uploadProgress}%"></div>
                      </div>
                      <p class="upload-percentage">{uploadProgress.toFixed(1)}%</p>
                    {:else if uploadProgress === 100}
                      <p class="upload-text">업로드 완료! 분석을 시작합니다...</p>
                    {:else}
                      <p class="upload-text">소설을 업로드하고 있습니다...</p>
                    {/if}
                  </div>
                </div>
              </div>
            {:else if canGoNext()}
              <div class="success-banner">
                ✅ 준비 완료! 소설 업로드 버튼을 클릭하세요
              </div>
            {/if}
          </div>
        </div>

      {:else if currentStep === 2}
        <!-- 2단계: 등장인물 자동 추출 -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">👥 2단계: 등장인물 자동 추출</h2>
            <p class="card-desc">AI가 소설에서 등장인물을 자동으로 추출합니다</p>
          </div>
          <div class="card-body">
            {#if loadingAnalysis}
              <div class="extracting-state">
                <div class="spinner"></div>
                <p class="extracting-text">AI가 소설을 분석하고 있습니다...</p>
                <p class="extracting-hint">요약과 등장인물을 추출하는 중...</p>
              </div>
            {:else if characters.length > 0}
              <div class="analysis-results">
                <!-- 요약 -->
                {#if summary}
                  <div class="summary-section">
                    <h3 class="section-subtitle">📖 소설 요약</h3>
                    <div class="summary-box">
                      {summary}
                    </div>
                  </div>
                {/if}
                
                <!-- 등장인물 -->
                <div class="characters-section">
                  <h3 class="section-subtitle">👥 추출된 등장인물</h3>
                  <div class="character-list">
                    {#each characters as character}
                      <div class="character-card">
                        <div class="character-avatar">
                          {character.name.charAt(0)}
                        </div>
                        <div class="character-details">
                          <div class="character-name">{character.name}</div>
                          {#if character.aliases && character.aliases.length > 0}
                            <div class="character-aliases">별칭: {character.aliases.join(', ')}</div>
                          {/if}
                          <div class="character-description">{character.description}</div>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
                
                <div class="success-banner">
                  ✅ 분석 완료! 등장인물 {characters.length}명 추출
                </div>
              </div>
            {/if}
          </div>
        </div>

      {:else if currentStep === 3}
        <!-- 3단계: 게이지 선택 -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">📊 3단계: 게이지 선택</h2>
            <p class="card-desc">스토리에서 사용할 상태 지표를 선택하세요 (최소 2개)</p>
          </div>
          <div class="card-body">
            {#if loadingGauges}
              <div class="loading-state">
                <div class="spinner"></div>
                <p>AI가 소설 주제에 맞는 게이지를 제안하고 있습니다...</p>
              </div>
            {:else if proposedGauges.length > 0}
              <div class="form-group">
                <label class="form-label">AI가 제안한 게이지 (정확히 2개 선택) <span class="required">*</span></label>
                <p class="field-hint">소설의 주제와 내용에 맞춰 AI가 선택한 5가지 게이지입니다</p>
                <div class="gauge-grid">
                  {#each proposedGauges as gauge}
                    <button
                      type="button"
                      class="gauge-option"
                      class:selected={selectedGaugeIds.includes(gauge.id)}
                      onclick={() => toggleGauge(gauge.id)}
                      disabled={selectingGauges}
                    >
                      <div class="gauge-check">
                        {#if selectedGaugeIds.includes(gauge.id)}
                          ✓
                        {/if}
                      </div>
                      <div class="gauge-info">
                        <div class="gauge-name">{gauge.name}</div>
                        <div class="gauge-desc">{gauge.meaning || gauge.description}</div>
                        {#if gauge.min_label && gauge.max_label}
                          <div class="gauge-range">
                            {gauge.min_label} ↔ {gauge.max_label}
                          </div>
                        {/if}
                      </div>
                    </button>
                  {/each}
                </div>
                {#if selectedGaugeIds.length > 0}
                  <p class="selection-count" class:complete={selectedGaugeIds.length === 2}>
                    {selectedGaugeIds.length}/2 선택됨 {selectedGaugeIds.length === 2 ? '✓' : ''}
                  </p>
                {/if}
              </div>
            {/if}
          </div>
        </div>

      {:else if currentStep === 4}
        <!-- 4단계: 엔딩 설계 -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">🎬 4단계: 예상 엔딩 설계</h2>
            <p class="card-desc">스토리에서 생성할 엔딩의 유형과 개수를 설정하세요</p>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">엔딩 구성</label>
              <div class="ending-config">
                <div class="ending-item">
                  <label>😊 해피 엔딩</label>
                  <input type="number" min="0" max="5" bind:value={endingConfig.happy} class="ending-input" />
                </div>
                <div class="ending-item">
                  <label>😢 비극 엔딩</label>
                  <input type="number" min="0" max="5" bind:value={endingConfig.tragic} class="ending-input" />
                </div>
                <div class="ending-item">
                  <label>😐 중립 엔딩</label>
                  <input type="number" min="0" max="5" bind:value={endingConfig.neutral} class="ending-input" />
                </div>
                <div class="ending-item">
                  <label>🤔 열린 엔딩</label>
                  <input type="number" min="0" max="5" bind:value={endingConfig.open} class="ending-input" />
                </div>
                <div class="ending-item">
                  <label>💀 배드 엔딩</label>
                  <input type="number" min="0" max="5" bind:value={endingConfig.bad} class="ending-input" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">에피소드 수 (1-10)</label>
              <div class="slider-container">
                <input type="range" min="1" max="10" bind:value={numEpisodes} class="slider" />
                <span class="slider-value">{numEpisodes}화</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">분기 깊이 (2-5)</label>
              <div class="slider-container">
                <input type="range" min="2" max="5" bind:value={maxDepth} class="slider" />
                <span class="slider-value">레벨 {maxDepth}</span>
              </div>
            </div>

            <div class="info-card">
              <h3 class="info-title">📊 예상 생성 규모</h3>
              <ul class="info-list">
                <li>총 에피소드: <strong>{numEpisodes}화</strong></li>
                <li>분기 깊이: <strong>레벨 {maxDepth}</strong></li>
                <li>예상 노드 수: <strong>약 {Math.pow(2, maxDepth) * numEpisodes}개</strong></li>
                <li>총 엔딩 수: <strong>{Object.values(endingConfig).reduce((a, b) => a + b, 0)}개</strong></li>
              </ul>
            </div>
          </div>
        </div>

      {:else if currentStep === 5}
        <!-- 5단계: 트리 편집 -->
        <div class="content-card tree-edit-card">
          <div class="card-header">
            <h2 class="card-title">🌳 5단계: 에피소드 트리 편집</h2>
            <p class="card-desc">
              {#if treeEditMode}
                에피소드 {currentEpisode}의 스토리 트리를 검토하고 필요시 수정하세요
              {:else}
                AI가 에피소드 {currentEpisode}을(를) 생성하고 있습니다...
              {/if}
            </p>
          </div>
          <div class="card-body">
            {#if treeEditMode}
              <!-- 트리 편집 모드 -->
              {#if currentEpisodeTree}
              <div class="tree-edit-layout">
                <!-- 트리 시각화 영역 -->
                <div class="tree-panel">
                  <div class="panel-header">
                    <span class="panel-title">📊 스토리 트리</span>
                    <span class="episode-badge">EP {currentEpisode} / {actualTotalEpisodes}</span>
                  </div>
                  <div class="tree-scroll-container">
                    <StoryTree 
                      rootNode={currentEpisodeTree}
                      selectedNodeId={selectedNode?.id || ''}
                      maxDepth={maxDepth}
                      episodeTitle={currentEpisodeTitle}
                      on:selectNode={handleNodeSelect}
                    />
                  </div>
                </div>
                
                <!-- 노드 편집 패널 -->
                <div class="editor-panel-container">
                  <NodeEditor 
                    node={selectedNode}
                    isLoading={regenerating}
                    episodeTitle={currentEpisodeTitle}
                    episodeOrder={currentEpisode}
                    on:applyChanges={handleApplyChanges}
                    on:cancel={() => { selectedNode = null; }}
                  />
                </div>
              </div>
              
              <!-- 하단 안내 -->
              <div class="tree-edit-footer">
                <div class="edit-instructions">
                  <p>💡 <strong>사용법:</strong> 노드를 클릭하여 선택 → 내용 수정 → "적용" 버튼 클릭</p>
                  <p>수정된 노드의 하위 트리가 자동으로 재생성됩니다.</p>
                </div>
                
                <div class="edit-actions">
                  <Button 
                    variant="outline"
                    onclick={() => { 
                      // 현재 에피소드 스킵하고 다음으로
                      if (confirm('현재 에피소드를 수정 없이 확정하시겠습니까?')) {
                        generateNextEpisodeFromTree();
                      }
                    }}
                    disabled={generating || regenerating}
                  >
                    {#if currentEpisode >= actualTotalEpisodes}
                      ✅ 완료하기
                    {:else}
                      ⏭️ 다음 에피소드 생성
                    {/if}
                  </Button>
                </div>
              </div>
              {:else}
                <!-- 트리 데이터 없음 -->
                <div class="empty-tree-state">
                  <div class="empty-icon">⚠️</div>
                  <h3 class="empty-title">트리 데이터를 불러올 수 없습니다</h3>
                  <p class="empty-message">
                    에피소드가 생성되었지만 트리 구조를 불러오지 못했습니다.
                  </p>
                  <div class="empty-actions">
                    <Button 
                      onclick={() => { 
                        if (confirm('현재 에피소드를 건너뛰고 다음 에피소드를 생성하시겠습니까?')) {
                          generateNextEpisodeFromTree();
                        }
                      }}
                      disabled={generating || regenerating}
                    >
                      ⏭️ 다음 에피소드 생성
                    </Button>
                    <Button 
                      variant="outline"
                      onclick={() => {
                        currentStep = 4;
                        error = '';
                      }}
                    >
                      ← 설정으로 돌아가기
                    </Button>
                  </div>
                </div>
              {/if}
            {:else}
              <!-- 생성 중 상태 (동기 방식) -->
              <div class="generating-state">
                <div class="spinner"></div>
                <div class="progress-info">
                  <!-- 에피소드 진행 표시 -->
                  <div class="episode-progress">
                    <span class="episode-label">에피소드 생성</span>
                    <span class="episode-count">{currentEpisode} / {actualTotalEpisodes || numEpisodes}</span>
                  </div>
                  
                  {#if progressMessage}
                    <p class="progress-message">{progressMessage}</p>
                  {/if}
                  
                  <p class="progress-hint">
                    AI가 스토리를 생성하고 있습니다. 잠시만 기다려주세요...
                  </p>
                  
                  <!-- 에피소드 상태 표시 -->
                  <div class="episode-list">
                    {#each Array(actualTotalEpisodes || numEpisodes) as _, i}
                      <div 
                        class="episode-item"
                        class:completed={i < totalEpisodesGenerated}
                        class:active={i === totalEpisodesGenerated && generating}
                      >
                        {#if i < totalEpisodesGenerated}
                          ✓
                        {:else if i === totalEpisodesGenerated && generating}
                          ⏳
                        {:else}
                          {i + 1}
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            {/if}
            
            {#if error}
              <div class="error-banner">
                ❌ {error}
              </div>
            {/if}
          </div>
        </div>

      {:else if currentStep === 6}
        <!-- 6단계: 에피소드 생성 중 (동기 방식) -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">✨ 6단계: 에피소드 생성 중</h2>
            <p class="card-desc">AI가 스토리와 디테일을 생성하고 있습니다...</p>
          </div>
          <div class="card-body">
            <div class="generating-state">
              <div class="spinner"></div>
              <div class="progress-info">
                <!-- 에피소드 진행 표시 -->
                <div class="episode-progress">
                  <span class="episode-label">에피소드 생성</span>
                  <span class="episode-count">{currentEpisode} / {actualTotalEpisodes || numEpisodes}</span>
                </div>
                
                {#if progressMessage}
                  <p class="progress-message">{progressMessage}</p>
                {/if}
                
                <p class="progress-hint">
                  동기 방식으로 생성 중입니다. 약 1-2분 소요됩니다...
                </p>
                
                <!-- 에피소드 상태 표시 -->
                <div class="episode-list">
                  {#each Array(actualTotalEpisodes || numEpisodes) as _, i}
                    <div 
                      class="episode-item"
                      class:completed={i < totalEpisodesGenerated}
                      class:active={i === totalEpisodesGenerated && generating}
                    >
                      {#if i < totalEpisodesGenerated}
                        ✓
                      {:else if i === totalEpisodesGenerated && generating}
                        ⏳
                      {:else}
                        {i + 1}
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            </div>
            {#if error}
              <div class="error-state">
                <div class="error-icon">❌</div>
                <h3 class="error-title">생성 실패</h3>
                <div class="error-detail">
                  {#each error.split('\n') as line}
                    <p class="error-line">{line}</p>
                  {/each}
                </div>
                <div class="error-actions">
                  <Button onclick={() => { currentStep = 4; error = ''; }}>
                    ← 설정 수정
                  </Button>
                  <Button variant="outline" onclick={() => { 
                    console.log('=== 에러 상세 정보 ===');
                    console.log('storyId:', storyId);
                    console.log('currentEpisode:', currentEpisode);
                    console.log('totalEpisodesGenerated:', totalEpisodesGenerated);
                    console.log('error:', error);
                    console.log('progressMessage:', progressMessage);
                    alert('콘솔(F12)에서 상세 정보를 확인하세요');
                  }}>
                    🔍 콘솔에서 자세히 보기
                  </Button>
                </div>
              </div>
            {/if}
          </div>
        </div>

      {:else if currentStep === 7}
        <!-- 7단계: 완료 -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">🎉 4단계: 생성 완료!</h2>
            <p class="card-desc">인터랙티브 스토리가 성공적으로 생성되었습니다</p>
          </div>
          <div class="card-body">
            {#if metadata && storyDataId}
              <div class="success-state">
                <div class="success-icon">✨</div>
                <h3 class="success-title">{metadata.title}</h3>
                {#if metadata.description}
                  <p class="success-desc">{metadata.description}</p>
                {/if}
                
                <div class="story-stats">
                  <div class="stat-item">
                    <span class="stat-label">총 에피소드</span>
                    <span class="stat-value">{metadata.totalEpisodes}화</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">총 노드</span>
                    <span class="stat-value">{metadata.totalNodes}개</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">게이지 수</span>
                    <span class="stat-value">{metadata.totalGauges}개</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">생성일</span>
                    <span class="stat-value">{new Date(metadata.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>

                <div class="action-buttons">
                  <Button size="lg" onclick={startPlaying}>
                    🎮 지금 플레이하기
                  </Button>
                  <Button size="lg" variant="outline" onclick={createNew}>
                    ➕ 새로 만들기
                  </Button>
                </div>
              </div>
            {/if}
          </div>
        </div>
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

<style>
  .wizard-page {
    min-height: calc(100vh - 60px);
    background: linear-gradient(135deg, 
      hsl(var(--primary) / 0.1), 
      hsl(var(--accent) / 0.1)
    );
    padding: 2rem;
  }

  .wizard-container {
    max-width: 900px;
    margin: 0 auto;
  }

  /* 헤더 */
  .wizard-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .wizard-title {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
  }

  .wizard-subtitle {
    font-size: 1.125rem;
    color: hsl(var(--muted-foreground));
  }

  /* 진행 단계 */
  .progress-bar-container {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .steps-container {
    display: flex;
    justify-content: space-between;
  }

  .step-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .step-circle {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 2px solid hsl(var(--border));
    background: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.125rem;
    transition: all 0.3s;
  }

  .step-circle.active {
    background: hsl(var(--primary));
    border-color: hsl(var(--primary));
    color: white;
    transform: scale(1.1);
  }

  .step-circle.completed {
    background: hsl(142 76% 36%);
    border-color: hsl(142 76% 36%);
    color: white;
  }

  .step-info {
    text-align: center;
  }

  .step-title {
    font-weight: 600;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
  }

  .step-desc {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
  }

  .step-connector {
    flex: 1;
    height: 2px;
    background: hsl(var(--border));
    margin: 0 0.5rem;
    margin-bottom: 3rem;
  }

  .step-connector.completed {
    background: hsl(142 76% 36%);
  }

  /* 콘텐츠 카드 */
  .step-content {
    margin-bottom: 2rem;
  }

  .content-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .card-header {
    padding: 2rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .card-desc {
    color: hsl(var(--muted-foreground));
  }

  .card-body {
    padding: 2rem;
  }

  /* 폼 요소 */
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 1rem;
  }

  .form-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
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
    font-family: monospace;
    resize: vertical;
  }

  .form-textarea:focus {
    outline: none;
    border-color: hsl(var(--primary));
  }

  .form-textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: hsl(var(--muted) / 0.3);
  }

  .textarea-info {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }

  /* 파일 업로드 */
  .file-info {
    margin-top: 0.75rem;
    padding: 1rem;
    background: hsl(var(--muted) / 0.3);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .file-icon {
    font-size: 1.5rem;
  }

  .file-name {
    flex: 1;
    font-weight: 600;
    color: hsl(var(--foreground));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
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
    font-size: 1rem;
    transition: all 0.2s;
  }

  .file-remove:hover:not(:disabled) {
    background: hsl(0 84.2% 60.2% / 0.1);
    border-color: hsl(0 84.2% 60.2%);
    color: hsl(0 84.2% 60.2%);
  }

  .file-remove:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* 구분선 */
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
    padding: 1rem;
    background: hsl(142 76% 36% / 0.1);
    border: 1px solid hsl(142 76% 36%);
    border-radius: var(--radius-md);
    color: hsl(142 76% 36%);
    font-weight: 600;
    text-align: center;
  }

  .error-banner {
    padding: 1rem;
    background: hsl(0 84.2% 60.2% / 0.1);
    border: 1px solid hsl(0 84.2% 60.2%);
    border-radius: var(--radius-md);
    color: hsl(0 84.2% 60.2%);
    font-weight: 600;
    text-align: center;
  }

  .info-banner {
    padding: 1rem;
    background: hsl(var(--primary) / 0.1);
    border: 1px solid hsl(var(--primary));
    border-radius: var(--radius-md);
    color: hsl(var(--primary));
    font-weight: 600;
    text-align: center;
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
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .gauge-option {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background: hsl(var(--card));
    border: 2px solid hsl(var(--border));
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .gauge-option:hover {
    border-color: hsl(var(--primary));
    background: hsl(var(--muted) / 0.3);
  }

  .gauge-option.selected {
    border-color: hsl(var(--primary));
    background: hsl(var(--primary) / 0.1);
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
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
    margin-top: 1.5rem;
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
  }

  .step-indicator {
    font-weight: 600;
    color: hsl(var(--muted-foreground));
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
    font-weight: 600;
    color: hsl(var(--foreground));
    text-align: center;
  }

  /* 엔딩 설정 */
  .ending-config {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
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

  .section-subtitle {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
  }

  .summary-box {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
    line-height: 1.8;
    color: hsl(var(--foreground));
  }

  .character-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .character-card {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
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
    margin-top: 0.5rem;
    line-height: 1.6;
    color: hsl(var(--foreground));
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
  }

  .tree-edit-layout {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 1.5rem;
    min-height: 500px;
  }

  .tree-panel {
    background: hsl(var(--muted) / 0.2);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
    overflow: auto;
    padding: 1rem;
  }

  .editor-panel-container {
    min-height: 400px;
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

  @media (max-width: 768px) {
    .wizard-title {
      font-size: 2rem;
    }

    .steps-container {
      flex-direction: column;
      gap: 1rem;
    }

    .step-connector {
      display: none;
    }

    .story-stats {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>

