# 환경 변수 설정 가이드

이 문서는 프로젝트에서 사용하는 환경 변수 설정 방법을 안내합니다.

## 설정 방법

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 설정하세요:

```env
# Backend API Configuration
PUBLIC_API_BASE_URL=http://localhost:8080

# API Mode: 'mock' or 'production'
PUBLIC_API_MODE=production

# LLM Configuration (for AI features)
PUBLIC_LLM_PROVIDER=openai
PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
PUBLIC_OPENAI_MODEL=gpt-4-turbo-preview

# Anthropic (alternative LLM provider)
PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
PUBLIC_ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Image Generation Configuration
PUBLIC_IMAGE_API_PROVIDER=openai
PUBLIC_IMAGE_API_KEY=your_image_api_key_here
PUBLIC_IMAGE_MODEL=dall-e-3

# Storage Configuration
PUBLIC_STORAGE_TYPE=localStorage
```

## 환경 변수 설명

### Backend API

- **PUBLIC_API_BASE_URL**: 백엔드 API 서버 주소
  - 개발 환경: `http://localhost:8080`
  - 프로덕션: 실제 서버 주소

- **PUBLIC_API_MODE**: API 작동 모드
  - `mock`: 목업 데이터 사용 (백엔드 없이 개발)
  - `production`: 실제 백엔드 API 사용

### LLM (Language Model)

- **PUBLIC_LLM_PROVIDER**: LLM 제공자
  - `openai`: OpenAI GPT 사용
  - `anthropic`: Anthropic Claude 사용

- **PUBLIC_OPENAI_API_KEY**: OpenAI API 키
  - https://platform.openai.com/api-keys 에서 발급

- **PUBLIC_OPENAI_MODEL**: 사용할 OpenAI 모델
  - 권장: `gpt-4-turbo-preview` 또는 `gpt-4`

- **PUBLIC_ANTHROPIC_API_KEY**: Anthropic API 키 (선택사항)
  - https://console.anthropic.com/ 에서 발급

- **PUBLIC_ANTHROPIC_MODEL**: 사용할 Claude 모델 (선택사항)
  - 권장: `claude-3-sonnet-20240229`

### Image Generation

- **PUBLIC_IMAGE_API_PROVIDER**: 이미지 생성 제공자
  - `openai`: OpenAI DALL-E 사용
  - `stability`: Stability AI 사용
  - `replicate`: Replicate API 사용

- **PUBLIC_IMAGE_API_KEY**: 이미지 생성 API 키

- **PUBLIC_IMAGE_MODEL**: 사용할 이미지 생성 모델
  - OpenAI: `dall-e-3` 권장

### Storage

- **PUBLIC_STORAGE_TYPE**: 데이터 저장 방식
  - `localStorage`: 브라우저 로컬 스토리지
  - `indexedDB`: IndexedDB 사용
  - `api`: 백엔드 API 사용

## 개발 환경별 설정

### 로컬 개발 (백엔드 없음)

백엔드 서버 없이 목업 데이터로 개발하는 경우:

```env
PUBLIC_API_MODE=mock
PUBLIC_STORAGE_TYPE=localStorage
```

### 로컬 개발 (백엔드 연동)

로컬에서 백엔드 서버와 함께 개발하는 경우:

```env
PUBLIC_API_BASE_URL=http://localhost:8080
PUBLIC_API_MODE=production
PUBLIC_STORAGE_TYPE=api
```

### 프로덕션

실제 서버에 배포하는 경우:

```env
PUBLIC_API_BASE_URL=https://api.yourdomain.com
PUBLIC_API_MODE=production
PUBLIC_OPENAI_API_KEY=your_production_key
PUBLIC_STORAGE_TYPE=api
```

## 주의사항

⚠️ **보안 주의사항**

1. `.env` 파일은 절대 Git에 커밋하지 마세요!
2. API 키는 외부에 노출되지 않도록 주의하세요
3. 프로덕션 환경에서는 환경 변수를 서버에서 관리하세요

✅ **.gitignore 확인**

`.gitignore` 파일에 다음이 포함되어 있는지 확인하세요:

```gitignore
.env
.env.local
.env.production
```

## API 키 발급 방법

### OpenAI API Key

1. https://platform.openai.com/ 접속
2. 로그인/회원가입
3. API Keys 메뉴로 이동
4. "Create new secret key" 클릭
5. 생성된 키를 `.env` 파일에 복사

### Anthropic API Key (선택사항)

1. https://console.anthropic.com/ 접속
2. 로그인/회원가입
3. API Keys 섹션으로 이동
4. "Create Key" 클릭
5. 생성된 키를 `.env` 파일에 복사

## 문제 해결

### API가 작동하지 않는 경우

1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수명이 `PUBLIC_`로 시작하는지 확인
3. 개발 서버를 재시작 (`npm run dev`)
4. 백엔드 서버가 실행 중인지 확인

### 브라우저 콘솔 확인

개발자 도구를 열고 콘솔에서 환경 변수 확인:

```javascript
console.log(import.meta.env.PUBLIC_API_BASE_URL);
console.log(import.meta.env.PUBLIC_API_MODE);
```

## 추가 리소스

- [SvelteKit 환경 변수 문서](https://kit.svelte.dev/docs/modules#$env-static-public)
- [Vite 환경 변수 문서](https://vitejs.dev/guide/env-and-mode.html)
- [API 연동 가이드](./docs/API-INTEGRATION.md)
- [API 사용 예시](./docs/API-USAGE-EXAMPLES.md)

