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
    position: relative;
    background: linear-gradient(
      135deg,
      hsla(250 100% 70% / 0.15),
      hsla(280 100% 65% / 0.1),
      hsla(45 100% 65% / 0.08)
    );
    padding: 5rem 2rem;
    overflow: hidden;
  }
  
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 30%, hsla(250 100% 70% / 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, hsla(45 100% 65% / 0.12) 0%, transparent 50%);
    animation: float 8s ease-in-out infinite;
  }

  .hero-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: hsl(var(--foreground));
    letter-spacing: -0.02em;
    animation: fadeIn 0.8s ease-out;
  }

  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 20px hsla(250 100% 70% / 0.3));
    display: inline-block;
  }

  .hero-description {
    font-size: 1.25rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 2.5rem;
    line-height: 1.7;
    animation: fadeIn 0.8s ease-out 0.2s backwards;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    animation: fadeIn 0.8s ease-out 0.4s backwards;
  }

  .hero-image {
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.8s ease-out 0.3s backwards;
  }

  .hero-card {
    width: 100%;
    height: 350px;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--glow-card);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .hero-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-primary);
    opacity: 0.05;
    animation: shimmer 3s ease-in-out infinite;
  }
  
  .hero-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--glow-card), var(--glow-primary);
  }

  .typing-demo {
    font-size: 1.75rem;
    font-weight: 700;
    position: relative;
    z-index: 1;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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

