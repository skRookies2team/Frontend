# IF 스토리 (IF Story)

AI 멀티모달 스토리 시뮬레이터 플랫폼

## 프로젝트 개요

IF 스토리는 소설을 실시간으로 플레이 가능한 인터랙티브 시뮬레이션으로 변환하는 AI 기반 플랫폼입니다. LLM + RAG + State Machine 구조를 사용하여 사용자가 스토리를 '읽는' 것이 아니라 '플레이'하도록 설계되었습니다.

## 주요 기능

### 1. 게임 상태 관리 (GSM - Game State Manager)
- 중앙집중식 상태 관리 시스템
- 캐릭터 관계도, 신뢰도, 주제 게이지 추적
- 플레이어 선택 히스토리 관리

### 2. 스토리 생성 엔진
- LLM 기반 동적 장면 생성
- 플레이어 선택에 따른 실시간 스토리 분기
- JSON 기반 구조화된 스토리 데이터

### 3. 캐릭터 RAG 시스템
- 캐릭터별 지식 베이스
- 게임 상태를 반영한 동적 대화
- 플레이어와의 인터랙티브 조언 시스템

### 4. 멀티모달 생성
- AI 기반 장면 배경 이미지 생성
- 시각적으로 몰입감 있는 스토리텔링

### 5. 주제 게이지 시스템
- 소설별 맞춤 주제 추적 (예: 문명 vs 야만)
- 선택의 영향을 실시간으로 시각화

## 아키텍처

