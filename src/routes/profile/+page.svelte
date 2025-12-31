<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { api, type UserProfileDto, type GameHistoryDto, type AchievementDto } from '$lib/api';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let activeTab = $state<'stories' | 'created' | 'stats'>('stories');
  let loading = $state(true);
  let profile: UserProfileDto | null = $state(null);
  let gameHistory: GameHistoryDto[] = $state([]);
  let achievements: AchievementDto[] = $state([]);
  let error = $state('');

  onMount(async () => {
    // Check if user is authenticated
    if (!api.auth.isAuthenticated()) {
      goto('/login');
      return;
    }

    try {
      // Load profile data
      const [profileData, historyData, achievementsData] = await Promise.all([
        api.user.getMyProfile(),
        api.user.getGameHistory(),
        api.user.getAchievements()
      ]);

      profile = profileData;
      gameHistory = historyData;
      achievements = achievementsData;
    } catch (err) {
      console.error('Failed to load profile:', err);
      error = '프로필을 불러오는데 실패했습니다.';
    } finally {
      loading = false;
    }
  });


  // Mock data for stories (will be replaced with actual API)
  const playedStories = [
    {
      id: 1,
      title: '파리대왕',
      author: '윌리엄 골딩',
      progress: 75,
      lastPlayed: '2시간 전',
      thumbnail: '/boys-stranded-on-tropical-island-survival.jpg'
    },
    {
      id: 2,
      title: '죄와 벌',
      author: '표도르 도스토옙스키',
      progress: 45,
      lastPlayed: '1일 전',
      thumbnail: '/dark-19th-century-russian-street-atmospheric.jpg'
    },
    {
      id: 3,
      title: '위대한 개츠비',
      author: 'F. 스콧 피츠제럴드',
      progress: 100,
      lastPlayed: '3일 전',
      thumbnail: '/1920s-art-deco-mansion-gatsby-party-luxury.jpg'
    }
  ];
  
  const createdStories = [
    {
      id: 1,
      title: '시간여행자의 딜레마',
      views: 1542,
      likes: 234,
      status: 'published'
    },
    {
      id: 2,
      title: '마법학교의 비밀',
      views: 892,
      likes: 156,
      status: 'draft'
    }
  ];
</script>

