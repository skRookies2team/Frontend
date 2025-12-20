/**
 * Game State Types
 * Core type definitions for the game state management system
 */

/**
 * Game State
 * Represents the complete state of the game at any point in time
 */
export interface GameState {
  // Story progression
  currentNovel: string // Novel ID
  act: number // Current act/chapter
  scene: number // Current scene number

  // Character relationships and trust
  relationships: Record<string, number> // Character relationship values (-100 to 100)
  trust: Record<string, number> // Character trust levels (0 to 100)

  // Theme gauges (novel-specific)
  themeGauges: Record<string, number> // Theme gauge values (-100 to 100)

  // Story flags and choices
  flags: Record<string, boolean> // Story state flags
  choiceHistory: Choice[] // History of player choices

  // Current scene data
  currentScene?: SceneData // Currently displayed scene

  // Metadata
  startTime: number // Game start timestamp
  lastUpdate: number // Last state update timestamp
}

/**
 * Scene Data
 * Represents a single scene/moment in the story
 */
export interface SceneData {
  id: string // Unique scene identifier
  story: string // Narrative text (markdown supported)
  choices: Choice[] // Available player choices
  imagePrompt?: string // Prompt for image generation
  imageUrl?: string // Generated or static image URL
  characterEvents?: CharacterEvent[] // Character interactions in this scene
  stateUpdate?: Partial<GameState> // Direct state updates (optional)
}

/**
 * Player Choice
 * Represents a decision point for the player
 */
export interface Choice {
  id: string // Unique choice identifier
  text: string // Choice description shown to player
  impact?: ChoiceImpact // Effects of this choice
  timestamp?: number // When the choice was made (for history)
}

/**
 * Choice Impact
 * Defines how a choice affects the game state
 */
export interface ChoiceImpact {
  relationships?: Record<string, number> // Relationship changes
  trust?: Record<string, number> // Trust level changes
  themeGauges?: Record<string, number> // Theme gauge changes
  flags?: Record<string, boolean> // Flag updates
}

/**
 * Character Event
 * Represents a character action or dialogue in a scene
 */
export interface CharacterEvent {
  characterId: string // ID of the character
  eventType: "dialogue" | "reaction" | "hint" // Type of event
  content: string // Event content/text
}

/**
 * Novel Configuration
 * Defines the setup and metadata for a playable novel
 */
export interface NovelConfig {
  id: string // Unique novel identifier
  title: string // Novel title
  description: string // Short description
  author: string // Original author
  category: string // Category for filtering
  difficulty: string // Difficulty level (초급/중급/고급)
  thumbnail: string // Thumbnail image URL

  // Core characters
  characters: Character[] // List of characters in the novel

  // Theme gauge definitions
  themeGauges: ThemeGauge[] // Theme gauges for this novel

  // Initial state
  initialState: Partial<GameState> // Starting game state
}

/**
 * Character
 * Represents a character in the story
 */
export interface Character {
  id: string // Unique character identifier (UI용)
  chatId?: string // RAG API용 대화 ID (형식: {storyId}_{characterName} 또는 {storyId})
  name: string // Character name
  description: string // Brief description
  personality: string // Personality traits
  knowledgeBase?: string[] // RAG knowledge chunks (optional)
  portraitUrl?: string // Character portrait image (optional)
}

/**
 * Theme Gauge
 * Represents a thematic axis in the story (e.g., good vs evil)
 */
export interface ThemeGauge {
  id: string // Unique gauge identifier
  name: string // Gauge name
  label: string // Display label
  leftLabel: string // Label for left side (negative)
  rightLabel: string // Label for right side (positive)
  initialValue: number // Starting value (-100 to 100)
  description: string // Gauge description
}
