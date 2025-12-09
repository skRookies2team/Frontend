/**
 * API Image Generator Implementation
 * Uses Backend-Relay server for AI image generation
 */

import type { IImageGeneratorAPI } from "$lib/api/types/service-types"
import { createImageClient } from "$lib/api/image-client"
import { aiApi } from "$lib/api/ai-api"
import { appConfig } from "$lib/config/app-config"

export class APIImageGenerator implements IImageGeneratorAPI {
  private imageClient = createImageClient()
  private useBackend = appConfig.image.provider === 'backend'

  async generateImage(prompt: string): Promise<string> {
    console.log("[API] Generating image using", this.useBackend ? "Backend-Relay" : "Direct API", "for prompt:", prompt)

    try {
      if (this.useBackend) {
        // Backend-Relay 서버를 통한 이미지 생성
        const response = await aiApi.generateImage({
          nodeText: prompt,
          episodeTitle: '',
          mood: 'atmospheric',
          style: 'cinematic'
        })
        return response.imageUrl
      } else {
        // 직접 API 호출 (OpenAI, Stability 등)
        const response = await this.imageClient.generate({
          prompt: this.enhancePrompt(prompt),
          size: "1792x1024",
          quality: "standard",
        });
        return response.url;
      }
    } catch (error) {
      console.error("[API] Error generating image:", error)
      // Fallback to placeholder on error
      const encodedPrompt = encodeURIComponent(prompt)
      return `/placeholder.svg?height=800&width=1200&query=${encodedPrompt}`
    }
  }

  async generateCharacterPortrait(characterName: string, description: string): Promise<string> {
    console.log("[API] Generating character portrait using", this.useBackend ? "Backend-Relay" : "Direct API", "for:", characterName)

    const prompt = `Portrait of ${characterName}, ${description}, book illustration style, detailed, professional`

    try {
      if (this.useBackend) {
        // Backend-Relay 서버를 통한 이미지 생성
        const response = await aiApi.generateImage({
          nodeText: prompt,
          episodeTitle: '',
          characters: [characterName],
          mood: 'portrait',
          style: 'book illustration'
        })
        return response.imageUrl
      } else {
        // 직접 API 호출
        const response = await this.imageClient.generate({
          prompt,
          size: "1024x1024",
          quality: "standard",
        });
        return response.url;
      }
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

