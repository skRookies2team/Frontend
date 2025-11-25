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
  HealthCheckResponse
} from './backend-types';

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
}

export const gameApi = new GameApi();



