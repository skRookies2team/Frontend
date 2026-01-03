/**
 * Creator Wizard Store
 *
 * Manages all state and logic for the story creation wizard.
 * Separated from the main page component for better organization.
 */

import { api, ApiError, type CharacterDto, type GaugeDto } from '$lib/api';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

// TreeNode type definition (from story-tree.svelte)
export interface TreeNode {
  id: string;
  text: string;
  depth: number;
  choices?: Array<{ text: string; tags: string[] }>;
  children?: TreeNode[];
  details?: {
    situation?: string;
    npc_emotions?: { [key: string]: string };
    relations_update?: { [key: string]: number };
  };
  imagePrompt?: string;
  imageUrl?: string;
}

class WizardStore {
  // ===== 상태 변수들 =====

  // 단계 상태
  currentStep = $state(1);
  storyId = $state('');

  // 1단계: 소설 텍스트 입력
  title = $state('');
  novelText = $state('');
  genre = $state('');
  uploadedFile = $state<File | null>(null);
  uploadProgress = $state(0);
  uploading = $state(false);

  // 2단계: 등장인물 & 요약 (자동 추출)
  summary = $state('');
  characters = $state<CharacterDto[]>([]);
  expandedCharacters = $state<Set<string>>(new Set());
  selectedCharacterNames = $state<string[]>([]);
  loadingAnalysis = $state(false);
  selectingCharacters = $state(false);

  // 2단계: 썸네일
  thumbnailUrl = $state('');
  thumbnailLoading = $state(false);
  thumbnailUploading = $state(false);
  hasAiGenerated = $state(false);

  // 3단계: 게이지 선택 (5개 → 2개 선택)
  proposedGauges = $state<GaugeDto[]>([]);
  selectedGaugeIds = $state<string[]>([]);
  loadingGauges = $state(false);
  selectingGauges = $state(false);

  // 4단계: 엔딩 설계
  description = $state('');
  endingConfig = $state({
    happy: 2,
    tragic: 1,
    neutral: 1,
    open: 1,
    bad: 0
  });
  numEpisodes = $state(5); // 프론트엔드 기본값 (백엔드에서 실제 에피소드 수 결정)
  maxDepth = $state(3);
  numEpisodeEndings = $state(3);
  configuringStory = $state(false);

  // 5-6단계: 스토리 생성 중 (동기 방식)
  generating = $state(false);
  progressMessage = $state('');
  currentEpisode = $state(1);  // 현재 생성 중인 에피소드
  totalEpisodesGenerated = $state(0);  // 생성 완료된 에피소드 수
  actualTotalEpisodes = $state(0);  // 설정된 총 에피소드 수

  // 5단계: 트리 편집 관련
  currentEpisodeTree = $state<TreeNode | null>(null);  // 현재 에피소드의 트리 데이터
  currentEpisodeTitle = $state('');  // 현재 에피소드 제목
  selectedNode = $state<TreeNode | null>(null);  // 선택된 노드
  regenerating = $state(false);  // 서브트리 재생성 중
  treeEditMode = $state(false);  // 트리 편집 모드 여부

  // 7단계: 완료
  storyDataId = $state<number | null>(null);
  metadata = $state<any>(null);
  error = $state('');

  // 상태 저장/복원 키
  private readonly STORAGE_KEY = 'wizard-state';

  constructor() {
    // $effect는 컴포넌트 컨텍스트에서만 동작하므로 제거
    // 대신 각 상태 변경 함수에서 명시적으로 saveState() 호출
  }

  // ===== 상태 관리 함수들 =====

