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
  numEpisodes?: number; // 1-10
  maxDepth?: number; // 1-5
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

export interface FinalEndingDto {
  id: string;
  type: string;
  title: string;
  condition: string;
  summary: string;
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

// ==================== Health Check ====================

export interface HealthCheckResponse {
  status: string;
  [key: string]: any;
}

