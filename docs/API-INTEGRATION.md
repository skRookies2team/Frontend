# Backend API Integration Guide

이 문서는 백엔드 API와 프론트엔드를 연결하는 방법을 설명합니다.

## 설정

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 설정하세요:

```env
PUBLIC_API_BASE_URL=http://localhost:8080
PUBLIC_API_MODE=production
```

### 2. API 클라이언트 구조

```   
src/lib/api/
├── index.ts              # 메인 진입점
├── backend-types.ts      # 타입 정의
├── http-client.ts        # HTTP 클라이언트
├── auth-api.ts          # 인증 API
├── user-api.ts          # 사용자 API
├── post-api.ts          # 게시글 API
├── comment-api.ts       # 댓글 API
├── review-api.ts        # 리뷰 API
├── game-api.ts          # 게임 API
└── health-api.ts        # 헬스체크 API
```

## 사용 방법

### Authentication (인증)

```typescript
import { api } from '$lib/api';

// 회원가입
const response = await api.auth.signUp({
  username: 'user123',
  email: 'user@example.com',
  password: 'password123',
  nickname: '사용자'
});

// 로그인
const loginResponse = await api.auth.login({
  username: 'user123',
  password: 'password123'
});

// 로그아웃
await api.auth.logout();

// 토큰 갱신
await api.auth.refreshToken();

// 인증 상태 확인
const isAuthenticated = api.auth.isAuthenticated();
```

### User (사용자)

```typescript
import { api } from '$lib/api';

// 내 프로필 조회
const myProfile = await api.user.getMyProfile();

// 프로필 수정
const updatedProfile = await api.user.updateProfile({
  nickname: '새로운 닉네임',
  bio: '자기소개',
  profileImageUrl: 'https://example.com/image.jpg'
});

// 다른 사용자 프로필 조회
const userProfile = await api.user.getUserProfile('username');

// 게임 플레이 기록
const history = await api.user.getGameHistory();

// 업적 조회
const achievements = await api.user.getAchievements();
```

### Post (게시글)

```typescript
import { api, PostType } from '$lib/api';

// 게시글 목록 조회
const posts = await api.post.getPosts({ page: 0, size: 20 });

// 타입별 게시글 조회
const storyPosts = await api.post.getPostsByType(
  PostType.STORY,
  { page: 0, size: 20 }
);

// 게시글 검색
const searchResults = await api.post.searchPosts(
  '검색어',
  { page: 0, size: 20 }
);

// 게시글 상세 조회
const post = await api.post.getPost(1);

// 게시글 작성
const newPost = await api.post.createPost({
  title: '제목',
  content: '내용',
  type: PostType.GENERAL
});

// 게시글 수정
const updated = await api.post.updatePost(1, {
  title: '수정된 제목',
  content: '수정된 내용',
  type: PostType.GENERAL
});

// 게시글 삭제
await api.post.deletePost(1);

// 좋아요 토글
await api.post.toggleLike(1);

// 북마크 토글
await api.post.toggleBookmark(1);
```

### Comment (댓글)

```typescript
import { api } from '$lib/api';

// 댓글 목록 조회
const comments = await api.comment.getComments(1);

// 댓글 작성
const newComment = await api.comment.createComment(1, {
  content: '댓글 내용'
});

// 대댓글 작성
const reply = await api.comment.createComment(1, {
  content: '대댓글 내용',
  parentId: 2
});

// 댓글 수정
const updated = await api.comment.updateComment(1, 2, '수정된 내용');

// 댓글 삭제
await api.comment.deleteComment(1, 2);

// 댓글 좋아요 토글
await api.comment.toggleLike(1, 2);
```

### Review (리뷰)

```typescript
import { api } from '$lib/api';

// 스토리별 리뷰 목록
const reviews = await api.review.getReviewsByStory(
  1,
  { page: 0, size: 20 }
);

// 스토리 평점 통계
const stats = await api.review.getStoryRatingStats(1);

// 내가 작성한 리뷰 조회
const myReview = await api.review.getMyReviewForStory(1);

// 리뷰 작성
const newReview = await api.review.createReview({
  storyDataId: 1,
  rating: 5,
  content: '리뷰 내용'
});

// 리뷰 수정
const updated = await api.review.updateReview(1, {
  storyDataId: 1,
  rating: 4,
  content: '수정된 리뷰'
});

// 리뷰 삭제
await api.review.deleteReview(1);
```

### Game (게임)

```typescript
import { api } from '$lib/api';

// 모든 스토리 조회
const stories = await api.game.getAllStories();

// 스토리 업로드
const newStory = await api.game.uploadStory(
  '스토리 제목',
  JSON.stringify(storyData),
  '스토리 설명'
);

// AI로 스토리 생성
const generatedStory = await api.game.generateStory({
  title: '스토리 제목',
  description: '설명',
  novelText: '소설 텍스트',
  numEpisodes: 5,
  maxDepth: 3
});

// 게임 시작
const gameState = await api.game.startGame({
  storyDataId: 1
});

// 게임 상태 조회
const state = await api.game.getGameState('session-id');

// 선택지 선택
const newState = await api.game.makeChoice('session-id', 0);

// AI 서버 상태 확인
const aiHealth = await api.game.checkAiHealth();
```

### Health Check

```typescript
import { api } from '$lib/api';

// 전체 헬스체크
const health = await api.health.healthCheck();

// 데이터베이스 상태
const dbHealth = await api.health.databaseStatus();

// AI 서버 상태
const aiHealth = await api.health.aiServerStatus();
```

## 에러 처리

```typescript
import { api, ApiError } from '$lib/api';

try {
  const profile = await api.user.getMyProfile();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error: ${error.status} - ${error.statusText}`);
    console.error('Error data:', error.data);
    
    // 인증 에러 처리
    if (error.status === 401) {
      // 토큰 갱신 시도
      try {
        await api.auth.refreshToken();
        // 재시도
        const profile = await api.user.getMyProfile();
      } catch (refreshError) {
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      }
    }
  } else {
    console.error('Network error:', error);
  }
}
```

## Svelte Component 예시

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { api, type UserProfileDto } from '$lib/api';

  let profile: UserProfileDto | null = $state(null);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    try {
      profile = await api.user.getMyProfile();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load profile';
    } finally {
      loading = false;
    }
  });

  async function updateNickname(nickname: string) {
    try {
      profile = await api.user.updateProfile({ nickname });
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update';
    }
  }
</script>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p>Error: {error}</p>
{:else if profile}
  <div>
    <h1>{profile.nickname}</h1>
    <p>{profile.bio}</p>
    <button onclick={() => updateNickname('New Name')}>
      Update Nickname
    </button>
  </div>
{/if}
```

## 주요 기능

### 자동 인증 처리
- 모든 API 요청에 자동으로 Bearer 토큰 추가
- 토큰은 로그인/회원가입 시 자동 저장
- `requiresAuth: false` 옵션으로 인증 생략 가능

### 타입 안전성
- TypeScript로 모든 요청/응답 타입 정의
- IDE 자동완성 지원

### 페이지네이션 지원
- 게시글, 리뷰 등에서 페이지네이션 사용
- `Pageable` 타입으로 표준화

### 에러 처리
- `ApiError` 클래스로 일관된 에러 처리
- HTTP 상태 코드와 에러 데이터 제공

## 참고사항

- 인증이 필요한 API는 로그인 후 사용해야 합니다
- 토큰은 localStorage에 저장됩니다
- API 기본 URL은 환경 변수로 설정할 수 있습니다






