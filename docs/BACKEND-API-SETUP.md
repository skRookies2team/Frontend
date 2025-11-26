# 백엔드 API 연동 완료 가이드

## 🎉 완료된 작업

백엔드 API와 프론트엔드가 성공적으로 연결되었습니다!

### 생성된 파일

#### 1. API 클라이언트 (`src/lib/api/`)

- **`backend-types.ts`**: 모든 DTO 타입 정의
  - Request/Response 타입
  - Pagination 타입
  - Enum 정의

- **`http-client.ts`**: HTTP 요청 처리
  - 자동 인증 헤더 추가
  - 에러 처리
  - Query parameter 처리

- **`auth-api.ts`**: 인증 관련 API
  - 회원가입, 로그인, 로그아웃
  - 토큰 갱신
  - 인증 상태 관리

- **`user-api.ts`**: 사용자 관련 API
  - 프로필 조회/수정
  - 게임 기록
  - 업적 조회

- **`post-api.ts`**: 게시글 관련 API
  - CRUD 작업
  - 좋아요/북마크
  - 검색

- **`comment-api.ts`**: 댓글 관련 API
  - CRUD 작업
  - 좋아요

- **`review-api.ts`**: 리뷰 관련 API
  - CRUD 작업
  - 평점 통계

- **`game-api.ts`**: 게임 관련 API
  - 스토리 관리
  - 게임 세션
  - 선택지 처리

- **`health-api.ts`**: 헬스체크 API

- **`index.ts`**: 통합 export 파일

#### 2. 업데이트된 페이지

- **`src/routes/login/+page.svelte`**
  - 실제 회원가입/로그인 API 연동
  - 에러 처리
  - 로딩 상태

- **`src/routes/profile/+page.svelte`**
  - 실제 프로필 데이터 로드
  - 게임 기록 및 업적 표시
  - 로그아웃 기능

- **`src/routes/community/+page.svelte`**
  - 실제 게시글 목록 로드
  - 좋아요/북마크 기능
  - 페이지네이션

#### 3. 문서

- **`docs/API-INTEGRATION.md`**: API 연동 가이드
- **`docs/API-USAGE-EXAMPLES.md`**: 상세 사용 예시
- **`ENV.md`**: 환경 변수 설정 가이드

## 🚀 사용 방법

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
PUBLIC_API_BASE_URL=http://localhost:8080
PUBLIC_API_MODE=production
```

### 2. 기본 사용

```typescript
import { api } from '$lib/api';

// 로그인
await api.auth.login({ username: 'user', password: 'pass' });

// 프로필 조회
const profile = await api.user.getMyProfile();

// 게시글 목록
const posts = await api.post.getPosts({ page: 0, size: 20 });
```

### 3. 에러 처리

```typescript
import { api, ApiError } from '$lib/api';

