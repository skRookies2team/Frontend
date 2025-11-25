/**
 * Review API
 */

import { httpClient } from './http-client';
import type {
  ReviewResponseDto,
  CreateReviewRequestDto,
  PageReviewResponseDto,
  Pageable
} from './backend-types';

export class ReviewApi {
  /**
   * Get reviews for a story
   */
  async getReviewsByStory(storyDataId: number, pageable: Pageable): Promise<PageReviewResponseDto> {
    return httpClient.get<PageReviewResponseDto>(
      `/api/reviews/story/${storyDataId}`,
      { params: pageable }
    );
  }

  /**
   * Get story rating stats
   */
  async getStoryRatingStats(storyDataId: number): Promise<Record<string, any>> {
    return httpClient.get<Record<string, any>>(`/api/reviews/story/${storyDataId}/stats`);
  }

  /**
   * Get my review for a story
   */
  async getMyReviewForStory(storyDataId: number): Promise<ReviewResponseDto> {
    return httpClient.get<ReviewResponseDto>(`/api/reviews/story/${storyDataId}/me`);
  }

  /**
   * Create review
   */
  async createReview(data: CreateReviewRequestDto): Promise<ReviewResponseDto> {
    return httpClient.post<ReviewResponseDto>('/api/reviews', data);
  }

  /**
   * Update review
   */
  async updateReview(reviewId: number, data: CreateReviewRequestDto): Promise<ReviewResponseDto> {
    return httpClient.put<ReviewResponseDto>(`/api/reviews/${reviewId}`, data);
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: number): Promise<string> {
    return httpClient.delete<string>(`/api/reviews/${reviewId}`);
  }
}

export const reviewApi = new ReviewApi();



