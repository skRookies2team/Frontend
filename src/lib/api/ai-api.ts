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

// ==================== Request/Response Types ====================

export interface NovelAnalyzeRequest {
  novelText: string;
}

export interface NovelAnalyzeResponse {
  summary: string;
  characters: Array<{
    name: string;
    aliases: string[];
    description: string;
    relationships: string[];
  }>;
  gauges: Array<{
    id: string;
    name: string;
    meaning: string;
    description: string;
    min_label: string;
    max_label: string;
  }>;
}

export interface StoryGenerateRequest {
  novelText: string;
  summary: string;
  characters: Array<{
    name: string;
    aliases: string[];
    description: string;
    relationships: string[];
  }>;
  selectedGauges: Array<{
    id: string;
    name: string;
    meaning: string;
    description: string;
    min_label: string;
    max_label: string;
  }>;
  numEpisodes: number;
  maxDepth: number;
  endingConfig: {
    [key: string]: number;
  };
  numEpisodeEndings: number;
}

export interface StoryGenerateResponse {
  episodes: any[];
  finalEndings: any[];
  metadata: {
    totalEpisodes: number;
    totalNodes: number;
    totalGauges: number;
  };
}

export interface ImageGenerationRequest {
  nodeText: string;
  episodeTitle: string;
  characters?: string[];
  mood?: string;
  style?: string;
}

export interface ImageGenerationResponse {
  imageUrl: string;
  revisedPrompt?: string;
}

export interface SubtreeRegenerationRequest {
  episodeTitle: string;
  episodeOrder: number;
  parentNode: {
    nodeId: string;
    text: string;
    situation: string;
    npcEmotions: { [key: string]: string };
    relationsUpdate: { [key: string]: string };
    choices: Array<{
      text: string;
      tags: string[];
    }>;
  };
  currentDepth: number;
  maxDepth: number;
  selectedGauges: Array<{
    id: string;
    name: string;
    meaning: string;
    description: string;
    min_label: string;
    max_label: string;
  }>;
  characters: Array<{
    name: string;
    aliases: string[];
    description: string;
    relationships: string[];
  }>;
  novelSummary: string;
}

export interface SubtreeRegenerationResponse {
  regeneratedNodes: any[];
  totalNodesRegenerated: number;
}

export interface CharacterIndexRequest {
  characterId: string;
  name: string;
  aliases: string[];
  description: string;
  relationships: string[];
  novelContext: string;
}

export interface ChatMessageRequest {
  characterId: string;
  userMessage: string;
  gameContext?: {
    currentEpisode?: string;
    currentNode?: string;
    gaugeStates?: { [key: string]: number };
    relationships?: { [key: string]: number };
  };
}

export interface ChatMessageResponse {
  aiMessage: string;
  characterId: string;
  timestamp: string;
}

export interface AIHealthResponse {
  status: string;
  relayServer: string;
  aiServers: {
    analysisAi: { status: string };
    imageGenerationAi: { status: string };
    ragAi: { status: string };
  };
}

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
  async generateImage(data: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    return relayHttpClient.post<ImageGenerationResponse>('/ai/generate-image', data);
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

