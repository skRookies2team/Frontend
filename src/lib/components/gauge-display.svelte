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
    padding: 1rem;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
  }
  
  .gauge-track {
    position: relative;
    width: 100%;
    height: 8px;
    background: hsl(var(--muted));
    border-radius: 999px;
    overflow: hidden;
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
    transition: width 0.5s ease;
  }
  
  .gauge-marker {
    position: absolute;
    top: 50%;
    width: 16px;
    height: 16px;
    background: hsl(var(--foreground));
    border: 2px solid hsl(var(--background));
    border-radius: 999px;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: left 0.5s ease;
  }
</style>
