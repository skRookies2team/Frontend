/**
 * Application Configuration
 * Centralized configuration management using environment variables
 */

export type APIMode = 'mock' | 'production'
export type LLMProvider = 'openai' | 'anthropic'
export type ImageProvider = 'openai' | 'stability' | 'replicate'
export type StorageType = 'localStorage' | 'indexedDB' | 'api'

export interface AppConfig {
  // API Mode
  apiMode: APIMode

  // LLM Configuration
  llm: {
    provider: LLMProvider
    apiKey: string
    model: string
  }

  // Image Generation Configuration
  image: {
    provider: ImageProvider
    apiKey: string
    model: string
  }

  // Storage Configuration
  storage: {
    type: StorageType
  }
}

/**
 * Load configuration from environment variables
 */
function loadConfig(): AppConfig {
  // Check if we're in browser environment
  const isBrowser = typeof window !== 'undefined'
  
  // Use Vite's import.meta.env for environment variables
  const env = isBrowser ? import.meta.env : {}

  return {
    apiMode: (env.PUBLIC_API_MODE || 'mock') as APIMode,
    
    llm: {
      provider: (env.PUBLIC_LLM_PROVIDER || 'openai') as LLMProvider,
      apiKey: env.PUBLIC_OPENAI_API_KEY || env.PUBLIC_ANTHROPIC_API_KEY || '',
      model: env.PUBLIC_OPENAI_MODEL || env.PUBLIC_ANTHROPIC_MODEL || 'gpt-4-turbo-preview',
    },
    
    image: {
      provider: (env.PUBLIC_IMAGE_API_PROVIDER || 'openai') as ImageProvider,
      apiKey: env.PUBLIC_IMAGE_API_KEY || '',
      model: env.PUBLIC_IMAGE_MODEL || 'dall-e-3',
    },
    
    storage: {
      type: (env.PUBLIC_STORAGE_TYPE || 'localStorage') as StorageType,
    },
  }
}

// Singleton instance
export const appConfig: AppConfig = loadConfig()

/**
 * Check if we're running in mock mode
 */
export function isMockMode(): boolean {
  return appConfig.apiMode === 'mock'
}

/**
 * Check if we're running in production mode
 */
export function isProductionMode(): boolean {
  return appConfig.apiMode === 'production'
}

