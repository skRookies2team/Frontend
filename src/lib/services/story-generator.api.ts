/**
 * API Story Generator Implementation
 * Uses real LLM APIs for story generation
 */

import type { GameState, SceneData, Choice } from "$lib/types/game-state"
import type { IStoryGeneratorAPI } from "$lib/api/types/service-types"
import { createLLMClient } from "$lib/api/llm-client"
import { APIImageGenerator } from "./image-generator.api"

export class APIStoryGenerator implements IStoryGeneratorAPI {
  private llmClient = createLLMClient()
  private imageGenerator = new APIImageGenerator()

  async generateScene(
    gameState: GameState,
    novelContext: string,
    previousChoice?: Choice
  ): Promise<SceneData> {
    console.log("[API] Generating scene using LLM...")

    const prompt = this.buildPrompt(gameState, novelContext, previousChoice)

    try {
      // Call LLM API
      const response = await this.llmClient.chat({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a storyteller AI for an interactive novel simulator. Generate scenes in valid JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      })

      // Parse the JSON response
      const sceneData: SceneData = JSON.parse(response.content)

      // Generate image if prompt is provided
      if (sceneData.imagePrompt) {
        sceneData.imageUrl = await this.imageGenerator.generateImage(sceneData.imagePrompt)
      }

      return sceneData
    } catch (error) {
      console.error("[API] Error generating scene:", error)
      throw new Error(`Failed to generate scene: ${error}`)
    }
  }

  private buildPrompt(gameState: GameState, novelContext: string, previousChoice?: Choice): string {
    return `
You are a storyteller AI for an interactive novel simulator.

Novel Context: ${novelContext}

Current Game State:
- Act: ${gameState.act}, Scene: ${gameState.scene}
- Theme Gauges: ${JSON.stringify(gameState.themeGauges)}
- Relationships: ${JSON.stringify(gameState.relationships)}
- Trust Levels: ${JSON.stringify(gameState.trust)}
- Active Flags: ${JSON.stringify(gameState.flags)}

${previousChoice ? `Previous Choice: ${previousChoice.text}` : "This is the beginning of the story."}

Generate the next scene in JSON format with:
{
  "id": "unique_scene_id",
  "story": "narrative text (2-3 paragraphs)",
  "choices": [
    {
      "id": "choice_1",
      "text": "choice description",
      "impact": {
        "relationships": { "character_id": number },
        "trust": { "character_id": number },
        "themeGauges": { "gauge_id": number },
        "flags": { "flag_name": boolean }
      }
    }
  ],
  "imagePrompt": "description for AI image generation",
  "characterEvents": [
    {
      "characterId": "character_id",
      "eventType": "dialogue",
      "content": "what the character says"
    }
  ]
}

Make choices meaningful and reflect their impacts on the game state.
The story should be engaging, immersive, and consistent with the novel's themes.
Provide 3-4 choices that offer different paths and consequences.
`.trim()
  }
}

