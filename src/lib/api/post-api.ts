/**
 * Post API
 */

import { httpClient } from './http-client';
import type {
  PostResponseDto,
  CreatePostRequestDto,
  PagePostResponseDto,
  Pageable,
  PostType
} from './backend-types';

export class PostApi {
  /**
   * Get all posts
   */
  async getPosts(pageable: Pageable): Promise<PagePostResponseDto> {
    return httpClient.get<PagePostResponseDto>('/api/posts', {
      params: pageable
    });
  }

  /**
   * Get posts by type
   */
  async getPostsByType(type: PostType, pageable: Pageable): Promise<PagePostResponseDto> {
    return httpClient.get<PagePostResponseDto>(`/api/posts/type/${type}`, {
      params: pageable
    });
  }

  /**
   * Search posts
   */
  async searchPosts(keyword: string, pageable: Pageable): Promise<PagePostResponseDto> {
    return httpClient.get<PagePostResponseDto>('/api/posts/search', {
      params: { keyword, ...pageable }
    });
  }

  /**
   * Get post by ID
   */
  async getPost(postId: number): Promise<PostResponseDto> {
    return httpClient.get<PostResponseDto>(`/api/posts/${postId}`);
  }

  /**
   * Create new post
   */
  async createPost(data: CreatePostRequestDto): Promise<PostResponseDto> {
    return httpClient.post<PostResponseDto>('/api/posts', data);
  }

  /**
   * Update post
   */
  async updatePost(postId: number, data: CreatePostRequestDto): Promise<PostResponseDto> {
    return httpClient.put<PostResponseDto>(`/api/posts/${postId}`, data);
  }

  /**
   * Delete post
   */
  async deletePost(postId: number): Promise<string> {
    return httpClient.delete<string>(`/api/posts/${postId}`);
  }

  /**
   * Toggle like on post
   */
  async toggleLike(postId: number): Promise<string> {
    return httpClient.post<string>(`/api/posts/${postId}/like`);
  }

  /**
   * Toggle bookmark on post
   */
  async toggleBookmark(postId: number): Promise<string> {
    return httpClient.post<string>(`/api/posts/${postId}/bookmark`);
  }
}

export const postApi = new PostApi();






