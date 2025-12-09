/**
 * API Character Chat Implementation
 * Uses Backend-Relay server for RAG-based character responses
 */

import type { Character, GameState } from "$lib/types/game-state"
import type { ICharacterChatAPI } from "$lib/api/types/service-types"
import { createLLMClient } from "$lib/api/llm-client"
import { aiApi } from "$lib/api/ai-api"
import { appConfig } from "$lib/config/app-config"
import { getCharacterKnowledge } from "$lib/data/mock-knowledge"

export class APICharacterChat implements ICharacterChatAPI {
  private llmClient = createLLMClient()
  private useBackend = appConfig.apiMode === 'production'

  async getCharacterResponse(
    character: Character,
    gameState: GameState,
    userQuery?: string
  ): Promise<string> {
    console.log("[API] Getting character response using", this.useBackend ? "Backend-Relay" : "Direct LLM", ":", character.name)

    try {
      if (this.useBackend) {
        // Backend-Relay 서버를 통한 RAG 기반 캐릭터 응답
        const response = await aiApi.sendChatMessage({
          characterId: character.id,
          userMessage: userQuery || "현재 상황에 대해 조언해주세요.",
          gameContext: {
            currentEpisode: `Act ${gameState.act}`,
            currentNode: `Scene ${gameState.scene}`,
            gaugeStates: gameState.themeGauges,
            relationships: gameState.relationships
          }
        })
        return `${character.name}: ${response.aiMessage}`
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
      return await aiApi.indexCharacter({
        characterId: character.id,
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

