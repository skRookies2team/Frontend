/**
 * Story Generator Service
 * Entry point for story generation - delegates to mock or API implementation
 */

import { getStoryGenerator } from "./service-factory"

/**
 * Story Generator singleton instance
 * Automatically switches between Mock and API implementations based on config
 */
export const storyGenerator = getStoryGenerator()
