<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { storyApi } from '$lib/api/story-api';
  import type { StorySearchResultDto, StorySortBy, PageStorySearchResultDto } from '$lib/api/types/backend-types';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';

  let searchResult: PageStorySearchResultDto | null = $state(null);
  let loading = $state(true);
  let error = $state('');

  // URL 파라미터에서 검색 조건 읽기
  let keyword = $derived($page.url.searchParams.get('keyword') || '');
  let currentPage = $derived(parseInt($page.url.searchParams.get('page') || '0'));
  let pageSize = $derived(parseInt($page.url.searchParams.get('size') || '12'));
  let sortBy = $derived(($page.url.searchParams.get('sortBy') as StorySortBy) || 'latest');

  // 정렬 옵션
  const sortOptions: { value: StorySortBy; label: string }[] = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'likes', label: '좋아요순' },
  ];

  async function performSearch() {
    loading = true;
    error = '';

    try {
      searchResult = await storyApi.searchStories({
        keyword: keyword || undefined,
        page: currentPage,
        size: pageSize,
        sortBy: sortBy,
      });
    } catch (err) {
      console.error('검색 실패:', err);
      error = '검색 중 오류가 발생했습니다.';
      searchResult = null;
    } finally {
      loading = false;
    }
  }

  // URL 변경 시 검색 수행
  $effect(() => {
    // 의존성: keyword, currentPage, pageSize, sortBy
    const _ = keyword + currentPage + pageSize + sortBy;
    performSearch();
  });

  function updateSearchParams(params: Record<string, string | number>) {
    const url = new URL($page.url);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString());
    });
    goto(url.toString(), { replaceState: false });
  }

  function handleSortChange(newSortBy: StorySortBy) {
    updateSearchParams({ sortBy: newSortBy, page: '0' });
  }

  function handlePageChange(newPage: number) {
    updateSearchParams({ page: newPage.toString() });
  }

  function startStory(story: StorySearchResultDto) {
    window.location.href = `/play/${story.id}`;
  }
</script>

<svelte:head>
  <title>{keyword ? `"${keyword}" 검색 결과` : '스토리 검색'} - IF Story</title>
</svelte:head>

