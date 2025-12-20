/**
 * API Character Chat Implementation
 * Uses Backend-Relay server for RAG-based character responses
 */

import type { Character, GameState } from "$lib/types/game-state"
import type { ICharacterChatAPI } from "$lib/api/types/service-types"
import { createLLMClient } from "$lib/api/llm-client"
import { aiApi } from "$lib/api/ai-api"
import { api } from "$lib/api"
import { appConfig } from "$lib/config/app-config"
import { getCharacterKnowledge } from "$lib/data/mock-knowledge"

export class APICharacterChat implements ICharacterChatAPI {
  private llmClient = createLLMClient()
  // 백엔드 RAG API를 항상 사용 (새로운 /api/rag/chat 엔드포인트)
  private useBackend = true

  async getCharacterResponse(
    character: Character,
    gameState: GameState,
    userQuery?: string,
    conversationHistory?: Array<{ role: 'user' | 'npc'; message: string }>
  ): Promise<string> {
    console.log("[API] Getting character response using", this.useBackend ? "Backend RAG API" : "Direct LLM", ":", character.name)

    try {
      if (this.useBackend) {
        // 새로운 백엔드 RAG 채팅 API 사용: POST /api/rag/chat
        // ⚠️ 중요: character.chatId를 사용해야 함 (character.id는 UI용 ID)
        const characterId = character.chatId || character.id;
        
        if (!character.chatId) {
          console.warn(`[API] Character ${character.name} has no chatId, using id instead. This may cause errors.`);
        }
        
        // 백엔드가 히스토리를 관리하므로 프론트엔드에서 전달하지 않음
        // 백엔드가 자동으로 해당 characterId의 히스토리를 가져와서 사용
        const response = await api.game.ragChat({
          characterId: characterId, // chatId 사용 (형식: {storyId}_{characterName})
          userMessage: userQuery || "현재 상황에 대해 조언해주세요.",
          conversationHistory: [], // 백엔드가 히스토리 관리하므로 빈 배열
          maxTokens: 4000
        });
        
        return response.aiMessage; // 캐릭터 이름은 포함하지 않음 (백엔드에서 처리)
      } else {
        // 직접 LLM API 호출 (기존 방식)
        const relationship = gameState.relationships[character.id] || 0
        const trust = gameState.trust[character.id] || 50
        const knowledge = getCharacterKnowledge(character.id)

        const prompt = this.buildPrompt(character, gameState, relationship, trust, knowledge, userQuery)

        const response = await this.llmClient.chat({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt(character),
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        })

        return `${character.name}: ${response.content}`
      }
    } catch (error) {
      console.error("[API] Error getting character response:", error)
      throw new Error(`Failed to get character response: ${error}`)
    }
  }

  /**
   * 캐릭터를 RAG 시스템에 인덱싱 (Backend-Relay 사용 시)
   */
  async indexCharacter(character: Character, novelContext: string): Promise<boolean> {
    if (!this.useBackend) {
      console.log("[API] Skipping character indexing - not using backend mode")
      return true
    }

    try {
      console.log("[API] Indexing character for RAG:", character.name)
      // ⚠️ 중요: character.chatId를 사용해야 함 (character.id는 UI용 ID)
      const characterId = character.chatId || character.id;
      
      if (!character.chatId) {
        console.warn(`[API] Character ${character.name} has no chatId, using id instead for indexing. This may cause errors.`);
      }
      
      return await aiApi.indexCharacter({
        characterId: characterId, // chatId 사용
        name: character.name,
        aliases: [],
        description: character.description,
        relationships: [],
        novelContext
      })
    } catch (error) {
      console.error("[API] Error indexing character:", error)
      return false
    }
  }

  private getSystemPrompt(character: Character): string {
    return `You are ${character.name} from the novel. You must respond in character.

Character Description: ${character.description}
Personality: ${character.personality}

Your responses should:
1. Stay true to the character's personality and beliefs
2. Reference your knowledge and experiences from the story
3. Be influenced by the player's relationship with you
4. Be concise (1-3 sentences)
5. Be in Korean language
6. DO NOT include your name in the response (it will be added automatically)
`.trim()
  }

  private buildPrompt(
    character: Character,
    gameState: GameState,
    relationship: number,
    trust: number,
    knowledge: string[],
    userQuery?: string
  ): string {
    const relationshipStatus =
      relationship > 30 ? "매우 좋음" : relationship > 0 ? "좋음" : relationship > -30 ? "중립" : "나쁨"
    const trustStatus = trust > 70 ? "높음" : trust > 40 ? "보통" : "낮음"

    return `
Current Game State:
- Act: ${gameState.act}, Scene: ${gameState.scene}
- Your relationship with the player: ${relationshipStatus} (${relationship})
- Your trust in the player: ${trustStatus} (${trust})
- Theme Gauges: ${JSON.stringify(gameState.themeGauges)}

Your Knowledge Base:
${knowledge.map((k, i) => `${i + 1}. ${k}`).join("\n")}

${userQuery ? `Player's Question: ${userQuery}` : "The player is seeking your advice on the current situation."}

Respond as ${character.name} would, considering the relationship and trust levels.
Keep your response natural, in-character, and helpful.
`.trim()
  }
}

