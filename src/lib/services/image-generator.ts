/**
 * Image Generator Service
 * Entry point for image generation - delegates to mock or API implementation
 */

import { getImageGenerator } from "./service-factory"

/**
 * Image Generator singleton instance
 * Automatically switches between Mock and API implementations based on config
 */
export const imageGenerator = getImageGenerator()
