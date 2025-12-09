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
  import { api, type StoryData } from '$lib/api';
  import type { Character, NovelConfig } from '$lib/types/game-state';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  const novelId = $derived($page.params.novel_id);
  let novelConfig = $state<NovelConfig | null>(null);
  let storyData = $state<StoryData | null>(null);
  let useApiGame = $state(false);
  
  let loading = $state(false);
  let selectedCharacter = $state<{ character: Character | null; response: string }>({ character: null, response: '' });
  let showMenu = $state(false);
  let gameInitialized = $state(false);
  let sessionId = $state<string | null>(null);
  
  let gameState = $derived(gsm.currentState);
  
  onMount(async () => {
    loading = true;
    
    // 먼저 하드코딩된 novels 배열에서 찾기
    const localNovel = novels.find(n => n.id === novelId);
    
    if (localNovel) {
      // 하드코딩된 소설이 있으면 기존 방식 사용
      novelConfig = localNovel;
      gsm.initializeGame(novelConfig);
      
      const firstScene = await storyGenerator.generateScene(
        gsm.currentState,
        novelConfig.description
      );
      gsm.setScene(firstScene);
      
      gameInitialized = true;
    } else {
      // 하드코딩된 소설이 없으면 API에서 가져오기
      try {
        const storyId = parseInt(novelId);
        if (isNaN(storyId)) {
          console.error('Invalid story ID:', novelId);
          window.location.href = '/';
          return;
        }
        
        // 모든 스토리 목록에서 해당 ID 찾기
        const allStories = await api.game.getAllStories();
        const foundStory = allStories.find(s => s.id === storyId);
        
        if (!foundStory) {
          console.error('Story not found:', storyId);
          window.location.href = '/';
          return;
        }
        
        storyData = foundStory;
        
        // API 게임 시작
        const gameStateResponse = await api.game.startGame({ storyDataId: storyId });
        sessionId = gameStateResponse.sessionId;
        
        // 최소한의 NovelConfig 생성 (API 게임용)
        novelConfig = {
          id: novelId,
          title: foundStory.title,
          description: foundStory.description || '',
          author: '사용자 생성',
          category: '사용자 생성',
          difficulty: '중급',
          thumbnail: '',
          characters: [],
          themeGauges: gameStateResponse.gaugeDefinitions.map(g => ({
            id: g.id,
            name: g.name,
            label: g.name,
            leftLabel: g.leftLabel || '낮음',
            rightLabel: g.rightLabel || '높음',
            initialValue: gameStateResponse.gaugeStates[g.id] || 50,
            description: g.description || ''
          })),
          initialState: {
            act: 1,
            scene: 1,
            relationships: {},
            trust: {},
            themeGauges: gameStateResponse.gaugeStates,
            flags: {}
          }
        };
        
        // 게임 상태 초기화
        gsm.initializeGame(novelConfig);
        
        // API에서 받은 게임 상태를 씬으로 변환
        const apiScene = {
          id: gameStateResponse.currentNodeId,
          text: gameStateResponse.nodeText,
          choices: gameStateResponse.choices.map((c, idx) => ({
            id: `choice-${idx}`,
            text: c.text,
            consequence: ''
          }))
        };
        
        gsm.setScene(apiScene);
        useApiGame = true;
        gameInitialized = true;
      } catch (err) {
        console.error('Failed to load story from API:', err);
        alert('게임을 불러오는데 실패했습니다.');
        window.location.href = '/';
        return;
      }
    }
    
    loading = false;
  });
  
  async function handleChoiceSelect(choiceId: string) {
    if (!gameState.currentScene || !novelConfig) return;
    
    loading = true;
    const choice = gameState.currentScene.choices.find((c: any) => c.id === choiceId);
    
    if (choice) {
      if (useApiGame && sessionId) {
        // API 게임 사용 시
        try {
          const choiceIndex = parseInt(choiceId.replace('choice-', ''));
          if (isNaN(choiceIndex)) {
            console.error('Invalid choice index:', choiceId);
            loading = false;
            return;
          }
          
          const gameStateResponse = await api.game.makeChoice(sessionId, choiceIndex);
          
          // 게이지 상태 업데이트
          if (novelConfig && novelConfig.themeGauges) {
            novelConfig.themeGauges.forEach(gauge => {
              if (gameStateResponse.gaugeStates[gauge.id] !== undefined) {
                gsm.currentState.themeGauges[gauge.id] = gameStateResponse.gaugeStates[gauge.id];
              }
            });
          }
          
          // 다음 씬으로 이동
          const nextScene = {
            id: gameStateResponse.currentNodeId,
            text: gameStateResponse.nodeText,
            choices: gameStateResponse.choices.map((c, idx) => ({
              id: `choice-${idx}`,
              text: c.text,
              consequence: ''
            }))
          };
          
          gsm.setScene(nextScene);
          saveGameState(gsm.currentState);
        } catch (err) {
          console.error('Failed to make choice:', err);
          alert('선택지 처리에 실패했습니다.');
        }
      } else {
        // 기존 방식 (하드코딩된 소설)
        gsm.processChoice(choice);
        saveGameState(gsm.currentState);
        
        const nextScene = await storyGenerator.generateScene(
          gsm.currentState,
          novelConfig.description,
          choice
        );
        gsm.setScene(nextScene);
      }
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
            <h1 class="game-title">{novelConfig?.title || '게임'}</h1>
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
            {#if novelConfig && novelConfig.themeGauges && novelConfig.themeGauges.length > 0}
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
            {/if}
            
            {#if novelConfig && novelConfig.characters && novelConfig.characters.length > 0}
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
            {/if}
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
    background: hsla(240 12% 10% / 0.9);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border-bottom: 1px solid hsla(0 70% 45% / 0.2);
    box-shadow: 
      0 4px 24px hsla(0 0% 0% / 0.3),
      inset 0 1px 0 hsla(255 255 255 / 0.05);
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
    font-size: 1.375rem;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 80%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
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
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    box-shadow: var(--glow-card);
    gap: 2rem;
    position: relative;
    overflow: hidden;
  }
  
  .loading-screen::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, hsla(0 90% 48% / 0.1), transparent 70%);
    animation: pulse-bg 2s ease-in-out infinite;
  }
  
  @keyframes pulse-bg {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }

  .spinner {
    width: 64px;
    height: 64px;
    border: 5px solid hsl(var(--muted));
    border-top-color: hsl(var(--primary));
    border-right-color: hsl(var(--accent));
    border-radius: 50%;
    animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
    box-shadow: 
      0 0 20px hsla(0 90% 48% / 0.3),
      inset 0 0 10px hsla(0 90% 48% / 0.2);
    position: relative;
    z-index: 1;
  }

  .loading-text {
    font-size: 1.25rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    position: relative;
    z-index: 1;
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 70%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: pulse-text 2s ease-in-out infinite;
  }
  
  @keyframes pulse-text {
    0%, 100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
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
    position: relative;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--glow-card);
    transition: all 0.3s ease;
  }
  
  .sidebar-section::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, hsla(0 90% 48% / 0.05), transparent);
    pointer-events: none;
  }
  
  .sidebar-section:hover {
    border-color: hsl(var(--border-bright));
    box-shadow: var(--glow-card), var(--glow-primary);
  }

  .sidebar-title {
    font-size: 1.125rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.01em;
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

