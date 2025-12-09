<script lang="ts">
  import type { Character } from '$lib/types/game-state';
  import { gsm } from '$lib/stores/game-state-manager.svelte';
  
  let { character }: { character: Character } = $props();
  
  const relationship = $derived(gsm.getRelationship(character.id));
  const trust = $derived(gsm.getTrust(character.id));
  
  const relationshipColor = $derived(
    relationship > 30 ? 'text-accent' : 
    relationship < -30 ? 'text-destructive' : 
    'text-muted-foreground'
  );
</script>

<button class="character-card">
  <div class="flex items-start justify-between">
    <div>
      <h3 class="font-semibold text-lg">{character.name}</h3>
      <p class="text-sm text-muted-foreground mt-1">{character.description}</p>
    </div>
  </div>
  
  <div class="stats-row">
    <div class="stat">
      <span class="stat-label">관계도</span>
      <span class="stat-value {relationshipColor}">
        {relationship > 0 ? '+' : ''}{relationship}
      </span>
    </div>
    
    <div class="stat">
      <span class="stat-label">신뢰도</span>
      <span class="stat-value text-primary">{trust}%</span>
    </div>
  </div>
</button>

<style>
  .character-card {
    width: 100%;
    padding: 1.5rem;
    background: linear-gradient(135deg, hsl(240 12% 13%), hsl(240 12% 11%));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    text-align: left;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .character-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: var(--gradient-border);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .character-card::after {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: calc(var(--radius-lg) - 1px);
    background: linear-gradient(135deg, hsl(240 12% 13%), hsl(240 12% 11%));
    z-index: 0;
  }
  
  .character-card > * {
    position: relative;
    z-index: 1;
  }
  
  .character-card:hover {
    border-color: hsl(var(--primary));
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.3),
      0 0 0 1px hsla(0 90% 48% / 0.2);
    transform: translateY(-4px) scale(1.02);
  }
  
  .character-card:hover::before {
    opacity: 1;
  }
  
  .stats-row {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid hsla(0 70% 45% / 0.2);
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }
  
  .stat-value {
    font-size: 1.25rem;
    font-weight: 800;
    text-shadow: 0 0 8px currentColor;
  }
</style>
