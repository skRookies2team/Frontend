/**
 * External API Types
 * 외부 API 직접 호출용 타입 정의 (OpenAI, Anthropic, Stability AI 등)
 */

// ==================== LLM API Types ====================

export interface LLMRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' | 'text' };
}

export interface LLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ==================== Image Generation (External API) ====================

export interface ExternalImageGenerationRequest {
  prompt: string;
  model?: string;
  size?: string;
  quality?: string;
  n?: number;
}

export interface ExternalImageGenerationResponse {
  url: string;
  revisedPrompt?: string;
}

