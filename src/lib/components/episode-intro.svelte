<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { fade, slide } from 'svelte/transition';
  
  let { 
    episodeTitle,
    introText,
    onStart
  }: { 
    episodeTitle: string;
    introText: string;
    onStart: () => void;
  } = $props();
  
  let visible = $state(true);
  
  function handleStart() {
    visible = false;
    setTimeout(() => {
      onStart();
    }, 300);
  }
</script>

{#if visible}
  <div class="episode-intro-overlay" transition:fade={{ duration: 300 }}>
    <div class="episode-intro-container" transition:slide={{ duration: 400 }}>
      <div class="intro-background">
        <div class="intro-overlay"></div>
      </div>
      
      <div class="intro-content">
        <div class="intro-header">
          <div class="episode-badge">에피소드</div>
          <h1 class="episode-title">{episodeTitle}</h1>
        </div>
        
        <div class="intro-text-container">
          <p class="intro-text">{introText}</p>
        </div>
        
        <div class="intro-actions">
          <Button 
            class="start-button"
            size="lg"
            onclick={handleStart}
          >
            시작하기 →
          </Button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .episode-intro-overlay {
    position: fixed;
    inset: 0;
    background: hsla(0 0% 0% / 0.9);
    backdrop-filter: blur(8px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .episode-intro-container {
    position: relative;
    max-width: 900px;
    width: 100%;
    min-height: 500px;
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 2px solid hsl(var(--primary));
    box-shadow: 
      0 0 60px hsla(0 90% 48% / 0.4),
      inset 0 0 60px hsla(0 90% 48% / 0.1);
  }
  
  .intro-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      hsla(0 90% 48% / 0.15) 0%,
      hsla(240 12% 12% / 0.95) 30%,
      hsla(0 90% 48% / 0.1) 70%,
      hsla(240 12% 12% / 0.9) 100%
    );
  }
  
  .intro-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      hsla(0 90% 48% / 0.1),
      transparent 60%
    );
    animation: pulse-overlay 3s ease-in-out infinite;
  }
  
  @keyframes pulse-overlay {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
  
  .intro-content {
    position: relative;
    padding: 4rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    min-height: 500px;
    z-index: 1;
  }
  
  .intro-header {
    text-align: center;
  }
  
  .episode-badge {
    display: inline-block;
    padding: 0.625rem 1.5rem;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
    color: hsl(var(--primary-foreground));
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 20px hsla(0 90% 48% / 0.5);
    animation: slideDown 0.6s ease;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .episode-title {
    font-size: 2.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 80%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    text-shadow: 0 4px 16px hsla(0 90% 48% / 0.3);
    animation: fadeInTitle 0.8s ease 0.2s both;
    letter-spacing: -0.02em;
  }
  
  @keyframes fadeInTitle {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .intro-text-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .intro-text {
    font-size: 1.375rem;
    line-height: 2.2;
    color: hsl(0 0% 95%);
    text-align: center;
    white-space: pre-line;
    text-shadow: 0 2px 10px hsla(0 0% 0% / 0.5);
    font-weight: 400;
    letter-spacing: 0.01em;
    max-width: 800px;
    margin: 0 auto;
    animation: fadeInText 1s ease 0.6s both;
  }
  
  @keyframes fadeInText {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .intro-actions {
    display: flex;
    justify-content: center;
    padding-top: 1rem;
    animation: fadeInButton 1.2s ease 1s both;
  }
  
  @keyframes fadeInButton {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  :global(.start-button) {
    padding: 1.25rem 3rem;
    font-size: 1.125rem;
    font-weight: 700;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
    box-shadow: 
      0 4px 20px hsla(0 90% 48% / 0.5),
      0 0 40px hsla(0 90% 48% / 0.3);
    transition: all 0.3s ease;
  }
  
  :global(.start-button:hover) {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 28px hsla(0 90% 48% / 0.6),
      0 0 50px hsla(0 90% 48% / 0.4);
  }
</style>

