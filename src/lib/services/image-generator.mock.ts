/**
 * Mock Image Generator Implementation
 * Uses placeholder images for development and testing
 */

import type { IImageGeneratorAPI } from "$lib/api/types"

export class MockImageGenerator implements IImageGeneratorAPI {
  async generateImage(prompt: string): Promise<string> {
    console.log("[Mock] Generating placeholder image for prompt:", prompt)

    // Use placeholder service with scene-specific queries
    const encodedPrompt = encodeURIComponent(prompt)
    return `/placeholder.svg?height=800&width=1200&query=${encodedPrompt}`
  }

  async generateCharacterPortrait(characterName: string, description: string): Promise<string> {
    console.log("[Mock] Generating placeholder portrait for:", characterName)

    const prompt = `Portrait of ${characterName}, ${description}, book illustration style`
    const encodedPrompt = encodeURIComponent(prompt)
    return `/placeholder.svg?height=400&width=400&query=${encodedPrompt}`
  }
}

