<script lang="ts">
  import { api, type StoryData } from '$lib/api';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';
  
  let stories: StoryData[] = $state([]);
  let loading = $state(true);
  let error = $state('');
  let selectedCategory = $state('전체');
  let searchQuery = $state('');
  let isLoggedIn = $state(false);
  
  // 카테고리는 임시로 하드코딩 (백엔드에 카테고리 정보가 없으므로)
  const categories = ['전체', '고전문학', 'SF', '추리', '판타지', '로맨스', '교육'];
  
  onMount(async () => {
    try {
      stories = await api.game.getAllStories();
      // 로그인 상태 확인
      isLoggedIn = api.auth.isAuthenticated();
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
              <span>{category}</span>
            </button>
          {/each}
        </div>
      </div>
      
      {#if !isLoggedIn}
        <div class="sidebar-section">
          <h3 class="sidebar-title">로그인하고</h3>
          <p class="sidebar-text">모든 기능을 자유롭게 이용하세요</p>
          <div class="login-buttons">
            <button type="button" class="social-btn kakao" aria-label="카카오 로그인" onclick={() => window.location.href = '/login'}>
              <span class="social-icon">💬</span>
            </button>
            <button type="button" class="social-btn google" aria-label="구글 로그인" onclick={() => window.location.href = '/login'}>
              <span class="social-icon">G</span>
            </button>
          </div>
        </div>
        
        <div class="sidebar-section">
          <p class="sidebar-text small">다른 방법으로 시작하기</p>
        </div>
      {:else}
        <div class="sidebar-section">
          <h3 class="sidebar-title">🏆 랭킹</h3>
          <p class="sidebar-text">인기 있는 스토리를 확인하세요</p>
        </div>
      {/if}
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
    position: relative;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--glow-card);
    transition: all 0.3s ease;
  }
  
  .sidebar-section::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, hsla(250 100% 70% / 0.05), transparent);
    pointer-events: none;
  }
  
  .sidebar-section:hover {
    border-color: hsl(var(--border-bright));
    transform: translateX(-2px);
  }

  .sidebar-title {
    font-size: 0.95rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
    letter-spacing: 0.02em;
    text-transform: uppercase;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
    padding: 0.75rem 1.25rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: left;
    position: relative;
    overflow: hidden;
  }
  
  .category-pill::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-primary);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .category-pill span {
    position: relative;
    z-index: 1;
  }

  .category-pill:hover {
    background: hsl(var(--muted));
    transform: translateX(4px);
    border-color: hsl(var(--border-bright));
  }

  .category-pill.active {
    background: var(--gradient-primary);
    color: white;
    border-color: hsl(var(--primary));
    box-shadow: 
      0 4px 12px hsla(250 100% 70% / 0.3),
      inset 0 1px 0 hsla(255 255 255 / 0.2);
  }
  
  .category-pill.active::before {
    opacity: 1;
  }

  .login-buttons {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .social-btn {
    flex: 1;
    padding: 0.875rem;
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    background: hsl(var(--background));
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .social-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, hsla(255 255 255 / 0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .social-btn:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.2),
      0 0 0 1px hsla(255 255 255 / 0.1);
  }
  
  .social-btn:hover::before {
    opacity: 1;
  }

  .social-btn.kakao {
    background: linear-gradient(135deg, #fee500, #fdd500);
    border-color: #fdd500;
  }
  
  .social-btn.kakao:hover {
    box-shadow: 
      0 8px 24px rgba(254, 229, 0, 0.3),
      0 0 0 1px #fee500;
  }

  .social-btn.google {
    background: linear-gradient(135deg, #ffffff, #f5f5f5);
    border-color: #e0e0e0;
  }
  
  .social-btn.google:hover {
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(0, 0, 0, 0.1);
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
    position: relative;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    animation: fadeIn 0.6s ease-out backwards;
  }
  
  .story-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    padding: 1px;
    background: var(--gradient-border);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .story-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px hsla(250 100% 70% / 0.2),
      inset 0 1px 0 hsla(255 255 255 / 0.1);
  }
  
  .story-card:hover::before {
    opacity: 1;
  }
  
  .story-card:nth-child(2) { animation-delay: 0.1s; }
  .story-card:nth-child(3) { animation-delay: 0.2s; }
  .story-card:nth-child(4) { animation-delay: 0.3s; }
  .story-card:nth-child(5) { animation-delay: 0.4s; }
  .story-card:nth-child(6) { animation-delay: 0.5s; }

  .card-image {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: linear-gradient(135deg, hsl(240 12% 15%), hsl(240 12% 10%));
  }
  
  .card-image::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      transparent 50%,
      hsla(240 15% 6% / 0.8) 100%
    );
    pointer-events: none;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .story-card:hover .card-image img {
    transform: scale(1.1);
  }

  .card-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.375rem 0.875rem;
    background: linear-gradient(135deg, hsla(250 100% 70% / 0.9), hsla(280 100% 65% / 0.9));
    backdrop-filter: blur(12px);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: var(--radius-full);
    box-shadow: 0 4px 12px hsla(250 100% 70% / 0.3);
    border: 1px solid hsla(255 255 255 / 0.2);
    z-index: 1;
  }

  .card-content {
    padding: 1.5rem;
    position: relative;
    background: linear-gradient(
      180deg,
      hsla(240 12% 12% / 0.5) 0%,
      hsla(240 12% 10% / 0.8) 100%
    );
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 85%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
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
    font-weight: 600;
  }

  .meta-item svg {
    color: hsl(var(--accent));
    filter: drop-shadow(0 0 4px hsla(45 100% 65% / 0.3));
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    padding: 3rem;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    box-shadow: var(--glow-card);
  }

  .empty-icon {
    font-size: 5rem;
    margin-bottom: 1.5rem;
    filter: grayscale(0.3);
    animation: float 3s ease-in-out infinite;
  }

  .empty-title {
    font-size: 1.75rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 70%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .empty-text {
    color: hsl(var(--muted-foreground));
    font-size: 1.125rem;
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    gap: 1.5rem;
    padding: 3rem;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    box-shadow: var(--glow-card);
  }

  .error-icon {
    font-size: 5rem;
    margin-bottom: 1rem;
    animation: float 3s ease-in-out infinite;
  }

  .error-title {
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, hsl(0 85% 60%), hsl(0 85% 50%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