\`\`\`
┌─────────────────────────────────────────────┐
│         Configuration Layer                 │
│  - Environment variables                    │
│  - API mode (Mock vs Production)           │
└─────────────────┬───────────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼─────────┐    ┌────────▼────────┐
│  Service      │    │   API Clients   │
│  Factory      │    │  - LLM Client   │
│               │    │  - Image Client │
└─────┬─────────┘    └─────────────────┘
      │
      ├─────────────┬─────────────┬──────────────┐
      │             │             │              │
┌─────▼─────┐ ┌────▼──────┐ ┌───▼──────┐ ┌─────▼────┐
│  Story    │ │Character  │ │  Image   │ │   Game   │
│ Generator │ │  Chat     │ │Generator │ │  State   │
│           │ │  (RAG)    │ │          │ │ Manager  │
└─────┬─────┘ └────┬──────┘ └───┬──────┘ └─────┬────┘
      │            │             │              │
      └────────────┴─────────────┴──────────────┘
                       │
              ┌────────▼─────────┐
              │    UI Layer      │
              │   (Svelte 5)     │
              └──────────────────┘
\`\`\`

### 핵심 설계 원칙

1. **의존성 주입**: Service Factory를 통한 느슨한 결합
2. **인터페이스 기반**: Mock과 실제 API 구현 분리
3. **환경 기반 전환**: 설정만으로 Mock ↔ API 모드 전환
4. **확장 가능성**: 새로운 LLM 제공자 추가 용이

## 기술 스택

- **프레임워크**: SvelteKit (Svelte 5)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: shadcn-svelte
- **상태 관리**: Svelte Stores + Runes
- **스토리지**: localStorage (향후 확장 가능)

## 현재 구현된 소설

### 파리대왕 (Lord of the Flies)
- **저자**: 윌리엄 골딩
- **주제 게이지**: 
  - 문명 vs 야만
  - 이성 vs 본능
- **주요 캐릭터**: 랄프, 잭, 피기, 사이먼

## 주요 컴포넌트

- `GameStateManager`: 중앙 상태 관리
- `StoryGenerator`: LLM 기반 스토리 생성
- `CharacterChat`: RAG 기반 캐릭터 대화
- `ImageGenerator`: AI 이미지 생성
- `StoryScene`: 스토리 장면 렌더링
- `GaugeDisplay`: 주제 게이지 시각화
- `CharacterPanel`: 캐릭터 정보 및 상호작용

## 프로젝트 구조

\`\`\`
src/
├── lib/
│   ├── api/                    # API 클라이언트 레이어
│   │   ├── types.ts           # API 인터페이스 정의
│   │   ├── llm-client.ts      # LLM API 클라이언트 (OpenAI, Anthropic)
│   │   └── image-client.ts    # 이미지 생성 API 클라이언트
│   │
│   ├── config/                 # 설정 관리
│   │   └── app-config.ts      # 환경 변수 및 앱 설정
│   │
│   ├── services/               # 비즈니스 로직 서비스
│   │   ├── service-factory.ts # 서비스 팩토리 (의존성 주입)
│   │   ├── story-generator.ts # 스토리 생성 (엔트리 포인트)
│   │   ├── story-generator.mock.ts # Mock 구현
│   │   ├── story-generator.api.ts  # API 구현
│   │   ├── character-chat.ts  # 캐릭터 챗 (엔트리 포인트)
│   │   ├── character-chat.mock.ts  # Mock 구현
│   │   ├── character-chat.api.ts   # API 구현
│   │   ├── image-generator.ts # 이미지 생성 (엔트리 포인트)
│   │   ├── image-generator.mock.ts # Mock 구현
│   │   └── image-generator.api.ts  # API 구현
│   │
│   ├── data/                   # 데이터 레이어
│   │   ├── novel-configs.ts   # 소설 설정
│   │   ├── mock-scenes.ts     # Mock 씬 데이터
│   │   └── mock-knowledge.ts  # Mock 캐릭터 지식베이스
│   │
│   ├── stores/                 # 상태 관리
│   │   └── game-state-manager.svelte.ts
│   │
│   ├── types/                  # TypeScript 타입 정의
│   │   └── game-state.ts
│   │
│   └── components/             # UI 컴포넌트
│       └── ...
│
└── routes/                     # SvelteKit 라우트
    └── +page.svelte
\`\`\`

## Mock 모드 vs Production 모드

### Mock 모드 (기본값)
- 하드코딩된 데이터 사용
- API 키 불필요
- 빠른 개발 및 테스트
- 오프라인 작동

### Production 모드
- 실제 LLM API 호출
- API 키 필요
- 동적 스토리 생성
- 비용 발생

모드 전환은 \`.env\` 파일의 \`PUBLIC_API_MODE\` 변수로 제어합니다.

## 향후 확장

1. **추가 LLM 제공자 지원**
   - Google Gemini
   - Cohere
   - 로컬 LLM (Ollama 등)
   - 스트리밍 응답 지원

2. **더 많은 소설**
   - 셜록 홈즈 시리즈
   - 안나 카레니나
   - 기타 고전 문학

3. **고급 RAG 시스템**
   - Vector DB 통합 (Pinecone, Weaviate)
   - 실시간 임베딩 생성
   - 컨텍스트 기반 검색

4. **멀티플레이어**
   - 공동 스토리 진행
   - 선택의 투표 시스템
   - WebSocket 실시간 동기화

5. **고급 기능**
   - 음성 내레이션 (TTS)
   - 배경 음악 및 효과음
   - 모바일 앱
   - 스토리 분기 시각화

## 개발 시작하기

### 1. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 2. 환경 변수 설정 (선택사항)

프로젝트 루트에 \`.env\` 파일을 생성하고 다음 변수를 설정하세요:

\`\`\`env
# API 모드 설정 (mock 또는 production)
PUBLIC_API_MODE=mock

# OpenAI 설정 (production 모드에서 사용)
PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
PUBLIC_OPENAI_MODEL=gpt-4-turbo-preview

# Anthropic 설정 (선택사항)
PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
PUBLIC_ANTHROPIC_MODEL=claude-3-opus-20240229

# 이미지 생성 설정
PUBLIC_IMAGE_API_PROVIDER=openai
PUBLIC_IMAGE_API_KEY=your_image_api_key_here
PUBLIC_IMAGE_MODEL=dall-e-3
\`\`\`

> **참고**: 환경 변수 없이도 개발 가능합니다. 기본값은 Mock 모드로 설정되어 있습니다.

### 3. 개발 서버 시작

\`\`\`bash
npm run dev
\`\`\`

### 4. 프로덕션 빌드

\`\`\`bash
npm run build
\`\`\`

## 개발자 노트

이 프로젝트는 기획서의 모든 핵심 요구사항을 구현했습니다:
- ✅ 4-Engine Architecture (GSM, Story Generator, Character RAG, UI)
- ✅ 동적 스토리 생성 시스템
- ✅ 캐릭터 기반 RAG
- ✅ 주제 게이지 및 관계도 시스템
- ✅ 멀티모달 렌더링 (이미지)
- ✅ 선택의 즉각적 영향 반영
- ✅ 저장/로드 시스템

## 라이선스

MIT License
