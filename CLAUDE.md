# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IF Story** is an AI-powered multimodal story simulator platform that transforms novels into interactive, playable simulations. It uses LLM + RAG + State Machine architecture to let users "play" stories rather than just read them.

The frontend is a SvelteKit SPA built with Svelte 5, TypeScript, and Tailwind CSS v4, deployed as a static site to AWS S3/CloudFront.

## Development Commands

### Setup and Development
```bash
# Install dependencies
npm install

# Start development server (default port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Type check
npm run check

# Type check in watch mode
npm run check:watch

# Format code
npm run format

# Check formatting
npm run lint
```

### Build Preparation
The project uses `@sveltejs/adapter-static` configured in `svelte.config.js` for CloudFront + S3 deployment. Before building:
- Ensure environment variables are set (see ENV.md)
- The build outputs to the `build/` directory
- SPA fallback is enabled with `fallback: 'index.html'`

## Architecture

### Layered Architecture
```
Presentation Layer (Svelte Components)
    ↓
Application Layer (Game State Manager)
    ↓
Service Layer (Story Generator, Character Chat, Image Generator)
    ↓
API Layer / Data Layer
```

### Key Architectural Patterns

1. **Dependency Injection via Service Factory** (`src/lib/services/service-factory.ts`)
   - Services are created through a factory that switches between Mock and API implementations
   - Controlled by `PUBLIC_API_MODE` environment variable
   - Enables offline development and easy testing

2. **Dual Backend Architecture**
   - **Main Backend** (port 8080): Authentication, story management, community features, gameplay
   - **Relay Backend** (port 8081): AI features (novel analysis, story generation, image generation, RAG chat)
   - Configuration in `src/lib/config/app-config.ts`

3. **Game State Management** (`src/lib/stores/game-state-manager.svelte.ts`)
   - Singleton pattern using Svelte 5 runes
   - Manages: relationships, trust, theme gauges, flags, choice history
   - Exports state context for LLM via `exportForLLM()`

### Directory Structure

- `src/lib/api/` - API clients for both backend servers and external APIs (OpenAI, Anthropic)
  - `types/` - TypeScript type definitions for all APIs
  - `ai-api.ts` - Relay server API (AI features)
  - `auth-api.ts`, `user-api.ts`, `story-api.ts`, etc. - Main backend APIs
  - `llm-client.ts`, `image-client.ts` - Direct external API clients (fallback/development)

- `src/lib/services/` - Business logic with dual implementations
  - `service-factory.ts` - Factory for creating Mock or API services
  - `*-generator.mock.ts` - Mock implementations using local data
  - `*-generator.api.ts` - Real API implementations

- `src/lib/data/` - Mock data and novel configurations
  - `novel-configs.ts` - Novel metadata, characters, theme gauges
  - `mock-scenes.ts` - Pre-generated scenes for mock mode
  - `mock-knowledge.ts` - Character knowledge base for RAG

- `src/lib/stores/` - Global state management (Svelte stores/runes)

- `src/lib/components/` - Reusable UI components

- `src/routes/` - SvelteKit file-based routing
  - `/` - Home page
  - `/play/[novel_id]` - Game play page
  - `/creator` - Story creator wizard
  - `/community` - Community features
  - `/login`, `/profile` - User pages

### Service Layer Pattern

All services follow this structure:
```typescript
// 1. Interface definition (in src/lib/api/types/service-types.ts)
interface IStoryGeneratorAPI {
  generateScene(...): Promise<SceneData>
}

// 2. Mock implementation (*.mock.ts)
class MockStoryGenerator implements IStoryGeneratorAPI {
  async generateScene(...) {
    return mockScenes[...]  // Uses local data
  }
}

// 3. API implementation (*.api.ts)
class APIStoryGenerator implements IStoryGeneratorAPI {
  async generateScene(...) {
    return await aiApi.generateStory(...)  // Calls backend
  }
}

// 4. Factory creates appropriate implementation
serviceFactory.getStoryGenerator()  // Returns Mock or API based on config
```

## Environment Configuration

The application supports two modes controlled by environment variables:

### Mock Mode (default)
- Uses hardcoded data from `src/lib/data/`
- No API keys required
- Works offline
- Fast development/testing

### Production Mode
- Connects to real backend servers
- Requires backend URLs in environment variables
- Set `PUBLIC_API_MODE=production`

