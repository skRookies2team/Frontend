/**
 * Game API
 */

import { httpClient } from './http-client';
import type {
  GameStateResponseDto,
  StartGameRequestDto,
  ChoiceRequestDto,
  StoryData,
  GenerateStoryRequestDto,
  HealthCheckResponse,
  EndingResponseDto
} from './types/backend-types';

export class GameApi {
  /**
   * Get all stories
   */
  async getAllStories(): Promise<StoryData[]> {
    return httpClient.get<StoryData[]>('/api/game/stories');
  }

  /**
   * Upload story
   */
  async uploadStory(title: string, storyJson: string, description?: string): Promise<StoryData> {
    return httpClient.post<StoryData>(
      '/api/game/stories',
      storyJson,
      {
        params: { title, description }
      }
    );
  }

  /**
   * Generate story using AI
   */
  async generateStory(data: GenerateStoryRequestDto): Promise<StoryData> {
    return httpClient.post<StoryData>('/api/game/stories/generate', data);
  }

  /**
   * Start new game
   */
  async startGame(data: StartGameRequestDto): Promise<GameStateResponseDto> {
    return httpClient.post<GameStateResponseDto>('/api/game/start', data);
  }

  /**
   * Get game state
   */
  async getGameState(sessionId: string): Promise<GameStateResponseDto> {
    return httpClient.get<GameStateResponseDto>(`/api/game/${sessionId}`);
  }

  /**
   * Make choice in game
   */
  async makeChoice(sessionId: string, choiceIndex: number): Promise<GameStateResponseDto> {
    const data: ChoiceRequestDto = { choiceIndex };
    return httpClient.post<GameStateResponseDto>(`/api/game/${sessionId}/choice`, data);
  }

  /**
   * Check AI server health
   */
  async checkAiHealth(): Promise<HealthCheckResponse> {
    return httpClient.get<HealthCheckResponse>('/api/game/ai/health');
  }

  /**
   * Get ending information (episode or final ending)
   */
  async getEnding(sessionId: string): Promise<EndingResponseDto> {
    return httpClient.get<EndingResponseDto>(`/api/game/${sessionId}/ending`);
  }

  /**
   * Get selected characters by StoryDataId (게임 플레이 중 NPC 대화용)
   * 새로운 엔드포인트: GET /api/game/stories/{storyDataId}/selected-characters
   */
  async getSelectedCharactersByStoryDataId(storyDataId: number): Promise<import('./types/backend-types').SelectedCharactersResponseDto> {
    return httpClient.get<import('./types/backend-types').SelectedCharactersResponseDto>(
      `/api/game/stories/${storyDataId}/selected-characters`
    );
  }
}

export const gameApi = new GameApi();






