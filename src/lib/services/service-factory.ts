/**
 * Service Factory
 * Creates service instances based on configuration (Mock vs API)
 */

import type { IStoryGeneratorAPI, ICharacterChatAPI, IImageGeneratorAPI } from "$lib/api/types/service-types"
import { isMockMode } from "$lib/config/app-config"

// Mock implementations
import { MockStoryGenerator } from "./story-generator.mock"
import { MockCharacterChat } from "./character-chat.mock"
import { MockImageGenerator } from "./image-generator.mock"

// API implementations
import { APIStoryGenerator } from "./story-generator.api"
import { APICharacterChat } from "./character-chat.api"
import { APIImageGenerator } from "./image-generator.api"

/**
 * Service Factory Class
 */
class ServiceFactory {
  private storyGeneratorInstance: IStoryGeneratorAPI | null = null
  private characterChatInstance: ICharacterChatAPI | null = null
  private imageGeneratorInstance: IImageGeneratorAPI | null = null

  /**
   * Get Story Generator instance (singleton)
   */
  getStoryGenerator(): IStoryGeneratorAPI {
    if (!this.storyGeneratorInstance) {
      this.storyGeneratorInstance = isMockMode()
        ? new MockStoryGenerator()
        : new APIStoryGenerator()
      
      console.log(`[ServiceFactory] Created ${isMockMode() ? 'Mock' : 'API'} Story Generator`)
    }
    return this.storyGeneratorInstance
  }

  /**
   * Get Character Chat instance (singleton)
   */
  getCharacterChat(): ICharacterChatAPI {
    if (!this.characterChatInstance) {
      this.characterChatInstance = isMockMode()
        ? new MockCharacterChat()
        : new APICharacterChat()
      
      console.log(`[ServiceFactory] Created ${isMockMode() ? 'Mock' : 'API'} Character Chat`)
    }
    return this.characterChatInstance
  }

  /**
   * Get Image Generator instance (singleton)
   */
  getImageGenerator(): IImageGeneratorAPI {
    if (!this.imageGeneratorInstance) {
      this.imageGeneratorInstance = isMockMode()
        ? new MockImageGenerator()
        : new APIImageGenerator()
      
      console.log(`[ServiceFactory] Created ${isMockMode() ? 'Mock' : 'API'} Image Generator`)
    }
    return this.imageGeneratorInstance
  }

  /**
   * Reset all service instances (useful for testing or switching modes)
   */
  reset(): void {
    this.storyGeneratorInstance = null
    this.characterChatInstance = null
    this.imageGeneratorInstance = null
    console.log("[ServiceFactory] All services reset")
  }
}

// Export singleton instance
export const serviceFactory = new ServiceFactory()

/**
 * Convenience functions for getting services
 */
export function getStoryGenerator(): IStoryGeneratorAPI {
  return serviceFactory.getStoryGenerator()
}

export function getCharacterChat(): ICharacterChatAPI {
  return serviceFactory.getCharacterChat()
}

export function getImageGenerator(): IImageGeneratorAPI {
  return serviceFactory.getImageGenerator()
}

