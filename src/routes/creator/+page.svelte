<script lang="ts">
  import { Button } from '$lib/components/ui/button';
</script>

<div class="creator-page">
  <!-- Hero Section -->
  <section class="hero">
    <!-- Background Video -->
    <div class="hero-video-wrapper">
      <video 
        class="hero-video" 
        autoplay 
        muted 
        loop 
        playsinline
        preload="auto"
        onerror={(e) => console.error('Video load error:', e)}
        onloadeddata={() => console.log('Video loaded successfully')}
      >
        <source src="/111281-690770684_small.mp4" type="video/mp4">
      </video>
      <div class="hero-video-overlay"></div>
    </div>
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-badge">✨ AI 기반 스토리 크리에이터</div>
        <h1 class="hero-title">
          당신의 이야기를<br/>
          <span class="gradient-text">인터랙티브 소설</span>로
        </h1>
        <p class="hero-description">
          AI 기술로 더 쉽고 빠르게 인터랙티브 스토리를 제작하고,<br/>
          전 세계 독자들과 공유하세요.
        </p>
        <div class="hero-actions">
          <Button size="lg" onclick={() => window.location.href = '/creator/wizard'}>
            시작하기
          </Button>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .creator-page {
    min-height: calc(100vh - 60px);
    background: hsl(var(--background));
  }

  /* Hero Section */
  .hero {
    position: relative;
    padding: 4rem 2rem;
    overflow: hidden;
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .hero-video-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
  }

  .hero-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.8) contrast(1.1) saturate(1.3);
    opacity: 1;
    pointer-events: none;
  }

  .hero-video-overlay {
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(135deg, hsla(0 0% 0% / 0.2) 0%, hsla(0 0% 0% / 0.1) 100%),
      radial-gradient(circle at 20% 30%, hsla(0 90% 48% / 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, hsla(0 85% 55% / 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  .hero-container {
    max-width: 1100px;
    width: min(1100px, 90vw);
    margin-left: clamp(1.5rem, 6vw, 5rem);
    margin-right: auto;
    position: relative;
    z-index: 2;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
    text-align: left;
    max-width: 720px;
  }

  .hero-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: hsl(var(--primary) / 0.1);
    border: 1px solid hsl(var(--primary) / 0.2);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--primary));
    width: fit-content;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 900;
    line-height: 1.1;
    color: hsl(var(--foreground));
    letter-spacing: -0.02em;
    margin: 0;
    text-shadow: 0 2px 20px hsla(0 0% 0% / 0.5);
  }

  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
  }

  .hero-description {
    font-size: 1.125rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.7;
    margin: 0;
    text-shadow: 0 1px 10px hsla(0 0% 0% / 0.5);
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .hero {
      padding: 3rem 1.5rem;
    }

    .ai-helper-badge {
      top: 3rem;
      right: 1.5rem;
    }

    .hero-title {
      font-size: 2.5rem;
    }

    .hero-description {
      font-size: 1rem;
    }
  }
</style>

