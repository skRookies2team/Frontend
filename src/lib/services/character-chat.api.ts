/**
 * API Character Chat Implementation
 * Uses real LLM APIs with RAG for character responses
 */

import type { Character, GameState } from "$lib/types/game-state"
import type { ICharacterChatAPI } from "$lib/api/types"
import { createLLMClient } from "$lib/api/llm-client"
import { getCharacterKnowledge } from "$lib/data/mock-knowledge"

export class APICharacterChat implements ICharacterChatAPI {
  private llmClient = createLLMClient()

  async getCharacterResponse(
    character: Character,
    gameState: GameState,
    userQuery?: string
  ): Promise<string> {
    console.log("[API] Getting character response using LLM:", character.name)

    const relationship = gameState.relationships[character.id] || 0
    const trust = gameState.trust[character.id] || 50
    const knowledge = getCharacterKnowledge(character.id)

    const prompt = this.buildPrompt(character, gameState, relationship, trust, knowledge, userQuery)

    try {
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
    } catch (error) {
      console.error("[API] Error getting character response:", error)
      throw new Error(`Failed to get character response: ${error}`)
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

