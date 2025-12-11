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
  let categoryDropdownOpen = $state(false);
  let recommendationDropdownOpen = $state(false);
  let viewMode = $state<'grid' | 'list'>('grid');
  let categoryDropdownRef: HTMLElement | null = $state(null);
  let recommendationDropdownRef: HTMLElement | null = $state(null);

  function handleClickOutside(event: MouseEvent) {
    if (categoryDropdownRef && !categoryDropdownRef.contains(event.target as Node)) {
      categoryDropdownOpen = false;
    }
    if (recommendationDropdownRef && !recommendationDropdownRef.contains(event.target as Node)) {
      recommendationDropdownOpen = false;
    }
  }
  
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

    // 외부 클릭 감지
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
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
    <!-- Netflix Style Header -->
    <div class="netflix-header">
      <div class="header-left">
        <h1 class="page-title">시리즈</h1>
        <div class="header-dropdowns">
          <div class="dropdown-wrapper" bind:this={categoryDropdownRef}>
            <button 
              type="button"
              class="header-dropdown-trigger"
              onclick={(e) => {
                e.stopPropagation();
                categoryDropdownOpen = !categoryDropdownOpen;
              }}
              aria-expanded={categoryDropdownOpen}
            >
              <span>장르</span>
              <svg 
                class="dropdown-icon" 
                class:open={categoryDropdownOpen}
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
              >
                <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            {#if categoryDropdownOpen}
              <div class="header-dropdown-menu" onclick={(e) => e.stopPropagation()}>
                {#each categories as category}
                  <button 
                    type="button"
                    class="header-dropdown-item"
                    class:active={selectedCategory === category}
                    onclick={() => {
                      selectedCategory = category;
                      categoryDropdownOpen = false;
                    }}
                  >
                    {category}
                  </button>
                {/each}
              </div>
            {/if}
          </div>
          
          <div class="dropdown-wrapper" bind:this={recommendationDropdownRef}>
            <button 
              type="button"
              class="header-dropdown-trigger"
              onclick={(e) => {
                e.stopPropagation();
                recommendationDropdownOpen = !recommendationDropdownOpen;
              }}
              aria-expanded={recommendationDropdownOpen}
            >
              <span>추천 콘텐츠</span>
              <svg 
                class="dropdown-icon" 
                class:open={recommendationDropdownOpen}
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
              >
                <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            {#if recommendationDropdownOpen}
              <div class="header-dropdown-menu" onclick={(e) => e.stopPropagation()}>
                <button type="button" class="header-dropdown-item">인기 콘텐츠</button>
                <button type="button" class="header-dropdown-item">최신 등록</button>
                <button type="button" class="header-dropdown-item">추천 콘텐츠</button>
              </div>
            {/if}
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <div class="view-toggle">
          <button 
            type="button"
            class="view-toggle-btn"
            class:active={viewMode === 'list'}
            onclick={() => viewMode = 'list'}
            aria-label="리스트 뷰"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor"/>
              <rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor"/>
              <rect x="2" y="11" width="12" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
          <button 
            type="button"
            class="view-toggle-btn"
            class:active={viewMode === 'grid'}
            onclick={() => viewMode = 'grid'}
            aria-label="그리드 뷰"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
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
        <!-- Netflix Style Content Grid -->
        <div class="netflix-content">
          {#if filteredStories.length > 0}
            <div class="netflix-grid" class:list-view={viewMode === 'list'}>
              {#each filteredStories as story}
                <div class="netflix-card" onclick={() => startStory(story)}>
                  <div class="netflix-card-image">
                    <img src="/placeholder.svg" alt={story.title} />
                    {#if Math.random() > 0.7}
                      <div class="top10-badge">TOP 10</div>
                    {/if}
                  </div>
                  <div class="netflix-card-info">
                    <h3 class="netflix-card-title">{story.title}</h3>
                    <p class="netflix-card-episode">
                      {#if Math.random() > 0.5}
                        새로운 에피소드 지금 시청하기
                      {:else}
                        다음 에피소드 {['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'][Math.floor(Math.random() * 7)]}
                      {/if}
                    </p>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty-state">
              <p class="empty-icon">📚</p>
              <h3 class="empty-title">스토리가 없습니다</h3>
              <p class="empty-text">새로운 스토리를 만들어보세요</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  .platform {
    min-height: calc(100vh - 60px);
    background: hsl(var(--background));
    padding-bottom: 4rem;
  }

  .main-content {
    max-width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  /* Netflix Style Header */
  .netflix-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 4%;
    background: hsl(var(--background));
    border-bottom: 1px solid hsl(var(--border));
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 800;
    color: hsl(var(--foreground));
    margin: 0;
    letter-spacing: -0.02em;
  }

  .header-dropdowns {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .dropdown-wrapper {
    position: relative;
  }

  .header-dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid hsl(var(--border));
    border-radius: 4px;
    color: hsl(var(--foreground));
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .header-dropdown-trigger:hover {
    background: hsl(var(--muted));
    border-color: hsl(var(--primary));
  }

  .dropdown-icon {
    width: 12px;
    height: 12px;
    transition: transform 0.2s ease;
    color: hsl(var(--muted-foreground));
  }

  .dropdown-icon.open {
    transform: rotate(180deg);
  }

  .header-dropdown-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    min-width: 180px;
    background: hsl(var(--background));
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid hsl(var(--border));
    border-radius: 4px;
    box-shadow: 0 8px 24px hsla(0 0% 0% / 0.6);
    z-index: 100;
    overflow: hidden;
    animation: slideDown 0.2s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .header-dropdown-item {
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    font-size: 0.9375rem;
    font-weight: 500;
    color: hsl(var(--foreground));
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    border-bottom: 1px solid hsl(var(--border));
  }

  .header-dropdown-item:last-child {
    border-bottom: none;
  }

  .header-dropdown-item:hover {
    background: hsl(var(--muted));
    color: hsl(var(--primary));
  }

  .header-dropdown-item.active {
    background: hsl(var(--primary) / 0.1);
    color: hsl(var(--primary));
    font-weight: 700;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .view-toggle {
    display: flex;
    gap: 0.5rem;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 4px;
    padding: 0.25rem;
  }

  .view-toggle-btn {
    padding: 0.5rem;
    background: transparent;
    border: none;
    border-radius: 3px;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .view-toggle-btn:hover {
    background: hsl(var(--muted));
    color: hsl(var(--foreground));
  }

  .view-toggle-btn.active {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  .content-area {
    min-height: 80vh;
    padding: 2rem 0;
  }

  .netflix-content {
    padding: 0 4%;
  }

  .netflix-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0;
  }

  .netflix-grid.list-view {
    grid-template-columns: 1fr;
  }

  .netflix-card {
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;
  }

  .netflix-card:hover {
    transform: translateY(-4px);
  }

  .netflix-card-image {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: 4px;
    background: hsl(var(--card));
    margin-bottom: 0.75rem;
  }

  .netflix-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .netflix-card:hover .netflix-card-image img {
    transform: scale(1.05);
  }

  .top10-badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    font-size: 0.75rem;
    font-weight: 800;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    letter-spacing: 0.05em;
    z-index: 2;
  }

  .netflix-card-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .netflix-card-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    line-height: 1.3;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .netflix-card-episode {
    font-size: 0.8125rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.4;
    margin: 0;
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
    .netflix-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.25rem;
    }
  }

  @media (max-width: 768px) {
    .netflix-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem 1rem;
    }

    .header-left {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      width: 100%;
    }

    .page-title {
      font-size: 1.5rem;
    }

    .header-dropdowns {
      width: 100%;
      flex-direction: column;
      gap: 0.75rem;
    }

    .dropdown-wrapper {
      width: 100%;
    }

    .header-dropdown-trigger {
      width: 100%;
    }

    .netflix-content {
      padding: 0 2%;
    }

    .netflix-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }
  }
</style>
