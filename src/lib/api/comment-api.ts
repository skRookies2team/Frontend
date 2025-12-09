/**
 * Comment API
 */

import { httpClient } from './http-client';
import type {
  CommentResponseDto,
  CreateCommentRequestDto
} from './types/backend-types';

export class CommentApi {
  /**
   * Get comments for a post
   * 
   * 실제 요청 URL은 환경변수에 따라 자동으로 결정됩니다:
   * - 개발: http://localhost:8080/api/posts/{postId}/comments
   * - 프로덕션: https://api.yourdomain.com/api/posts/{postId}/comments
   * 
   * 도메인 정보는 환경변수(PUBLIC_API_BASE_URL)에서 가져오므로,
   * 코드에서는 상대 경로만 작성하면 됩니다.
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
  async updateComment(commentId: number, content: string): Promise<CommentResponseDto> {
    return httpClient.put<CommentResponseDto>(
      `/api/comments/${commentId}`,
      content
    );
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId: number): Promise<string> {
    return httpClient.delete<string>(`/api/comments/${commentId}`);
  }

  /**
   * Toggle like on comment
   */
  async toggleLike(commentId: number): Promise<string> {
    return httpClient.post<string>(`/api/comments/${commentId}/like`);
  }
}

export const commentApi = new CommentApi();