  /**
   * 상태 저장 (sessionStorage)
   */
  saveState() {
    if (!browser) return;

    try {
      const state = {
        currentStep: this.currentStep,
        storyId: this.storyId,
        title: this.title,
        description: this.description,
        genre: this.genre,
        summary: this.summary,
        characters: this.characters.map(c => ({ ...c })),
        selectedCharacterNames: [...this.selectedCharacterNames],
        selectedGaugeIds: [...this.selectedGaugeIds],
        endingConfig: { ...this.endingConfig },
        numEpisodes: this.numEpisodes,
        maxDepth: this.maxDepth,
        numEpisodeEndings: this.numEpisodeEndings,
        currentEpisode: this.currentEpisode,
        totalEpisodesGenerated: this.totalEpisodesGenerated,
        actualTotalEpisodes: this.actualTotalEpisodes,
        currentEpisodeTitle: this.currentEpisodeTitle,
        storyDataId: this.storyDataId,
        metadata: this.metadata,
        // 트리 편집 관련 상태 추가
        treeEditMode: this.treeEditMode,
        currentEpisodeTree: this.currentEpisodeTree ? JSON.parse(JSON.stringify(this.currentEpisodeTree)) : null,
        proposedGauges: this.proposedGauges.map(g => ({ ...g })),
        // 썸네일 상태 추가
        thumbnailUrl: this.thumbnailUrl,
        hasAiGenerated: this.hasAiGenerated
      };
      // sessionStorage: F5 새로고침 시 유지, 탭/브라우저 닫으면 초기화
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('상태 저장 실패:', err);
    }
  }

  /**
   * 상태 복원 (sessionStorage)
   */
  restoreState() {
    if (!browser) return;

    try {
      const saved = sessionStorage.getItem(this.STORAGE_KEY);
      if (!saved) return;

      const state = JSON.parse(saved);
      if (state.currentStep) this.currentStep = state.currentStep;
      if (state.storyId) this.storyId = state.storyId;
      if (state.title) this.title = state.title;
      if (state.description) this.description = state.description;
      if (state.genre) this.genre = state.genre;
      if (state.summary) this.summary = state.summary;
      if (state.characters) this.characters = state.characters;
      if (state.selectedCharacterNames) this.selectedCharacterNames = state.selectedCharacterNames;
      if (state.selectedGaugeIds) this.selectedGaugeIds = state.selectedGaugeIds;
      if (state.endingConfig) this.endingConfig = state.endingConfig;
      if (state.numEpisodes) this.numEpisodes = state.numEpisodes;
      if (state.maxDepth) this.maxDepth = state.maxDepth;
      if (state.numEpisodeEndings) this.numEpisodeEndings = state.numEpisodeEndings;
      if (state.currentEpisode) this.currentEpisode = state.currentEpisode;
      if (state.totalEpisodesGenerated) this.totalEpisodesGenerated = state.totalEpisodesGenerated;
      if (state.actualTotalEpisodes) this.actualTotalEpisodes = state.actualTotalEpisodes;
      if (state.currentEpisodeTitle) this.currentEpisodeTitle = state.currentEpisodeTitle;
      if (state.storyDataId) this.storyDataId = state.storyDataId;
      if (state.metadata) this.metadata = state.metadata;
      // 트리 편집 관련 상태 복원
      if (state.treeEditMode !== undefined) this.treeEditMode = state.treeEditMode;
      if (state.currentEpisodeTree) this.currentEpisodeTree = state.currentEpisodeTree;
      if (state.proposedGauges) this.proposedGauges = state.proposedGauges;
      // 썸네일 상태 복원
      if (state.thumbnailUrl) this.thumbnailUrl = state.thumbnailUrl;
      if (state.hasAiGenerated !== undefined) this.hasAiGenerated = state.hasAiGenerated;
    } catch (err) {
      console.warn('상태 복원 실패:', err);
    }
  }

