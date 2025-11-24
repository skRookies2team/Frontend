/**
 * Mock Character Chat Implementation
 * Uses hardcoded knowledge base for development and testing
 */

import type { Character, GameState } from "$lib/types/game-state"
import type { ICharacterChatAPI } from "$lib/api/types"
import { getCharacterKnowledge } from "$lib/data/mock-knowledge"

export class MockCharacterChat implements ICharacterChatAPI {
  async getCharacterResponse(
    character: Character,
    gameState: GameState,
    userQuery?: string
  ): Promise<string> {
    console.log("[Mock] Getting character response from mock data:", character.name)

    const knowledge = getCharacterKnowledge(character.id)
    const relationship = gameState.relationships[character.id] || 0
    const trust = gameState.trust[character.id] || 50

    // Simulate RAG-based response
    if (userQuery) {
      return this.generateQueryResponse(character, knowledge, relationship, trust, userQuery)
    } else {
      return this.generateContextualAdvice(character, knowledge, gameState, relationship, trust)
    }
  }

  private generateQueryResponse(
    character: Character,
    knowledge: string[],
    relationship: number,
    trust: number,
    query: string
  ): string {
    // Simple keyword matching for demo
    const relevantKnowledge = knowledge[Math.floor(Math.random() * knowledge.length)]

    if (relationship > 30 && trust > 60) {
      return `${character.name}: ${relevantKnowledge} 당신을 믿어요.`
    } else if (relationship < -30 || trust < 40) {
      return `${character.name}: ${relevantKnowledge} 하지만 당신이 올바른 선택을 할지 모르겠어요.`
    } else {
      return `${character.name}: ${relevantKnowledge}`
    }
  }

  private generateContextualAdvice(
    character: Character,
    knowledge: string[],
    gameState: GameState,
    relationship: number,
    trust: number
  ): string {
    const advice = knowledge[Math.floor(Math.random() * knowledge.length)]

    // Add context based on theme gauges
    const civilization = gameState.themeGauges["civilization"] || 0
    const reason = gameState.themeGauges["reason"] || 0

    if (character.id === "ralph" && civilization < -30) {
      return `${character.name}: 우리가 너무 야만적으로 변하고 있어요... ${advice}`
    } else if (character.id === "jack" && civilization > 30) {
      return `${character.name}: 규칙에 너무 얽매이지 마세요. ${advice}`
    } else if (character.id === "piggy" && reason < -30) {
      return `${character.name}: 더 이성적으로 생각해야 해요! ${advice}`
    }

    return `${character.name}: ${advice}`
  }
}

