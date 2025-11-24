<script lang="ts">
  import { api, type StoryData } from '$lib/api';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';
  
  let stories: StoryData[] = $state([]);
  let loading = $state(true);
  let error = $state('');
  let selectedCategory = $state('전체');
  let searchQuery = $state('');
  
  // 카테고리는 임시로 하드코딩 (백엔드에 카테고리 정보가 없으므로)
  const categories = ['전체', '고전문학', 'SF', '추리', '판타지', '로맨스'];
  
  onMount(async () => {
    try {
      stories = await api.game.getAllStories();
    } catch (err) {
      console.error('Failed to load stories:', err);
      error = '스토리를 불러오는데 실패했습니다.';
    } finally {
      loading = false;
    }
  });
  
  let filteredStories = $derived.by(() => {
    let result = stories;
    
    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(story => 
        story.title.toLowerCase().includes(query) ||
        story.description.toLowerCase().includes(query)
      );
    }
    
    return result;
  });
  
  function startStory(story: StoryData) {
    window.location.href = `/play/${story.id}`;
  }
</script>

<div class="platform">
  <main class="main-content">
    <aside class="sidebar-left">
      <div class="sidebar-section">
        <h3 class="sidebar-title">카테고리</h3>
        <div class="category-pills">
          {#each categories as category}
            <button 
              type="button"
              class="category-pill"
              class:active={selectedCategory === category}
              onclick={() => selectedCategory = category}
              aria-label={category}
            >
              {category}
            </button>
          {/each}
        </div>
      </div>
      
      <div class="sidebar-section">
        <h3 class="sidebar-title">로그인하고</h3>
        <p class="sidebar-text">모든 기능을 자유롭게 이용하세요</p>
        <div class="login-buttons">
          <button type="button" class="social-btn kakao" aria-label="카카오 로그인">
            <span class="social-icon">💬</span>
          </button>
          <button type="button" class="social-btn google" aria-label="구글 로그인">
            <span class="social-icon">G</span>
          </button>
        </div>
      </div>
      
      <div class="sidebar-section">
        <p class="sidebar-text small">다른 방법으로 시작하기</p>
      </div>
    </aside>
    
    <div class="content-area">
      {#if loading}
        <div class="loading-state">
          <p>로딩중...</p>
        </div>
      {:else if error}
        <div class="error-state">
          <p class="error-icon">⚠️</p>
          <h3 class="error-title">{error}</h3>
          <Button onclick={() => window.location.reload()}>다시 시도</Button>
        </div>
      {:else}
        <!-- Story Cards Grid -->
        <div class="cards-grid">
          {#each filteredStories as story}
            <article class="story-card">
              <div class="card-image">
                <img src="/placeholder.svg" alt={story.title} />
                <div class="card-badge">스토리</div>
              </div>
              <div class="card-content">
                <h3 class="card-title">{story.title}</h3>
                <p class="card-description">{story.description || '설명이 없습니다'}</p>
                <div class="card-meta">
                  <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 3h12v10H2z" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M6 7h4M6 10h4" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    {story.totalEpisodes}화
                  </span>
                  <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1l2 4 4.5.5-3.25 3 .75 4.5L8 11l-4 2 .75-4.5L1.5 5.5 6 5z" fill="currentColor"/>
                    </svg>
                    {story.totalNodes}개 노드
                  </span>
                </div>
                <div class="card-date">
                  {new Date(story.createdAt).toLocaleDateString('ko-KR')}
                </div>
                <Button 
                  class="w-full" 
                  variant="outline"
                  onclick={() => startStory(story)}
                  aria-label={`${story.title} 시작하기`}
                >
                  시작하기
                </Button>
              </div>
            </article>
          {/each}
        </div>
        
        {#if filteredStories.length === 0}
          <div class="empty-state">
            <p class="empty-icon">📚</p>
            <h3 class="empty-title">스토리가 없습니다</h3>
            <p class="empty-text">새로운 스토리를 만들어보세요</p>
          </div>
        {/if}
      {/if}
    </div>
  </main>
</div>

<style>
  .platform {
    min-height: calc(100vh - 60px);
  }

  .main-content {
    max-width: 1440px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 3rem;
  }

  .sidebar-left {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .sidebar-section {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.25rem;
  }

  .sidebar-title {
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
  }

  .sidebar-text {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.5;
  }

  .sidebar-text.small {
    font-size: 0.75rem;
    text-align: center;
  }

  .category-pills {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .category-pill {
    padding: 0.625rem 1rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .category-pill:hover {
    background: hsl(var(--muted));
  }

  .category-pill.active {
    background: hsl(var(--primary));
    color: white;
    border-color: hsl(var(--primary));
  }

  .login-buttons {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .social-btn {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    background: hsl(var(--background));
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    transition: all 0.2s;
  }

  .social-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .social-btn.kakao {
    background: #fee500;
  }

  .social-btn.google {
    background: white;
  }

  .content-area {
    min-height: 80vh;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .story-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .story-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-color: hsl(var(--primary));
  }

  .card-image {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.375rem 0.75rem;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: var(--radius-full);
  }

  .card-content {
    padding: 1.25rem;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: hsl(var(--foreground));
  }

  .card-author {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 0.75rem;
  }

  .card-description {
    font-size: 0.875rem;
    line-height: 1.5;
    color: hsl(var(--muted-foreground));
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .meta-item svg {
    color: hsl(var(--primary));
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .empty-text {
    color: hsl(var(--muted-foreground));
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    gap: 1rem;
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .error-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: hsl(0 84.2% 60.2%);
  }

  .card-date {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 0.75rem;
  }

  @media (max-width: 1200px) {
    .main-content {
      grid-template-columns: 1fr;
    }

    .sidebar-left {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .cards-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
