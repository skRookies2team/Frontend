<script lang="ts">
  let { current, total }: { current: number; total: number } = $props();
  
  const percentage = $derived((current / total) * 100);
</script>

<div class="progress-indicator">
  <div class="progress-bar">
    <div class="progress-fill" style="width: {percentage}%"></div>
  </div>
  <p class="progress-text">Scene {current} of ~{total}</p>
</div>

<style>
  .progress-indicator {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .progress-bar {
    height: 4px;
    background: hsl(var(--muted));
    border-radius: 999px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: hsl(var(--primary));
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    text-align: center;
  }
</style>
