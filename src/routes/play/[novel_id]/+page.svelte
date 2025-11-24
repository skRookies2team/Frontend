<script lang="ts">
  import { gsm } from '$lib/stores/game-state-manager.svelte';
  import { novels } from '$lib/data/novel-configs';
  import { storyGenerator } from '$lib/services/story-generator';
  import { characterChat } from '$lib/services/character-chat';
  import { saveGameState, loadGameState, clearGameState, hasSavedGame } from '$lib/utils/storage';
  import GaugeDisplay from '$lib/components/gauge-display.svelte';
  import CharacterPanel from '$lib/components/character-panel.svelte';
  import StoryScene from '$lib/components/story-scene.svelte';
  import CharacterDialog from '$lib/components/character-dialog.svelte';
  import GameMenu from '$lib/components/game-menu.svelte';
  import ProgressIndicator from '$lib/components/progress-indicator.svelte';
  import { Button } from '$lib/components/ui/button';
  import type { Character, NovelConfig } from '$lib/types/game-state';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  const novelId = $derived($page.params.novel_id);
  const novelConfig = $derived(novels.find(n => n.id === novelId));
  
  let loading = $state(false);
  let selectedCharacter = $state<{ character: Character | null; response: string }>({ character: null, response: '' });
  let showMenu = $state(false);
  let gameInitialized = $state(false);
  
  let gameState = $derived(gsm.currentState);
  
  onMount(async () => {
    if (!novelConfig) {
      window.location.href = '/';
      return;
    }
    
    // Initialize game
    loading = true;
    gsm.initializeGame(novelConfig);
    
    const firstScene = await storyGenerator.generateScene(
      gsm.currentState,
      novelConfig.description
    );
    gsm.setScene(firstScene);
    
    gameInitialized = true;
    loading = false;
  });
  
  async function handleChoiceSelect(choiceId: string) {
    if (!gameState.currentScene || !novelConfig) return;
    
    loading = true;
    const choice = gameState.currentScene.choices.find((c: any) => c.id === choiceId);
    
    if (choice) {
      gsm.processChoice(choice);
      saveGameState(gsm.currentState);
      
      const nextScene = await storyGenerator.generateScene(
        gsm.currentState,
        novelConfig.description,
        choice
      );
      gsm.setScene(nextScene);
    }
    
    loading = false;
  }
  
  async function handleCharacterClick(character: Character) {
    loading = true;
    const response = await characterChat.getCharacterResponse(
      character,
      gsm.currentState
    );
    selectedCharacter = { character, response };
    loading = false;
  }
  
  function handleRestart() {
    if (confirm('정말로 처음부터 다시 시작하시겠습니까? 저장된 진행상황이 삭제됩니다.')) {
      clearGameState();
      window.location.reload();
    }
  }
  
  function handleSave() {
    const success = saveGameState(gsm.currentState);
    if (success) {
      alert('게임이 저장되었습니다!');
    } else {
      alert('게임 저장에 실패했습니다.');
    }
  }
  
  function exitToMain() {
    if (confirm('메인으로 돌아가시겠습니까? 저장하지 않은 진행상황은 사라집니다.')) {
      window.location.href = '/';
    }
  }
</script>