<div class="profile-page">
  {#if loading}
    <div class="loading-container">
      <p>로딩중...</p>
    </div>
  {:else if error}
    <div class="error-container">
      <p>{error}</p>
      <Button onclick={() => window.location.reload()}>다시 시도</Button>
    </div>
  {:else if profile}
  <div class="profile-container">
    <!-- Profile Header -->
    <header class="profile-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="profile-main">
          <div class="avatar-section">
            <div class="avatar-large">
              {#if profile.profileImageUrl}
                <img src={profile.profileImageUrl} alt={profile.nickname} />
              {:else}
                👤
              {/if}
            </div>
            <Button variant="outline" size="sm" class="edit-avatar-btn">
              편집
            </Button>
          </div>
          <div class="profile-info">
            <h1 class="user-name">{profile.nickname}</h1>
            <p class="user-email">{profile.email}</p>
            <p class="user-bio">{profile.bio || '자기소개가 없습니다.'}</p>
            <p class="user-meta">가입일: {new Date(profile.createdAt).toLocaleDateString('ko-KR')}</p>
            <div class="user-stats">
              <div class="stat-badge">
                <span class="stat-label">플레이</span>
                <span class="stat-value">{profile.totalPlayCount}</span>
              </div>
              <div class="stat-badge">
                <span class="stat-label">완료</span>
                <span class="stat-value">{profile.completedStoryCount}</span>
              </div>
              <div class="stat-badge">
                <span class="stat-label">엔딩</span>
                <span class="stat-value">{profile.unlockedEndingCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Tabs -->
    <div class="profile-tabs">
      <button 
        class="tab"
        class:active={activeTab === 'stories'}
        onclick={() => activeTab = 'stories'}
      >
        📖 플레이한 스토리
      </button>
      <button 
        class="tab"
        class:active={activeTab === 'created'}
        onclick={() => activeTab = 'created'}
      >
        ✍️ 작성한 스토리
      </button>
      <button 
        class="tab"
        class:active={activeTab === 'stats'}
        onclick={() => activeTab = 'stats'}
      >
        📊 통계 & 업적
      </button>
    </div>

    <!-- Content -->
    <div class="profile-content">
      {#if activeTab === 'stories'}
        <div class="stories-grid">
          {#each playedStories as story}
            <div class="story-card">
              <div class="story-thumbnail">
                <img src={story.thumbnail} alt={story.title} />
                <div class="progress-overlay">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: {story.progress}%"></div>
                  </div>
                  <span class="progress-text">{story.progress}% 완료</span>
                </div>
              </div>
              <div class="story-info">
                <h3 class="story-title">{story.title}</h3>
                <p class="story-author">{story.author}</p>
                <p class="story-meta">마지막 플레이: {story.lastPlayed}</p>
                <Button variant="outline" class="w-full">
                  이어하기
                </Button>
              </div>
            </div>
          {/each}
        </div>
      {:else if activeTab === 'created'}
        <div class="created-list">
          {#each createdStories as story}
            <div class="created-card">
              <div class="created-info">
                <h3 class="created-title">{story.title}</h3>
                <div class="created-stats">
                  <span>👁️ {story.views}</span>
                  <span>❤️ {story.likes}</span>
                  <span class="status" class:published={story.status === 'published'}>
                    {story.status === 'published' ? '발행됨' : '초안'}
                  </span>
                </div>
              </div>
              <div class="created-actions">
                <Button variant="outline" size="sm">편집</Button>
                <Button variant="outline" size="sm">통계</Button>
                <Button variant="ghost" size="sm">삭제</Button>
              </div>
            </div>
          {/each}
          <Button class="w-full">
            ➕ 새 스토리 만들기
          </Button>
        </div>
      {:else if activeTab === 'stats'}
        <div class="stats-section">
          <!-- Achievement Grid -->
          <div class="section-block">
            <div class="achievements-header">
              <h2 class="section-title">업적</h2>
              <div class="achievements-summary">
                <span class="achievements-count">{profile.unlockedAchievementCount}</span>
                <span class="achievements-total">/ {achievements.length}</span>
              </div>
            </div>
            {#if achievements.length > 0}
              <div class="achievements-grid">
                {#each achievements as achievement}
                  <div class="achievement-card" class:unlocked={achievement.isUnlocked}>
                    <div class="achievement-icon-wrapper">
                      <div class="achievement-icon" class:locked={!achievement.isUnlocked}>
                        {#if achievement.iconUrl}
                          <img src={achievement.iconUrl} alt={achievement.name} />
                        {:else}
                          <span class="achievement-icon-emoji">🏆</span>
                        {/if}
                      </div>
                      {#if !achievement.isUnlocked}
                        <div class="lock-overlay">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H4C3.44772 10 3 10.4477 3 11V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V11C21 10.4477 20.5523 10 20 10H18M6 10H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                      {/if}
                    </div>
                    <div class="achievement-content">
                      <h4 class="achievement-title">{achievement.name}</h4>
                      <p class="achievement-description">{achievement.description}</p>
                      {#if !achievement.isUnlocked && achievement.targetValue > 1}
                        <div class="achievement-progress-bar">
                          <div 
                            class="progress-fill-bar" 
                            style="width: {(achievement.currentValue / achievement.targetValue) * 100}%"
                          ></div>
                        </div>
                        <div class="achievement-progress-text">
                          {achievement.currentValue} / {achievement.targetValue}
                        </div>
                      {:else if achievement.isUnlocked && achievement.unlockedAt}
                        <div class="achievement-unlocked-date">
                          획득: {new Date(achievement.unlockedAt).toLocaleDateString('ko-KR')}
                        </div>
                      {/if}
                      <div class="achievement-points">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {achievement.points || 0}점
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="achievements-empty">
                <div class="empty-icon-large">🏆</div>
                <h3 class="empty-title">업적이 없습니다</h3>
                <p class="empty-description">
                  게임을 플레이하면 업적을 획득할 수 있습니다
                </p>
              </div>
            {/if}
          </div>

          <!-- Stats Grid -->
          <div class="section-block">
            <h2 class="section-title">통계</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">{profile.totalPlayCount}</div>
                <div class="stat-label">플레이한 스토리</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{profile.completedStoryCount}</div>
                <div class="stat-label">완료한 스토리</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{profile.unlockedEndingCount}</div>
                <div class="stat-label">달성한 엔딩</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{profile.unlockedAchievementCount}</div>
                <div class="stat-label">달성 업적</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{profile.achievementRate.toFixed(1)}%</div>
                <div class="stat-label">업적 달성률</div>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
  {/if}
</div>

<style>
  .profile-page {
    min-height: calc(100vh - 60px);
    background: hsl(var(--background));
  }

  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Profile Header */
  .profile-header {
    position: relative;
    margin-bottom: 2rem;
  }

  .header-background {
    height: 200px;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  }

  .header-content {
    position: relative;
    padding: 0 2rem;
    margin-top: -80px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .profile-main {
    display: flex;
    gap: 2rem;
    align-items: flex-end;
  }

  .avatar-section {
    text-align: center;
  }

  .avatar-large {
    width: 160px;
    height: 160px;
    background: hsl(var(--card));
    border: 4px solid hsl(var(--background));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5rem;
    margin-bottom: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }


  .profile-info {
    padding-bottom: 1rem;
  }

  .user-name {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
    color: hsl(var(--foreground));
  }

  .user-email {
    color: hsl(var(--muted-foreground));
    margin-bottom: 0.25rem;
  }

  .user-meta {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 1rem;
  }

  .user-stats {
    display: flex;
    gap: 1rem;
  }

  .stat-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
  }

  .stat-label {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .stat-value {
    font-weight: 700;
    color: hsl(var(--primary));
  }


  /* Tabs */
  .profile-tabs {
    display: flex;
    gap: 0.5rem;
    padding: 0 2rem;
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

  /* Content */
  .profile-content {
    padding: 2rem;
  }

  .stories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .story-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: all 0.3s;
  }

  .story-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .story-thumbnail {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .story-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .progress-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.75rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: white;
    transition: width 0.3s;
  }

  .progress-text {
    font-size: 0.75rem;
    color: white;
    font-weight: 600;
  }

  .story-info {
    padding: 1.25rem;
  }

  .story-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: hsl(var(--foreground));
  }

  .story-author {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 0.5rem;
  }

  .story-meta {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 1rem;
  }

  /* Created Stories */
  .created-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .created-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .created-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .created-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .status {
    padding: 0.25rem 0.75rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
  }

  .status.published {
    background: hsl(var(--primary) / 0.1);
    color: hsl(var(--primary));
  }

  .created-actions {
    display: flex;
    gap: 0.5rem;
  }

  /* Stats Section */
  .stats-section {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .section-block {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0;
    color: hsl(var(--foreground));
  }

  .achievements-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .achievements-summary {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .achievements-count {
    color: hsl(var(--primary));
    font-size: 1.5rem;
  }

  .achievements-total {
    color: hsl(var(--muted-foreground));
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .achievement-card {
    position: relative;
    display: flex;
    gap: 1rem;
    padding: 1.25rem;
    background: hsl(0 0% 8%);
    border: 2px solid hsl(0 0% 20%);
    border-radius: var(--radius-lg);
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .achievement-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, hsl(var(--primary) / 0.05), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .achievement-card.unlocked {
    background: hsl(0 0% 10%);
    border-color: hsl(0 90% 40%);
    box-shadow: 0 4px 12px hsl(0 90% 40% / 0.2);
  }

  .achievement-card.unlocked::before {
    opacity: 1;
  }

  .achievement-card.unlocked:hover {
    border-color: hsl(0 90% 50%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px hsl(0 90% 40% / 0.3);
  }

  .achievement-icon-wrapper {
    position: relative;
    flex-shrink: 0;
    width: 80px;
    height: 80px;
  }

  .achievement-icon {
    width: 100%;
    height: 100%;
    background: hsl(0 0% 15%);
    border: 2px solid hsl(0 0% 25%);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .achievement-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .achievement-icon-emoji {
    font-size: 3rem;
    filter: grayscale(0);
    transition: filter 0.3s ease;
  }

  .achievement-icon.locked {
    background: hsl(0 0% 6%);
    border-color: hsl(0 0% 15%);
    filter: grayscale(1) brightness(0.4);
  }

  .achievement-icon.locked .achievement-icon-emoji {
    filter: grayscale(1) brightness(0.3);
  }

  .achievement-card.unlocked .achievement-icon {
    background: hsl(0 0% 12%);
    border-color: hsl(0 90% 40%);
    box-shadow: 0 0 12px hsl(0 90% 40% / 0.3);
  }

  .lock-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(0 0% 0% / 0.6);
    border-radius: var(--radius-md);
    color: hsl(0 0% 60%);
    backdrop-filter: blur(2px);
  }

  .achievement-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
  }

  .achievement-title {
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
    color: hsl(0 0% 95%);
    line-height: 1.3;
  }

  .achievement-card.unlocked .achievement-title {
    color: hsl(0 0% 100%);
  }

  .achievement-description {
    font-size: 0.8125rem;
    color: hsl(0 0% 70%);
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .achievement-card.unlocked .achievement-description {
    color: hsl(0 0% 80%);
  }

  .achievement-progress-bar {
    width: 100%;
    height: 6px;
    background: hsl(0 0% 15%);
    border-radius: 999px;
    overflow: hidden;
    margin-top: 0.25rem;
  }

  .achievement-card.unlocked .achievement-progress-bar {
    background: hsl(0 0% 20%);
  }

  .progress-fill-bar {
    height: 100%;
    background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)));
    border-radius: 999px;
    transition: width 0.5s ease;
    box-shadow: 0 0 8px hsl(var(--primary) / 0.5);
  }

  .achievement-progress-text {
    font-size: 0.75rem;
    color: hsl(0 0% 60%);
    font-weight: 600;
    margin-top: 0.125rem;
  }

  .achievement-unlocked-date {
    font-size: 0.75rem;
    color: hsl(var(--primary));
    font-weight: 600;
    margin-top: 0.25rem;
  }

  .achievement-points {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: auto;
    padding-top: 0.5rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: hsl(0 0% 60%);
  }

  .achievement-card.unlocked .achievement-points {
    color: hsl(var(--primary));
  }

  .achievement-points svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
  }

  .achievements-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
  }

  .empty-icon-large {
    font-size: 5rem;
    margin-bottom: 1.5rem;
    opacity: 0.3;
    filter: grayscale(0.5);
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0 0 0.75rem 0;
  }

  .empty-description {
    font-size: 1rem;
    color: hsl(var(--muted-foreground));
    margin: 0;
    max-width: 400px;
    line-height: 1.6;
  }

  .loading-container,
  .error-container {
    min-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .user-bio {
    color: hsl(var(--muted-foreground));
    margin-bottom: 0.5rem;
    font-style: italic;
  }

  .avatar-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .stat-card {
    text-align: center;
    padding: 2rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-lg);
  }

  .stat-number {
    font-size: 3rem;
    font-weight: 800;
    color: hsl(var(--primary));
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: hsl(var(--muted-foreground));
  }

  @media (max-width: 768px) {
    .profile-main {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stories-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

