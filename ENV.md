# 환경 변수 설정 가이드

이 문서는 프로젝트에서 사용하는 환경 변수 설정 방법을 안내합니다.

## 설정 방법

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 설정하세요:

```env
# Backend API Configuration
# 메인 백엔드 (인증, 스토리 관리, 커뮤니티 등) - 포트 8080
PUBLIC_API_BASE_URL=http://localhost:8080
# 릴레이 서버 (AI 분석, 생성, 이미지, 채팅) - 포트 8081
PUBLIC_RELAY_API_URL=http://localhost:8081

# API Mode: 'mock' or 'production'
PUBLIC_API_MODE=production

# LLM Configuration (for AI features - mock mode에서만 사용)
PUBLIC_LLM_PROVIDER=openai
PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
PUBLIC_OPENAI_MODEL=gpt-4-turbo-preview

# Anthropic (alternative LLM provider)
PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
PUBLIC_ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Image Generation Configuration
# 'backend'로 설정하면 Relay 서버를 통해 이미지 생성
# 'openai', 'stability', 'replicate'로 설정하면 직접 API 호출
PUBLIC_IMAGE_API_PROVIDER=backend
PUBLIC_IMAGE_API_KEY=your_image_api_key_here
PUBLIC_IMAGE_MODEL=dall-e-3

# Storage Configuration
PUBLIC_STORAGE_TYPE=localStorage
```

## 환경 변수 설명

### Backend API

- **PUBLIC_API_BASE_URL**: 메인 백엔드 API 서버 주소 (포트 8080)
  - 담당 기능: 인증, 스토리 관리, 커뮤니티, 게임플레이 등
  - 개발 환경: `http://localhost:8080`
  - 프로덕션: 실제 서버 주소

- **PUBLIC_RELAY_API_URL**: 릴레이 서버 주소 (포트 8081)
  - 담당 기능: AI 분석, 스토리 생성, 이미지 생성, 캐릭터 채팅 (RAG)
  - 개발 환경: `http://localhost:8081`
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
  - `backend`: 릴레이 서버를 통해 이미지 생성 (권장)
  - `openai`: OpenAI DALL-E 직접 호출
  - `stability`: Stability AI 직접 호출
  - `replicate`: Replicate API 직접 호출

- **PUBLIC_IMAGE_API_KEY**: 이미지 생성 API 키 (backend 모드에서는 불필요)

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
PUBLIC_RELAY_API_URL=http://localhost:8081
PUBLIC_API_MODE=production
PUBLIC_IMAGE_API_PROVIDER=backend
PUBLIC_STORAGE_TYPE=api
```

### 프로덕션

실제 서버에 배포하는 경우:

```env
# ⚠️ 중요: 프로덕션에서는 도메인을 포함한 전체 URL이 필수입니다!
# http:// 또는 https:// 프로토콜 포함 필수
PUBLIC_API_BASE_URL=https://api.yourdomain.com
PUBLIC_RELAY_API_URL=https://relay.yourdomain.com
# 또는 같은 도메인 사용 시:
# PUBLIC_API_BASE_URL=https://api.yourdomain.com
# PUBLIC_RELAY_API_URL=https://api.yourdomain.com

PUBLIC_API_MODE=production
PUBLIC_IMAGE_API_PROVIDER=backend
PUBLIC_STORAGE_TYPE=api
```

**프로덕션 배포 시 주의사항:**

1. **도메인 포함 필수**: `localhost`가 아닌 실제 도메인을 사용해야 합니다
   - ✅ 올바른 예: `https://api.yourdomain.com`
   - ❌ 잘못된 예: `api.yourdomain.com` (프로토콜 누락)
   - ❌ 잘못된 예: `localhost:8080` (프로덕션에서 사용 불가)

2. **HTTPS 사용 권장**: 프로덕션에서는 보안을 위해 HTTPS를 사용하세요

3. **환경변수 설정 확인**: 배포 플랫폼(Vercel, Netlify, AWS 등)에서 환경변수를 올바르게 설정했는지 확인하세요

4. **빌드 시점 검증**: 프로덕션 빌드 시 `localhost`를 사용하면 빌드가 실패합니다
   - 환경 변수가 올바르게 설정되지 않으면 빌드 오류가 발생하여 배포 전에 문제를 발견할 수 있습니다

## 주의사항

⚠️ **보안 주의사항**

1. `.env` 파일은 절대 Git에 커밋하지 마세요!
2. API 키는 외부에 노출되지 않도록 주의하세요
3. 프로덕션 환경에서는 환경 변수를 서버에서 관리하세요

