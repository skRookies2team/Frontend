/**
 * LLM API Client
 * 외부 LLM 제공자와 직접 통신하는 클라이언트 (폴백/개발용)
 * 
 * 프로덕션 환경에서는 Backend-Relay 서버(ai-api.ts)를 통해 LLM을 사용합니다.
 * 이 클라이언트는 개발/테스트 또는 Backend-Relay 서버가 사용 불가능할 때 폴백으로 사용됩니다.
 * 
 * 지원 제공자:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude 3)
 */

import type { LLMRequest, LLMResponse } from "./types/external-api-types";
import { appConfig } from "$lib/config/app-config";

/**
 * Base LLM Client Interface
 */
export interface LLMClient {
  chat(request: LLMRequest): Promise<LLMResponse>
}

/**
 * OpenAI API Client
 */
export class OpenAIClient implements LLMClient {
  private apiKey: string
  private baseURL: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || appConfig.llm.apiKey
    this.baseURL = "https://api.openai.com/v1"
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model || appConfig.llm.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens,
        response_format: request.response_format,
      }),
    })

    if (!response.ok) {
      const text = await response.text();
      let error;
      try {
        error = JSON.parse(text);
      } catch {
        throw new Error(`OpenAI API Error: ${response.statusText} - ${text.substring(0, 200)}`);
      }
      throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`)
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      throw new Error('OpenAI API returned empty response');
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      throw new Error(`OpenAI API returned invalid JSON: ${text.substring(0, 200)}`);
    }
    
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
    }
  }
}

/**
 * Anthropic API Client
 */
export class AnthropicClient implements LLMClient {
  private apiKey: string
  private baseURL: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || appConfig.llm.apiKey
    this.baseURL = "https://api.anthropic.com/v1"
  }

  async chat(request: LLMRequest): Promise<LLMResponse> {
    // Convert messages to Anthropic format
    const systemMessage = request.messages.find((m) => m.role === "system")?.content || ""
    const messages = request.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role,
        content: m.content,
      }))

    const response = await fetch(`${this.baseURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: request.model || appConfig.llm.model,
        messages,
        system: systemMessage,
        max_tokens: request.max_tokens || 4096,
        temperature: request.temperature || 0.7,
      }),
    })

    if (!response.ok) {
      const text = await response.text();
      let error;
      try {
        error = JSON.parse(text);
      } catch {
        throw new Error(`Anthropic API Error: ${response.statusText} - ${text.substring(0, 200)}`);
      }
      throw new Error(`Anthropic API Error: ${error.error?.message || response.statusText}`)
    }

    const text = await response.text();
    if (!text || text.trim().length === 0) {
      throw new Error('Anthropic API returned empty response');
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Anthropic API returned invalid JSON: ${text.substring(0, 200)}`);
    }
    
    return {
      content: data.content[0].text,
      usage: {
        prompt_tokens: data.usage?.input_tokens || 0,
        completion_tokens: data.usage?.output_tokens || 0,
        total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    }
  }
}

/**
 * Factory function to create LLM client based on configuration
 */
export function createLLMClient(): LLMClient {
  switch (appConfig.llm.provider) {
    case "openai":
      return new OpenAIClient()
    case "anthropic":
      return new AnthropicClient()
    default:
      return new OpenAIClient()
  }
}

