# 아키텍처 문서

## 개요

IF Story는 확장 가능하고 유지보수가 쉬운 구조로 설계되었습니다. 핵심 원칙은 **관심사의 분리**, **의존성 주입**, **인터페이스 기반 설계**입니다.

## 계층 구조

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                  │
│  (Svelte Components, UI)                    │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Application Layer                   │
│  (Game State Manager, Business Logic)      │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Service Layer                       │
│  (Story Generator, Character Chat, etc)     │
└─────────────────┬───────────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼─────────┐    ┌────────▼────────┐
│  Data Layer   │    │   API Layer     │
│  (Mock Data)  │    │  (Real APIs)    │
└───────────────┘    └─────────────────┘
```

## 핵심 컴포넌트

### 1. Configuration Layer (`src/lib/config/`)

**목적**: 환경 변수 관리 및 앱 설정

```typescript
// app-config.ts
export const appConfig: AppConfig = {
  apiMode: 'mock' | 'production',
  llm: { provider, apiKey, model },
  image: { provider, apiKey, model },
}
```

**책임**:
- 환경 변수 로드
- 설정 검증
- 모드 전환 관리

### 2. API Layer (`src/lib/api/`)

**목적**: 외부 API와의 통신

**구조**:
```
api/
├── types.ts           # API 인터페이스 정의
├── llm-client.ts      # LLM API 클라이언트
└── image-client.ts    # 이미지 API 클라이언트
```

**인터페이스**:
```typescript
interface LLMClient {
  chat(request: LLMRequest): Promise<LLMResponse>
}

interface ImageClient {
  generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse>
}
```

**구현체**:
- `OpenAIClient`: OpenAI API 통신
- `AnthropicClient`: Anthropic API 통신
- `OpenAIImageClient`: DALL-E 이미지 생성

### 3. Service Layer (`src/lib/services/`)

**목적**: 비즈니스 로직 구현

**패턴**: Strategy Pattern + Factory Pattern

```
services/
├── service-factory.ts      # 서비스 생성 팩토리
├── story-generator.ts      # 엔트리 포인트
├── story-generator.mock.ts # Mock 구현
├── story-generator.api.ts  # API 구현
└── ...
```

**서비스 팩토리**:
```typescript
class ServiceFactory {
  getStoryGenerator(): IStoryGeneratorAPI {
    return isMockMode() 
      ? new MockStoryGenerator()
      : new APIStoryGenerator()
  }
}
```

### 4. Data Layer (`src/lib/data/`)

**목적**: 데이터 저장 및 관리

```
data/
├── novel-configs.ts   # 소설 메타데이터
├── mock-scenes.ts     # Mock 씬 데이터
└── mock-knowledge.ts  # Mock 캐릭터 지식
```

### 5. State Management (`src/lib/stores/`)

**목적**: 전역 상태 관리

```typescript
class GameStateManager {
  currentState: GameState
  
  initializeGame(novelConfig: NovelConfig)
  processChoice(choice: Choice)
  updateState(updates: Partial<GameState>)
}
```

**특징**:
- Svelte 5 Runes 사용
- 중앙집중식 상태 관리
- 불변성 유지

## 데이터 흐름

### 1. 씬 생성 흐름

```
User Action
    │
    ▼
UI Component (+page.svelte)
    │
    ▼
Game State Manager
    │
    ▼
Story Generator (entry point)
    │
    ▼
Service Factory
    │
    ├──[Mock Mode]──▶ MockStoryGenerator ──▶ Mock Data
    │
    └──[API Mode]───▶ APIStoryGenerator ──▶ LLM Client ──▶ OpenAI/Anthropic
```

### 2. 캐릭터 대화 흐름

```
Character Click
    │
    ▼
Character Panel Component
    │
    ▼
Character Chat Service
    │
    ├──[Mock Mode]──▶ MockCharacterChat ──▶ Mock Knowledge
    │
    └──[API Mode]───▶ APICharacterChat ──▶ LLM Client + RAG
