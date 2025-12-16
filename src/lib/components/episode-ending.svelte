<script lang="ts">
  import type { EpisodeEndingDto, GaugeDto } from '$lib/api/types/backend-types';
  import { Button } from '$lib/components/ui/button';
  
  let { 
    ending,
    gaugeDefinitions,
    onContinue
  }: { 
    ending: EpisodeEndingDto;
    gaugeDefinitions?: GaugeDto[];
    onContinue: () => void;
  } = $props();
  
  let showGaugeChanges = $state(false);
</script>

<div class="episode-ending">
  <div class="ending-background">
    <div class="ending-overlay"></div>
  </div>
  
  <div class="ending-content">
    <div class="ending-header">
      <div class="ending-badge">에피소드 엔딩</div>
      <h1 class="ending-title">{ending.title}</h1>
      {#if ending.condition}
        <p class="ending-condition">{ending.condition}</p>
      {/if}
    </div>
    
    <div class="ending-text-container">
      <p class="ending-text">{ending.text}</p>
    </div>
    
    {#if ending.gauge_changes && Object.keys(ending.gauge_changes).length > 0 && gaugeDefinitions}
      <div class="gauge-changes-section">
        <button 
          class="gauge-toggle"
          onclick={() => showGaugeChanges = !showGaugeChanges}
        >
          {showGaugeChanges ? '▼' : '▶'} 게이지 변화 보기
        </button>
        
        {#if showGaugeChanges}
          <div class="gauge-changes">
            {#each gaugeDefinitions as gauge}
              {#if ending.gauge_changes[gauge.id] !== undefined}
                <div class="gauge-change-item">
                  <span class="gauge-name">{gauge.name}</span>
                  <span class="gauge-change {ending.gauge_changes[gauge.id] > 0 ? 'positive' : ending.gauge_changes[gauge.id] < 0 ? 'negative' : 'neutral'}">
                    {ending.gauge_changes[gauge.id] > 0 ? '+' : ''}{ending.gauge_changes[gauge.id]}
                  </span>
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    {/if}
    
    <div class="ending-actions">
      <Button 
        class="continue-button"
        size="lg"
        onclick={onContinue}
      >
        다음 에피소드로 계속하기 →
      </Button>
    </div>
  </div>
</div>

<style>
  .episode-ending {
    position: relative;
    min-height: 600px;
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 2px solid hsl(var(--primary));
    box-shadow: 
      var(--glow-card),
      0 0 40px hsla(0 90% 48% / 0.3);
    animation: fadeInEnding 0.8s ease;
  }
  
  @keyframes fadeInEnding {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .ending-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      hsla(0 90% 48% / 0.15) 0%,
      hsla(240 12% 12% / 0.9) 50%,
      hsla(0 90% 48% / 0.1) 100%
    );
  }
  
  .ending-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      hsla(0 90% 48% / 0.1),
      transparent 70%
    );
    animation: pulse-overlay 3s ease-in-out infinite;
  }
  
  @keyframes pulse-overlay {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }
  
  .ending-content {
    position: relative;
    padding: 4rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    min-height: 600px;
    z-index: 1;
  }
  
  .ending-header {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .ending-badge {
    display: inline-block;
    padding: 0.5rem 1.25rem;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
    color: hsl(var(--primary-foreground));
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 16px hsla(0 90% 48% / 0.4);
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
  
  .ending-title {
    font-size: 2.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 80%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 1rem 0;
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
  
  .ending-condition {
    font-size: 1rem;
    color: hsl(var(--muted-foreground));
    font-style: italic;
    margin: 0;
    animation: fadeInTitle 0.8s ease 0.4s both;
  }
  
  .ending-text-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .ending-text {
    font-size: 1.375rem;
    line-height: 2;
    color: hsl(0 0% 95%);
    text-align: center;
    white-space: pre-line;
    text-shadow: 0 2px 8px hsla(0 0% 0% / 0.5);
    font-weight: 400;
    letter-spacing: 0.01em;
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
  
  .gauge-changes-section {
    margin: 2rem 0;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .gauge-toggle {
    width: 100%;
    padding: 0.75rem 1rem;
    background: hsla(0 90% 48% / 0.1);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }
  
  .gauge-toggle:hover {
    background: hsla(0 90% 48% / 0.15);
    border-color: hsl(var(--primary));
  }
  
  .gauge-changes {
    margin-top: 1rem;
    padding: 1.5rem;
    background: hsla(240 12% 12% / 0.8);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    animation: slideDown 0.3s ease;
  }
  
  .gauge-change-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: hsla(240 12% 10% / 0.5);
    border-radius: var(--radius-sm);
  }
  
  .gauge-name {
    font-weight: 500;
    color: hsl(var(--foreground));
  }
  
  .gauge-change {
    font-weight: 700;
    font-size: 1.125rem;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
  }
  
  .gauge-change.positive {
    color: hsl(142 76% 36%);
    background: hsla(142 76% 36% / 0.1);
  }
  
  .gauge-change.negative {
    color: hsl(0 84% 60%);
    background: hsla(0 84% 60% / 0.1);
  }
  
  .gauge-change.neutral {
    color: hsl(var(--muted-foreground));
    background: hsla(var(--muted) / 0.1);
  }
  
  .ending-actions {
    margin-top: auto;
    display: flex;
    justify-content: center;
    padding-top: 2rem;
    animation: fadeInButton 1s ease 1s both;
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
  
  :global(.continue-button) {
    padding: 1.25rem 2.5rem;
    font-size: 1.125rem;
    font-weight: 700;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
    box-shadow: 
      0 4px 16px hsla(0 90% 48% / 0.4),
      0 0 32px hsla(0 90% 48% / 0.2);
    transition: all 0.3s ease;
  }
  
  :global(.continue-button:hover) {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 24px hsla(0 90% 48% / 0.5),
      0 0 40px hsla(0 90% 48% / 0.3);
  }
</style>