  /**
   * 상태 초기화
   */
  clearWizardState() {
    if (!browser) return;
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 초기화 (onMount에서 호출)
   */
  initialize() {
    if (!browser) return;

    if (!api.auth.isAuthenticated()) {
      alert('로그인이 필요합니다.');
      goto('/login');
      return;
    }

    // 기존 localStorage의 wizard-state 삭제 (마이그레이션)
    localStorage.removeItem(this.STORAGE_KEY);

    // 상태 복원 (sessionStorage에서)
    this.restoreState();

    // 상태 복원 후 storyId가 있고 2단계 이상이면 썸네일 조회
    if (this.storyId && this.currentStep >= 2 && !this.thumbnailUrl) {
      this.loadThumbnail();
    }

    // 페이지 언로드 시 상태 저장
    const handleBeforeUnload = () => {
      this.saveState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // 클린업 함수 반환
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      this.saveState();
    };
  }

  // ===== 유틸리티 함수들 =====

  /**
   * 다음 단계로 진행 가능한지 확인
   */
  canGoNext(): boolean {
    switch (this.currentStep) {
      case 1:
        // 파일이 있어야 함
        return this.uploadedFile !== null && this.title.length > 0;
      case 2: return this.characters.length > 0 && this.summary.length > 0 && this.selectedCharacterNames.length >= 1 && this.selectedCharacterNames.length <= 2;
      case 3: return this.selectedGaugeIds.length === 2;
      case 4: return true;
      case 5: case 6: return false; // 자동 진행
      case 7: return this.storyDataId !== null;
      default: return false;
    }
  }

  /**
   * 텍스트 자르기
   */
  truncate(text: string, maxLength = 140): string {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  }

  // ===== Setter 함수들 =====

  setTitleValue = (value: string) => {
    this.title = value;
    this.saveState();
  }

  setDescriptionValue = (value: string) => {
    this.description = value;
    this.saveState();
  }

  setGenreValue = (value: string) => {
    this.genre = value;
    this.saveState();
  }

  clearUploadedFile = () => {
    this.uploadedFile = null;
    this.saveState();
  }

  toggleGauge = (gaugeId: string) => {
    if (this.selectedGaugeIds.includes(gaugeId)) {
      this.selectedGaugeIds = this.selectedGaugeIds.filter(id => id !== gaugeId);
    } else if (this.selectedGaugeIds.length < 2) {
      this.selectedGaugeIds = [...this.selectedGaugeIds, gaugeId];
    } else {
      // 이미 2개 선택됨: 첫 번째를 제거하고 새로운 것 추가
      this.selectedGaugeIds = [this.selectedGaugeIds[1], gaugeId];
    }
    this.saveState();
  }

  toggleCharacter = (name: string) => {
    const next = new Set(this.expandedCharacters);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    this.expandedCharacters = next;
    // expandedCharacters는 UI 상태이므로 저장하지 않음
  }

  toggleCharacterSelection = (name: string) => {
    if (this.selectedCharacterNames.includes(name)) {
      this.selectedCharacterNames = this.selectedCharacterNames.filter(n => n !== name);
    } else if (this.selectedCharacterNames.length < 2) {
      this.selectedCharacterNames = [...this.selectedCharacterNames, name];
    } else {
      // 이미 2개 선택됨: 첫 번째를 제거하고 새로운 것 추가
      this.selectedCharacterNames = [this.selectedCharacterNames[1], name];
    }
    this.saveState();
  }

  handleEndingChange = (key: string, value: number) => {
    this.endingConfig = { ...this.endingConfig, [key]: value };
    this.saveState();
  }

  handleNumEpisodesChange = (value: number) => {
    this.numEpisodes = value;
    this.saveState();
  }

  handleMaxDepthChange = (value: number) => {
    this.maxDepth = value;
    this.saveState();
  }

  handleNumEpisodeEndingsChange = (value: number) => {
    this.numEpisodeEndings = value;
    this.saveState();
  }

  // ===== 1단계: 소설 업로드 =====

  async uploadNovel() {
    console.log('uploadNovel 호출됨');
    console.log('canGoNext:', this.canGoNext());
    console.log('title:', this.title);
    console.log('uploadedFile:', this.uploadedFile);
    console.log('novelText length:', this.novelText.length);

    // 더블클릭 방지: 이미 업로드 중이면 리턴
    if (this.uploading) {
      return;
    }

    if (!this.canGoNext()) {
      alert('제목과 소설 파일을 입력해주세요');
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.error = '';

    try {
      let response;

      // 파일이 있는 경우: S3 업로드 방식 사용
      if (this.uploadedFile) {
        console.log('S3 업로드 방식 사용...');

        // 1. S3에 파일 업로드
        const fileKey = await api.upload.uploadStoryFile(this.uploadedFile, (progress) => {
          this.uploadProgress = progress;
          console.log(`업로드 진행률: ${progress.toFixed(1)}%`);
        });

        console.log('S3 업로드 완료, fileKey:', fileKey);

        // 2. 백엔드에 분석 요청
        response = await api.story.uploadNovelFromS3({
          title: this.title,
          description: this.description,
          genre: this.genre,
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

      this.storyId = response.storyId;
      this.currentStep = 2;
      this.saveState();

      // 2단계로 이동 후 자동으로 분석 데이터 로드
      this.loadAnalysisData();
    } catch (err: any) {
      console.error('업로드 실패:', err);
      if (err instanceof ApiError) {
        this.error = err.data?.message || '소설 업로드에 실패했습니다.';
        alert('업로드 실패: ' + this.error);
      } else {
        this.error = '네트워크 오류가 발생했습니다.';
        alert('네트워크 오류: ' + err.message);
      }
    } finally {
      this.uploading = false;
      this.uploadProgress = 0;
    }
  }

  async handleFileUpload(event: Event) {
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
      this.uploadedFile = file;
      this.novelText = ''; // 파일 선택 시 텍스트 입력 초기화

      // 제목이 없으면 파일명으로 자동 설정
      if (!this.title) {
        this.title = file.name.replace(/\.(txt|pdf|doc|docx)$/i, '');
      }

      this.saveState();
      console.log('파일 선택됨:', file.name, `(${(file.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error('파일 처리 실패:', err);
      this.error = '파일을 처리할 수 없습니다.';
      this.uploadedFile = null;
    }
  }

  // ===== 2단계: 분석 데이터 로드 =====

  async loadAnalysisData() {
    this.loadingAnalysis = true;

    try {
      // 진행률 폴링: CHARACTERS_READY가 될 때까지
      const checkProgress = async (): Promise<void> => {
        const progressData = await api.story.getProgress(this.storyId);

        if (progressData.status === 'CHARACTERS_READY' || progressData.status === 'GAUGES_READY') {
          // 요약과 캐릭터 로드
          const [summaryData, charactersData] = await Promise.all([
            api.story.getSummary(this.storyId),
            api.story.getCharacters(this.storyId)
          ]);

          this.summary = summaryData.summary;
          this.characters = charactersData.characters;
          this.loadingAnalysis = false;
          this.saveState();

          // 썸네일 조회 (분석 완료 후 비동기로 조회)
          this.loadThumbnail();
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
      this.error = err.message || '분석에 실패했습니다.';
      this.loadingAnalysis = false;
    }
  }

  async loadThumbnail() {
    this.thumbnailLoading = true;
    try {
      const response = await api.story.getThumbnail(this.storyId);
      this.thumbnailUrl = response.thumbnailUrl || '';
      this.hasAiGenerated = response.hasAiGenerated || false;
      this.saveState();
    } catch (err: any) {
      // 썸네일이 없는 경우는 에러로 처리하지 않음
      console.log('썸네일 조회:', err.message || '썸네일 없음');
      this.thumbnailUrl = '';
      this.hasAiGenerated = false;
    } finally {
      this.thumbnailLoading = false;
    }
  }

  async handleThumbnailUpload(file: File) {
    this.thumbnailUploading = true;
    this.error = '';

    try {
      // 1. Presigned URL 발급
      const { uploadUrl, fileKey } = await api.upload.getImagePresignedUrl(
        file.name,
        file.size
      );

      // 2. S3에 파일 업로드
      const httpClient = (await import('$lib/api/http-client')).httpClient;
      await httpClient.uploadToS3(uploadUrl, file);

      // 3. 백엔드에 썸네일 등록
      const response = await api.story.updateThumbnail(this.storyId, {
        thumbnailFileKey: fileKey
      });

      // 4. 상태 업데이트
      this.thumbnailUrl = response.thumbnailUrl;
      this.hasAiGenerated = false; // 사용자 업로드이므로 false
      this.saveState();
      console.log('썸네일 업로드 성공:', response.message);
    } catch (err: any) {
      console.error('썸네일 업로드 실패:', err);
      if (err instanceof ApiError) {
        this.error = err.data?.message || '썸네일 업로드에 실패했습니다.';
      } else {
        this.error = '썸네일 업로드 중 오류가 발생했습니다.';
      }
      alert('썸네일 업로드 실패: ' + this.error);
    } finally {
      this.thumbnailUploading = false;
    }
  }

  handleThumbnailRemove = () => {
    this.thumbnailUrl = '';
    this.hasAiGenerated = false;
  }

  async submitCharacterSelection() {
    // 더블클릭 방지: 이미 처리 중이면 리턴
    if (this.selectingCharacters) {
      return;
    }

    if (this.selectedCharacterNames.length < 1 || this.selectedCharacterNames.length > 2) {
      alert('NPC로 만들 캐릭터를 1~2명 선택해주세요.');
      return;
    }

    this.selectingCharacters = true;
    this.error = '';

    try {
      await api.story.selectCharacters(this.storyId, {
        characterNames: this.selectedCharacterNames
      });

      // 3단계로 이동 후 게이지 로드
      this.currentStep = 3;
      this.saveState();
      await this.loadGauges();
    } catch (err: any) {
      console.error('캐릭터 선택 실패:', err);
      if (err instanceof ApiError) {
        this.error = err.data?.message || '캐릭터 선택에 실패했습니다.';
      } else {
        this.error = '네트워크 오류가 발생했습니다.';
      }
      alert('캐릭터 선택 실패: ' + this.error);
    } finally {
      this.selectingCharacters = false;
    }
  }

  // ===== 3단계: 게이지 선택 =====

  async loadGauges() {
    this.loadingGauges = true;
    this.error = '';

    try {
      const response = await api.story.getGauges(this.storyId);
      this.proposedGauges = response.gauges;
      this.saveState();
    } catch (err: any) {
      console.error('게이지 로드 실패:', err);
      if (err instanceof ApiError) {
        this.error = err.data?.message || '게이지 로드에 실패했습니다.';
      } else {
        this.error = '네트워크 오류가 발생했습니다.';
      }
    } finally {
      this.loadingGauges = false;
    }
  }

  async submitGaugeSelection() {
    // 더블클릭 방지: 이미 처리 중이면 리턴
    if (this.selectingGauges) {
      return;
    }

    if (this.selectedGaugeIds.length !== 2) {
      alert('게이지를 정확히 2개 선택해주세요.');
      return;
    }

    this.selectingGauges = true;
    this.error = '';

    try {
      await api.story.selectGauges(this.storyId, {
        selectedGaugeIds: this.selectedGaugeIds
      });

      this.currentStep = 4;
      this.saveState();
    } catch (err: any) {
      console.error('게이지 선택 실패:', err);
      if (err instanceof ApiError) {
        this.error = err.data?.message || '게이지 선택에 실패했습니다.';
      } else {
        this.error = '네트워크 오류가 발생했습니다.';
      }
    } finally {
      this.selectingGauges = false;
    }
  }

  // ===== 4단계: 설정 제출 & 생성 시작 =====

  async submitConfig() {
    // 더블클릭 방지: 이미 처리 중이면 리턴
    if (this.configuringStory || this.generating) {
      return;
    }

    this.configuringStory = true;
    this.generating = true;
    this.error = '';
    this.currentEpisode = 1;
    this.totalEpisodesGenerated = 0;
    this.currentStep = 5;
    this.progressMessage = '에피소드 1 생성 중... (약 1-2분 소요)';
    this.saveState();

    try {
      // 설정 저장
      const configResponse = await api.story.configureStory(this.storyId, {
        description: this.description,
        numEpisodes: this.numEpisodes,
        maxDepth: this.maxDepth,
        endingConfig: this.endingConfig,
        numEpisodeEndings: this.numEpisodeEndings
      });

      // 백엔드에서 반환된 실제 에피소드 수를 사용
      this.actualTotalEpisodes = configResponse.config.numEpisodes;
      this.saveState();

      // 에피소드 1 생성 (동기 - 완료될 때까지 대기)
      console.log('EP1 생성 시작 (동기 방식)...');
      console.log('StoryId:', this.storyId);

      const episodeData = await api.story.startEpisodeGeneration(this.storyId);
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
      this.enterTreeEditMode(episodeData);

    } catch (err: any) {
      console.error('생성 실패:', err);
      if (err instanceof ApiError) {
        this.error = err.data?.message || err.message || '스토리 생성에 실패했습니다.';
        console.error('API 에러 상세:', {
          status: err.status,
          data: err.data,
          message: err.message
        });
      } else {
        this.error = err.message || '네트워크 오류가 발생했습니다.';
        console.error('일반 에러:', err);
      }
      this.generating = false;
      // 에러 발생 시 Step 4에 머물도록 (사용자가 다시 시도할 수 있게)
      this.currentStep = 4;
    } finally {
      this.configuringStory = false;
    }
  }

  // ===== 5단계: 트리 편집 =====

  handleNodeSelect = (event: CustomEvent<{ node: TreeNode }>) => {
    this.selectedNode = event.detail.node;
    console.log('노드 선택됨:', this.selectedNode?.id);
  }

  async handleApplyChanges(event: CustomEvent<{
    nodeId: string;
    newText: string;
    newChoices: Array<{ text: string; tags: string[] }>;
    newImagePrompt?: string;
    newImageUrl?: string;
  }>) {
    if (!this.selectedNode || !this.currentEpisodeTree) return;

    // 더블클릭 방지: 이미 재생성 중이면 리턴
    if (this.regenerating) {
      return;
    }

    const { nodeId, newText, newChoices, newImagePrompt, newImageUrl } = event.detail;

    try {
      console.log('서브트리 재생성 요청:', { nodeId, newText, newImagePrompt, newImageUrl });

      // 이미지 프롬프트 업데이트 (트리에 직접 반영)
      if (newImagePrompt !== undefined) {
        this.updateNodeImagePrompt(nodeId, newImagePrompt);
      }

      // 이미지 URL 업데이트 (트리에 직접 반영)
      if (newImageUrl !== undefined) {
        this.updateNodeImageUrl(nodeId, newImageUrl);
      }

      // 텍스트/선택지 변경이 없으면(이미지 관련만 변경) 서브트리 재생성은 생략
      const textChanged = newText !== this.selectedNode.text;
      const choicesChanged =
        (this.selectedNode.choices?.length || 0) !== newChoices.length ||
        newChoices.some((c, i) => c.text !== (this.selectedNode!.choices?.[i]?.text || ''));

      if (!textChanged && !choicesChanged) {
        this.selectedNode = null;
        alert('✅ 이미지 정보가 업데이트되었습니다.');
        return;
      }

      this.regenerating = true;
      this.error = '';

      // 백엔드 API를 통한 서브트리 재생성 (동기 방식)
      const response = await api.story.regenerateSubtree(
        this.storyId,
        this.currentEpisode,
        nodeId,
        {
          nodeText: newText,
          choices: newChoices.map(c => c.text),
          situation: this.selectedNode.details?.situation || '',
          npcEmotions: this.selectedNode.details?.npc_emotions || {},
          tags: newChoices.flatMap(c => c.tags)
        }
      );

      console.log('서브트리 재생성 완료:', response.totalNodesRegenerated, '개 노드');

      // 트리 업데이트 (재생성된 노드들로 교체)
      this.updateTreeWithRegeneratedNodes(nodeId, response.regeneratedNodes);

      // 재생성 후 이미지 프롬프트 다시 설정 (재생성으로 노드가 교체될 수 있음)
      if (newImagePrompt !== undefined) {
        this.updateNodeImagePrompt(nodeId, newImagePrompt);
      }

      // 재생성 후 이미지 URL 다시 설정 (재생성으로 노드가 교체될 수 있음)
      if (newImageUrl !== undefined) {
        this.updateNodeImageUrl(nodeId, newImageUrl);
      }

      this.selectedNode = null;
      alert(`✅ 서브트리 재생성 완료! ${response.totalNodesRegenerated}개 노드가 업데이트되었습니다.`);

    } catch (err: any) {
      console.error('서브트리 재생성 실패:', err);
      if (err instanceof ApiError) {
        this.error = err.data?.message || '서브트리 재생성에 실패했습니다.';
      } else {
        this.error = err.message || '서브트리 재생성에 실패했습니다.';
      }
      alert('❌ 서브트리 재생성 실패: ' + this.error);
    } finally {
      this.regenerating = false;
    }
  }

  private updateNodeImagePrompt(nodeId: string, imagePrompt: string) {
    if (!this.currentEpisodeTree) return;

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

    updateNode(this.currentEpisodeTree);

    // selectedNode도 업데이트
    if (this.selectedNode && this.selectedNode.id === nodeId) {
      this.selectedNode.imagePrompt = imagePrompt;
    }
  }

  private updateNodeImageUrl(nodeId: string, imageUrl: string) {
    if (!this.currentEpisodeTree) return;

    function updateNode(node: TreeNode): boolean {
      if (node.id === nodeId) {
        node.imageUrl = imageUrl;
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

    updateNode(this.currentEpisodeTree);

    // selectedNode도 업데이트
    if (this.selectedNode && this.selectedNode.id === nodeId) {
      this.selectedNode.imageUrl = imageUrl;
    }
  }

  private updateTreeWithRegeneratedNodes(parentNodeId: string, regeneratedNodes: any[]) {
    if (!this.currentEpisodeTree || regeneratedNodes.length === 0) return;

    // 재귀적으로 트리를 순회하며 해당 노드를 찾아 교체
    const findAndReplace = (node: TreeNode): TreeNode => {
      if (node.id === parentNodeId) {
        // 재생성된 첫 번째 노드로 교체 (부모 노드 포함)
        const newNode = this.convertToTreeNode(regeneratedNodes[0]);
        return newNode;
      }

      if (node.children && node.children.length > 0) {
        node.children = node.children.map((child: TreeNode) => findAndReplace(child));
      }

      return node;
    }

    this.currentEpisodeTree = findAndReplace({ ...this.currentEpisodeTree });
  }

  private convertToTreeNode(apiNode: any): TreeNode {
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
      node.children = apiNode.children.map((child: any) => this.convertToTreeNode(child));
    }

    return node;
  }

  async generateNextEpisodeFromTree() {
    // 더블클릭 방지: 이미 생성 중이면 리턴
    if (this.generating) {
      return;
    }

    // 현재 에피소드 완료 처리
    this.totalEpisodesGenerated = this.currentEpisode;

    // 모든 에피소드 완료 확인
    if (this.totalEpisodesGenerated >= this.actualTotalEpisodes) {
      console.log('🎉 모든 에피소드 생성 완료!');
      await this.loadResultDirectly();
      return;
    }

    this.generating = true;
    this.treeEditMode = false;
    this.error = '';
    this.currentEpisode++;
    this.progressMessage = `에피소드 ${this.currentEpisode}/${this.actualTotalEpisodes} 생성 중... (약 1-2분 소요)`;
    this.saveState();

    try {
      // 다음 에피소드 생성 (동기 - 완료될 때까지 대기)
      console.log(`EP${this.currentEpisode} 생성 시작 (동기 방식)...`);
      const episodeData = await api.story.generateNextEpisode(this.storyId);
      console.log(`EP${this.currentEpisode} 생성 완료:`, episodeData);

      // 트리 편집 모드로 진입
      this.enterTreeEditMode(episodeData);

    } catch (err: any) {
      console.error('다음 에피소드 생성 실패:', err);
      if (err instanceof ApiError) {
        this.error = err.data?.message || '다음 에피소드 생성에 실패했습니다.';
      } else {
        this.error = err.message || '네트워크 오류가 발생했습니다.';
      }
      this.generating = false;
    }
  }

  private enterTreeEditMode(episodeData: any) {
    console.log('트리 편집 모드 진입:', episodeData);

    // 에피소드 데이터에서 트리 추출
    if (episodeData.nodes && episodeData.nodes.length > 0) {
      const rootNode = episodeData.nodes[0];
      this.currentEpisodeTree = this.convertToTreeNode(rootNode);

      // 만약 nodes가 여러 개라면, children 관계를 재구성
      if (episodeData.nodes.length > 1) {
        // parent_id를 기준으로 트리 구조 재구성
        const nodeMap = new Map<string, any>();
        episodeData.nodes.forEach((node: any) => {
          nodeMap.set(node.id || node.nodeId, node);
        });

        // 루트 노드의 children 재구성
        const buildTree = (node: any): TreeNode => {
          const treeNode = this.convertToTreeNode(node);
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

        this.currentEpisodeTree = buildTree(rootNode);
      }
    } else if (episodeData.startNode) {
      this.currentEpisodeTree = this.convertToTreeNode(episodeData.startNode);
    } else {
      console.warn('에피소드 데이터에 노드가 없습니다:', episodeData);
      // 빈 트리로라도 편집 모드 진입
      this.currentEpisodeTree = null;
    }

    this.currentEpisodeTitle = episodeData.title || `에피소드 ${this.currentEpisode}`;
    this.treeEditMode = true;
    this.currentStep = 5;
    this.generating = false;
    this.selectedNode = null;
    this.saveState();

    console.log('트리 편집 모드 설정 완료:', {
      title: this.currentEpisodeTitle,
      hasTree: this.currentEpisodeTree !== null,
      treeNodeCount: this.currentEpisodeTree ? this.countNodes(this.currentEpisodeTree) : 0
    });
  }

  private countNodes(node: TreeNode): number {
    let count = 1;
    if (node.children) {
      node.children.forEach((child: TreeNode) => {
        count += this.countNodes(child);
      });
    }
    return count;
  }

  // ===== 7단계: 완료 =====

  async loadResultDirectly() {
    const maxRetries = 5;
    let retryCount = 0;

    const tryLoad = async (): Promise<void> => {
      try {
        retryCount++;
        console.log(`결과 조회 시도 ${retryCount}/${maxRetries}... storyId:`, this.storyId);

        const result = await api.story.getResult(this.storyId);
        console.log('✅ 결과 조회 성공:', result);

        this.storyDataId = result.storyDataId;
        this.metadata = result.metadata;

        this.currentStep = 7;
        this.generating = false;
        this.saveState();

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
          console.error('storyId:', this.storyId);
          console.error('에러 객체:', err);
          if (err instanceof ApiError) {
            console.error('API Error Status:', err.status);
            console.error('API Error Data:', err.data);
          }

          if (err instanceof ApiError && err.status === 404) {
            this.error = '❌ 스토리를 찾을 수 없습니다 (404)\n\n' +
                    `storyId: ${this.storyId}\n` +
                    '백엔드에서 생성은 완료되었지만 결과를 저장하지 못했을 수 있습니다.\n\n' +
                    '백엔드 콘솔 로그를 확인해주세요.';
          } else if (err instanceof ApiError && err.status === 500) {
            this.error = `❌ 백엔드 서버 내부 오류 (500)\n\n` +
                    `storyId: ${this.storyId}\n` +
                    `에러 메시지: ${err.data?.message || err.message}\n\n` +
                    '백엔드 콘솔에서 다음을 확인하세요:\n' +
                    '1. Exception 스택 트레이스\n' +
                    '2. /api/stories/${storyId}/result 관련 로그\n' +
                    '3. 데이터베이스 연결 상태\n' +
                    '4. AI 서버 응답 데이터';
          } else if (err instanceof ApiError) {
            this.error = `❌ API 에러 (${err.status})\n\n` +
                    `storyId: ${this.storyId}\n` +
                    `메시지: ${err.data?.message || err.message}`;
          } else {
            this.error = `❌ 네트워크 오류\n\n` +
                    `storyId: ${this.storyId}\n` +
                    `메시지: ${err.message}`;
          }

          this.generating = false;
        }
      }
    };

    await tryLoad();
  }

  startPlaying = () => {
    if (this.storyDataId) {
      goto(`/play/${this.storyDataId}`);
    }
  }

  // ===== 네비게이션 =====

  async nextStep() {
    console.log('nextStep 호출됨, currentStep:', this.currentStep);

    try {
      if (this.currentStep === 1) {
        console.log('1단계: uploadNovel 호출');
        await this.uploadNovel();
      } else if (this.currentStep === 2) {
        console.log('2단계: 캐릭터 선택 제출');
        await this.submitCharacterSelection();
      } else if (this.currentStep === 3) {
        console.log('3단계: 게이지 선택 제출');
        await this.submitGaugeSelection();
      } else if (this.currentStep === 4) {
        console.log('4단계: 설정 제출 & 생성 시작');
        await this.submitConfig();
      } else if (this.canGoNext()) {
        console.log('일반 다음 단계');
        this.currentStep++;
        this.saveState();
      }
    } catch (error) {
      console.error('nextStep 에러:', error);
      alert('에러 발생: ' + error);
    }
  }

  prevStep = () => {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.saveState();
    }
  }

  createNew = () => {
    this.currentStep = 1;
    this.storyId = '';
    this.title = '';
    this.novelText = '';
    this.uploadedFile = null;
    this.uploadProgress = 0;
    this.description = '';
    this.genre = '';
    this.summary = '';
    this.characters = [];
    this.proposedGauges = [];
    this.selectedGaugeIds = [];
    this.endingConfig = { happy: 2, tragic: 1, neutral: 1, open: 1, bad: 0 };
    this.numEpisodes = 5; // 프론트엔드 기본값 (백엔드에서 실제 에피소드 수 결정)
    this.maxDepth = 3;
    this.numEpisodeEndings = 3;
    this.storyDataId = null;
    this.metadata = null;
    this.error = '';
    this.progressMessage = '';
    // 에피소드별 생성 관련 초기화
    this.currentEpisode = 1;
    this.totalEpisodesGenerated = 0;
    this.actualTotalEpisodes = 0;
    // 트리 편집 관련 초기화
    this.currentEpisodeTree = null;
    this.currentEpisodeTitle = '';
    this.selectedNode = null;
    this.regenerating = false;
    this.treeEditMode = false;
    this.saveState();
  }
}

export const wizardStore = new WizardStore();