```

## 디자인 패턴

### 1. Factory Pattern

**사용 위치**: `service-factory.ts`

**이점**:
- 객체 생성 로직 캡슐화
- 런타임에 구현체 전환
- 테스트 용이성

### 2. Strategy Pattern

**사용 위치**: Mock vs API 구현

**이점**:
- 알고리즘 교체 가능
- 코드 재사용
- 확장 용이

### 3. Singleton Pattern

**사용 위치**: Service Factory, GSM

**이점**:
- 단일 인스턴스 보장
- 전역 접근점
- 상태 일관성

### 4. Dependency Injection

**사용 위치**: 모든 서비스

**이점**:
- 느슨한 결합
- 테스트 용이성
- 유연한 구성

## 확장성

### 새로운 소설 추가

1. `src/lib/data/novel-configs.ts`에 설정 추가
2. Mock 씬 데이터 작성 (선택사항)
3. 캐릭터 지식베이스 추가

### 새로운 LLM 제공자 추가

1. `src/lib/api/llm-client.ts`에 클라이언트 구현
   ```typescript
   export class NewLLMClient implements LLMClient {
     async chat(request: LLMRequest): Promise<LLMResponse> {
       // 구현
     }
   }
   ```

2. 팩토리에 케이스 추가
   ```typescript
   export function createLLMClient(): LLMClient {
     switch (appConfig.llm.provider) {
       case "new-llm": return new NewLLMClient()
       // ...
     }
   }
   ```

3. 설정에 타입 추가
   ```typescript
   export type LLMProvider = 'openai' | 'anthropic' | 'new-llm'
   ```

### 새로운 기능 추가

예: 음성 생성 서비스

1. 인터페이스 정의
   ```typescript
   // src/lib/api/types.ts
   export interface IVoiceGeneratorAPI {
     generateVoice(text: string, voice: string): Promise<string>
   }
   ```

2. Mock 구현
   ```typescript
   // src/lib/services/voice-generator.mock.ts
   export class MockVoiceGenerator implements IVoiceGeneratorAPI {
     async generateVoice(text: string): Promise<string> {
       return "/mock-audio.mp3"
     }
   }
   ```

3. API 구현
   ```typescript
   // src/lib/services/voice-generator.api.ts
   export class APIVoiceGenerator implements IVoiceGeneratorAPI {
     async generateVoice(text: string): Promise<string> {
       // ElevenLabs API 호출
     }
   }
   ```

4. 팩토리에 추가
   ```typescript
   // src/lib/services/service-factory.ts
   getVoiceGenerator(): IVoiceGeneratorAPI {
     return isMockMode() 
       ? new MockVoiceGenerator()
       : new APIVoiceGenerator()
   }
   ```

## 테스트 전략

### Unit Tests
- 각 서비스 독립적으로 테스트
- Mock 구현체를 사용한 빠른 테스트

### Integration Tests
- Service Factory를 통한 통합 테스트
- Mock 모드에서 전체 흐름 검증

### E2E Tests
- Playwright를 사용한 UI 테스트
- 실제 사용자 시나리오 검증

## 성능 최적화

### 1. 지연 로딩
- 서비스는 첫 사용 시에만 생성 (Lazy Initialization)

### 2. 캐싱
- API 응답 캐싱
- 이미지 URL 캐싱

### 3. 병렬 처리
- 이미지 생성과 스토리 생성 병렬 실행

## 보안

### API 키 관리
- 환경 변수로만 관리
- Git에서 제외 (.gitignore)
- 프로덕션에서는 서버 사이드 처리 권장

### 입력 검증
- 사용자 입력 sanitization
- API 응답 검증

## 모니터링

### 로깅
- 각 레이어에서 구조화된 로깅
- `[Mock]`, `[API]` 접두사로 모드 식별

### 에러 처리
- Try-catch로 에러 캡처
- Fallback 동작 구현
- 사용자 친화적 에러 메시지

## 참고 자료

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns](https://refactoring.guru/design-patterns)