try {
  const result = await api.user.getMyProfile();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Status: ${error.status}`);
    console.error(`Message:`, error.data);
  }
}
```

## 📋 API 엔드포인트

### Authentication
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `POST /api/auth/refresh` - 토큰 갱신

### User
- `GET /api/users/me` - 내 프로필 조회
- `PUT /api/users/me` - 프로필 수정
- `GET /api/users/{username}` - 사용자 프로필 조회
- `GET /api/users/me/history` - 게임 플레이 기록
- `GET /api/users/me/achievements` - 업적 조회

### Post
- `GET /api/posts` - 게시글 목록
- `GET /api/posts/{postId}` - 게시글 상세
- `POST /api/posts` - 게시글 작성
- `PUT /api/posts/{postId}` - 게시글 수정
- `DELETE /api/posts/{postId}` - 게시글 삭제
- `POST /api/posts/{postId}/like` - 좋아요 토글
- `POST /api/posts/{postId}/bookmark` - 북마크 토글
- `GET /api/posts/search` - 게시글 검색
- `GET /api/posts/type/{type}` - 타입별 게시글

### Comment
- `GET /api/posts/{postId}/comments` - 댓글 목록
- `POST /api/posts/{postId}/comments` - 댓글 작성
- `PUT /api/posts/{postId}/comments/{commentId}` - 댓글 수정
- `DELETE /api/posts/{postId}/comments/{commentId}` - 댓글 삭제
- `POST /api/posts/{postId}/comments/{commentId}/like` - 댓글 좋아요

### Review
- `GET /api/reviews/story/{storyDataId}` - 스토리별 리뷰 목록
- `GET /api/reviews/story/{storyDataId}/stats` - 평점 통계
- `GET /api/reviews/story/{storyDataId}/me` - 내 리뷰 조회
- `POST /api/reviews` - 리뷰 작성
- `PUT /api/reviews/{reviewId}` - 리뷰 수정
- `DELETE /api/reviews/{reviewId}` - 리뷰 삭제

### Game
- `GET /api/game/stories` - 스토리 목록
- `POST /api/game/stories` - 스토리 업로드
- `POST /api/game/stories/generate` - AI 스토리 생성
- `POST /api/game/start` - 게임 시작
- `GET /api/game/{sessionId}` - 게임 상태 조회
- `POST /api/game/{sessionId}/choice` - 선택지 선택

### Health Check
- `GET /api/health` - 전체 헬스체크
- `GET /api/health/database` - 데이터베이스 상태
- `GET /api/health/ai-server` - AI 서버 상태

## ✨ 주요 기능

### 1. 자동 인증 처리
- 로그인 시 토큰 자동 저장
- 모든 요청에 자동으로 Bearer 토큰 추가
- 토큰 갱신 지원

### 2. 타입 안전성
- TypeScript 완전 지원
- 모든 요청/응답 타입 정의
- IDE 자동완성

### 3. 에러 처리
- 일관된 에러 처리 (`ApiError` 클래스)
- HTTP 상태 코드별 처리
- 네트워크 에러 처리

### 4. 페이지네이션
- 표준화된 `Pageable` 인터페이스
- 정렬 지원

## 🔧 개발 팁

### 인증이 필요 없는 요청

```typescript
// requiresAuth: false 옵션 사용
await httpClient.get('/api/health', { requiresAuth: false });
```

### 파일 업로드

```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### 커스텀 헤더

```typescript
await httpClient.get('/api/data', {
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

## 🐛 문제 해결

### CORS 에러
백엔드 서버에서 CORS 설정 확인:
```java
@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### 401 Unauthorized
1. 토큰이 유효한지 확인
2. 토큰 만료 시 갱신 시도
3. 실패 시 재로그인

### Network Error
1. 백엔드 서버 실행 확인
2. API URL 확인
3. 방화벽/네트워크 설정 확인

## 📚 추가 리소스

- [API 연동 가이드](./API-INTEGRATION.md)
- [API 사용 예시](./API-USAGE-EXAMPLES.md)
- [환경 변수 설정](../ENV.md)
- [프로젝트 아키텍처](./ARCHITECTURE.md)

## 🎯 다음 단계

1. **게임 페이지 연동**: 실제 게임 플레이 API 연결
2. **크리에이터 페이지**: 스토리 생성/편집 기능
3. **실시간 기능**: WebSocket 연동
4. **파일 업로드**: 프로필 이미지, 스토리 이미지
5. **검색 개선**: 고급 검색 필터
6. **알림 시스템**: 실시간 알림 구현

## ✅ 테스트

백엔드 서버를 실행하고 다음을 확인하세요:

```bash
# 백엔드 서버 실행 (8080 포트)
# ... 백엔드 실행 명령어 ...

# 프론트엔드 실행
npm run dev

# 브라우저에서 테스트
# 1. http://localhost:5173/login - 로그인/회원가입
# 2. http://localhost:5173/profile - 프로필 페이지
# 3. http://localhost:5173/community - 커뮤니티
```

## 📞 지원

문제가 발생하면:
1. 콘솔 에러 확인
2. 네트워크 탭 확인
3. 백엔드 로그 확인
4. 문서 참조

---

**작성일**: 2025-11-24
**버전**: 1.0
**상태**: ✅ 완료




