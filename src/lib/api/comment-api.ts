/**
 * Comment API
 */

import { httpClient } from './http-client';
import type {
  CommentResponseDto,
  CreateCommentRequestDto
} from './backend-types';

export class CommentApi {
  /**
   * Get comments for a post
   */
  async getComments(postId: number): Promise<CommentResponseDto[]> {
    return httpClient.get<CommentResponseDto[]>(`/api/posts/${postId}/comments`);
  }

  /**
   * Create comment
   */
  async createComment(postId: number, data: CreateCommentRequestDto): Promise<CommentResponseDto> {
    return httpClient.post<CommentResponseDto>(`/api/posts/${postId}/comments`, data);
  }

  /**
   * Update comment
   */
  async updateComment(postId: number, commentId: number, content: string): Promise<CommentResponseDto> {
    return httpClient.put<CommentResponseDto>(
      `/api/posts/${postId}/comments/${commentId}`,
      content
    );
  }

  /**
   * Delete comment
   */
  async deleteComment(postId: number, commentId: number): Promise<string> {
    return httpClient.delete<string>(`/api/posts/${postId}/comments/${commentId}`);
  }

  /**
   * Toggle like on comment
   */
  async toggleLike(postId: number, commentId: number): Promise<string> {
    return httpClient.post<string>(`/api/posts/${postId}/comments/${commentId}/like`);
  }
}

export const commentApi = new CommentApi();

