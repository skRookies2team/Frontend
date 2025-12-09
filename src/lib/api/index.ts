/**
 * API Client - Main Entry Point
 * Exports all API clients and types
 */

// Import all API clients
import { authApi, AuthApi } from './auth-api';
import { userApi, UserApi } from './user-api';
import { postApi, PostApi } from './post-api';
import { commentApi, CommentApi } from './comment-api';
import { reviewApi, ReviewApi } from './review-api';
import { gameApi, GameApi } from './game-api';
import { healthApi, HealthApi } from './health-api';
import { storyApi, StoryApi } from './story-api';
import { uploadApi, UploadApi } from './upload-api';
import { aiApi, AiApi } from './ai-api';
import { httpClient, relayHttpClient, ApiError } from './http-client';

// Re-export all API clients
export { authApi, AuthApi };
export { userApi, UserApi };
export { postApi, PostApi };
export { commentApi, CommentApi };
export { reviewApi, ReviewApi };
export { gameApi, GameApi };
export { healthApi, HealthApi };
export { storyApi, StoryApi };
export { uploadApi, UploadApi };
export { aiApi, AiApi };

// Export HTTP clients and error class
export { httpClient, relayHttpClient, ApiError };
export type { RequestConfig } from './http-client';

// Export all types
export * from './types';
export * from './types/backend-types'; // PostType 등 enum export를 위해 추가
export * from './ai-api';

/**
 * Unified API client with all endpoints
 * 
 * Backend (8080): auth, user, post, comment, review, game, story, upload
 * Backend-Relay (8081): ai (분석, 생성, 이미지, 채팅)
 */
export const api = {
  // 메인 백엔드 (포트 8080)
  auth: authApi,
  user: userApi,
  post: postApi,
  comment: commentApi,
  review: reviewApi,
  game: gameApi,
  health: healthApi,
  story: storyApi,
  upload: uploadApi,
  // 릴레이 서버 (포트 8081)
  ai: aiApi
} as const;

