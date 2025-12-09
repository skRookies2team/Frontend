# 리팩토링 계획서

## 현재 문제점

### 1. API 레이어 구조 혼란
- `lib/api/ai-api.ts`: Backend-Relay 서버 API (포트 8081) - 실제 프로덕션용
- `lib/api/llm-client.ts`: 직접 LLM API 클라이언트 (OpenAI, Anthropic) - 폴백/개발용
- `lib/api/image-client.ts`: 직접 이미지 API 클라이언트 - 폴백/개발용
- 서비스 레이어에서 두 가지 방식을 혼용하여 사용

### 2. 타입 정의 분산
- `lib/api/types.ts`: 서비스 인터페이스
- `lib/api/backend-types.ts`: 백엔드 API 타입
- `lib/api/ai-api.ts`: AI API 타입
- 타입이 여러 파일에 분산되어 있음

### 3. 중복 디렉토리
- `Frontend/` 디렉토리와 root `src/` 디렉토리 중복
- 실제 사용되는 것은 root `src/` 디렉토리

### 4. 네이밍 불일치
- `story-api.ts` vs `story-generator.api.ts`
- API 클라이언트와 서비스 구현체의 역할 구분이 불명확

## 리팩토링 목표

1. **API 레이어 명확화**
   - Backend API와 External API 클라이언트 분리
   - 역할과 책임 명확화

2. **타입 정의 통합**
   - 관련 타입들을 논리적으로 그룹화
   - 중복 제거

3. **디렉토리 구조 개선**
   - 불필요한 중복 제거
   - 명확한 계층 구조

4. **네이밍 일관성**
   - 일관된 네이밍 컨벤션 적용
   - 파일명과 클래스명 통일

## 리팩토링 계획

### Phase 1: API 레이어 구조 정리

#### 1.1 디렉토리 구조 재구성
```
lib/api/
├── backend/          # 백엔드 API 클라이언트 (포트 8080, 8081)
│   ├── auth-api.ts
│   ├── user-api.ts
│   ├── story-api.ts
│   ├── ai-api.ts     # Backend-Relay 서버 (포트 8081)
│   └── ...
├── external/         # 외부 API 직접 클라이언트 (폴백용)
│   ├── llm-client.ts
│   └── image-client.ts
├── types/            # 타입 정의
│   ├── backend-types.ts
│   ├── ai-types.ts
│   └── service-types.ts
├── http-client.ts   # 공통 HTTP 클라이언트
└── index.ts         # 통합 export
```

#### 1.2 역할 명확화
- **Backend API**: 실제 백엔드 서버와 통신 (프로덕션)
- **External API**: 외부 서비스 직접 호출 (개발/폴백)
- **Services**: 비즈니스 로직 레이어

### Phase 2: 타입 정의 통합

#### 2.1 타입 파일 재구성
- `types/backend-types.ts`: 백엔드 API 요청/응답 타입
- `types/ai-types.ts`: AI 관련 타입 (ai-api에서 분리)
- `types/service-types.ts`: 서비스 인터페이스 (types.ts에서 이동)

### Phase 3: 서비스 레이어 정리

#### 3.1 서비스 구조 명확화
- 서비스는 Backend API를 우선 사용
- External API는 폴백으로만 사용
- Mock 구현은 별도 유지

### Phase 4: 중복 제거 및 정리

#### 4.1 Frontend 디렉토리 처리
- 사용되지 않는 `Frontend/` 디렉토리 제거 또는 문서화

#### 4.2 불필요한 파일 정리
- 사용되지 않는 import 제거
- 중복 코드 제거

## 실행 순서

1. ✅ 프로젝트 구조 분석 완료
2. ✅ 타입 정의 통합 완료
3. ✅ API 레이어 구조 명확화 완료
4. ✅ 서비스 레이어 import 경로 업데이트 완료
5. 🔄 중복 제거 및 최종 정리 진행 중

## 완료된 작업

### Phase 2: 타입 정의 통합 ✅

#### 완료 사항:
- `lib/api/types/` 디렉토리 생성
- `backend-types.ts` 이동 및 정리
- `ai-types.ts` 생성 (ai-api.ts에서 타입 분리)
- `external-api-types.ts` 생성 (외부 API 타입)
- `service-types.ts` 생성 (서비스 인터페이스)
- `types/index.ts` 생성 (통합 export)
- 모든 API 파일의 import 경로 업데이트
- 레거시 `types.ts` 파일을 하위 호환성을 위해 유지

### Phase 3: API 레이어 명확화 ✅

#### 완료 사항:
- API 레이어 구조 문서화 (`lib/api/README.md`)
- `llm-client.ts`와 `image-client.ts`에 역할 명시 주석 추가
- 타입 네이밍 충돌 해결 (BackendImageGenerationRequest vs ExternalImageGenerationRequest)
- 모든 서비스 파일의 import 경로 업데이트

## 남은 작업

### Phase 4: 중복 제거 및 정리
- [ ] Frontend 디렉토리 처리 (사용 여부 확인 후 제거 또는 문서화)
- [ ] 불필요한 import 제거
- [ ] 코드 정리 및 최종 검토

