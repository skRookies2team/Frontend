<script lang="ts">
  import type { FinalEndingDto, GaugeDto } from '$lib/api/types/backend-types';
  import { Button } from '$lib/components/ui/button';
  
  let { 
    ending,
    gaugeDefinitions,
    finalGaugeStates,
    onRestart
  }: { 
    ending: FinalEndingDto;
    gaugeDefinitions?: GaugeDto[];
    finalGaugeStates?: Record<string, number>;
    onRestart: () => void;
  } = $props();
  
  let showFinalStats = $state(false);
</script>

<div class="final-ending">
  <div class="ending-background">
    <div class="ending-overlay"></div>
  </div>
  
  <div class="ending-content">
    <div class="ending-header">
      <div class="ending-badge final">최종 엔딩</div>
      <h1 class="ending-title">{ending.title}</h1>
      {#if ending.type}
        <p class="ending-type">타입: {ending.type}</p>
      {/if}
      {#if ending.condition}
        <p class="ending-condition">{ending.condition}</p>
      {/if}
    </div>
    
    <div class="ending-text-container">
      <p class="ending-text">{ending.summary}</p>
    </div>
    
    {#if gaugeDefinitions && finalGaugeStates}
      <div class="final-stats-section">
        <button 
          class="stats-toggle"
          onclick={() => showFinalStats = !showFinalStats}
        >
          {showFinalStats ? '▼' : '▶'} 최종 게이지 상태 보기
        </button>
        
        {#if showFinalStats}
          <div class="final-stats">
            {#each gaugeDefinitions as gauge}
              <div class="gauge-stat-item">
                <span class="gauge-name">{gauge.name}</span>
                <div class="gauge-bar">
                  <div 
                    class="gauge-fill"
                    style="width: {((finalGaugeStates[gauge.id] || 0) + 100) / 2}%"
                  ></div>
                </div>
                <span class="gauge-value">{finalGaugeStates[gauge.id] || 0}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
    
    <div class="ending-actions">
      <Button 
        class="restart-button"
        size="lg"
        onclick={onRestart}
      >
        처음부터 다시 시작하기
      </Button>
    </div>
  </div>
</div>

<style>
  .final-ending {
    position: relative;
    min-height: 700px;
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 3px solid hsl(var(--primary));
    box-shadow: 
      var(--glow-card),
      0 0 60px hsla(0 90% 48% / 0.4),
      inset 0 0 60px hsla(0 90% 48% / 0.1);
    animation: fadeInFinalEnding 1s ease;
  }
  
  @keyframes fadeInFinalEnding {
    from {
      opacity: 0;
      transform: scale(0.9);
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
      hsla(0 90% 48% / 0.2) 0%,
      hsla(240 12% 12% / 0.95) 30%,
      hsla(0 90% 48% / 0.15) 70%,
      hsla(240 12% 12% / 0.9) 100%
    );
  }
  
  .ending-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      hsla(0 90% 48% / 0.15),
      transparent 60%
    );
    animation: pulse-overlay-final 4s ease-in-out infinite;
  }
  
  @keyframes pulse-overlay-final {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
  
  .ending-content {
    position: relative;
    padding: 5rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    min-height: 700px;
    z-index: 1;
  }
  
  .ending-header {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .ending-badge {
    display: inline-block;
    padding: 0.625rem 1.5rem;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
    color: hsl(var(--primary-foreground));
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px hsla(0 90% 48% / 0.5);
    animation: slideDown 0.6s ease;
  }
  
  .ending-badge.final {
    font-size: 1rem;
    padding: 0.75rem 2rem;
    box-shadow: 
      0 4px 20px hsla(0 90% 48% / 0.5),
      0 0 40px hsla(0 90% 48% / 0.3);
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
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 70%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 1rem 0;
    text-shadow: 0 4px 20px hsla(0 90% 48% / 0.4);
    animation: fadeInTitle 1s ease 0.3s both;
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
  
  .ending-type {
    font-size: 1.125rem;
    color: hsl(var(--primary));
    font-weight: 600;
    margin: 0.5rem 0;
    animation: fadeInTitle 1s ease 0.5s both;
  }
  
  .ending-condition {
    font-size: 1rem;
    color: hsl(var(--muted-foreground));
    font-style: italic;
    margin: 0.5rem 0 0 0;
    animation: fadeInTitle 1s ease 0.7s both;
  }
  
  .ending-text-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .ending-text {
    font-size: 1.5rem;
    line-height: 2.2;
    color: hsl(0 0% 95%);
    text-align: center;
    white-space: pre-line;
    text-shadow: 0 2px 10px hsla(0 0% 0% / 0.5);
    font-weight: 400;
    letter-spacing: 0.01em;
    animation: fadeInText 1.2s ease 0.9s both;
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
  
  .final-stats-section {
    margin: 2rem 0;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .stats-toggle {
    width: 100%;
    padding: 0.875rem 1.25rem;
    background: hsla(0 90% 48% / 0.15);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }
  
  .stats-toggle:hover {
    background: hsla(0 90% 48% / 0.2);
    border-color: hsl(var(--primary));
  }
  
  .final-stats {
    margin-top: 1.5rem;
    padding: 2rem;
    background: hsla(240 12% 12% / 0.8);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: slideDown 0.3s ease;
  }
  
  .gauge-stat-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: hsla(240 12% 10% / 0.5);
    border-radius: var(--radius-sm);
  }
  
  .gauge-name {
    min-width: 120px;
    font-weight: 500;
    color: hsl(var(--foreground));
  }
  
  .gauge-bar {
    flex: 1;
    height: 8px;
    background: hsla(240 12% 20% / 0.5);
    border-radius: var(--radius-full);
    overflow: hidden;
  }
  
  .gauge-fill {
    height: 100%;
    background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)));
    border-radius: var(--radius-full);
    transition: width 0.5s ease;
  }
  
  .gauge-value {
    min-width: 50px;
    text-align: right;
    font-weight: 700;
    color: hsl(var(--foreground));
  }
  
  .ending-actions {
    margin-top: auto;
    display: flex;
    justify-content: center;
    padding-top: 2rem;
    animation: fadeInButton 1.2s ease 1.2s both;
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
  
  :global(.restart-button) {
    padding: 1.5rem 3rem;
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
    box-shadow: 
      0 4px 20px hsla(0 90% 48% / 0.5),
      0 0 40px hsla(0 90% 48% / 0.3);
    transition: all 0.3s ease;
  }
  
  :global(.restart-button:hover) {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 28px hsla(0 90% 48% / 0.6),
      0 0 50px hsla(0 90% 48% / 0.4);
  }
</style>

