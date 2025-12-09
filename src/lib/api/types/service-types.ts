/**
 * Service Types and Interfaces
 * 서비스 레이어 인터페이스 정의
 */

import type { GameState, SceneData, Choice, Character } from "$lib/types/game-state";

/**
 * Story Generation API Interface
 */
export interface IStoryGeneratorAPI {
  /**
   * Generate a new scene based on game state and context
   */
  generateScene(
    gameState: GameState,
    novelContext: string,
    previousChoice?: Choice
  ): Promise<SceneData>;
}

/**
 * Character Chat API Interface
 */
export interface ICharacterChatAPI {
  /**
   * Get character response based on query and game state
   */
  getCharacterResponse(
    character: Character,
    gameState: GameState,
    userQuery?: string
  ): Promise<string>;

  /**
   * Initialize character knowledge base
   */
  initializeCharacter?(characterId: string, knowledge: string[]): void;
}

/**
 * Image Generation API Interface
 */
export interface IImageGeneratorAPI {
  /**
   * Generate an image from a text prompt
   */
  generateImage(prompt: string): Promise<string>;

  /**
   * Generate a character portrait
   */
  generateCharacterPortrait(characterName: string, description: string): Promise<string>;
}

