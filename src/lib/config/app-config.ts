/**
 * Application Configuration
 * Centralized configuration management using environment variables
 */

export type APIMode = 'mock' | 'production'
export type LLMProvider = 'openai' | 'anthropic'
export type ImageProvider = 'openai' | 'stability' | 'replicate' | 'backend'
export type StorageType = 'localStorage' | 'indexedDB' | 'api'

export interface AppConfig {
  // API Mode
  apiMode: APIMode

  // Backend URLs
  backend: {
    baseUrl: string  // 메인 백엔드 (인증, 스토리 관리 등)
    relayUrl: string // 릴레이 서버 (AI 기능)
  }

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
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Get environment variable with validation
 */
function getEnvVar(key: string, defaultValue?: string, required = false): string {
  const isBrowser = typeof window !== 'undefined';
  // SvelteKit/Vite에서 import.meta.env는 빌드 시점에 환경 변수가 주입됨
  const env = isBrowser ? (import.meta.env as Record<string, string | undefined>) : {};
  const value = env[key] || defaultValue;

  if (required && !value) {
    // 프로덕션 환경에서만 에러를 던지고, 개발 환경에서는 경고만 표시
    const errorMsg = `환경 변수 ${key}가 설정되지 않았습니다. ` +
      `프로덕션 환경에서는 반드시 설정해야 합니다. ` +
      `.env 파일을 확인하거나 배포 플랫폼의 환경 변수 설정을 확인하세요.`;
    
    console.error(`[Config Error] ${errorMsg}`);
    // 개발 환경에서는 기본값 사용, 프로덕션에서는 에러
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.warn(`[Config Warning] ${key}가 설정되지 않아 기본값을 사용합니다: ${defaultValue}`);
      return defaultValue || '';
    }
    throw new Error(errorMsg);
  }

  return value || '';
}

/**
 * Load configuration from environment variables
 */
function loadConfig(): AppConfig {
  const isBrowser = typeof window !== 'undefined';
  // SvelteKit/Vite에서 import.meta.env는 빌드 시점에 환경 변수가 주입됨
  const env = (isBrowser ? import.meta.env : {}) as Record<string, string | boolean | undefined>;
  
  // 프로덕션 모드 확인
  const isProduction = env.MODE === 'production' || env.PROD === true;
  const apiMode = ((env.PUBLIC_API_MODE as string) || 'mock') as APIMode;
  const isProductionMode = apiMode === 'production';

  // 기본 URL (개발 환경용)
  const defaultBaseUrl = 'http://localhost:8080';
  const defaultRelayUrl = 'http://localhost:8081';

  // 프로덕션 모드에서는 환경변수 필수
  const baseUrl = getEnvVar(
    'PUBLIC_API_BASE_URL',
    defaultBaseUrl,
    isProduction && isProductionMode
  );
  const relayUrl = getEnvVar(
    'PUBLIC_RELAY_API_URL',
    defaultRelayUrl,
    isProduction && isProductionMode
  );

  // 프로덕션 환경에서 localhost 사용 감지 및 에러
  // 빌드 시점에 검증하여 잘못된 설정으로 배포되는 것을 방지
  if (isProduction && isProductionMode) {
    const isLocalhost = (url: string) => 
      url.includes('localhost') || url.includes('127.0.0.1') || url.includes('0.0.0.0');
    
    if (isLocalhost(baseUrl)) {
      const errorMsg = 
        `🚨 배포 환경 오류: PUBLIC_API_BASE_URL이 localhost로 설정되어 있습니다 (${baseUrl})\n` +
        `배포 환경에서는 실제 서버 도메인을 사용해야 합니다.\n` +
        `예: https://api.yourdomain.com\n` +
        `배포 플랫폼의 환경 변수 설정을 확인하세요.`;
      console.error(`[Config Error] ${errorMsg}`);
      // 프로덕션 빌드 시 에러를 던져서 빌드 실패를 명확히 함
      throw new Error(errorMsg);
    }
    
    if (isLocalhost(relayUrl)) {
      const errorMsg = 
        `🚨 배포 환경 오류: PUBLIC_RELAY_API_URL이 localhost로 설정되어 있습니다 (${relayUrl})\n` +
        `배포 환경에서는 실제 서버 도메인을 사용해야 합니다.\n` +
        `예: https://relay.yourdomain.com\n` +
        `배포 플랫폼의 환경 변수 설정을 확인하세요.`;
      console.error(`[Config Error] ${errorMsg}`);
      throw new Error(errorMsg);
    }
  }

  // URL 형식 검증
  if (isProductionMode && !isValidUrl(baseUrl)) {
    console.warn(
      `⚠️ PUBLIC_API_BASE_URL이 유효한 URL 형식이 아닙니다: ${baseUrl}\n` +
      `프로덕션 환경에서는 https://api.yourdomain.com 형식의 완전한 URL이 필요합니다.`
    );
  }

  if (isProductionMode && !isValidUrl(relayUrl)) {
    console.warn(
      `⚠️ PUBLIC_RELAY_API_URL이 유효한 URL 형식이 아닙니다: ${relayUrl}\n` +
      `프로덕션 환경에서는 https://relay.yourdomain.com 형식의 완전한 URL이 필요합니다.`
    );
  }

  return {
    apiMode,

    backend: {
      baseUrl,
      relayUrl,
    },

    llm: {
      provider: ((env.PUBLIC_LLM_PROVIDER as string) || 'openai') as LLMProvider,
      apiKey: ((env.PUBLIC_OPENAI_API_KEY as string) || (env.PUBLIC_ANTHROPIC_API_KEY as string) || ''),
      model: ((env.PUBLIC_OPENAI_MODEL as string) || (env.PUBLIC_ANTHROPIC_MODEL as string) || 'gpt-4-turbo-preview'),
    },

    image: {
      provider: ((env.PUBLIC_IMAGE_API_PROVIDER as string) || 'backend') as ImageProvider,
      apiKey: (env.PUBLIC_IMAGE_API_KEY as string) || '',
      model: (env.PUBLIC_IMAGE_MODEL as string) || 'dall-e-3',
    },

    storage: {
      type: ((env.PUBLIC_STORAGE_TYPE as string) || 'localStorage') as StorageType,
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

