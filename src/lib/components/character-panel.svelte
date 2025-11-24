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
    padding: 1.25rem;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    text-align: left;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .character-card:hover {
    border-color: hsl(var(--primary));
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  
  .stats-row {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid hsl(var(--border));
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .stat-value {
    font-size: 1.125rem;
    font-weight: 600;
  }
</style>
