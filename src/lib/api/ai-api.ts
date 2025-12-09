/**
 * AI API Client
 * Backend-Relay 서버와 통신하여 AI 기능을 제공합니다 (포트 8081)
 * - 소설 분석
 * - 스토리 생성
 * - 이미지 생성
 * - 서브트리 재생성
 * - 캐릭터 채팅 (RAG)
 */

import { relayHttpClient } from './http-client';
import type {
  NovelAnalyzeRequest,
  NovelAnalyzeResponse,
  StoryGenerateRequest,
  StoryGenerateResponse,
  BackendImageGenerationRequest,
  BackendImageGenerationResponse,
  SubtreeRegenerationRequest,
  SubtreeRegenerationResponse,
  CharacterIndexRequest,
  ChatMessageRequest,
  ChatMessageResponse,
  AIHealthResponse,
} from './types/ai-types';

// Re-export types for backward compatibility
export type {
  NovelAnalyzeRequest,
  NovelAnalyzeResponse,
  StoryGenerateRequest,
  StoryGenerateResponse,
  BackendImageGenerationRequest as ImageGenerationRequest,
  BackendImageGenerationResponse as ImageGenerationResponse,
  SubtreeRegenerationRequest,
  SubtreeRegenerationResponse,
  CharacterIndexRequest,
  ChatMessageRequest,
  ChatMessageResponse,
  AIHealthResponse,
} from './types/ai-types';

// ==================== AI API Class ====================

export class AiApi {
  /**
   * 소설 분석 (요약, 캐릭터, 게이지 추출)
   */
  async analyzeNovel(data: NovelAnalyzeRequest): Promise<NovelAnalyzeResponse> {
    return relayHttpClient.post<NovelAnalyzeResponse>('/ai/analyze', data);
  }

  /**
   * 전체 스토리 생성
   */
  async generateStory(data: StoryGenerateRequest): Promise<StoryGenerateResponse> {
    return relayHttpClient.post<StoryGenerateResponse>('/ai/generate', data);
  }

  /**
   * 이미지 생성
   */
  async generateImage(data: BackendImageGenerationRequest): Promise<BackendImageGenerationResponse> {
    return relayHttpClient.post<BackendImageGenerationResponse>('/ai/generate-image', data);
  }

  /**
   * 노드 수정 후 서브트리 재생성
   */
  async regenerateSubtree(data: SubtreeRegenerationRequest): Promise<SubtreeRegenerationResponse> {
    return relayHttpClient.post<SubtreeRegenerationResponse>('/ai/regenerate-subtree', data);
  }

  /**
   * RAG용 캐릭터 인덱싱
   */
  async indexCharacter(data: CharacterIndexRequest): Promise<boolean> {
    return relayHttpClient.post<boolean>('/ai/chat/index-character', data);
  }

  /**
   * 캐릭터 채팅 메시지 전송
   */
  async sendChatMessage(data: ChatMessageRequest): Promise<ChatMessageResponse> {
    return relayHttpClient.post<ChatMessageResponse>('/ai/chat/message', data);
  }

  /**
   * AI 서버 헬스 체크
   */
  async checkHealth(): Promise<AIHealthResponse> {
    return relayHttpClient.get<AIHealthResponse>('/ai/health', { requiresAuth: false });
  }
}

export const aiApi = new AiApi();








