/**
 * AI API Types
 * Backend-Relay 서버 (포트 8081) AI 기능 관련 타입 정의
 */

// ==================== Novel Analysis ====================

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

// ==================== Story Generation ====================

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

// ==================== Image Generation (Backend-Relay) ====================

export interface BackendImageGenerationRequest {
  nodeText: string;
  episodeTitle: string;
  characters?: string[];
  mood?: string;
  style?: string;
}

export interface BackendImageGenerationResponse {
  imageUrl: string;
  revisedPrompt?: string;
}

// ==================== Subtree Regeneration ====================

export interface SubtreeRegenerationRequest {
  episodeTitle: string;
  episodeOrder: number;
  parentNode: {
    nodeId: string;
    text: string;
    choices?: string[];
    situation?: string;
    npcEmotions?: { [key: string]: string };
    tags?: string[];
    depth: number;
  };
  currentDepth: number;
  maxDepth: number;
  novelContext: string;
  previousChoices?: string[];
  selectedGaugeIds?: string[];
  // 캐싱된 분석 결과 (성능 최적화)
  summary?: string;
  charactersJson?: string;
  gaugesJson?: string;
}

export interface SubtreeRegenerationResponse {
  status: string;
  message: string;
  regeneratedNodes: Array<{
    nodeId: string;
    text: string;
    choices: string[];
    depth: number;
    parentId?: string;
    details?: {
      situation?: string;
      npcEmotions?: { [key: string]: string };
      tags?: string[];
    };
  }>;
  totalNodesRegenerated: number;
}

// ==================== Character Chat (RAG) ====================

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

// ==================== Health Check ====================

export interface AIHealthResponse {
  status: string;
  relayServer: string;
  aiServers: {
    analysisAi: { status: string };
    imageGenerationAi: { status: string };
    ragAi: { status: string };
  };
}

