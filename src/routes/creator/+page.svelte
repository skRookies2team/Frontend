<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  
  const features = [
    {
      icon: '✍️',
      title: '간편한 스토리 작성',
      description: '직관적인 에디터로 인터랙티브 소설을 쉽게 만들어보세요'
    },
    {
      icon: '🎨',
      title: 'AI 이미지 생성',
      description: '텍스트로 설명하면 AI가 자동으로 장면 이미지를 생성합니다'
    },
    {
      icon: '🎭',
      title: '캐릭터 시스템',
      description: '독특한 성격과 대화를 가진 캐릭터를 만들 수 있습니다'
    },
    {
      icon: '📊',
      title: '통계 & 분석',
      description: '독자 반응과 선택 통계를 실시간으로 확인하세요'
    },
    {
      icon: '💰',
      title: '수익화',
      description: '작품으로 수익을 창출하고 창작 활동을 지속하세요'
    },
    {
      icon: '🌐',
      title: '커뮤니티',
      description: '다른 작가들과 교류하고 영감을 얻으세요'
    }
  ];
  
  const creators = [
    {
      name: '김작가',
      avatar: '👨‍💼',
      works: 12,
      followers: 15400,
      description: '판타지 전문 작가'
    },
    {
      name: '이소설',
      avatar: '👩‍🎨',
      works: 8,
      followers: 23100,
      description: '로맨스 베스트셀러 작가'
    },
    {
      name: '박스토리',
      avatar: '👨‍🏫',
      works: 15,
      followers: 18200,
      description: '추리 스릴러 전문'
    },
    {
      name: '최문학',
      avatar: '👩‍💻',
      works: 6,
      followers: 9800,
      description: 'SF 작가'
    }
  ];
</script>

<div class="creator-page">
  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">
          당신의 이야기를<br/>
          <span class="gradient-text">인터랙티브 소설</span>로 만들어보세요
        </h1>
        <p class="hero-description">
          AI 기술로 더 쉽고 빠르게 인터랙티브 스토리를 제작하고,<br/>
          전 세계 독자들과 공유하세요.
        </p>
        <div class="hero-actions">
          <Button size="lg" class="hero-btn-primary" onclick={() => window.location.href = '/creator/wizard'}>
            📝 작품 만들기
          </Button>
          <Button size="lg" variant="outline" class="hero-btn-secondary">
            📚 가이드 보기
          </Button>
        </div>
      </div>
      <div class="hero-image">
        <div class="hero-card">
          <div class="typing-demo">✨ AI가 이야기를 돕습니다...</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="features">
    <div class="section-container">
      <h2 class="section-title">크리에이터를 위한 강력한 도구</h2>
      <div class="features-grid">
        {#each features as feature}
          <div class="feature-card">
            <div class="feature-icon">{feature.icon}</div>
            <h3 class="feature-title">{feature.title}</h3>
            <p class="feature-description">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Top Creators Section -->
  <section class="top-creators">
    <div class="section-container">
      <h2 class="section-title">인기 크리에이터</h2>
      <div class="creators-grid">
        {#each creators as creator}
          <div class="creator-card">
            <div class="creator-avatar">{creator.avatar}</div>
            <h3 class="creator-name">{creator.name}</h3>
            <p class="creator-description">{creator.description}</p>
            <div class="creator-stats">
              <div class="stat">
                <span class="stat-label">작품</span>
                <span class="stat-value">{creator.works}</span>
              </div>
              <div class="stat">
                <span class="stat-label">팔로워</span>
                <span class="stat-value">{creator.followers.toLocaleString()}</span>
              </div>
            </div>
            <Button variant="outline" class="w-full">
              팔로우
            </Button>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta">
    <div class="cta-container">
      <h2 class="cta-title">지금 바로 시작하세요</h2>
      <p class="cta-description">
        무료로 가입하고 첫 작품을 만들어보세요
      </p>
      <Button size="lg" class="cta-button" onclick={() => window.location.href = '/creator/wizard'}>
        무료로 시작하기 →
      </Button>
    </div>
  </section>
</div>

<style>
  .creator-page {
    min-height: calc(100vh - 60px);
  }

  /* Hero Section */
  .hero {
    background: linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1));
    padding: 4rem 2rem;
  }

  .hero-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 900;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    color: hsl(var(--foreground));
  }

  .gradient-text {
    background: linear-gradient(135deg, #ef4444, #f97316);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-description {
    font-size: 1.125rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
  }

  .hero-image {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero-card {
    width: 100%;
    height: 300px;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  }

  .typing-demo {
    font-size: 1.5rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    animation: typing 3s steps(30) infinite;
    overflow: hidden;
    white-space: nowrap;
  }

  @keyframes typing {
    0%, 100% { width: 0; }
    50% { width: 100%; }
  }

  /* Features Section */
  .features {
    padding: 5rem 2rem;
    background: hsl(var(--background));
  }

  .section-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 3rem;
    color: hsl(var(--foreground));
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .feature-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 2rem;
    transition: all 0.3s;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .feature-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: hsl(var(--foreground));
  }

  .feature-description {
    color: hsl(var(--muted-foreground));
    line-height: 1.6;
  }

  /* Top Creators Section */
  .top-creators {
    padding: 5rem 2rem;
    background: hsl(var(--muted) / 0.3);
  }

  .creators-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .creator-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 2rem;
    text-align: center;
    transition: all 0.3s;
  }

  .creator-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .creator-avatar {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .creator-name {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .creator-description {
    color: hsl(var(--muted-foreground));
    margin-bottom: 1.5rem;
  }

  .creator-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1.5rem;
    padding: 1rem 0;
    border-top: 1px solid hsl(var(--border));
    border-bottom: 1px solid hsl(var(--border));
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
  }

  .stat-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: hsl(var(--foreground));
  }

  /* CTA Section */
  .cta {
    padding: 5rem 2rem;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  }

  .cta-container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .cta-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    margin-bottom: 1rem;
  }

  .cta-description {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
  }

  .cta-button {
    background: white;
    color: hsl(var(--primary));
  }

  .cta-button:hover {
    background: rgba(255, 255, 255, 0.9);
  }

  @media (max-width: 768px) {
    .hero-container {
      grid-template-columns: 1fr;
    }

    .hero-title {
      font-size: 2rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .cta-title {
      font-size: 2rem;
    }
  }
</style>

