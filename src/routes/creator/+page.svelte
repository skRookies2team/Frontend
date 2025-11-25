<script lang="ts">
  import { Button } from '$lib/components/ui/button';
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
          <Button size="lg" onclick={() => window.location.href = '/creator/wizard'}>
            📝 AI 스토리 생성하기
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

  @media (max-width: 768px) {
    .hero-container {
      grid-template-columns: 1fr;
    }

    .hero-title {
      font-size: 2rem;
    }
  }
</style>

