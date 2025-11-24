/**
 * Character Chat Service
 * Entry point for character chat - delegates to mock or API implementation
 */

import { getCharacterChat } from "./service-factory"

/**
 * Character Chat singleton instance
 * Automatically switches between Mock and API implementations based on config
 */
export const characterChat = getCharacterChat()
