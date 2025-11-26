# API 사용 예시 모음

이 문서는 실제 프로젝트에서 백엔드 API를 사용하는 다양한 예시를 제공합니다.

## 목차
- [인증 (Authentication)](#인증-authentication)
- [사용자 관리 (User)](#사용자-관리-user)
- [게시글 (Post)](#게시글-post)
- [댓글 (Comment)](#댓글-comment)
- [리뷰 (Review)](#리뷰-review)
- [게임 (Game)](#게임-game)

---

## 인증 (Authentication)

### 회원가입 및 로그인

```typescript
// src/routes/login/+page.svelte
import { api, ApiError } from '$lib/api';
import { goto } from '$app/navigation';

let username = $state('');
let email = $state('');
let password = $state('');
let nickname = $state('');
let loading = $state(false);
let errorMessage = $state('');

async function handleSignUp() {
  loading = true;
  errorMessage = '';
  
  try {
    const response = await api.auth.signUp({
      username,
      email,
      password,
      nickname
    });
    
    console.log('회원가입 성공:', response);
    // 토큰은 자동으로 localStorage에 저장됨
    alert('회원가입이 완료되었습니다!');
    goto('/');
  } catch (error) {
    if (error instanceof ApiError) {
      errorMessage = error.data?.message || '회원가입에 실패했습니다.';
    } else {
      errorMessage = '네트워크 오류가 발생했습니다.';
    }
  } finally {
    loading = false;
  }
}

async function handleLogin() {
  loading = true;
  errorMessage = '';
  
  try {
    const response = await api.auth.login({
      username,
      password
    });
    
    console.log('로그인 성공:', response);
    goto('/');
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        errorMessage = '아이디 또는 비밀번호가 올바르지 않습니다.';
      } else {
        errorMessage = '로그인에 실패했습니다.';
      }
    }
  } finally {
    loading = false;
  }
}
```

### 로그아웃

```typescript
async function handleLogout() {
  try {
    await api.auth.logout();
    // localStorage에서 토큰 자동 삭제됨
    goto('/login');
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}
```

### 토큰 갱신

```typescript
import { api, ApiError } from '$lib/api';

async function refreshAccessToken() {
  try {
    const response = await api.auth.refreshToken();
    console.log('토큰 갱신 성공');
    // 새로운 토큰이 자동으로 저장됨
    return true;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    // 로그인 페이지로 리다이렉트
    goto('/login');
    return false;
  }
}
```

### 인증 상태 확인

```typescript
import { api } from '$lib/api';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

onMount(() => {
  if (!api.auth.isAuthenticated()) {
    goto('/login');
  }
});
```

---

## 사용자 관리 (User)

### 프로필 조회 및 표시

```typescript
// src/routes/profile/+page.svelte
import { api, type UserProfileDto } from '$lib/api';
import { onMount } from 'svelte';

let profile: UserProfileDto | null = $state(null);
let loading = $state(true);

onMount(async () => {
  try {
    profile = await api.user.getMyProfile();
  } catch (error) {
    console.error('프로필 로드 실패:', error);
  } finally {
    loading = false;
  }
});
```

```svelte
{#if profile}
  <div class="profile">
    <h1>{profile.nickname}</h1>
    <p>{profile.email}</p>
    <p>{profile.bio}</p>
    
    <div class="stats">
      <div>총 플레이: {profile.totalPlayCount}</div>
      <div>완료: {profile.completedStoryCount}</div>
      <div>엔딩: {profile.unlockedEndingCount}</div>
      <div>업적: {profile.unlockedAchievementCount}</div>
      <div>업적 달성률: {profile.achievementRate.toFixed(1)}%</div>
    </div>
  </div>
{/if}
```

### 프로필 수정

```typescript
let nickname = $state('');
let bio = $state('');
let profileImageUrl = $state('');

async function updateProfile() {
  try {
    const updated = await api.user.updateProfile({
      nickname,
      bio,
      profileImageUrl
    });
    
    console.log('프로필 업데이트 성공:', updated);
    alert('프로필이 수정되었습니다!');
  } catch (error) {
    console.error('프로필 수정 실패:', error);
  }
}
```

### 게임 기록 조회

```typescript
import { api, type GameHistoryDto } from '$lib/api';

let gameHistory: GameHistoryDto[] = $state([]);

onMount(async () => {
  try {
    gameHistory = await api.user.getGameHistory();
  } catch (error) {
    console.error('게임 기록 로드 실패:', error);
  }
});
```

```svelte
{#each gameHistory as game}
  <div class="game-item">
    <h3>{game.storyTitle}</h3>
    <p>세션 ID: {game.sessionId}</p>
    <p>완료 여부: {game.isCompleted ? '완료' : '진행중'}</p>
    {#if game.finalEndingId}
      <p>엔딩: {game.finalEndingId}</p>
    {/if}
    <p>플레이: {new Date(game.updatedAt).toLocaleDateString()}</p>
  </div>
{/each}
```

### 업적 조회

```typescript
import { api, type AchievementDto } from '$lib/api';

let achievements: AchievementDto[] = $state([]);

onMount(async () => {
  try {
    achievements = await api.user.getAchievements();
  } catch (error) {
    console.error('업적 로드 실패:', error);
  }
});
```

```svelte
{#each achievements as achievement}
  <div class="achievement" class:unlocked={achievement.isUnlocked}>
    <div class="icon">{achievement.iconUrl}</div>
    <div>
      <h4>{achievement.name}</h4>
      <p>{achievement.description}</p>
      <div class="progress">
        {achievement.currentValue} / {achievement.targetValue}
      </div>
      {#if achievement.isUnlocked}
        <p>달성일: {new Date(achievement.unlockedAt!).toLocaleDateString()}</p>
      {/if}
    </div>
  </div>
{/each}
```

---

## 게시글 (Post)

### 게시글 목록 조회

```typescript
// src/routes/community/+page.svelte
import { api, type PostResponseDto } from '$lib/api';

let posts: PostResponseDto[] = $state([]);
let currentPage = $state(0);
let totalPages = $state(0);

async function loadPosts() {
  try {
    const response = await api.post.getPosts({
      page: currentPage,
      size: 20,
      sort: ['createdAt,desc']
    });
    
    posts = response.content;
    totalPages = response.totalPages;
  } catch (error) {
    console.error('게시글 로드 실패:', error);
  }
}
```

### 게시글 작성

```typescript
import { api, PostType } from '$lib/api';

let title = $state('');
let content = $state('');
let type = $state(PostType.GENERAL);

async function createPost() {
  try {
    const post = await api.post.createPost({
      title,
      content,
      type
    });
    
    console.log('게시글 작성 완료:', post);
    goto(`/community/${post.postId}`);
  } catch (error) {
    console.error('게시글 작성 실패:', error);
  }
}
```

### 게시글 검색

```typescript
let keyword = $state('');
let searchResults: PostResponseDto[] = $state([]);

async function searchPosts() {
  try {
    const response = await api.post.searchPosts(keyword, {
      page: 0,
      size: 20
    });
    
    searchResults = response.content;
  } catch (error) {
    console.error('검색 실패:', error);
  }
}
```

### 좋아요 & 북마크

```typescript
async function toggleLike(postId: number) {
  try {
    await api.post.toggleLike(postId);
    // 목록 새로고침
    await loadPosts();
  } catch (error) {
    console.error('좋아요 실패:', error);
  }
}

async function toggleBookmark(postId: number) {
  try {
    await api.post.toggleBookmark(postId);
    await loadPosts();
  } catch (error) {
    console.error('북마크 실패:', error);
  }
}
```

---

## 댓글 (Comment)

### 댓글 목록 조회

```typescript
import { api, type CommentResponseDto } from '$lib/api';

let postId = 1;
let comments: CommentResponseDto[] = $state([]);

async function loadComments() {
  try {
    comments = await api.comment.getComments(postId);
  } catch (error) {
    console.error('댓글 로드 실패:', error);
  }
}
```

### 댓글 작성

```typescript
let content = $state('');

async function createComment() {
  try {
    const comment = await api.comment.createComment(postId, {
      content
    });
    
    console.log('댓글 작성 완료:', comment);
    content = '';
    await loadComments();
  } catch (error) {
    console.error('댓글 작성 실패:', error);
  }
}
```

### 대댓글 작성

```typescript
async function createReply(parentId: number, content: string) {
  try {
    const reply = await api.comment.createComment(postId, {
      content,
      parentId
    });
    
    console.log('대댓글 작성 완료:', reply);
    await loadComments();
  } catch (error) {
    console.error('대댓글 작성 실패:', error);
  }
}
```

---

## 리뷰 (Review)

### 리뷰 목록 조회

```typescript
import { api, type ReviewResponseDto } from '$lib/api';

let storyId = 1;
let reviews: ReviewResponseDto[] = $state([]);

async function loadReviews() {
  try {
    const response = await api.review.getReviewsByStory(storyId, {
      page: 0,
      size: 10,
      sort: ['createdAt,desc']
    });
    
    reviews = response.content;
  } catch (error) {
    console.error('리뷰 로드 실패:', error);
  }
}
```

### 리뷰 작성

```typescript
let rating = $state(5);
let reviewContent = $state('');

async function createReview() {
  try {
    const review = await api.review.createReview({
      storyDataId: storyId,
      rating,
      content: reviewContent
    });
    
    console.log('리뷰 작성 완료:', review);
    await loadReviews();
  } catch (error) {
    console.error('리뷰 작성 실패:', error);
  }
}
```

### 평점 통계 조회

```typescript
let stats: any = $state(null);

async function loadRatingStats() {
  try {
    stats = await api.review.getStoryRatingStats(storyId);
    console.log('평점 통계:', stats);
  } catch (error) {
    console.error('통계 로드 실패:', error);
  }
}
```

---

## 게임 (Game)

### 스토리 목록 조회

```typescript
import { api, type StoryData } from '$lib/api';

let stories: StoryData[] = $state([]);

onMount(async () => {
  try {
    stories = await api.game.getAllStories();
  } catch (error) {
    console.error('스토리 목록 로드 실패:', error);
  }
});
```

### 게임 시작

```typescript
import { api, type GameStateResponseDto } from '$lib/api';

let gameState: GameStateResponseDto | null = $state(null);

async function startGame(storyDataId: number) {
  try {
    gameState = await api.game.startGame({ storyDataId });
    console.log('게임 시작:', gameState);
  } catch (error) {
    console.error('게임 시작 실패:', error);
  }
}
```

### 선택지 선택

```typescript
async function makeChoice(sessionId: string, choiceIndex: number) {
  try {
    gameState = await api.game.makeChoice(sessionId, choiceIndex);
    console.log('새로운 게임 상태:', gameState);
    
    // 에피소드 종료 확인
    if (gameState.isEpisodeEnd && gameState.episodeEnding) {
      console.log('에피소드 엔딩:', gameState.episodeEnding);
    }
    
    // 게임 종료 확인
    if (gameState.isGameEnd && gameState.finalEnding) {
      console.log('최종 엔딩:', gameState.finalEnding);
    }
  } catch (error) {
    console.error('선택 실패:', error);
  }
}
```

### 게임 상태 표시

```svelte
{#if gameState}
  <div class="game-view">
    <h2>{gameState.episodeTitle}</h2>
    
    {#if gameState.introText}
      <p class="intro">{gameState.introText}</p>
    {/if}
    
    <p class="node-text">{gameState.nodeText}</p>
    
    <!-- 게이지 표시 -->
    <div class="gauges">
      {#each gameState.gaugeDefinitions as gauge}
        <div class="gauge">
          <div class="gauge-name">{gauge.name}</div>
          <div class="gauge-bar">
            <div 
              class="gauge-fill" 
              style="width: {gameState.gaugeStates[gauge.id] || 0}%"
            ></div>
          </div>
          <div class="gauge-labels">
            <span>{gauge.min_label}</span>
            <span>{gauge.max_label}</span>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- 선택지 -->
    {#if !gameState.isGameEnd}
      <div class="choices">
        {#each gameState.choices as choice, index}
          <button onclick={() => makeChoice(gameState.sessionId, index)}>
            {choice.text}
          </button>
        {/each}
      </div>
    {/if}
    
    <!-- 엔딩 -->
    {#if gameState.isGameEnd && gameState.finalEnding}
      <div class="ending">
        <h3>{gameState.finalEnding.title}</h3>
        <p>{gameState.finalEnding.summary}</p>
      </div>
    {/if}
  </div>
{/if}
```

### AI 스토리 생성

```typescript
let novelText = $state('');
let title = $state('');
let description = $state('');

async function generateStory() {
  try {
    const story = await api.game.generateStory({
      title,
      description,
      novelText,
      numEpisodes: 5,
      maxDepth: 3
    });
    
    console.log('생성된 스토리:', story);
    goto(`/play/${story.id}`);
  } catch (error) {
    console.error('스토리 생성 실패:', error);
  }
}
```

---

## 에러 처리 패턴

### 기본 에러 처리

```typescript
import { api, ApiError } from '$lib/api';

try {
  const result = await api.someMethod();
} catch (error) {
  if (error instanceof ApiError) {
    // API 에러
    console.error(`Status: ${error.status}`);
    console.error(`Message: ${error.statusText}`);
    console.error(`Data:`, error.data);
    
    // 상태 코드별 처리
    switch (error.status) {
      case 401:
        // 인증 오류 - 로그인 필요
        goto('/login');
        break;
      case 403:
        // 권한 없음
        alert('권한이 없습니다.');
        break;
      case 404:
        // 리소스 없음
        alert('요청한 데이터를 찾을 수 없습니다.');
        break;
      case 500:
        // 서버 오류
        alert('서버 오류가 발생했습니다.');
        break;
      default:
        alert('오류가 발생했습니다.');
    }
  } else {
    // 네트워크 오류
    console.error('Network error:', error);
    alert('네트워크 오류가 발생했습니다.');
  }
}
```

### 재시도 로직

```typescript
async function fetchWithRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // 지수 백오프
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
  throw new Error('Max retries reached');
}

// 사용 예시
const profile = await fetchWithRetry(() => api.user.getMyProfile());
```

---

## 참고 사항

1. **인증 토큰**: 로그인/회원가입 시 자동으로 localStorage에 저장됩니다.
2. **자동 인증 헤더**: 모든 API 요청에 자동으로 Bearer 토큰이 추가됩니다.
3. **타입 안전성**: TypeScript를 사용하여 모든 요청/응답이 타입 체크됩니다.
4. **에러 처리**: `ApiError` 클래스를 사용하여 일관된 에러 처리가 가능합니다.




