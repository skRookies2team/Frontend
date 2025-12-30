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
  <div class="story-content">
    <div class="story-text-container">
      <p class="story-text">{scene.story}</p>
    </div>

    {#if scene.imageUrl}
      <div class="scene-image-container">
        <img
          src={scene.imageUrl}
          alt="Scene illustration"
          class="scene-image"
          class:loaded={imageLoaded}
          onload={handleImageLoad}
        />
      </div>
    {/if}

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
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border));
    box-shadow: var(--glow-card);
    animation: fadeIn 0.6s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .story-content {
    padding: 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .story-text-container {
    margin-bottom: 0.5rem;
  }

  .story-text {
    font-size: 1.25rem;
    line-height: 1.9;
    color: hsl(0 0% 95%);
    white-space: pre-line;
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  .scene-image-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: hsl(var(--muted) / 0.3);
    box-shadow: 0 8px 32px hsla(0 0% 0% / 0.4);
  }

  .scene-image {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: cover;
    display: block;
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  .scene-image.loaded {
    opacity: 1;
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

  /* 반응형 */
  @media (max-width: 768px) {
    .story-content {
      padding: 2rem 1.5rem;
      gap: 1.5rem;
    }

    .story-text {
      font-size: 1.125rem;
    }

    .scene-image {
      max-height: 350px;
    }
  }
</style>
