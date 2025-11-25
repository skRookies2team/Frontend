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
import { httpClient, ApiError } from './http-client';

// Re-export all API clients
export { authApi, AuthApi };
export { userApi, UserApi };
export { postApi, PostApi };
export { commentApi, CommentApi };
export { reviewApi, ReviewApi };
export { gameApi, GameApi };
export { healthApi, HealthApi };
export { storyApi, StoryApi };

// Export HTTP client and error class
export { httpClient, ApiError };
export type { RequestConfig } from './http-client';

// Export all types
export * from './backend-types';

/**
 * Unified API client with all endpoints
 */
export const api = {
  auth: authApi,
  user: userApi,
  post: postApi,
  comment: commentApi,
  review: reviewApi,
  game: gameApi,
  health: healthApi,
  story: storyApi
} as const;

