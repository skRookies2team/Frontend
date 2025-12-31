<script lang="ts">
  import { gsm } from '$lib/stores/game-state-manager.svelte';
  import { bgmManager } from '$lib/stores/bgm-manager.svelte';
  import { novels } from '$lib/data/novel-configs';
  import { storyGenerator } from '$lib/services/story-generator';
  import { characterChat } from '$lib/services/character-chat';
  import { saveGameState, loadGameState, clearGameState, hasSavedGame } from '$lib/utils/storage';
  import { getAccessibleImageUrl } from '$lib/utils/image-url';
  import CharacterPanel from '$lib/components/character-panel.svelte';
  import StoryScene from '$lib/components/story-scene.svelte';
  import EpisodeEnding from '$lib/components/episode-ending.svelte';
  import FinalEnding from '$lib/components/final-ending.svelte';
  import EpisodeIntro from '$lib/components/episode-intro.svelte';
  import BgmControl from '$lib/components/bgm-control.svelte';
  // CharacterDialog 제거 (NPC 설명창 사용 안 함)
  // import CharacterDialog from '$lib/components/character-dialog.svelte';
  import GameMenu from '$lib/components/game-menu.svelte';
  import { Button } from '$lib/components/ui/button';
  import { api, type StoryData } from '$lib/api';
  import type { Character, NovelConfig } from '$lib/types/game-state';
  import type { EpisodeEndingDto, FinalEndingDto, GaugeDto, EndingResponseDto } from '$lib/api/types/backend-types';
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  
  const novelId = $derived($page.params.novel_id);
  let novelConfig = $state<NovelConfig | null>(null);
  let storyData = $state<StoryData | null>(null);
  let useApiGame = $state(false);
  
  let loading = $state(false); // 게임 장면 로딩용
  let chatLoading = $state(false); // NPC 대화 전송 로딩용 (장면에 영향 없음)
  let selectedCharacter = $state<{ character: Character | null; response: string; lastUserMessage?: string }>({ character: null, response: '' });
  let showMenu = $state(false);
  let gameInitialized = $state(false);
  let sessionId = $state<string | null>(null);
  let chatMessage = $state('');
  let chatMessagesContainer: HTMLDivElement;
  
  // 즉각 반응 상태
  let showImmediateReaction = $state(false);
  let immediateReactionText = $state('');
  
  // 엔딩 상태
  let episodeEnding = $state<EpisodeEndingDto | null>(null);
  let finalEnding = $state<FinalEndingDto | null>(null);
  let endingGaugeDefinitions = $state<GaugeDto[]>([]);
  let finalGaugeStates = $state<Record<string, number>>({});
  
  // 에피소드 도입부 상태
  let showEpisodeIntro = $state(false);
  let episodeIntroTitle = $state('');
  let episodeIntroText = $state('');
  let currentEpisodeId = $state<string | null>(null);
  
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
        
        // 선택된 캐릭터 조회 시작 (NPC 대화용) - 병렬로 실행
        const selectedCharactersPromise = api.game.getSelectedCharactersByStoryDataId(storyId).catch(err => {
          console.error('Failed to load selected characters:', err);
          return null; // NPC 로드 실패해도 게임은 계속 진행
        });
        
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
        
        // 선택된 캐릭터 조회 결과 처리 (이미 병렬로 시작됨)
        try {
          const selectedCharactersResponse = await selectedCharactersPromise;
          if (selectedCharactersResponse && selectedCharactersResponse.hasSelection && selectedCharactersResponse.selectedCharacters.length > 0) {
            console.log('선택된 캐릭터 응답:', selectedCharactersResponse);
            
            // CharacterDto를 Character 타입으로 변환
            // 각 캐릭터별 chatCharacterId를 chatId로 사용 (없으면 공통 chatCharacterId 사용)
            const characters: Character[] = selectedCharactersResponse.selectedCharacters.map((char) => {
              // 각 캐릭터별 고유 chatCharacterId가 있으면 사용, 없으면 공통 chatCharacterId 사용
              const chatId = char.chatCharacterId || selectedCharactersResponse.chatCharacterId;
              
              return {
                id: char.name.toLowerCase().replace(/\s+/g, '-'), // UI용 ID
                chatId: chatId, // RAG API용 대화 ID (중요!)
                name: char.name,
                description: char.description || '',
                personality: char.description || '', // description을 personality로도 사용
                knowledgeBase: []
              };
            });
            
            // novelConfig에 캐릭터 추가
            if (novelConfig) {
              novelConfig.characters = characters;
            }
            
            console.log('선택된 NPC 캐릭터 로드 완료:', characters);
            console.log('캐릭터별 chatId:', characters.map(c => ({ name: c.name, chatId: c.chatId })));
          } else {
            console.log('선택된 NPC가 없습니다.');
          }
        } catch (err) {
          console.error('Failed to load selected characters:', err);
          // NPC 로드 실패해도 게임은 계속 진행
        }
        
        // 에피소드 도입부 확인
        console.log('게임 시작 - 도입부 확인:', {
          hasIntroText: !!gameStateResponse.introText,
          introText: gameStateResponse.introText,
          episodeTitle: gameStateResponse.episodeTitle,
          currentEpisodeId: gameStateResponse.currentEpisodeId
        });
        
        if (gameStateResponse.introText && gameStateResponse.introText.trim()) {
          console.log('도입부 표시 설정');
          showEpisodeIntro = true;
          episodeIntroTitle = gameStateResponse.episodeTitle || '에피소드 시작';
          episodeIntroText = gameStateResponse.introText;
          currentEpisodeId = gameStateResponse.currentEpisodeId;
        } else {
          console.log('도입부 텍스트가 없어서 표시하지 않음');
        }
        
        // API에서 받은 게임 상태를 씬으로 변환
        const apiScene = {
          id: gameStateResponse.currentNodeId,
          story: gameStateResponse.nodeText,
          imageUrl: gameStateResponse.nodeImage?.imageUrl
            ? getAccessibleImageUrl(gameStateResponse.nodeImage.imageUrl, gameStateResponse.nodeImage.fileKey)
            : undefined,
          choices: gameStateResponse.choices.map((c, idx) => ({
            id: `choice-${idx}`,
            text: c.text,
            consequence: '',
            immediateReaction: c.immediateReaction
          }))
        };
        
        gsm.setScene(apiScene);
        useApiGame = true;
        gameInitialized = true;

        // BGM 재생
        if (gameStateResponse.bgm && gameStateResponse.currentEpisodeId) {
          bgmManager.play(gameStateResponse.bgm, gameStateResponse.currentEpisodeId);
        }
      } catch (err) {
        console.error('Failed to load story from API:', err);
        alert('게임을 불러오는데 실패했습니다.');
        window.location.href = '/';
        return;
      }
    }
    
    loading = false;
  });

  // 페이지 떠날 때 BGM 정리
  onDestroy(() => {
    bgmManager.stop();
    console.log('[Play] 페이지를 떠나면서 BGM 중지');
  });

  async function handleChoiceSelect(choiceId: string) {
    if (!gameState.currentScene || !novelConfig) return;
    
    const choice = gameState.currentScene.choices.find((c: any) => c.id === choiceId);
    
    if (choice) {
      if (useApiGame && sessionId) {
        // API 게임 사용 시
        try {
          // 특수 선택지 처리 (에피소드 계속하기, 재시작 등)
          if (choiceId === 'continue') {
            // 다음 에피소드로 계속하기
            episodeEnding = null; // 엔딩 화면 닫기
            try {
              const gameStateResponse = await api.game.getGameState(sessionId);
              
              // 다음 에피소드 도입부 확인
              if (gameStateResponse.introText && gameStateResponse.introText.trim() && 
                  gameStateResponse.currentEpisodeId !== currentEpisodeId) {
                showEpisodeIntro = true;
                episodeIntroTitle = gameStateResponse.episodeTitle || '에피소드 시작';
                episodeIntroText = gameStateResponse.introText;
                currentEpisodeId = gameStateResponse.currentEpisodeId;
              }
              
              // 다음 에피소드의 첫 노드로 이동
              const nextScene = {
                id: gameStateResponse.currentNodeId,
                story: gameStateResponse.nodeText,
                imageUrl: gameStateResponse.nodeImage?.imageUrl
                  ? getAccessibleImageUrl(gameStateResponse.nodeImage.imageUrl, gameStateResponse.nodeImage.fileKey)
                  : undefined,
                choices: gameStateResponse.choices.map((c, idx) => ({
                  id: `choice-${idx}`,
                  text: c.text,
                  consequence: '',
                  immediateReaction: c.immediateReaction
                }))
              };
              
              // 게이지 상태 업데이트
              if (novelConfig && novelConfig.themeGauges) {
                novelConfig.themeGauges.forEach(gauge => {
                  if (gameStateResponse.gaugeStates[gauge.id] !== undefined) {
                    gsm.currentState.themeGauges[gauge.id] = gameStateResponse.gaugeStates[gauge.id];
                  }
                });
              }

              gsm.setScene(nextScene);

              // BGM 재생 (새 에피소드)
              if (gameStateResponse.bgm && gameStateResponse.currentEpisodeId) {
                bgmManager.play(gameStateResponse.bgm, gameStateResponse.currentEpisodeId);
              }
              saveGameState(gsm.currentState);
              loading = false;
              return;
            } catch (err) {
              console.error('Failed to continue to next episode:', err);
              alert('다음 에피소드로 이동하는데 실패했습니다.');
              loading = false;
              return;
            }
          }
          
          if (choiceId === 'restart') {
            // 게임 재시작
            if (confirm('정말로 처음부터 다시 시작하시겠습니까?')) {
              clearGameState();
              window.location.reload();
            }
            loading = false;
            return;
          }
          
          const choiceIndex = parseInt(choiceId.replace('choice-', ''));
          if (isNaN(choiceIndex)) {
            console.error('Invalid choice index:', choiceId);
            loading = false;
            return;
          }
          
          // 즉각 반응이 있으면 표시
          const selectedChoice = gameState.currentScene.choices[choiceIndex];
          console.log('선택된 선택지:', selectedChoice);
          console.log('immediateReaction:', (selectedChoice as any)?.immediateReaction);
          
          if (selectedChoice && (selectedChoice as any).immediateReaction) {
            console.log('즉각 반응 표시:', (selectedChoice as any).immediateReaction);
            immediateReactionText = (selectedChoice as any).immediateReaction;
            showImmediateReaction = true;
            
            // 2초 동안 표시 후 자동으로 사라짐
            setTimeout(() => {
              showImmediateReaction = false;
            }, 2000);
          } else {
            console.log('즉각 반응 없음 또는 선택지 없음');
          }
          
          loading = true;
          const gameStateResponse = await api.game.makeChoice(sessionId, choiceIndex);
          
          // 게이지 상태 업데이트
          if (novelConfig && novelConfig.themeGauges) {
            novelConfig.themeGauges.forEach(gauge => {
              if (gameStateResponse.gaugeStates[gauge.id] !== undefined) {
                gsm.currentState.themeGauges[gauge.id] = gameStateResponse.gaugeStates[gauge.id];
              }
            });
          }
          
          // 에피소드 종료 확인 및 엔딩 처리
          if (gameStateResponse.isEpisodeEnd && !gameStateResponse.isGameEnd && sessionId) {
            console.log('에피소드 종료 감지:', {
              isEpisodeEnd: gameStateResponse.isEpisodeEnd,
              isGameEnd: gameStateResponse.isGameEnd,
              episodeEndingInResponse: gameStateResponse.episodeEnding
            });
            
            // 먼저 makeChoice 응답에 episodeEnding이 있는지 확인
            if (gameStateResponse.episodeEnding) {
              console.log('makeChoice 응답에서 episodeEnding 발견:', gameStateResponse.episodeEnding);
              episodeEnding = gameStateResponse.episodeEnding;
              endingGaugeDefinitions = gameStateResponse.gaugeDefinitions || [];
              saveGameState(gsm.currentState);
              loading = false;
              return;
            }
            
            // 없으면 getEnding API 호출
            try {
              console.log('getEnding API 호출 중...');
              const endingResponse = await api.game.getEnding(sessionId);
              console.log('getEnding 응답:', endingResponse);
              
              // 엔딩 정보 저장 및 표시
              if (endingResponse.episodeEnding) {
                console.log('getEnding에서 episodeEnding 발견:', endingResponse.episodeEnding);
                episodeEnding = endingResponse.episodeEnding;
                endingGaugeDefinitions = endingResponse.gaugeDefinitions || gameStateResponse.gaugeDefinitions || [];
                saveGameState(gsm.currentState);
                loading = false;
                return;
              } else {
                console.warn('getEnding 응답에 episodeEnding이 없음:', endingResponse);
              }
            } catch (err) {
              console.error('Failed to get episode ending:', err);
              // 엔딩 호출 실패 시에도 계속 진행
            }
          }
          
          // 게임 종료 확인
          if (gameStateResponse.isGameEnd && sessionId) {
            console.log('게임 종료 감지:', {
              isGameEnd: gameStateResponse.isGameEnd,
              finalEndingInResponse: gameStateResponse.finalEnding
            });
            
            // 먼저 makeChoice 응답에 finalEnding이 있는지 확인
            if (gameStateResponse.finalEnding) {
              console.log('makeChoice 응답에서 finalEnding 발견:', gameStateResponse.finalEnding);
              finalEnding = gameStateResponse.finalEnding;
              endingGaugeDefinitions = gameStateResponse.gaugeDefinitions || [];
              finalGaugeStates = gameStateResponse.gaugeStates || {};
              saveGameState(gsm.currentState);
              loading = false;
              return;
            }
            
            // 없으면 getEnding API 호출
            try {
              console.log('getEnding API 호출 중 (최종 엔딩)...');
              const endingResponse = await api.game.getEnding(sessionId);
              console.log('getEnding 응답 (최종 엔딩):', endingResponse);
              
              // 최종 엔딩 정보 저장 및 표시
              if (endingResponse.finalEnding) {
                console.log('getEnding에서 finalEnding 발견:', endingResponse.finalEnding);
                finalEnding = endingResponse.finalEnding;
                endingGaugeDefinitions = endingResponse.gaugeDefinitions || gameStateResponse.gaugeDefinitions || [];
                finalGaugeStates = endingResponse.finalGaugeStates || gameStateResponse.gaugeStates || {};
                saveGameState(gsm.currentState);
                loading = false;
                return;
              } else {
                console.warn('getEnding 응답에 finalEnding이 없음:', endingResponse);
              }
            } catch (err) {
              console.error('Failed to get final ending:', err);
              // 엔딩 호출 실패 시에도 계속 진행
            }
          }
          
          // 다음 씬으로 이동
          const nextScene = {
            id: gameStateResponse.currentNodeId,
            story: gameStateResponse.nodeText,
            imageUrl: gameStateResponse.nodeImage?.imageUrl
              ? getAccessibleImageUrl(gameStateResponse.nodeImage.imageUrl, gameStateResponse.nodeImage.fileKey)
              : undefined,
            choices: gameStateResponse.choices.map((c, idx) => ({
              id: `choice-${idx}`,
              text: c.text,
              consequence: '',
              immediateReaction: c.immediateReaction
            }))
          };

          gsm.setScene(nextScene);

          // BGM 재생 (같은 에피소드 내에서는 계속 재생)
          if (gameStateResponse.bgm && gameStateResponse.currentEpisodeId) {
            bgmManager.play(gameStateResponse.bgm, gameStateResponse.currentEpisodeId);
          }
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
  
  function handleNpcSelect(character: Character) {
    if (selectedCharacter.character?.id === character.id) {
      // 같은 NPC를 다시 클릭하면 닫기
      selectedCharacter.character = null;
      selectedCharacter.response = '';
      selectedCharacter.lastUserMessage = undefined;
      chatMessage = '';
    } else {
      // 다른 NPC 선택
      selectedCharacter.character = character;
      selectedCharacter.response = '';
      selectedCharacter.lastUserMessage = undefined;
      chatMessage = '';
    }
  }
  
  async function handleSendMessage() {
    if (!chatMessage.trim() || !selectedCharacter.character || chatLoading) return;
    
    const message = chatMessage.trim();
    const userMessage = message;
    chatMessage = '';
    chatLoading = true;
    
    try {
      // 사용자 메시지 저장
      selectedCharacter.lastUserMessage = userMessage;
      
      // NPC 응답 받기 (히스토리는 백엔드에서 관리하므로 전달하지 않음)
      const responseText = await characterChat.getCharacterResponse(
        selectedCharacter.character,
        gsm.currentState,
        userMessage
      );
      
      console.log('[DEBUG] RAG 서버 응답 받음:', responseText);
      
      // NPC 응답 저장 (직접 속성 변경으로 반응성 보장)
      selectedCharacter.response = responseText;
      
      console.log('[DEBUG] selectedCharacter 업데이트 완료:', selectedCharacter);
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('메시지 전송에 실패했습니다.');
      // 에러 발생 시 사용자 메시지도 롤백
      selectedCharacter.lastUserMessage = undefined;
    } finally {
      chatLoading = false;
    }
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
            {:else if finalEnding}
              <FinalEnding 
                ending={finalEnding}
                gaugeDefinitions={endingGaugeDefinitions}
                finalGaugeStates={finalGaugeStates}
                onRestart={() => {
                  if (confirm('정말로 처음부터 다시 시작하시겠습니까?')) {
                    clearGameState();
                    window.location.reload();
                  }
                }}
              />
            {:else if episodeEnding}
              <EpisodeEnding 
                ending={episodeEnding}
                gaugeDefinitions={endingGaugeDefinitions}
                onContinue={async () => {
                  episodeEnding = null;
                  try {
                    const gameStateResponse = await api.game.getGameState(sessionId!);
                    
                    // 다음 에피소드 도입부 확인
                    if (gameStateResponse.introText && gameStateResponse.introText.trim() && 
                        gameStateResponse.currentEpisodeId !== currentEpisodeId) {
                      showEpisodeIntro = true;
                      episodeIntroTitle = gameStateResponse.episodeTitle || '에피소드 시작';
                      episodeIntroText = gameStateResponse.introText;
                      currentEpisodeId = gameStateResponse.currentEpisodeId;
                    }
                    
                    const nextScene = {
                      id: gameStateResponse.currentNodeId,
                      story: gameStateResponse.nodeText,
                      imageUrl: gameStateResponse.nodeImage?.imageUrl
                        ? getAccessibleImageUrl(gameStateResponse.nodeImage.imageUrl, gameStateResponse.nodeImage.fileKey)
                        : undefined,
                      choices: gameStateResponse.choices.map((c, idx) => ({
                        id: `choice-${idx}`,
                        text: c.text,
                        consequence: '',
                        immediateReaction: c.immediateReaction
                      }))
                    };
                    
                    if (novelConfig && novelConfig.themeGauges) {
                      novelConfig.themeGauges.forEach(gauge => {
                        if (gameStateResponse.gaugeStates[gauge.id] !== undefined) {
                          gsm.currentState.themeGauges[gauge.id] = gameStateResponse.gaugeStates[gauge.id];
                        }
                      });
                    }

                    gsm.setScene(nextScene);

                    // BGM 재생 (같은 에피소드 내에서는 계속 재생)
                    if (gameStateResponse.bgm && gameStateResponse.currentEpisodeId) {
                      bgmManager.play(gameStateResponse.bgm, gameStateResponse.currentEpisodeId);
                    }
                    saveGameState(gsm.currentState);
                  } catch (err) {
                    console.error('Failed to continue to next episode:', err);
                    alert('다음 에피소드로 이동하는데 실패했습니다.');
                  }
                }}
              />
            {:else if gameState.currentScene}
              <StoryScene 
                scene={gameState.currentScene}
                onChoiceSelect={handleChoiceSelect}
              />
            {/if}
          </div>
          
          {#if showEpisodeIntro}
            <EpisodeIntro 
              episodeTitle={episodeIntroTitle}
              introText={episodeIntroText}
              onStart={() => {
                console.log('도입부 시작 버튼 클릭');
                showEpisodeIntro = false;
              }}
            />
          {/if}
          
          {#if showImmediateReaction}
            <div class="immediate-reaction-overlay">
              <div class="immediate-reaction-card">
                <div class="reaction-icon">💬</div>
                <p class="reaction-text">{immediateReactionText}</p>
              </div>
            </div>
          {/if}
          
          <aside class="game-sidebar">
            <div class="sidebar-section npc-chat-section">
              <h2 class="sidebar-title">NPC 대화</h2>
              <p class="sidebar-hint">
                NPC를 선택하여 대화하세요
              </p>
              
              <!-- NPC 선택 목록 -->
              {#if novelConfig && novelConfig.characters && novelConfig.characters.length > 0}
                <div class="characters-list">
                  {#each novelConfig.characters as character}
                    <button 
                      class="character-btn" 
                      type="button"
                      class:active={selectedCharacter.character?.id === character.id}
                      onclick={() => handleNpcSelect(character)}
                      aria-label={`${character.name} 선택`}
                    >
                      <CharacterPanel {character} />
                    </button>
                  {/each}
                </div>
              {:else}
                <div class="characters-list">
                  <div class="no-npc-hint">
                    <p>현재 사용 가능한 NPC가 없습니다</p>
                  </div>
                </div>
              {/if}
              
              <!-- 대화 인터페이스 -->
              <div class="chat-interface">
                {#if selectedCharacter.character}
                  <div class="chat-header">
                    <div class="chat-character-info">
                      <div class="chat-avatar">
                        {selectedCharacter.character.name.charAt(0)}
                      </div>
                      <div>
                        <h3 class="chat-character-name">{selectedCharacter.character.name}</h3>
                        <p class="chat-character-desc">{selectedCharacter.character.description || 'NPC'}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      class="chat-close-btn"
                      onclick={() => {
                        selectedCharacter.character = null;
                        selectedCharacter.response = '';
                        selectedCharacter.lastUserMessage = undefined;
                      }}
                      aria-label="대화 닫기"
                    >
                      ✕
                    </button>
                  </div>
                {:else}
                  <div class="chat-header">
                    <div class="chat-character-info">
                      <div class="chat-avatar">💬</div>
                      <div>
                        <h3 class="chat-character-name">NPC 대화</h3>
                        <p class="chat-character-desc">NPC를 선택하여 대화를 시작하세요</p>
                      </div>
                    </div>
                  </div>
                {/if}
                
                <!-- 대화 메시지 영역 -->
                <div class="chat-messages" bind:this={chatMessagesContainer}>
                  {#if selectedCharacter.character}
                    <!-- 첫 인사말 -->
                    {#if !selectedCharacter.lastUserMessage && !selectedCharacter.response}
                      <div class="chat-message npc-message">
                        <div class="message-avatar">{selectedCharacter.character.name.charAt(0)}</div>
                        <div class="message-content">
                          <p>안녕하세요! 무엇을 도와드릴까요?</p>
                        </div>
                      </div>
                    {/if}
                    
                    <!-- 사용자 메시지 표시 -->
                    {#if selectedCharacter.lastUserMessage}
                      <div class="chat-message user-message">
                        <div class="message-content">
                          <p>{selectedCharacter.lastUserMessage}</p>
                        </div>
                        <div class="message-avatar">나</div>
                      </div>
                    {/if}
                    
                    <!-- NPC 응답 표시 -->
                    {#if selectedCharacter.response}
                      <div class="chat-message npc-message">
                        <div class="message-avatar">{selectedCharacter.character.name.charAt(0)}</div>
                        <div class="message-content">
                          <p>{selectedCharacter.response}</p>
                        </div>
                      </div>
                    {/if}
                  {:else}
                    <div class="chat-empty-state-inline">
                      <div class="empty-icon">💬</div>
                      <p class="empty-text">NPC를 선택하여 대화를 시작하세요</p>
                    </div>
                  {/if}
                </div>
                
                <!-- 메시지 입력 영역 - 항상 표시 -->
                <div class="chat-input-area">
                  <div class="chat-input-wrapper">
                    <textarea
                      class="chat-input"
                      placeholder={selectedCharacter.character ? "메시지를 입력하세요..." : "먼저 NPC를 선택하세요"}
                      rows="2"
                      bind:value={chatMessage}
                      disabled={!selectedCharacter.character}
                      onkeydown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && selectedCharacter.character) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    ></textarea>
                    <button
                      type="button"
                      class="chat-send-btn"
                      onclick={handleSendMessage}
                      disabled={!chatMessage.trim() || chatLoading || !selectedCharacter.character}
                      aria-label="메시지 전송"
                    >
                      {#if chatLoading}
                        <div class="spinner-small"></div>
                      {:else}
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2 10l16-8-8 16-2-6-6-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      {/if}
                    </button>
                  </div>
                  <p class="chat-hint">Enter로 전송, Shift+Enter로 줄바꿈</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
  
  <!-- CharacterDialog 제거 (NPC 설명창 사용 안 함) -->
  <!--
  {#if selectedCharacter.character}
    <CharacterDialog
      character={selectedCharacter.character}
      response={selectedCharacter.response}
      onClose={() => {
        selectedCharacter.character = null;
        selectedCharacter.response = '';
        selectedCharacter.lastUserMessage = undefined;
      }}
    />
  {/if}
  -->
  
  {#if showMenu}
    <GameMenu
      onClose={() => showMenu = false}
      onSave={handleSave}
      onRestart={handleRestart}
    />
  {/if}

  <!-- BGM 컨트롤 (우측 하단 고정) -->
  {#if gameInitialized && bgmManager.currentBgm}
    <div class="bgm-control-container">
      <BgmControl />
    </div>
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
    grid-template-columns: auto 1fr auto;
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
  
  .character-btn.active {
    border-color: hsl(var(--primary));
    background: hsl(var(--primary) / 0.1);
  }

  /* NPC 대화 인터페이스 */
  .npc-chat-section {
    min-height: 600px;
    display: flex;
    flex-direction: column;
  }

  .chat-interface {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    height: 500px;
    border: 2px solid hsl(0 0% 30%);
    border-radius: var(--radius-md);
    background: hsl(0 0% 8%);
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid hsl(0 0% 30%);
    background: hsl(0 0% 12%);
  }

  .chat-character-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .chat-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: hsl(var(--primary));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .chat-character-name {
    font-size: 0.9375rem;
    font-weight: 700;
    color: hsl(0 0% 95%);
    margin: 0 0 0.25rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chat-character-desc {
    font-size: 0.75rem;
    color: hsl(0 0% 70%);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chat-close-btn {
    padding: 0.5rem;
    background: none;
    border: none;
    color: hsl(0 0% 70%);
    cursor: pointer;
    font-size: 1.25rem;
    line-height: 1;
    transition: color 0.2s;
    flex-shrink: 0;
  }

  .chat-close-btn:hover {
    color: hsl(0 0% 95%);
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: hsl(0 0% 6%);
  }

  .chat-messages::-webkit-scrollbar {
    width: 8px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: hsl(0 0% 10%);
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: hsl(0 0% 40%);
    border-radius: 4px;
  }

  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: hsl(0 0% 50%);
  }

  .chat-message {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    max-width: 85%;
  }

  .chat-message.npc-message {
    align-self: flex-start;
  }

  .chat-message.user-message {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .message-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: hsl(var(--primary));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .user-message .message-avatar {
    background: hsl(var(--muted));
    color: hsl(var(--foreground));
  }

  .message-content {
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    background: hsl(0 0% 15%);
    border: 1px solid hsl(0 0% 25%);
  }

  .user-message .message-content {
    background: hsl(0 90% 20%);
    border-color: hsl(0 90% 35%);
  }

  .message-content p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    color: hsl(0 0% 95%);
    word-wrap: break-word;
  }

  .chat-input-area {
    padding: 1rem;
    border-top: 1px solid hsl(0 0% 30%);
    background: hsl(0 0% 10%);
  }

  .chat-input-wrapper {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
  }

  .chat-input {
    flex: 1;
    padding: 0.75rem;
    background: hsl(0 0% 12%);
    border: 2px solid hsl(0 0% 30%);
    border-radius: var(--radius-md);
    color: hsl(0 0% 95%);
    font-size: 0.875rem;
    font-family: inherit;
    resize: none;
    min-height: 2.5rem;
    max-height: 6rem;
    transition: all 0.2s;
  }

  .chat-input::placeholder {
    color: hsl(0 0% 50%);
  }

  .chat-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: hsl(0 0% 8%);
  }

  .chat-input:focus:not(:disabled) {
    outline: none;
    border-color: hsl(0 90% 50%);
    box-shadow: 0 0 0 3px hsl(0 90% 50% / 0.2);
    background: hsl(0 0% 15%);
  }

  .chat-send-btn {
    padding: 0.75rem;
    background: hsl(var(--primary));
    border: none;
    border-radius: var(--radius-md);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
    min-width: 2.5rem;
    height: 2.5rem;
  }

  .chat-send-btn:hover:not(:disabled) {
    background: hsl(var(--primary) / 0.9);
    transform: scale(1.05);
  }

  .chat-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinner-small {
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  .chat-hint {
    margin: 0.5rem 0 0 0;
    font-size: 0.75rem;
    color: hsl(0 0% 60%);
    text-align: center;
  }

  .chat-empty-state-inline {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    height: 100%;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.6;
  }

  .empty-text {
    font-size: 0.875rem;
    color: hsl(0 0% 65%);
    margin: 0;
  }

  .no-npc-hint {
    padding: 1.5rem;
    text-align: center;
    border: 1px dashed hsl(0 0% 30%);
    border-radius: var(--radius-md);
    background: hsl(0 0% 10%);
  }

  .no-npc-hint p {
    margin: 0;
    font-size: 0.875rem;
    color: hsl(0 0% 65%);
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

  }
  
  /* 즉각 반응 슬라이드 */
  .immediate-reaction-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 100;
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .immediate-reaction-card {
    max-width: 600px;
    width: 90%;
    padding: 2.5rem 2rem;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 2px solid hsl(var(--primary));
    border-radius: var(--radius-xl);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.8),
      0 0 0 1px hsl(var(--primary) / 0.3),
      inset 0 0 20px hsl(var(--primary) / 0.1);
    text-align: center;
    animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }
  
  .immediate-reaction-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes shimmer {
    to { left: 100%; }
  }
  
  .reaction-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: bounce 0.6s ease-out;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .reaction-text {
    font-size: 1.375rem;
    font-weight: 600;
    line-height: 1.6;
    color: hsl(var(--foreground));
    margin: 0;
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 85%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    z-index: 1;
  }

  /* BGM 컨트롤 */
  .bgm-control-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 50;
    animation: slideInFromBottom 0.5s ease;
  }

  @keyframes slideInFromBottom {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .bgm-control-container {
      bottom: 1rem;
      right: 1rem;
      left: 1rem;
    }
  }
</style>

