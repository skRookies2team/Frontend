// Local storage utilities for saving game state

import type { GameState } from "$lib/types/game-state"

const STORAGE_KEY = "if-story-save"

export function saveGameState(state: GameState): boolean {
  try {
    const serialized = JSON.stringify(state)
    localStorage.setItem(STORAGE_KEY, serialized)
    console.log("[v0] Game state saved successfully")
    return true
  } catch (error) {
    console.error("[v0] Error saving game state:", error)
    return false
  }
}

export function loadGameState(): GameState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) return null

    const state = JSON.parse(serialized)
    console.log("[v0] Game state loaded successfully")
    return state
  } catch (error) {
    console.error("[v0] Error loading game state:", error)
    return null
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log("[v0] Game state cleared")
  } catch (error) {
    console.error("[v0] Error clearing game state:", error)
  }
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null
}
