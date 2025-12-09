/**
 * Mock Story Generator Implementation
 * Uses hardcoded scenes for development and testing
 */

import type { GameState, SceneData, Choice } from "$lib/types/game-state"
import type { IStoryGeneratorAPI } from "$lib/api/types/service-types"
import { getMockScenesByNovel } from "$lib/data/mock-scenes"
import { MockImageGenerator } from "./image-generator.mock"

export class MockStoryGenerator implements IStoryGeneratorAPI {
  private imageGenerator = new MockImageGenerator()

  async generateScene(
    gameState: GameState,
    novelContext: string,
    previousChoice?: Choice
  ): Promise<SceneData> {
    console.log("[Mock] Generating scene from mock data...")

    // Get mock scene based on novel ID and scene number
    const sceneData = getMockScenesByNovel(
      gameState.currentNovel,
      gameState.scene - 1
    )

    // Generate image if prompt is provided
    if (sceneData.imagePrompt) {
      sceneData.imageUrl = await this.imageGenerator.generateImage(sceneData.imagePrompt)
    }

    return sceneData
  }
}

