/**
 * API Types and Interfaces
 * Defines contracts for all API services
 */

import type { GameState, SceneData, Choice, Character } from "$lib/types/game-state"

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
  ): Promise<SceneData>
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
  ): Promise<string>

  /**
   * Initialize character knowledge base
   */
  initializeCharacter?(characterId: string, knowledge: string[]): void
}

/**
 * Image Generation API Interface
 */
export interface IImageGeneratorAPI {
  /**
   * Generate an image from a text prompt
   */
  generateImage(prompt: string): Promise<string>

  /**
   * Generate a character portrait
   */
  generateCharacterPortrait(characterName: string, description: string): Promise<string>
}

/**
 * Request/Response types for LLM APIs
 */
export interface LLMRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  temperature?: number
  max_tokens?: number
  response_format?: { type: 'json_object' | 'text' }
}

export interface LLMResponse {
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * Image Generation Request/Response types
 */
export interface ImageGenerationRequest {
  prompt: string
  model?: string
  size?: string
  quality?: string
  n?: number
}

export interface ImageGenerationResponse {
  url: string
  revisedPrompt?: string
}

