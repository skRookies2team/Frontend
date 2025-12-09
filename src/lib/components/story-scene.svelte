<script lang="ts">
  import type { SceneData } from '$lib/types/game-state';
  import { Button } from '$lib/components/ui/button';
  
  let { 
    scene,
    onChoiceSelect
  }: { 
    scene: SceneData;
    onChoiceSelect: (choiceId: string) => void;
  } = $props();
  
  let imageLoaded = $state(false);
  let selectedChoice = $state<string | null>(null);
  
  function handleChoice(choiceId: string) {
    selectedChoice = choiceId;
    setTimeout(() => {
      onChoiceSelect(choiceId);
      selectedChoice = null;
    }, 300);
  }
  
  function handleImageLoad() {
    imageLoaded = true;
  }
  
  $effect(() => {
    if (scene.id) {
      imageLoaded = false;
    }
  });
</script>

<div class="story-scene">
  {#if scene.imageUrl}
    <div class="story-background" class:loaded={imageLoaded}>
      <img 
        src={scene.imageUrl || "/placeholder.svg"} 
        alt="Scene background"
        onload={handleImageLoad}
      />
      <div class="story-overlay"></div>
    </div>
  {:else}
    <div class="story-background-gradient">
      <div class="story-overlay"></div>
    </div>
  {/if}
  
  <div class="story-content">
    <div class="story-text-container">
      <p class="story-text">{scene.story}</p>
    </div>
    
    {#if scene.characterEvents && scene.characterEvents.length > 0}
      <div class="character-events">
        {#each scene.characterEvents as event}
          <div class="character-event">
            <span class="character-name">{event.characterId}</span>
            <p class="event-content">"{event.content}"</p>
          </div>
        {/each}
      </div>
    {/if}
    
    <div class="choices-container">
      <p class="choices-label">선택하세요:</p>
      <div class="choices-grid">
        {#each scene.choices as choice, index}
          <Button 
            class="choice-button {selectedChoice === choice.id ? 'selected' : ''}"
            size="lg"
            disabled={selectedChoice !== null}
            onclick={() => handleChoice(choice.id)}
            style="animation-delay: {index * 100}ms"
          >
            {choice.text}
          </Button>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .story-scene {
    position: relative;
    min-height: 600px;
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border));
    box-shadow: var(--glow-card);
    animation: fadeIn 0.6s ease;
  }
  
  .story-scene::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    background: linear-gradient(135deg, hsla(0 90% 48% / 0.08), transparent);
    pointer-events: none;
    z-index: 1;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .story-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity 0.8s ease;
  }
  
  .story-background.loaded {
    opacity: 1;
  }
  
  .story-background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .story-background-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, hsl(220 20% 15%) 0%, hsl(220 20% 10%) 100%);
  }
  
  .story-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--story-overlay);
  }
  
  .story-content {
    position: relative;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    min-height: 600px;
  }
  
  .story-text-container {
    flex: 1;
  }
  
  .story-text {
    font-size: 1.25rem;
    line-height: 1.9;
    color: hsl(0 0% 95%);
    max-width: 700px;
    white-space: pre-line;
    text-shadow: 0 2px 8px hsla(0 0% 0% / 0.5);
    font-weight: 400;
    letter-spacing: 0.01em;
  }
  
  .character-events {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 600px;
  }
  
  .character-event {
    padding: 1.25rem 1.5rem;
    background: linear-gradient(
      90deg,
      hsla(0 90% 48% / 0.15),
      hsla(240 12% 12% / 0.9)
    );
    border-left: 4px solid hsl(var(--primary));
    border-radius: var(--radius-md);
    backdrop-filter: blur(16px);
    box-shadow: 0 4px 16px hsla(0 0% 0% / 0.3);
    animation: slideInEvent 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes slideInEvent {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .character-name {
    font-weight: 600;
    color: hsl(var(--primary));
    text-transform: capitalize;
  }
  
  .event-content {
    margin-top: 0.25rem;
    font-style: italic;
    line-height: 1.6;
  }
  
  .choices-container {
    margin-top: auto;
  }
  
  .choices-label {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: hsl(var(--muted-foreground));
    margin-bottom: 1rem;
  }
  
  .choices-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  :global(.choice-button) {
    justify-content: flex-start;
    text-align: left;
    height: auto;
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
    line-height: 1.5;
    white-space: normal;
    transition: all 0.2s ease;
    animation: slideInChoice 0.5s ease forwards;
    opacity: 0;
  }
  
  @keyframes slideInChoice {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  :global(.choice-button:hover:not(:disabled)) {
    transform: translateX(8px);
    background: hsl(var(--choice-hover));
  }
  
  :global(.choice-button.selected) {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }
  
  :global(.choice-button:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
