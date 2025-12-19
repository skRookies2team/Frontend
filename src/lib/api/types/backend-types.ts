/**
 * Backend API Types
 * Auto-generated from OpenAPI specification
 */

// ==================== Request DTOs ====================

export interface SignUpRequestDto {
  username: string; // 3-50 chars
  email: string;
  password: string; // min 6 chars
  nickname: string; // 2-50 chars
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface UpdateProfileRequestDto {
  nickname?: string; // 2-50 chars
  bio?: string; // max 500 chars
  profileImageUrl?: string;
}

export interface CreatePostRequestDto {
  title: string; // max 200 chars
  content: string;
  type: PostType;
}

export interface CreateCommentRequestDto {
  content: string;
  parentId?: number;
}

export interface CreateReviewRequestDto {
  storyDataId: number;
  rating: number; // 1-5
  content?: string;
}

export interface StartGameRequestDto {
  storyDataId: number;
}

export interface ChoiceRequestDto {
  choiceIndex: number;
}

export interface GenerateStoryRequestDto {
  title: string;
  description?: string;
  novelText: string;
  selectedGaugeIds: string[]; // Required, min 2
  numEpisodes?: number; // 1-10, default 3
  maxDepth?: number; // 2-5, default 3
  endingConfig?: {
    happy?: number;
    tragic?: number;
    neutral?: number;
    open?: number;
    bad?: number;
  };
  numEpisodeEndings?: number; // default 3
}

// ==================== Story Management DTOs ====================

export type StoryStatus = 
  | 'ANALYZING' 
  | 'SUMMARY_READY' 
  | 'CHARACTERS_READY' 
  | 'GAUGES_READY' 
  | 'GAUGES_SELECTED' 
  | 'CONFIGURED' 
  | 'GENERATING' 
  | 'COMPLETED' 
  | 'FAILED';

export interface StoryUploadRequestDto {
  title: string;
  novelText: string;
  genre?: string;
}

export interface StoryUploadResponseDto {
  storyId: string;
  title: string;
  status: StoryStatus;
  createdAt: string;
}

export interface CharacterDto {
  name: string;
  aliases: string[];
  description: string;
  relationships: string[];
}

export interface StoryCharactersResponseDto {
  storyId: string;
  status: StoryStatus;
  characters: CharacterDto[];
}

export interface StorySummaryResponseDto {
  storyId: string;
  status: StoryStatus;
  summary: string;
}

export interface StoryGaugesResponseDto {
  storyId: string;
  status: StoryStatus;
  gauges: GaugeDto[];
}

export interface CharacterSelectionRequestDto {
  characterNames: string[]; // 1-2 characters
}

export interface SelectedCharactersResponseDto {
  selectedCharacterNames: string[];
  selectedCharacters: CharacterDto[];
  hasSelection: boolean;
}

export interface GaugeSelectionRequestDto {
  selectedGaugeIds: string[]; // exactly 2
}

export interface GaugeSelectionResponseDto {
  storyId: string;
  status: StoryStatus;
  selectedGauges: GaugeDto[];
}

export interface StoryConfigRequestDto {
  description?: string;
  numEpisodes?: number; // 1-10
  maxDepth?: number; // 2-5
  endingConfig: {
    [key: string]: number; // happy, tragic, neutral, open, bad
  };
  numEpisodeEndings?: number; // 1-5
}

export interface ConfigData {
  description?: string;
  numEpisodes: number;
  maxDepth: number;
  endingConfig: {
    [key: string]: number;
  };
  numEpisodeEndings: number;
}

export interface StoryConfigResponseDto {
  storyId: string;
  status: StoryStatus;
  config: ConfigData;
}

export interface StoryGenerationStartResponseDto {
  storyId: string;
  status: StoryStatus;
  message: string;
  estimatedTime: string;
}

/**
 * 에피소드별 생성 시작 응답
 * taskId를 사용하여 진행률을 폴링합니다
 */
export interface TaskStartResponseDto {
  storyId: string;
  taskId: string;
  status: StoryStatus;
  message: string;
  currentEpisode?: number;
  totalEpisodes?: number;
}

export interface ProgressData {
  currentPhase: string;
  completedEpisodes: number;
  totalEpisodes: number;
  percentage: number;
  message: string;
  error?: string;
}

export interface StoryProgressResponseDto {
  storyId: string;
  status: StoryStatus;
  progress: ProgressData;
}

export interface MetadataData {
  title: string;
  description?: string;
  genre?: string;
  totalEpisodes: number;
  totalNodes: number;
  totalGauges: number;
  createdAt: string;
}

export interface PreviewData {
  firstEpisodeTitle: string;
  firstEpisodeIntro: string;
  selectedGauges: GaugeDto[];
}

export interface StoryResultResponseDto {
  storyId: string;
  status: StoryStatus;
  storyDataId: number;
  metadata: MetadataData;
  preview: PreviewData;
}

// ==================== Response DTOs ====================

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  username: string;
  nickname: string;
}

export interface UserProfileDto {
  userId: number;
  username: string;
  email: string;
  nickname: string;
  bio: string;
  profileImageUrl: string;
  createdAt: string;
  totalPlayCount: number;
  completedStoryCount: number;
  unlockedEndingCount: number;
  unlockedAchievementCount: number;
  achievementRate: number;
}

