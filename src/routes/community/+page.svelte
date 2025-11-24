<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  
  let activeTab = $state<'popular' | 'recent' | 'following'>('popular');
  
  const posts = [
    {
      id: 1,
      author: { name: '김작가', avatar: '👨‍💼' },
      title: '처음으로 인터랙티브 소설을 완성했어요!',
      content: '3개월 동안 작업한 판타지 소설을 드디어 완성했습니다. 독자분들의 반응이 정말 좋아서 감격스러워요. 인터랙티브 요소를 추가하니 몰입도가 훨씬 높아진 것 같아요...',
      likes: 142,
      comments: 23,
      timeAgo: '2시간 전',
      tags: ['완성', '판타지', '첫작품']
    },
    {
      id: 2,
      author: { name: '이소설', avatar: '👩‍🎨' },
      title: 'AI 이미지 생성 팁 공유합니다',
      content: 'DALL-E를 활용해서 작품 이미지를 생성할 때 유용한 프롬프트 작성법을 공유합니다. 특히 캐릭터 일관성을 유지하는 방법이 중요한데요...',
      likes: 89,
      comments: 15,
      timeAgo: '5시간 전',
      tags: ['팁', 'AI', '이미지']
    },
    {
      id: 3,
      author: { name: '박스토리', avatar: '👨‍🏫' },
      title: '추리 소설 선택지 설계 노하우',
      content: '독자들이 진짜 추리하는 느낌을 받을 수 있도록 선택지를 설계하는 방법에 대해 이야기해보려고 합니다. 먼저 단서 배치가 중요한데...',
      likes: 201,
      comments: 34,
      timeAgo: '1일 전',
      tags: ['노하우', '추리', '선택지']
    },
    {
      id: 4,
      author: { name: '최문학', avatar: '👩‍💻' },
      title: 'SF 설정 작업할 때 참고하면 좋은 자료들',
      content: '하드 SF를 쓰시는 분들께 도움이 될 만한 과학 자료와 레퍼런스를 모아봤습니다. NASA 공개 자료부터 시작해서...',
      likes: 156,
      comments: 28,
      timeAgo: '1일 전',
      tags: ['SF', '자료', '레퍼런스']
    },
    {
      id: 5,
      author: { name: '정이야기', avatar: '👨‍🎨' },
      title: '캐릭터 깊이 있게 만드는 방법',
      content: '평면적인 캐릭터가 아닌 입체적인 캐릭터를 만들기 위한 팁을 공유합니다. 성격 시트 작성부터 대화 패턴까지...',
      likes: 178,
      comments: 42,
      timeAgo: '2일 전',
      tags: ['캐릭터', '팁', '창작']
    }
  ];
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
        {#each posts as post}
          <article class="post-card">
            <div class="post-header">
              <div class="author-info">
                <div class="author-avatar">{post.author.avatar}</div>
                <div>
                  <div class="author-name">{post.author.name}</div>
                  <div class="post-time">{post.timeAgo}</div>
                </div>
              </div>
            </div>
            
            <h2 class="post-title">{post.title}</h2>
            <p class="post-content">{post.content}</p>
            
            <div class="post-tags">
              {#each post.tags as tag}
                <span class="tag">#{tag}</span>
              {/each}
            </div>
            
            <div class="post-footer">
              <button class="action-btn">
                ❤️ {post.likes}
              </button>
              <button class="action-btn">
                💬 {post.comments}
              </button>
              <button class="action-btn">
                🔗 공유
              </button>
            </div>
          </article>
        {/each}
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
  }

  .post-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

