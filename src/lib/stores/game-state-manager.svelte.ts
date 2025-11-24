import type { GameState, SceneData, Choice, NovelConfig } from "$lib/types/game-state"

class GameStateManager {
  currentState = {
    currentNovel: "",
    act: 1,
    scene: 1,
    relationships: {},
    trust: {},
    themeGauges: {},
    flags: {},
    choiceHistory: [],
    startTime: Date.now(),
    lastUpdate: Date.now(),
  }

  novelConfig = null

  // Initialize game with novel config
  initializeGame(novelConfig: NovelConfig) {
    console.log("[v0] Initializing game with novel:", novelConfig.title)

    this.novelConfig = novelConfig
    this.currentState = {
      currentNovel: novelConfig.id,
      act: 1,
      scene: 1,
      relationships: {},
      trust: {},
      themeGauges: {},
      flags: {},
      choiceHistory: [],
      startTime: Date.now(),
      lastUpdate: Date.now(),
      ...novelConfig.initialState,
    }

    // Initialize relationships and trust for all characters
    novelConfig.characters.forEach((character) => {
      this.currentState.relationships[character.id] = 0
      this.currentState.trust[character.id] = 50
    })

    // Initialize theme gauges
    novelConfig.themeGauges.forEach((gauge) => {
      this.currentState.themeGauges[gauge.id] = gauge.initialValue
    })
  }

  // Update scene
  setScene(sceneData: SceneData) {
    console.log("[v0] Setting new scene:", sceneData.id)
    this.currentState.currentScene = sceneData
    this.currentState.lastUpdate = Date.now()
  }

  // Process player choice
  processChoice(choice: Choice) {
    console.log("[v0] Processing choice:", choice.text)

    // Add to history
    const choiceWithTimestamp = { ...choice, timestamp: Date.now() }
    this.currentState.choiceHistory = [...this.currentState.choiceHistory, choiceWithTimestamp]

    // Apply impacts
    if (choice.impact) {
      if (choice.impact.relationships) {
        Object.entries(choice.impact.relationships).forEach(([charId, value]) => {
          const current = this.currentState.relationships[charId] || 0
          this.currentState.relationships[charId] = Math.max(-100, Math.min(100, current + value))
        })
      }

      if (choice.impact.trust) {
        Object.entries(choice.impact.trust).forEach(([charId, value]) => {
          const current = this.currentState.trust[charId] || 50
          this.currentState.trust[charId] = Math.max(0, Math.min(100, current + value))
        })
      }

      if (choice.impact.themeGauges) {
        Object.entries(choice.impact.themeGauges).forEach(([gaugeId, value]) => {
          const current = this.currentState.themeGauges[gaugeId] || 0
          this.currentState.themeGauges[gaugeId] = Math.max(-100, Math.min(100, current + value))
        })
      }

      if (choice.impact.flags) {
        Object.entries(choice.impact.flags).forEach(([flag, value]) => {
          this.currentState.flags[flag] = value
        })
      }
    }

    this.currentState.scene = this.currentState.scene + 1
    this.currentState.lastUpdate = Date.now()
  }

  // Update specific state values
  updateState(updates: Partial<GameState>) {
    console.log("[v0] Updating state:", updates)
    this.currentState = {
      ...this.currentState,
      ...updates,
      lastUpdate: Date.now(),
    }
  }

  // Get relationship value
  getRelationship(characterId: string): number {
    return this.currentState.relationships[characterId] || 0
  }

  // Get trust value
  getTrust(characterId: string): number {
    return this.currentState.trust[characterId] || 50
  }

  // Get theme gauge value
  getThemeGauge(gaugeId: string): number {
    return this.currentState.themeGauges[gaugeId] || 0
  }

  // Export state for LLM context
  exportForLLM(): string {
    return JSON.stringify(
      {
        act: this.currentState.act,
        scene: this.currentState.scene,
        relationships: this.currentState.relationships,
        trust: this.currentState.trust,
        themeGauges: this.currentState.themeGauges,
        flags: this.currentState.flags,
        recentChoices: this.currentState.choiceHistory.slice(-5),
      },
      null,
      2,
    )
  }
}

// Singleton instance
export const gsm = new GameStateManager()