export interface PostResponseDto {
  postId: number;
  authorUsername: string;
  authorNickname: string;
  title: string;
  content: string;
  type: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentResponseDto {
  commentId: number;
  authorUsername: string;
  authorNickname: string;
  content: string;
  parentId?: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  replies: CommentResponseDto[];
}

export interface ReviewResponseDto {
  reviewId: number;
  authorUsername: string;
  authorNickname: string;
  storyDataId: number;
  rating: number;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameHistoryDto {
  sessionId: string;
  storyDataId: number;
  storyTitle: string;
  isCompleted: boolean;
  finalEndingId: string;
  gaugeStates: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementDto {
  achievementId: number;
  code: string;
  name: string;
  description: string;
  type: string;
  targetValue: number;
  currentValue: number;
  iconUrl: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface StoryData {
  id: number;
  title: string;
  description: string;
  genre?: string;
  storyJson: string;
  totalEpisodes: number;
  totalNodes: number;
  createdAt: string;
}

export interface GameStateResponseDto {
  sessionId: string;
  currentEpisodeId: string;
  currentNodeId: string;
  gaugeStates: Record<string, number>;
  accumulatedTags: Record<string, number>;
  episodeTitle: string;
  introText: string;
  nodeText: string;
  nodeDetails: StoryNodeDetailDto;
  choices: StoryChoiceDto[];
  gaugeDefinitions: GaugeDto[];
  isEpisodeEnd: boolean;
  isGameEnd: boolean;
  episodeEnding?: EpisodeEndingDto;
  finalEnding?: FinalEndingDto;
}

export interface StoryNodeDetailDto {
  situation: string;
  npc_emotions: Record<string, string>;
  relations_update: Record<string, string>;
}

export interface StoryChoiceDto {
  text: string;
  tags: string[];
  immediateReaction?: string;
}

export interface GaugeDto {
  id: string;
  name: string;
  meaning: string;
  description: string;
  min_label: string;
  max_label: string;
}

export interface EpisodeEndingDto {
  id: string;
  title: string;
  condition: string;
  text: string;
  gauge_changes: Record<string, number>;
}

// ==================== Episode & Node DTOs (동기 생성 API용) ====================

/**
 * 스토리 노드 상세 정보
 */
export interface StoryNodeDetailDto {
  situation: string;
  npc_emotions: Record<string, string>;
  relations_update: Record<string, string>;
}

/**
 * 스토리 노드
 */
export interface StoryNodeDto {
  id: string;
  depth: number;
  text: string;
  details: StoryNodeDetailDto;
  choices: StoryChoiceDto[];
  parent_id?: string;
  node_type?: string;
  episode_id?: string;
  children?: StoryNodeDto[];
}

/**
 * 에피소드 DTO (동기 API 응답)
 */
export interface EpisodeDto {
  id: string;
  title: string;
  order: number;
  description?: string;
  theme?: string;
  intro_text?: string;
  nodes: StoryNodeDto[];
  endings?: EpisodeEndingDto[];
}

/**
 * 노드 수정 요청 DTO
 */
export interface UpdateNodeRequestDto {
  nodeText: string;
  choices?: string[];
  situation?: string;
  npcEmotions?: Record<string, string>;
  tags?: string[];
}

/**
 * 서브트리 재생성 응답 DTO (백엔드)
 */
export interface RegenerateSubtreeResponseDto {
  status: string;
  message: string;
  regeneratedNodes: StoryNodeDto[];
  totalNodesRegenerated: number;
}

export interface FinalEndingDto {
  id: string;
  type: string;
  title: string;
  condition: string;
  summary: string;
}

/**
 * 엔딩 API 응답 DTO
 */
export interface EndingResponseDto {
  sessionId: string;
  isCompleted: boolean;
  finalEnding?: FinalEndingDto;
  finalGaugeStates: Record<string, number>;
  gaugeDefinitions: GaugeDto[];
  completedEpisodesCount: number;
  episodeEnding?: EpisodeEndingDto;
}

// ==================== Pagination ====================

export interface Pageable {
  page: number; // min 0
  size: number; // min 1
  sort?: string[];
}

export interface PageableObject {
  offset: number;
  sort: SortObject;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Page<T> {
  totalPages: number;
  totalElements: number;
  size: number;
  content: T[];
  number: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}

// Type aliases for specific pages
export type PagePostResponseDto = Page<PostResponseDto>;
export type PageReviewResponseDto = Page<ReviewResponseDto>;

// ==================== Enums ====================

export enum PostType {
  GENERAL = "GENERAL",
  STORY = "STORY",
  QUESTION = "QUESTION",
  GUIDE = "GUIDE",
  NOTICE = "NOTICE"
}

// ==================== File Upload ====================

export interface PresignedUrlResponseDto {
  uploadUrl: string;
  fileKey: string;
  expiresIn: number;
  method: string;
}

export interface S3UploadRequestDto {
  title: string;
  description?: string;
  genre?: string;
  fileKey: string;
}

export interface ProfileImageUploadResponseDto {
  profileImageUrl: string;
  message: string;
}

export interface MediaDto {
  mediaId: number;
  mediaType: string;
  mediaUrl: string;
  mediaOrder: number;
}

export interface PostMediaUploadResponseDto {
  mediaId: number;
  mediaType: string;
  mediaUrl: string;
  mediaKey: string;
  mediaOrder: number;
  fileSize: number;
  message: string;
}

// ==================== Health Check ====================

export interface HealthCheckResponse {
  status: string;
  [key: string]: any;
}

