<script lang="ts">
  import type { Character } from '$lib/types/game-state';
  import { Button } from '$lib/components/ui/button';
  import { X } from 'lucide-svelte';
  
  let { 
    character,
    response,
    onClose
  }: { 
    character: Character;
    response: string;
    onClose: () => void;
  } = $props();
</script>

<div class="dialog-overlay" role="dialog" aria-modal="true" tabindex="-1" onkeydown={(e) => e.key === 'Escape' && onClose()}>
  <div class="dialog-content" role="document" tabindex="0" onkeydown={(e) => e.key === 'Tab' && e.preventDefault()}>
    <div class="dialog-header">
      <div>
        <h2 class="dialog-title">{character.name}</h2>
        <p class="dialog-subtitle">{character.description}</p>
      </div>
      <Button variant="ghost" size="icon" onclick={onClose}>
        <X class="w-5 h-5" />
      </Button>
    </div>
    
    <div class="dialog-body">
      <div class="character-response">
        <p>{response}</p>
      </div>
    </div>
    
    <div class="dialog-footer">
      <Button onclick={onClose}>닫기</Button>
    </div>
  </div>
</div>

<style>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
    animation: fadeIn 0.2s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .dialog-content {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow: auto;
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .dialog-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 2rem 2rem 1rem 2rem;
    border-bottom: 1px solid hsl(var(--border));
  }
  
  .dialog-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .dialog-subtitle {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }
  
  .dialog-body {
    padding: 2rem;
  }
  
  .character-response {
    padding: 1.5rem;
    background: hsl(var(--muted));
    border-left: 3px solid hsl(var(--primary));
    border-radius: var(--radius-md);
    line-height: 1.7;
  }
  
  .dialog-footer {
    padding: 1rem 2rem 2rem 2rem;
    display: flex;
    justify-content: flex-end;
  }
</style>
