/**
 * User API
 */

import { httpClient } from './http-client';
import type {
  UserProfileDto,
  UpdateProfileRequestDto,
  GameHistoryDto,
  AchievementDto
} from './backend-types';

export class UserApi {
  /**
   * Get my profile
   */
  async getMyProfile(): Promise<UserProfileDto> {
    return httpClient.get<UserProfileDto>('/api/users/me');
  }

  /**
   * Update my profile
   */
  async updateProfile(data: UpdateProfileRequestDto): Promise<UserProfileDto> {
    return httpClient.put<UserProfileDto>('/api/users/me', data);
  }

  /**
   * Get user profile by username
   */
  async getUserProfile(username: string): Promise<UserProfileDto> {
    return httpClient.get<UserProfileDto>(`/api/users/${username}`);
  }

  /**
   * Get game play history
   */
  async getGameHistory(): Promise<GameHistoryDto[]> {
    return httpClient.get<GameHistoryDto[]>('/api/users/me/history');
  }

  /**
   * Get achievements
   */
  async getAchievements(): Promise<AchievementDto[]> {
    return httpClient.get<AchievementDto[]>('/api/users/me/achievements');
  }
}

export const userApi = new UserApi();





