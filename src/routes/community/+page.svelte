<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { api, PostType, type PostResponseDto } from '$lib/api';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let activeTab = $state<'popular' | 'recent' | 'following'>('popular');
  let posts: PostResponseDto[] = $state([]);
  let loading = $state(true);
  let currentPage = $state(0);
  let totalPages = $state(0);
  let error = $state('');

  onMount(() => {
    loadPosts();
  });

  async function loadPosts() {
    loading = true;
    error = '';
    
    try {
      // Load posts based on active tab
      const response = await api.post.getPosts({
        page: currentPage,
        size: 10,
        sort: activeTab === 'recent' ? ['createdAt,desc'] : ['likeCount,desc']
      });
      
      posts = response.content;
      totalPages = response.totalPages;
    } catch (err) {
      console.error('Failed to load posts:', err);
      error = '게시글을 불러오는데 실패했습니다.';
    } finally {
      loading = false;
    }
  }

  async function handleLike(postId: number) {
    try {
      await api.post.toggleLike(postId);
      // Reload posts to update like count
      await loadPosts();
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  }

  async function handleBookmark(postId: number) {
    try {
      await api.post.toggleBookmark(postId);
      // Reload posts to update bookmark status
      await loadPosts();
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  }

  function goToPost(postId: number) {
    goto(`/community/${postId}`);
  }

  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  }

  // Watch tab changes
  $effect(() => {
    activeTab;
    loadPosts();
  });
</script>

<div class="community-page">
  <div class="community-container">
    <!-- Header -->
    <header class="community-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">커뮤니티</h1>
          <p class="page-description">창작자들과 소통하고 영감을 나누세요</p>
        </div>
        <Button size="lg">
          ✍️ 글쓰기
        </Button>
      </div>
    </header>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        class="tab"
        class:active={activeTab === 'popular'}
        onclick={() => activeTab = 'popular'}
      >
        🔥 인기
      </button>
      <button 
        class="tab"
        class:active={activeTab === 'recent'}
        onclick={() => activeTab = 'recent'}
      >
        🆕 최신
      </button>
      <button 
        class="tab"
        class:active={activeTab === 'following'}
        onclick={() => activeTab = 'following'}
      >
        ⭐ 팔로잉
      </button>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Posts -->
      <div class="posts-section">
        {#if loading}
          <div class="loading-message">로딩중...</div>
        {:else if error}
          <div class="error-message">{error}</div>
        {:else if posts.length === 0}
          <div class="empty-message">게시글이 없습니다.</div>
        {:else}
          {#each posts as post}
            <article class="post-card" onclick={() => goToPost(post.postId)}>
              <div class="post-header">
                <div class="author-info">
                  <div class="author-avatar">👤</div>
                  <div>
                    <div class="author-name">{post.authorNickname}</div>
                    <div class="post-time">{formatTimeAgo(post.createdAt)}</div>
                  </div>
                </div>
                <span class="post-type">{post.type}</span>
              </div>
              
              <h2 class="post-title">{post.title}</h2>
              <p class="post-content">{post.content.substring(0, 200)}{post.content.length > 200 ? '...' : ''}</p>
              
              <div class="post-footer">
                <button 
                  class="action-btn" 
                  class:active={post.isLiked}
                  onclick={(e) => { e.stopPropagation(); handleLike(post.postId); }}
                >
                  {post.isLiked ? '❤️' : '🤍'} {post.likeCount}
                </button>
                <button class="action-btn" onclick={(e) => { e.stopPropagation(); goToPost(post.postId); }}>
                  💬 {post.commentCount}
                </button>
                <button 
                  class="action-btn"
                  class:active={post.isBookmarked}
                  onclick={(e) => { e.stopPropagation(); handleBookmark(post.postId); }}
                >
                  {post.isBookmarked ? '⭐' : '☆'} 북마크
                </button>
                <span class="view-count">👁️ {post.viewCount}</span>
              </div>
            </article>
          {/each}

          {#if totalPages > 1}
            <div class="pagination">
              <Button 
                variant="outline" 
                disabled={currentPage === 0}
                onclick={() => { currentPage--; loadPosts(); }}
              >
                이전
              </Button>
              <span>{currentPage + 1} / {totalPages}</span>
              <Button 
                variant="outline" 
                disabled={currentPage >= totalPages - 1}
                onclick={() => { currentPage++; loadPosts(); }}
              >
                다음
              </Button>
            </div>
          {/if}
        {/if}
      </div>

      <!-- Sidebar -->
      <aside class="sidebar">
        <!-- Popular Tags -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">인기 태그</h3>
          <div class="tags-grid">
            <button class="tag-btn">#판타지</button>
            <button class="tag-btn">#로맨스</button>
            <button class="tag-btn">#추리</button>
            <button class="tag-btn">#SF</button>
            <button class="tag-btn">#팁</button>
            <button class="tag-btn">#질문</button>
            <button class="tag-btn">#AI</button>
            <button class="tag-btn">#완성</button>
          </div>
        </div>

        <!-- Active Users -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">활동중인 작가</h3>
          <div class="users-list">
            {#each ['김작가', '이소설', '박스토리', '최문학', '정이야기'] as user}
              <div class="user-item">
                <div class="user-status"></div>
                <span>{user}</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Community Rules -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">커뮤니티 규칙</h3>
          <ul class="rules-list">
            <li>서로를 존중해주세요</li>
            <li>건설적인 피드백을 나눠요</li>
            <li>스포일러 주의!</li>
            <li>저작권을 지켜요</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</div>

<style>
  .community-page {
    min-height: calc(100vh - 60px);
    background: hsl(var(--background));
  }

  .community-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .community-header {
    margin-bottom: 2rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .page-description {
    font-size: 1.125rem;
    color: hsl(var(--muted-foreground));
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .tab {
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }

  .tab:hover {
    color: hsl(var(--foreground));
  }

  .tab.active {
    color: hsl(var(--primary));
    border-bottom-color: hsl(var(--primary));
  }

  /* Content Grid */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
  }

  .posts-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .post-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    transition: all 0.2s;
    cursor: pointer;
  }

  .post-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .author-info {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .author-avatar {
    font-size: 2rem;
  }

  .author-name {
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .post-time {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .post-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: hsl(var(--foreground));
  }

  .post-content {
    color: hsl(var(--muted-foreground));
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .post-tags {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .tag {
    padding: 0.25rem 0.75rem;
    background: hsl(var(--muted));
    color: hsl(var(--foreground));
    border-radius: var(--radius-full);
    font-size: 0.875rem;
  }

  .post-footer {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid hsl(var(--border));
  }

  .action-btn {
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-btn:hover {
    color: hsl(var(--primary));
  }

  .action-btn.active {
    color: hsl(var(--primary));
  }

  .post-type {
    padding: 0.25rem 0.75rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
  }

  .view-count {
    margin-left: auto;
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
  }

  .loading-message,
  .error-message,
  .empty-message {
    padding: 3rem;
    text-align: center;
    color: hsl(var(--muted-foreground));
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
  }

  .error-message {
    color: hsl(0 84.2% 60.2%);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
  }

  /* Sidebar */
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.5rem;
  }

  .sidebar-title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
  }

  .tags-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .tag-btn {
    padding: 0.5rem;
    background: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tag-btn:hover {
    background: hsl(var(--primary));
    color: white;
    border-color: hsl(var(--primary));
  }

  .users-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .user-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
  }

  .user-status {
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
  }

  .rules-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .rules-list li {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    padding-left: 1.25rem;
    position: relative;
  }

  .rules-list li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: hsl(var(--primary));
  }

  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }

    .sidebar {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
</style>

