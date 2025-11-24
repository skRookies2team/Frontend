# API 설정 가이드

이 문서는 Mock 모드에서 실제 API 모드로 전환하는 방법을 설명합니다.

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하세요:

```env
# API 모드 설정
PUBLIC_API_MODE=production

# LLM 제공자 선택 (openai 또는 anthropic)
PUBLIC_LLM_PROVIDER=openai

# OpenAI 설정
PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here
PUBLIC_OPENAI_MODEL=gpt-4-turbo-preview

# Anthropic 설정 (선택사항)
PUBLIC_ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
PUBLIC_ANTHROPIC_MODEL=claude-3-opus-20240229

# 이미지 생성 설정
PUBLIC_IMAGE_API_PROVIDER=openai
PUBLIC_IMAGE_API_KEY=sk-your-openai-api-key-here
PUBLIC_IMAGE_MODEL=dall-e-3
```

## API 키 발급

### OpenAI

1. [OpenAI Platform](https://platform.openai.com/)에 가입
2. API Keys 메뉴에서 새 키 생성
3. `.env` 파일의 `PUBLIC_OPENAI_API_KEY`에 설정

### Anthropic

1. [Anthropic Console](https://console.anthropic.com/)에 가입
2. API Keys에서 새 키 생성
3. `.env` 파일의 `PUBLIC_ANTHROPIC_API_KEY`에 설정

## 비용 관리

### OpenAI 예상 비용
- **GPT-4 Turbo**: $10 / 1M input tokens, $30 / 1M output tokens
- **DALL-E 3**: $0.040 - $0.080 per image

### 비용 절감 팁
1. 개발 중에는 Mock 모드 사용
2. API 호출 전 캐싱 구현
3. 토큰 수 제한 설정
4. 테스트용 소규모 모델 사용 (gpt-3.5-turbo)

## 모드 전환

### Mock 모드 (기본값)
```env
PUBLIC_API_MODE=mock
```

- API 키 불필요
- 하드코딩된 응답 사용
- 빠른 개발 및 테스트
- 무료

### Production 모드
```env
PUBLIC_API_MODE=production
```

- API 키 필요
- 실제 LLM 호출
- 동적 콘텐츠 생성
- 비용 발생

## 문제 해결

### API 키가 인식되지 않음
- `.env` 파일이 프로젝트 루트에 있는지 확인
- 개발 서버 재시작 (`npm run dev`)
- 환경 변수명이 `PUBLIC_` 접두사로 시작하는지 확인

### API 호출 실패
- API 키가 유효한지 확인
- 계정에 크레딧이 있는지 확인
- 네트워크 연결 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 이미지 생성 실패
- 이미지 API 키가 설정되었는지 확인
- 프롬프트가 정책 위반이 아닌지 확인
- 실패 시 자동으로 플레이스홀더 사용

## 지원되는 LLM 제공자

### 현재 지원
- ✅ OpenAI (GPT-4, GPT-3.5)
- ✅ Anthropic (Claude 3)

### 향후 지원 예정
- ⏳ Google Gemini
- ⏳ Cohere
- ⏳ 로컬 LLM (Ollama)

## 커스텀 설정

### 새로운 LLM 제공자 추가

1. `src/lib/api/llm-client.ts`에 클라이언트 클래스 추가
2. `createLLMClient` 팩토리에 케이스 추가
3. `src/lib/config/app-config.ts`에 설정 추가

예시:
```typescript
export class CustomLLMClient implements LLMClient {
  async chat(request: LLMRequest): Promise<LLMResponse> {
    // 구현
  }
}
```

### 새로운 이미지 제공자 추가

1. `src/lib/api/image-client.ts`에 클라이언트 클래스 추가
2. `createImageClient` 팩토리에 케이스 추가

## 보안 주의사항

⚠️ **중요**: 
- `.env` 파일을 Git에 커밋하지 마세요
- API 키를 공개 저장소에 노출하지 마세요
- 프로덕션에서는 서버 사이드에서 API 호출
- API 키는 환경 변수로 관리

## 참고 자료

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [SvelteKit Environment Variables](https://kit.svelte.dev/docs/modules#$env-dynamic-public)

