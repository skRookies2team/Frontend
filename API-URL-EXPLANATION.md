# API URL 구성 방식 설명

## 현재 구조

### 1. 도메인 정보는 환경변수에서 가져옴

**환경변수 설정:**
```env
# 개발 환경
PUBLIC_API_BASE_URL=http://localhost:8080
PUBLIC_RELAY_API_URL=http://localhost:8081

# 프로덕션 환경
PUBLIC_API_BASE_URL=https://api.yourdomain.com
PUBLIC_RELAY_API_URL=https://relay.yourdomain.com
```

### 2. 코드에서는 상대 경로만 사용

**예시: `comment-api.ts`**
```typescript
// 상대 경로만 사용 (도메인 없음)
async getComments(postId: number) {
  return httpClient.get(`/api/posts/${postId}/comments`);
  // 실제 요청 URL: http://localhost:8080/api/posts/1/comments
  // 또는 프로덕션: https://api.yourdomain.com/api/posts/1/comments
}
```

## URL 조합 과정

### Step 1: 환경변수 로드
```typescript
// app-config.ts
const baseUrl = env.PUBLIC_API_BASE_URL || 'http://localhost:8080';
// → 'http://localhost:8080' 또는 'https://api.yourdomain.com'
```

### Step 2: HttpClient 생성
```typescript
// http-client.ts
const API_BASE_URL = appConfig.backend.baseUrl; // 환경변수에서 가져온 값
export const httpClient = new HttpClient(API_BASE_URL);
```

### Step 3: URL 조합
```typescript
// http-client.ts의 buildUrl 메서드
private buildUrl(path: string, params?: Record<string, any>): string {
  // new URL(상대경로, baseUrl) → 절대 URL 생성
  const url = new URL(path, this.baseUrl);
  // 예: new URL('/api/posts/1/comments', 'http://localhost:8080')
  // 결과: 'http://localhost:8080/api/posts/1/comments'
  return url.toString();
}
```

## 실제 동작 예시

### 개발 환경
```typescript
// 환경변수
PUBLIC_API_BASE_URL=http://localhost:8080

// 코드
httpClient.get('/api/posts/1/comments')

// 실제 요청 URL
→ http://localhost:8080/api/posts/1/comments
```

### 프로덕션 환경
```typescript
// 환경변수
PUBLIC_API_BASE_URL=https://api.yourdomain.com

// 코드 (동일)
httpClient.get('/api/posts/1/comments')

// 실제 요청 URL
→ https://api.yourdomain.com/api/posts/1/comments
```

## 코드에서 도메인을 직접 붙이지 않는 이유

✅ **장점:**
1. 환경별로 다른 도메인 사용 가능 (개발/스테이징/프로덕션)
2. 코드 수정 없이 환경변수만 변경하면 됨
3. 하드코딩된 URL 제거로 유지보수 용이

❌ **만약 코드에 직접 붙인다면:**
```typescript
// 나쁜 예시
async getComments(postId: number) {
  return fetch('http://localhost:8080/api/posts/1/comments'); // 하드코딩
}
```
- 프로덕션 배포 시 코드 수정 필요
- 환경별로 다른 코드 필요
- 유지보수 어려움

## 현재 구조의 장점

1. **환경변수만 변경하면 됨**
   - 개발: `PUBLIC_API_BASE_URL=http://localhost:8080`
   - 프로덕션: `PUBLIC_API_BASE_URL=https://api.yourdomain.com`
   - 코드는 변경 불필요

2. **자동 URL 조합**
   - `new URL(path, baseUrl)`이 자동으로 조합
   - 상대 경로 + baseUrl = 완전한 URL

3. **타입 안전성**
   - TypeScript로 타입 체크
   - 잘못된 URL 형식 시 경고

## 확인 방법

### 브라우저 콘솔에서 확인
```javascript
// 환경변수 확인
console.log('Base URL:', import.meta.env.PUBLIC_API_BASE_URL);
console.log('Relay URL:', import.meta.env.PUBLIC_RELAY_API_URL);

// 실제 사용되는 URL 확인
import { appConfig } from '$lib/config/app-config';
console.log('Config Base URL:', appConfig.backend.baseUrl);
```

### 네트워크 탭에서 확인
1. 브라우저 개발자 도구 열기 (F12)
2. Network 탭 선택
3. API 요청 클릭
4. Request URL 확인

## 요약

- ✅ **도메인 정보**: 환경변수 (`PUBLIC_API_BASE_URL`, `PUBLIC_RELAY_API_URL`)
- ✅ **API 경로**: 코드에 상대 경로로 작성 (`/api/posts/...`)
- ✅ **URL 조합**: `http-client.ts`의 `buildUrl` 메서드가 자동 조합
- ✅ **결과**: 환경변수에 따라 자동으로 올바른 URL 생성

**코드에 도메인을 직접 붙일 필요 없습니다!** 환경변수만 설정하면 됩니다.