⚠️ **프로덕션 배포 주의사항**

1. **도메인 URL 필수**: 프로덕션 환경에서는 `PUBLIC_API_BASE_URL`과 `PUBLIC_RELAY_API_URL`에 
   도메인을 포함한 전체 URL을 반드시 설정해야 합니다
   - 예: `https://api.yourdomain.com` (프로토콜 포함 필수)
   - `localhost`는 개발 환경에서만 사용 가능

2. **환경변수 검증**: 환경변수가 올바르게 설정되지 않으면 콘솔에 경고가 표시됩니다
   - 배포 후 브라우저 콘솔을 확인하여 URL이 올바르게 설정되었는지 확인하세요

3. **CORS 설정**: 백엔드 서버에서 프론트엔드 도메인에 대한 CORS를 허용해야 합니다

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
console.log(import.meta.env.PUBLIC_API_BASE_URL);    // 메인 백엔드 URL
console.log(import.meta.env.PUBLIC_RELAY_API_URL);   // 릴레이 서버 URL
console.log(import.meta.env.PUBLIC_API_MODE);         // 'mock' 또는 'production'
console.log(import.meta.env.PUBLIC_IMAGE_API_PROVIDER); // 'backend', 'openai' 등
```

## 배포 플랫폼별 환경 변수 설정

### GitHub Actions (AWS S3 + CloudFront)

`.github/workflows/deploy.yml`에서 빌드 단계에 환경 변수를 설정합니다:

```yaml
- name: Build project
  env:
    PUBLIC_API_BASE_URL: ${{ secrets.PUBLIC_API_BASE_URL }}
    PUBLIC_RELAY_API_URL: ${{ secrets.PUBLIC_RELAY_API_URL }}
    PUBLIC_API_MODE: ${{ secrets.PUBLIC_API_MODE }}
  run: npm run build
```

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 Secrets를 설정하세요:
- `PUBLIC_API_BASE_URL`: `https://api.yourdomain.com`
- `PUBLIC_RELAY_API_URL`: `https://relay.yourdomain.com`
- `PUBLIC_API_MODE`: `production`

### Vercel

1. Vercel 대시보드 > 프로젝트 > Settings > Environment Variables로 이동
2. 다음 환경 변수를 추가:
   - `PUBLIC_API_BASE_URL`: `https://api.yourdomain.com`
   - `PUBLIC_RELAY_API_URL`: `https://relay.yourdomain.com`
   - `PUBLIC_API_MODE`: `production`
3. Environment를 `Production`, `Preview`, `Development`로 설정 (필요한 경우)
4. 변경사항 저장 후 재배포

### Netlify

1. Netlify 대시보드 > Site settings > Environment variables로 이동
2. 다음 환경 변수를 추가:
   - `PUBLIC_API_BASE_URL`: `https://api.yourdomain.com`
   - `PUBLIC_RELAY_API_URL`: `https://relay.yourdomain.com`
   - `PUBLIC_API_MODE`: `production`
3. 변경사항 저장 후 재배포

### AWS Amplify

1. Amplify Console > App settings > Environment variables로 이동
2. 다음 환경 변수를 추가:
   - `PUBLIC_API_BASE_URL`: `https://api.yourdomain.com`
   - `PUBLIC_RELAY_API_URL`: `https://relay.yourdomain.com`
   - `PUBLIC_API_MODE`: `production`
3. 변경사항 저장 후 재배포

### 환경 변수 확인 방법

배포 후 브라우저 개발자 도구 콘솔에서 다음을 실행하여 설정을 확인할 수 있습니다:

```javascript
// 브라우저 콘솔에서 실행
console.log('API Base URL:', import.meta.env.PUBLIC_API_BASE_URL);
console.log('Relay API URL:', import.meta.env.PUBLIC_RELAY_API_URL);
console.log('API Mode:', import.meta.env.PUBLIC_API_MODE);
```

⚠️ **주의**: `localhost`가 표시되면 환경 변수가 올바르게 설정되지 않은 것입니다.

## 추가 리소스

- [SvelteKit 환경 변수 문서](https://kit.svelte.dev/docs/modules#$env-static-public)
- [Vite 환경 변수 문서](https://vitejs.dev/guide/env-and-mode.html)
- [API 연동 가이드](./docs/API-INTEGRATION.md)
- [API 사용 예시](./docs/API-USAGE-EXAMPLES.md)






