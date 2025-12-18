/**
 * Image Generation API Client
 * 외부 이미지 생성 제공자와 직접 통신하는 클라이언트 (폴백/개발용)
 * 
 * 프로덕션 환경에서는 Backend-Relay 서버(ai-api.ts)를 통해 이미지를 생성합니다.
 * 이 클라이언트는 개발/테스트 또는 Backend-Relay 서버가 사용 불가능할 때 폴백으로 사용됩니다.
 * 
 * 지원 제공자:
 * - OpenAI DALL-E
 * - Stability AI (준비 중)
 * - Replicate (준비 중)
 */

import type { ExternalImageGenerationRequest, ExternalImageGenerationResponse } from "./types/external-api-types";
import { appConfig } from "$lib/config/app-config";

/**
 * Base Image Client Interface
 */
export interface ImageClient {
  generate(request: ExternalImageGenerationRequest): Promise<ExternalImageGenerationResponse>;
}

/**
 * OpenAI DALL-E Client
 */
export class OpenAIImageClient implements ImageClient {
  private apiKey: string
  private baseURL: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || appConfig.image.apiKey
    this.baseURL = "https://api.openai.com/v1"
  }

  async generate(request: ExternalImageGenerationRequest): Promise<ExternalImageGenerationResponse> {
    const response = await fetch(`${this.baseURL}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || appConfig.image.model,
        prompt: request.prompt,
        size: request.size || "1024x1024",
        quality: request.quality || "standard",
        n: request.n || 1,
      }),
    })

    if (!response.ok) {
      const text = await response.text();
      let error;
      try {
        error = JSON.parse(text);
      } catch {
        throw new Error(`OpenAI Image API Error: ${response.statusText} - ${text.substring(0, 200)}`);
      }
      throw new Error(`OpenAI Image API Error: ${error.error?.message || response.statusText}`)
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      throw new Error('OpenAI Image API returned empty response');
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      throw new Error(`OpenAI Image API returned invalid JSON: ${text.substring(0, 200)}`);
    }
    
    return {
      url: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt,
    }
  }
}

/**
 * Stability AI Client
 */
export class StabilityAIClient implements ImageClient {
  private apiKey: string
  private baseURL: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || appConfig.image.apiKey
    this.baseURL = "https://api.stability.ai/v1"
  }

  async generate(request: ExternalImageGenerationRequest): Promise<ExternalImageGenerationResponse> {
    // Stability AI implementation would go here
    // This is a placeholder
    throw new Error("Stability AI client not yet implemented")
  }
}

/**
 * Replicate Client
 */
export class ReplicateClient implements ImageClient {
  private apiKey: string
  private baseURL: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || appConfig.image.apiKey
    this.baseURL = "https://api.replicate.com/v1"
  }

  async generate(request: ExternalImageGenerationRequest): Promise<ExternalImageGenerationResponse> {
    // Replicate implementation would go here
    // This is a placeholder
    throw new Error("Replicate client not yet implemented")
  }
}

/**
 * Factory function to create image client based on configuration
 */
export function createImageClient(): ImageClient {
  switch (appConfig.image.provider) {
    case "openai":
      return new OpenAIImageClient()
    case "stability":
      return new StabilityAIClient()
    case "replicate":
      return new ReplicateClient()
    default:
      return new OpenAIImageClient()
  }
}