<div class="search-page">
  <main class="main-content">
    <!-- 검색 헤더 -->
    <div class="search-header">
      <div class="search-info">
        {#if keyword}
          <h1 class="search-title">
            "<span class="keyword">{keyword}</span>" 검색 결과
          </h1>
          {#if searchResult && !loading}
            <p class="result-count">
              총 {searchResult.totalElements}개의 스토리를 찾았습니다
            </p>
          {/if}
        {:else}
          <h1 class="search-title">전체 스토리</h1>
        {/if}
      </div>

      <!-- 정렬 옵션 -->
      <div class="sort-options">
        {#each sortOptions as option}
          <button
            type="button"
            class="sort-btn"
            class:active={sortBy === option.value}
            onclick={() => handleSortChange(option.value)}
          >
            {option.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- 콘텐츠 영역 -->
    <div class="content-area">
      {#if loading}
        <div class="loading-state">
          <div class="spinner"></div>
          <p>검색중...</p>
        </div>
      {:else if error}
        <div class="error-state">
          <p class="error-icon">&#9888;</p>
          <h3 class="error-title">{error}</h3>
          <Button onclick={() => performSearch()}>다시 시도</Button>
        </div>
      {:else if searchResult && searchResult.content.length > 0}
        <!-- 검색 결과 그리드 -->
        <div class="results-grid">
          {#each searchResult.content as story}
            <div class="story-card" role="button" tabindex="0" onclick={() => startStory(story)} onkeydown={(e) => e.key === 'Enter' && startStory(story)}>
              <div class="story-thumbnail">
                {#if story.thumbnailUrl}
                  <img src={story.thumbnailUrl} alt={story.title} />
                {:else}
                  <div class="placeholder-thumbnail">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </div>
                {/if}
                {#if story.genre}
                  <div class="genre-badge">{story.genre}</div>
                {/if}
              </div>
              <div class="story-info">
                <h3 class="story-title">{story.title}</h3>
                <p class="story-description">{story.description || '설명이 없습니다.'}</p>
                <div class="story-meta">
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2"/>
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    {story.viewCount}
                  </span>
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                    </svg>
                    {story.likesCount}
                  </span>
                  <span class="meta-item episodes">
                    EP {story.totalEpisodes}
                  </span>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- 페이지네이션 -->
        {#if searchResult.totalPages > 1}
          <div class="pagination">
            <button
              type="button"
              class="page-btn"
              disabled={searchResult.first}
              onclick={() => handlePageChange(currentPage - 1)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              이전
            </button>

            <div class="page-numbers">
              {#each Array(Math.min(5, searchResult.totalPages)) as _, i}
                {@const pageNum = Math.max(0, Math.min(currentPage - 2, searchResult.totalPages - 5)) + i}
                {#if pageNum < searchResult.totalPages}
                  <button
                    type="button"
                    class="page-num"
                    class:active={pageNum === currentPage}
                    onclick={() => handlePageChange(pageNum)}
                  >
                    {pageNum + 1}
                  </button>
                {/if}
              {/each}
            </div>

            <button
              type="button"
              class="page-btn"
              disabled={searchResult.last}
              onclick={() => handlePageChange(currentPage + 1)}
            >
              다음
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        {/if}
      {:else}
        <div class="empty-state">
          <p class="empty-icon">&#128269;</p>
          <h3 class="empty-title">검색 결과가 없습니다</h3>
          <p class="empty-text">
            {#if keyword}
              "{keyword}"에 대한 검색 결과가 없습니다.<br />
              다른 키워드로 검색해보세요.
            {:else}
              등록된 스토리가 없습니다.
            {/if}
          </p>
          <Button onclick={() => window.location.href = '/'}>홈으로 돌아가기</Button>
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  .search-page {
    min-height: calc(100vh - 60px);
    background: hsl(var(--background));
    padding-bottom: 4rem;
  }

  .main-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 4%;
  }

  /* 검색 헤더 */
  .search-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .search-info {
    flex: 1;
  }

  .search-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: hsl(var(--foreground));
    margin: 0 0 0.5rem 0;
  }

  .keyword {
    color: hsl(var(--primary));
  }

  .result-count {
    color: hsl(var(--muted-foreground));
    font-size: 0.9375rem;
    margin: 0;
  }

  .sort-options {
    display: flex;
    gap: 0.5rem;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 8px;
    padding: 0.25rem;
  }

  .sort-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sort-btn:hover {
    color: hsl(var(--foreground));
    background: hsl(var(--muted));
  }

  .sort-btn.active {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  /* 콘텐츠 영역 */
  .content-area {
    min-height: 60vh;
  }

  /* 결과 그리드 */
  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .story-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .story-card:hover {
    transform: translateY(-4px);
    border-color: hsl(var(--primary) / 0.5);
    box-shadow: 0 12px 24px hsla(0 0% 0% / 0.3);
  }

  .story-thumbnail {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: hsl(var(--muted));
  }

  .story-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .story-card:hover .story-thumbnail img {
    transform: scale(1.05);
  }

  .placeholder-thumbnail {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: hsl(var(--muted-foreground));
  }

  .genre-badge {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.25rem 0.75rem;
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 4px;
  }

  .story-info {
    padding: 1rem;
  }

  .story-title {
    font-size: 1rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0 0 0.5rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .story-description {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin: 0 0 0.75rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
  }

  .story-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8125rem;
    color: hsl(var(--muted-foreground));
  }

  .meta-item svg {
    opacity: 0.7;
  }

  .meta-item.episodes {
    background: hsl(var(--muted));
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
  }

  /* 페이지네이션 */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 3rem;
  }

  .page-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 8px;
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-btn:hover:not(:disabled) {
    background: hsl(var(--muted));
    border-color: hsl(var(--primary) / 0.5);
  }

  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-numbers {
    display: flex;
    gap: 0.5rem;
  }

  .page-num {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 8px;
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-num:hover {
    background: hsl(var(--muted));
  }

  .page-num.active {
    background: hsl(var(--primary));
    border-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  /* 상태 표시 */
  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    gap: 1rem;
    padding: 3rem;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 16px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid hsl(var(--border));
    border-top-color: hsl(var(--primary));
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error-icon,
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 0.5rem;
  }

  .error-title,
  .empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0;
  }

  .empty-text {
    color: hsl(var(--muted-foreground));
    font-size: 1rem;
    line-height: 1.6;
  }

  /* 반응형 */
  @media (max-width: 768px) {
    .search-header {
      flex-direction: column;
      gap: 1rem;
    }

    .search-title {
      font-size: 1.375rem;
    }

    .sort-options {
      width: 100%;
    }

    .sort-btn {
      flex: 1;
      text-align: center;
    }

    .results-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
    }

    .pagination {
      flex-wrap: wrap;
    }
  }
</style>
