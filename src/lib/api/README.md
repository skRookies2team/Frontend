# API 레이어 구조

## 개요

이 디렉토리는 백엔드 API와 외부 API 클라이언트를 관리합니다.

## 디렉토리 구조

```
lib/api/
├── types/                    # 타입 정의
│   ├── backend-types.ts      # 백엔드 API 타입 (포트 8080)
│   ├── ai-types.ts           # Backend-Relay API 타입 (포트 8081)
│   ├── external-api-types.ts # 외부 API 타입 (OpenAI, Anthropic 등)
│   ├── service-types.ts      # 서비스 인터페이스 타입
│   └── index.ts              # 타입 통합 export
│
├── http-client.ts            # 공통 HTTP 클라이언트
│
├── ai-api.ts                 # Backend-Relay 서버 API (포트 8081)
│                             # - 소설 분석, 스토리 생성, 이미지 생성, RAG 채팅
│
├── llm-client.ts             # 외부 LLM API 직접 클라이언트 (폴백용)
│                             # - OpenAI, Anthropic 직접 호출
│
├── image-client.ts           # 외부 이미지 API 직접 클라이언트 (폴백용)
│                             # - OpenAI DALL-E, Stability AI 직접 호출
│
├── auth-api.ts               # 인증 API (포트 8080)
├── user-api.ts               # 사용자 API (포트 8080)
├── story-api.ts              # 스토리 관리 API (포트 8080)
├── post-api.ts               # 게시글 API (포트 8080)
├── comment-api.ts            # 댓글 API (포트 8080)
├── review-api.ts             # 리뷰 API (포트 8080)
├── game-api.ts               # 게임 API (포트 8080)
├── upload-api.ts             # 파일 업로드 API (포트 8080)
├── health-api.ts             # 헬스 체크 API
│
├── types.ts                  # 레거시 타입 export (하위 호환성)
└── index.ts                  # 통합 export
```

## API 레이어 구분

### 1. Backend API (포트 8080)
메인 백엔드 서버와 통신하는 API 클라이언트들:
- `auth-api.ts`: 인증/인가
- `user-api.ts`: 사용자 관리
- `story-api.ts`: 스토리 관리
- `post-api.ts`, `comment-api.ts`, `review-api.ts`: 커뮤니티 기능
- `game-api.ts`: 게임 플레이
- `upload-api.ts`: 파일 업로드

### 2. Backend-Relay API (포트 8081)
AI 기능을 제공하는 릴레이 서버 API:
- `ai-api.ts`: 소설 분석, 스토리 생성, 이미지 생성, RAG 채팅

### 3. External API Clients (폴백/개발용)
외부 서비스를 직접 호출하는 클라이언트:
- `llm-client.ts`: OpenAI, Anthropic 직접 호출
- `image-client.ts`: DALL-E, Stability AI 직접 호출

**참고**: 프로덕션 환경에서는 Backend-Relay API를 사용하고, External API Clients는 개발/테스트 또는 폴백 용도로만 사용합니다.

## 사용 가이드

### Backend API 사용
```typescript
import { api } from '$lib/api';

// 스토리 업로드
const result = await api.story.uploadNovel({ title, novelText });

// 사용자 프로필 조회
const profile = await api.user.getProfile();
```

### Backend-Relay API 사용
```typescript
import { aiApi } from '$lib/api';

// 소설 분석
const analysis = await aiApi.analyzeNovel({ novelText });

// 이미지 생성
const image = await aiApi.generateImage({ nodeText, episodeTitle });
```

### External API 사용 (폴백)
```typescript
import { createLLMClient } from '$lib/api/llm-client';

const llmClient = createLLMClient();
const response = await llmClient.chat({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello' }]
});
```

## 타입 사용

모든 타입은 `$lib/api/types`에서 import:
```typescript
import type { 
  StoryUploadRequestDto,
  NovelAnalyzeRequest,
  LLMRequest,
  IStoryGeneratorAPI 
} from '$lib/api/types';
```

또는 통합 export 사용:
```typescript
import type { StoryUploadRequestDto } from '$lib/api';
```

## 서비스 레이어와의 관계

서비스 레이어(`lib/services`)는 이 API 레이어를 사용하여 비즈니스 로직을 구현합니다:

```
Service Layer (lib/services)
    ↓
API Layer (lib/api)
    ↓
Backend Servers / External APIs
```

서비스는 Backend API를 우선 사용하고, 필요시 External API를 폴백으로 사용합니다.

