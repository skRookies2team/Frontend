/**
 * API Image Generator Implementation
 * Uses real image generation APIs
 */

import type { IImageGeneratorAPI } from "$lib/api/types"
import { createImageClient } from "$lib/api/image-client"

export class APIImageGenerator implements IImageGeneratorAPI {
  private imageClient = createImageClient()

  async generateImage(prompt: string): Promise<string> {
    console.log("[API] Generating image using API for prompt:", prompt)

    try {
      const response = await this.imageClient.generate({
        prompt: this.enhancePrompt(prompt),
        size: "1792x1024",
        quality: "standard",
      })

      return response.url
    } catch (error) {
      console.error("[API] Error generating image:", error)
      // Fallback to placeholder on error
      const encodedPrompt = encodeURIComponent(prompt)
      return `/placeholder.svg?height=800&width=1200&query=${encodedPrompt}`
    }
  }

  async generateCharacterPortrait(characterName: string, description: string): Promise<string> {
    console.log("[API] Generating character portrait using API for:", characterName)

    const prompt = `Portrait of ${characterName}, ${description}, book illustration style, detailed, professional`

    try {
      const response = await this.imageClient.generate({
        prompt,
        size: "1024x1024",
        quality: "standard",
      })

      return response.url
    } catch (error) {
      console.error("[API] Error generating portrait:", error)
      // Fallback to placeholder on error
      const encodedPrompt = encodeURIComponent(prompt)
      return `/placeholder.svg?height=400&width=400&query=${encodedPrompt}`
    }
  }

  /**
   * Enhance prompt with quality and style keywords
   */
  private enhancePrompt(prompt: string): string {
    return `${prompt}, cinematic, highly detailed, professional photography, atmospheric lighting, 8k quality`
  }
}