See `ENV.md` for detailed environment variable configuration.

**Important**: Production deployments MUST set `PUBLIC_API_BASE_URL` and `PUBLIC_RELAY_API_URL` with full domain URLs including protocol (e.g., `https://api.yourdomain.com`).

## Key Implementation Details

### State Management with Svelte 5 Runes
The project uses Svelte 5's new runes system. The Game State Manager is a singleton class with reactive state:
```typescript
class GameStateManager {
  currentState = {
    currentNovel: "",
    act: 1,
    scene: 1,
    relationships: {},
    trust: {},
    themeGauges: {},
    // ... more state
  }
}
export const gsm = new GameStateManager()
```

### Choice Processing Flow
1. User selects choice → `gsm.processChoice(choice)`
2. Apply choice impacts (relationships, trust, theme gauges, flags)
3. Increment scene counter
4. Generate next scene via Story Generator
5. Update UI with new scene data

### RAG Character Chat
Character chat uses game state as context:
```typescript
characterChat.chat({
  characterId,
  message,
  gameState: gsm.exportForLLM()  // Includes relationships, trust, recent choices
})
```

### Image Generation
- In production mode: Routes through relay backend (`PUBLIC_IMAGE_API_PROVIDER=backend`)
- In development: Can directly call DALL-E or other providers
- Images are generated based on scene text and episode title

## Deployment

The project uses GitHub Actions for CI/CD (`.github/workflows/deploy.yml`):
1. Builds on push to `main` branch
2. Uploads to S3 with cache headers
3. Invalidates CloudFront cache

Required GitHub Secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (default: ap-northeast-2)
- `S3_BUCKET_NAME`
- `CLOUDFRONT_DISTRIBUTION_ID` (optional)

## Testing Strategy

While no test framework is currently configured:
- Mock mode enables rapid UI testing without backend dependencies
- Service factory pattern makes unit testing straightforward
- Each service layer can be tested independently

## Common Development Tasks

### Adding a New Novel
1. Add configuration to `src/lib/data/novel-configs.ts`
2. (Optional) Add mock scenes to `src/lib/data/mock-scenes.ts`
3. (Optional) Add character knowledge to `src/lib/data/mock-knowledge.ts`

### Adding a New LLM Provider
1. Implement client in `src/lib/api/llm-client.ts`
2. Update `LLMProvider` type in `src/lib/config/app-config.ts`
3. Update factory logic to instantiate new client

### Adding a New Service
1. Define interface in `src/lib/api/types/service-types.ts`
2. Create mock implementation in `src/lib/services/[service].mock.ts`
3. Create API implementation in `src/lib/services/[service].api.ts`
4. Add factory method in `src/lib/services/service-factory.ts`

## Important Conventions

- **Logging**: Use `[Mock]` or `[API]` prefixes to identify service mode
- **Type Safety**: All API requests/responses are strongly typed in `src/lib/api/types/`
- **Error Handling**: Services should provide fallback behavior and user-friendly error messages
- **State Updates**: Always go through GSM methods, never mutate state directly
- **Component Structure**: Prefer composition over inheritance for Svelte components

## Technology Stack

- **Framework**: SvelteKit 2.x with Svelte 5 (runes)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS v4 + tailwind-variants + clsx + tailwind-merge
- **Icons**: lucide-svelte
- **Build Tool**: Vite 6.x
- **Deployment**: Static adapter → S3 + CloudFront
- **Code Quality**: Prettier with svelte and tailwindcss plugins

## Backend Integration

The frontend expects two backend servers:

1. **Main Backend** (`PUBLIC_API_BASE_URL`)
   - REST API for CRUD operations
   - Authentication/authorization
   - Story management, community features, user profiles

2. **Relay Backend** (`PUBLIC_RELAY_API_URL`)
   - AI-powered features
   - Novel analysis, story generation, image generation
   - RAG-based character chat

See `src/lib/api/README.md` and `docs/API-INTEGRATION.md` for detailed API documentation.

## Notes for Development

- The project is designed for both frontend-only development (mock mode) and full-stack development (production mode)
- SvelteKit's `adapter-static` means all routes must be prerenderable or use client-side routing
- Environment variables must be prefixed with `PUBLIC_` to be accessible in the browser
- The `svelte.config.js` is configured with `strict: false` to allow SPA mode for S3 static hosting
