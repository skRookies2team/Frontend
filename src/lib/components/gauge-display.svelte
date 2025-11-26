<script lang="ts">
  import type { ThemeGauge } from '$lib/types/game-state';
  
  let { gauge, value }: { gauge: ThemeGauge; value: number } = $props();
  
  // Convert -100 to 100 range to 0 to 100 for display
  const percentage = $derived((value + 100) / 2);
</script>

<div class="gauge-container">
  <div class="flex items-center justify-between mb-2">
    <span class="text-sm text-muted-foreground">{gauge.leftLabel}</span>
    <span class="text-sm font-medium">{gauge.name}</span>
    <span class="text-sm text-muted-foreground">{gauge.rightLabel}</span>
  </div>
  
  <div class="gauge-track">
    <div 
      class="gauge-fill"
      style="width: {percentage}%"
    ></div>
    <div 
      class="gauge-marker"
      style="left: {percentage}%"
    ></div>
  </div>
</div>

<style>
  .gauge-container {
    padding: 1.25rem;
    background: linear-gradient(135deg, hsl(240 12% 13%), hsl(240 12% 11%));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    box-shadow: inset 0 1px 0 hsla(255 255 255 / 0.05);
    transition: all 0.3s ease;
  }
  
  .gauge-container:hover {
    border-color: hsl(var(--border-bright));
  }
  
  .gauge-track {
    position: relative;
    width: 100%;
    height: 10px;
    background: hsl(var(--muted));
    border-radius: 999px;
    overflow: visible;
    box-shadow: inset 0 2px 4px hsla(0 0% 0% / 0.3);
  }
  
  .gauge-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: linear-gradient(to right, 
      hsl(var(--gauge-negative)), 
      hsl(var(--primary)), 
      hsl(var(--gauge-positive))
    );
    border-radius: 999px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 12px hsla(250 100% 70% / 0.4);
  }
  
  .gauge-marker {
    position: absolute;
    top: 50%;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 90%));
    border: 3px solid hsl(var(--background));
    border-radius: 999px;
    transform: translate(-50%, -50%);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.4),
      0 0 0 2px hsla(250 100% 70% / 0.3);
    transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.4),
        0 0 0 2px hsla(250 100% 70% / 0.3);
    }
    50% {
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.4),
        0 0 0 4px hsla(250 100% 70% / 0.5),
        0 0 12px hsla(250 100% 70% / 0.4);
    }
  }
</style>
