# 배포 가이드

## 배포 전 체크리스트

### 1. 환경변수 설정 확인

프로덕션 배포 시 다음 환경변수가 **반드시** 설정되어 있어야 합니다:

```env
# 필수: 도메인을 포함한 전체 URL (프로토콜 포함)
PUBLIC_API_BASE_URL=https://api.yourdomain.com
PUBLIC_RELAY_API_URL=https://relay.yourdomain.com

# 필수: 프로덕션 모드
PUBLIC_API_MODE=production

# 권장: 이미지 생성은 백엔드를 통해
PUBLIC_IMAGE_API_PROVIDER=backend

# 권장: 스토리지는 API 사용
PUBLIC_STORAGE_TYPE=api
```

### 2. URL 형식 확인

✅ **올바른 형식:**
```
https://api.yourdomain.com
https://relay.yourdomain.com
http://api.yourdomain.com  (개발/테스트용)
```

❌ **잘못된 형식:**
```
api.yourdomain.com          (프로토콜 누락)
localhost:8080              (프로덕션에서 사용 불가)
http://localhost:8080       (프로덕션에서 사용 불가)
```

### 3. 배포 플랫폼별 설정

#### Vercel

1. 프로젝트 설정 → Environment Variables
2. 다음 변수 추가:
   - `PUBLIC_API_BASE_URL`
   - `PUBLIC_RELAY_API_URL`
   - `PUBLIC_API_MODE=production`
   - 기타 필요한 변수

#### Netlify

1. Site settings → Environment variables
2. 위와 동일한 변수 추가

#### AWS Amplify / CloudFront

1. App settings → Environment variables
2. 위와 동일한 변수 추가

#### Docker / Kubernetes

`.env` 파일 또는 ConfigMap/Secret에 환경변수 설정:

```yaml
# docker-compose.yml 예시
environment:
  - PUBLIC_API_BASE_URL=https://api.yourdomain.com
  - PUBLIC_RELAY_API_URL=https://relay.yourdomain.com
  - PUBLIC_API_MODE=production
```

## 배포 후 확인사항

### 1. 브라우저 콘솔 확인

배포 후 브라우저 개발자 도구 콘솔을 열어 다음을 확인:

```javascript
// 환경변수가 올바르게 설정되었는지 확인
console.log('API Base URL:', import.meta.env.PUBLIC_API_BASE_URL);
console.log('Relay URL:', import.meta.env.PUBLIC_RELAY_API_URL);
console.log('API Mode:', import.meta.env.PUBLIC_API_MODE);
```

### 2. 경고 메시지 확인

다음과 같은 경고가 나타나면 환경변수를 확인하세요:

```
⚠️ PUBLIC_API_BASE_URL이 유효한 URL 형식이 아닙니다: ...
⚠️ PUBLIC_RELAY_API_URL이 유효한 URL 형식이 아닙니다: ...
```

### 3. API 연결 테스트

1. 로그인 기능 테스트
2. API 호출이 정상적으로 작동하는지 확인
3. 네트워크 탭에서 API 요청 URL 확인

## 문제 해결

### 문제: API 요청이 실패합니다

**원인:**
- 환경변수가 설정되지 않음
- URL 형식이 잘못됨
- CORS 설정 문제

**해결:**
1. 환경변수가 올바르게 설정되었는지 확인
2. URL이 `https://` 또는 `http://`로 시작하는지 확인
3. 백엔드 서버의 CORS 설정 확인

### 문제: 빌드는 성공하지만 런타임 에러 발생

**원인:**
- 환경변수가 빌드 타임에 포함되지 않음
- 배포 플랫폼에서 환경변수 설정 누락

**해결:**
1. 배포 플랫폼의 환경변수 설정 확인
2. 빌드 로그에서 환경변수 확인
3. 환경변수 이름이 `PUBLIC_`로 시작하는지 확인 (SvelteKit 요구사항)

### 문제: 개발 환경에서는 작동하지만 프로덕션에서 실패

**원인:**
- 프로덕션 환경변수가 설정되지 않음
- 도메인/포트 차이

**해결:**
1. 프로덕션 환경변수 확인
2. `PUBLIC_API_MODE=production` 설정 확인
3. 프로덕션 URL이 올바른지 확인

## 환경변수 검증

코드에서 자동으로 다음을 검증합니다:

1. **프로덕션 모드 + 프로덕션 빌드**: 환경변수 필수
2. **URL 형식 검증**: 유효한 URL 형식인지 확인
3. **콘솔 경고**: 문제가 있으면 브라우저 콘솔에 경고 표시

## 보안 주의사항

1. ⚠️ `.env` 파일을 Git에 커밋하지 마세요
2. ⚠️ API 키는 환경변수로만 관리하세요
3. ⚠️ 프로덕션에서는 HTTPS 사용을 권장합니다
4. ⚠️ 환경변수는 배포 플랫폼의 보안 기능을 사용하세요

## 추가 리소스

- [환경변수 설정 가이드](./ENV.md)
- [API 연동 문서](./docs/API-INTEGRATION.md)
- [SvelteKit 환경변수 문서](https://kit.svelte.dev/docs/modules#$env-static-public)