{#if !novelConfig}
  <div class="loading-screen">
    <div class="spinner"></div>
    <p class="loading-text">소설을 찾을 수 없습니다...</p>
  </div>
{:else if !gameInitialized}
  <div class="loading-screen">
    <div class="spinner"></div>
    <p class="loading-text">게임을 준비하는 중...</p>
  </div>
{:else}
  <div class="game-page">
    <header class="game-header">
      <div class="header-container">
        <div class="header-content">
          <button 
            type="button" 
            class="back-btn"
            onclick={exitToMain}
            aria-label="메인으로 돌아가기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          
          <div class="header-info">
            <h1 class="game-title">{novelConfig.title}</h1>
            <p class="game-progress">
              Chapter {gameState.act} · Scene {gameState.scene}
            </p>
          </div>
          
          <div class="header-progress">
            <ProgressIndicator current={gameState.scene} total={20} />
          </div>
          
          <div class="header-actions">
            <Button variant="ghost" size="sm" onclick={handleSave} aria-label="게임 저장">
              💾 저장
            </Button>
            <Button variant="outline" size="sm" onclick={() => showMenu = true} aria-label="게임 메뉴 열기">
              ☰ 메뉴
            </Button>
          </div>
        </div>
      </div>
    </header>
    
    <main class="game-content">
      <div class="game-container">
        <div class="game-layout">
          <div class="story-column">
            {#if loading}
              <div class="loading-screen">
                <div class="spinner"></div>
                <p class="loading-text">장면을 생성하는 중...</p>
              </div>
            {:else if gameState.currentScene}
              <StoryScene 
                scene={gameState.currentScene}
                onChoiceSelect={handleChoiceSelect}
              />
            {/if}
          </div>
          
          <aside class="game-sidebar">
            <div class="sidebar-section">
              <h2 class="sidebar-title">주제 게이지</h2>
              <div class="gauges-list">
                {#each novelConfig.themeGauges as gauge}
                  <GaugeDisplay 
                    {gauge} 
                    value={gameState.themeGauges[gauge.id] || 0} 
                  />
                {/each}
              </div>
            </div>
            
            <div class="sidebar-section">
              <h2 class="sidebar-title">캐릭터</h2>
              <p class="sidebar-hint">
                캐릭터를 클릭하여 조언을 구하세요
              </p>
              <div class="characters-list">
                {#each novelConfig.characters as character}
                  <button 
                    class="character-btn" 
                    type="button" 
                    onclick={() => handleCharacterClick(character)}
                    aria-label={`${character.name} 클릭`}
                  >
                    <CharacterPanel 
                      {character}
                      trustLevel={gameState.trust[character.id] || 0}
                      relationship={gameState.relationships[character.id] || 0}
                    />
                  </button>
                {/each}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
  
  {#if selectedCharacter.character}
    <CharacterDialog
      character={selectedCharacter.character}
      response={selectedCharacter.response}
      onClose={() => selectedCharacter = { character: null, response: '' }}
    />
  {/if}
  
  {#if showMenu}
    <GameMenu
      onClose={() => showMenu = false}
      onSave={handleSave}
      onRestart={handleRestart}
    />
  {/if}
{/if}

<style>
  .game-page {
    min-height: 100vh;
  }

  .game-header {
    position: sticky;
    top: 0;
    background: hsl(var(--card));
    border-bottom: 1px solid hsl(var(--border));
    padding: 1rem 0;
    z-index: 40;
  }

  .header-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .header-content {
    display: grid;
    grid-template-columns: auto 1fr 2fr auto;
    gap: 2rem;
    align-items: center;
  }

  .back-btn {
    padding: 0.5rem;
    background: none;
    border: none;
    color: hsl(var(--foreground));
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .back-btn:hover {
    color: hsl(var(--primary));
  }

  .header-info {
    min-width: 0;
  }

  .game-title {
    font-size: 1.25rem;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  .game-progress {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .header-progress {
    justify-self: center;
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .game-content {
    padding: 2rem 0;
  }

  .game-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .game-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 2rem;
  }

  .story-column {
    min-width: 0;
  }

  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    gap: 1.5rem;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid hsl(var(--muted));
    border-top-color: hsl(var(--primary));
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    font-size: 1.125rem;
    color: hsl(var(--muted-foreground));
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .game-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar-section {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.5rem;
  }

  .sidebar-title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .sidebar-hint {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 1rem;
  }

  .gauges-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .characters-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .character-btn {
    width: 100%;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .character-btn:hover {
    transform: translateX(4px);
  }

  @media (max-width: 1200px) {
    .game-layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .header-content {
      grid-template-columns: auto 1fr auto;
    }

    .header-progress {
      display: none;
    }
  }
</style>

