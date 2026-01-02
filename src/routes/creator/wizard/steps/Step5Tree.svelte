<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import StoryTree from '$lib/components/story-tree.svelte';
  import NodeEditor from '$lib/components/node-editor.svelte';
  import type { TreeNode } from '../wizard-store.svelte';

  export let treeEditMode = false;
  export let storyId = '';
  export let currentEpisodeTree: TreeNode | null = null;
  export let selectedNode: TreeNode | null = null;
  export let regenerating = false;
  export let currentEpisodeTitle = '';
  export let currentEpisode = 1;
  export let actualTotalEpisodes = 0;
  export let generating = false;
  export let progressMessage = '';
  export let totalEpisodesGenerated = 0;
  export let numEpisodes = 0;
  export let error = '';
  export let maxDepth = 3;
  export let onSelectNode: (e: CustomEvent<{ node: TreeNode }>) => void;
  export let onApplyChanges: (e: CustomEvent<{ nodeId: string; newText: string; newChoices: Array<{ text: string; tags: string[] }>; newImagePrompt?: string; newImageUrl?: string; }>) => void;
  export let onCancelSelect: () => void;
  export let onGenerateNextEpisodeFromTree: () => void;
  export let onBackToSettings: () => void;
</script>

<div class="step5-container">
  {#if treeEditMode}
    <!-- 트리 편집 모드 -->
    <div class="tree-edit-mode">
      <!-- 헤더 -->
      <div class="edit-header">
        <div class="header-left">
          <div class="step-badge">
            <span class="step-icon">🌳</span>
            <span class="step-text">5단계</span>
          </div>
          <div class="header-info">
            <h2 class="header-title">에피소드 트리 편집</h2>
            <p class="header-desc">
              스토리 분기를 검토하고 필요하면 수정하세요
            </p>
          </div>
        </div>
        <div class="header-right">
          <div class="episode-indicator">
            <span class="episode-label">에피소드</span>
            <span class="episode-current">{currentEpisode}</span>
            <span class="episode-divider">/</span>
            <span class="episode-total">{actualTotalEpisodes}</span>
          </div>
        </div>
      </div>

      {#if currentEpisodeTree}
        <!-- 메인 편집 영역 -->
        <div class="edit-main">
          <!-- 트리 시각화 -->
          <div class="tree-panel">
            <div class="panel-header">
              <div class="panel-title-group">
                <span class="panel-icon">📊</span>
                <span class="panel-title">스토리 트리</span>
              </div>
              <div class="panel-actions">
                <span class="tree-stats">
                  {#if currentEpisodeTitle}
                    📖 {currentEpisodeTitle}
                  {/if}
                </span>
              </div>
            </div>
            <div class="tree-viewport">
              <StoryTree 
                rootNode={currentEpisodeTree}
                selectedNodeId={selectedNode?.id || ''}
                maxDepth={maxDepth}
                episodeTitle=""
                onselectnode={onSelectNode}
              />
            </div>
          </div>

          <!-- 노드 편집기 -->
          <div class="editor-panel">
            <NodeEditor 
              storyId={storyId}
              node={selectedNode}
              isLoading={regenerating}
              episodeTitle={currentEpisodeTitle}
              episodeOrder={currentEpisode}
              onapplychanges={onApplyChanges}
              oncancel={onCancelSelect}
            />
          </div>
        </div>

        <!-- 하단 액션 바 -->
        <div class="edit-footer">
          <div class="footer-left">
            <div class="hint-card">
              <span class="hint-icon">💡</span>
              <div class="hint-content">
                <strong>사용법</strong>
                <span>노드 클릭 → 내용 수정 → 적용 버튼</span>
              </div>
            </div>
          </div>
          <div class="footer-right">
            <Button 
              variant="outline"
              onclick={onBackToSettings}
              disabled={generating || regenerating}
            >
              ← 설정으로
            </Button>
            <Button 
              onclick={() => { 
                if (confirm('현재 에피소드를 확정하고 다음으로 진행하시겠습니까?')) {
                  onGenerateNextEpisodeFromTree();
                }
              }}
              disabled={generating || regenerating}
            >
              {#if currentEpisode >= actualTotalEpisodes}
                <span class="btn-icon">✅</span> 완료하기
              {:else}
                <span class="btn-icon">⏭️</span> 다음 에피소드
              {/if}
            </Button>
          </div>
        </div>
      {:else}
        <!-- 트리 데이터 없음 -->
        <div class="empty-state">
          <div class="empty-visual">
            <div class="empty-icon-wrapper">
              <span class="empty-icon">⚠️</span>
            </div>
            <div class="empty-rings"></div>
          </div>
          <h3 class="empty-title">트리 데이터를 불러올 수 없습니다</h3>
          <p class="empty-desc">
            에피소드가 생성되었지만 트리 구조를 불러오지 못했습니다.
          </p>
          <div class="empty-actions">
            <Button 
              onclick={() => { 
                if (confirm('현재 에피소드를 건너뛰고 다음을 생성하시겠습니까?')) {
                  onGenerateNextEpisodeFromTree();
                }
              }}
              disabled={generating || regenerating}
            >
              <span class="btn-icon">⏭️</span> 다음 에피소드
            </Button>
            <Button 
              variant="outline"
              onclick={onBackToSettings}
            >
              ← 설정으로 돌아가기
            </Button>
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <!-- 생성 중 상태 -->
    <div class="generating-mode">
      <div class="gen-visual">
        <!-- 중앙 애니메이션 -->
        <div class="gen-animation">
          <div class="gen-core">
            <span class="gen-emoji">🚀</span>
          </div>
          <div class="gen-orbit orbit-1"></div>
          <div class="gen-orbit orbit-2"></div>
          <div class="gen-orbit orbit-3"></div>
          <div class="gen-particles">
            {#each Array(8) as _, i}
              <div class="particle" style="--delay: {i * 0.15}s; --angle: {i * 45}deg"></div>
            {/each}
          </div>
        </div>
        
        <!-- 상태 텍스트 -->
        <div class="gen-status">
          <h2 class="gen-title">
            AI가 스토리를 생성하고 있습니다
            <span class="gen-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
          </h2>
          <p class="gen-subtitle">에피소드 {currentEpisode} 생성 중</p>
        </div>
      </div>

      <!-- 진행 상태 카드 -->
      <div class="gen-progress-card">
        <div class="progress-header">
          <span class="progress-label">전체 진행률</span>
          <span class="progress-value">{currentEpisode} / {actualTotalEpisodes || numEpisodes}</span>
        </div>
        
        <div class="progress-bar-container">
          <div 
            class="progress-bar-fill" 
            style="width: {((currentEpisode - 1) / (actualTotalEpisodes || numEpisodes)) * 100}%"
          ></div>
          <div 
            class="progress-bar-active" 
            style="left: {((currentEpisode - 1) / (actualTotalEpisodes || numEpisodes)) * 100}%"
          ></div>
        </div>

        {#if progressMessage}
          <p class="progress-message">{progressMessage}</p>
        {/if}

        <!-- 에피소드 상태 표시 -->
        <div class="episode-grid">
          {#each Array(actualTotalEpisodes || numEpisodes) as _, i}
            <div 
              class="episode-dot"
              class:completed={i < totalEpisodesGenerated}
              class:active={i === totalEpisodesGenerated && generating}
              class:pending={i > totalEpisodesGenerated}
            >
              {#if i < totalEpisodesGenerated}
                <span class="dot-icon">✓</span>
              {:else if i === totalEpisodesGenerated && generating}
                <span class="dot-spinner"></span>
              {:else}
                <span class="dot-number">{i + 1}</span>
              {/if}
            </div>
          {/each}
        </div>

        <p class="progress-hint">
          <span class="hint-icon">⏱️</span>
          예상 소요 시간: 약 1-2분
        </p>
      </div>
    </div>
  {/if}
  
  {#if error}
    <div class="error-toast">
      <span class="error-icon">❌</span>
      <span class="error-text">{error}</span>
    </div>
  {/if}
</div>

<style>
  .step5-container {
    position: relative;
    min-height: 600px;
  }

  /* === 트리 편집 모드 === */
  .tree-edit-mode {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .edit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    background: linear-gradient(135deg, 
      hsl(var(--card)) 0%, 
      hsl(var(--muted) / 0.3) 100%);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .step-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
    border-radius: var(--radius-full);
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
    box-shadow: 0 4px 12px hsl(var(--primary) / 0.4);
  }

  .step-icon {
    font-size: 1.25rem;
  }

  .header-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .header-title {
    font-size: 1.375rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0;
  }

  .header-desc {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .episode-indicator {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    padding: 0.75rem 1.25rem;
    background: hsl(var(--muted) / 0.5);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
  }

  .episode-label {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    margin-right: 0.5rem;
  }

  .episode-current {
    font-size: 1.75rem;
    font-weight: 800;
    color: hsl(var(--primary));
  }

  .episode-divider {
    font-size: 1.25rem;
    color: hsl(var(--muted-foreground));
    margin: 0 0.25rem;
  }

  .episode-total {
    font-size: 1.25rem;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
  }

  /* 메인 편집 영역 */
  .edit-main {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 1.5rem;
    min-height: 500px;
  }

  .tree-panel {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 500px;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    background: linear-gradient(135deg, 
      hsl(var(--muted) / 0.4) 0%, 
      hsl(var(--muted) / 0.2) 100%);
    border-bottom: 1px solid hsl(var(--border));
  }

  .panel-title-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .panel-icon {
    font-size: 1.25rem;
  }

  .panel-title {
    font-weight: 700;
    font-size: 1rem;
    color: hsl(var(--foreground));
  }

  .tree-stats {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .tree-viewport {
    flex: 1;
    overflow: scroll; /* 항상 스크롤바 표시 */
    padding: 0;
    min-height: 450px;
    max-height: 60vh;
    background: hsl(var(--muted) / 0.1);
    position: relative;
  }
  
  /* 트리 뷰포트 스크롤바 */
  .tree-viewport::-webkit-scrollbar {
    width: 14px;
    height: 14px;
    display: block;
  }
  
  .tree-viewport::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.3);
    border-radius: 7px;
  }
  
  .tree-viewport::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.6));
    border-radius: 7px;
    border: 3px solid hsl(var(--muted) / 0.3);
  }
  
  .tree-viewport::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary));
  }
  
  .tree-viewport::-webkit-scrollbar-corner {
    background: hsl(var(--muted) / 0.3);
  }

  .editor-panel {
    min-height: 400px;
  }

  /* 하단 액션 바 */
  .edit-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
  }

  .hint-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
  }

  .hint-icon {
    font-size: 1.25rem;
  }

  .hint-content {
    display: flex;
    flex-direction: column;
    font-size: 0.875rem;
  }

  .hint-content strong {
    color: hsl(var(--foreground));
    font-weight: 600;
  }

  .hint-content span {
    color: hsl(var(--muted-foreground));
  }

  .footer-right {
    display: flex;
    gap: 0.75rem;
  }

  .btn-icon {
    margin-right: 0.25rem;
  }

  /* === 생성 중 상태 === */
  .generating-mode {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 600px;
    padding: 3rem;
    gap: 3rem;
  }

  .gen-visual {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .gen-animation {
    position: relative;
    width: 180px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .gen-core {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
      0 0 40px hsl(var(--primary) / 0.5),
      0 0 80px hsl(var(--primary) / 0.3),
      inset 0 0 20px hsl(var(--primary) / 0.5);
    animation: core-pulse 2s ease-in-out infinite;
    z-index: 10;
  }

  .gen-emoji {
    font-size: 2.5rem;
    animation: emoji-bounce 2s ease-in-out infinite;
  }

  @keyframes core-pulse {
    0%, 100% { 
      transform: scale(1); 
      box-shadow: 
        0 0 40px hsl(var(--primary) / 0.5),
        0 0 80px hsl(var(--primary) / 0.3);
    }
    50% { 
      transform: scale(1.1); 
      box-shadow: 
        0 0 60px hsl(var(--primary) / 0.6),
        0 0 100px hsl(var(--primary) / 0.4);
    }
  }

  @keyframes emoji-bounce {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-5px) rotate(-5deg); }
    75% { transform: translateY(5px) rotate(5deg); }
  }

  .gen-orbit {
    position: absolute;
    border: 2px solid transparent;
    border-radius: 50%;
    animation: orbit-spin 3s linear infinite;
  }

  .orbit-1 {
    width: 120px;
    height: 120px;
    border-top-color: hsl(var(--primary) / 0.6);
    border-right-color: hsl(var(--primary) / 0.3);
    animation-duration: 2s;
  }

  .orbit-2 {
    width: 150px;
    height: 150px;
    border-bottom-color: hsl(200 70% 50% / 0.5);
    border-left-color: hsl(200 70% 50% / 0.2);
    animation-duration: 3s;
    animation-direction: reverse;
  }

  .orbit-3 {
    width: 180px;
    height: 180px;
    border-top-color: hsl(45 80% 50% / 0.4);
    border-right-color: hsl(45 80% 50% / 0.2);
    animation-duration: 4s;
  }

  @keyframes orbit-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .gen-particles {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .particle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: hsl(var(--primary));
    border-radius: 50%;
    top: 50%;
    left: 50%;
    opacity: 0;
    animation: particle-burst 2s ease-out infinite;
    animation-delay: var(--delay);
    transform: rotate(var(--angle)) translateX(90px);
  }

  @keyframes particle-burst {
    0% { opacity: 0; transform: rotate(var(--angle)) translateX(40px); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: rotate(var(--angle)) translateX(100px); }
  }

  .gen-status {
    text-align: center;
  }

  .gen-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .gen-dots {
    display: flex;
    gap: 4px;
  }

  .dot {
    width: 6px;
    height: 6px;
    background: hsl(var(--primary));
    border-radius: 50%;
    animation: dot-bounce 1.4s infinite ease-in-out both;
  }

  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }

  @keyframes dot-bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  .gen-subtitle {
    font-size: 1.125rem;
    color: hsl(var(--muted-foreground));
    margin: 0;
  }

  /* 진행 상태 카드 */
  .gen-progress-card {
    width: 100%;
    max-width: 480px;
    padding: 2rem;
    background: linear-gradient(135deg, 
      hsl(var(--card)) 0%, 
      hsl(var(--muted) / 0.3) 100%);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    box-shadow: 
      0 10px 40px hsl(var(--foreground) / 0.1),
      0 0 0 1px hsl(var(--border));
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .progress-label {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    font-weight: 500;
  }

  .progress-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: hsl(var(--primary));
  }

  .progress-bar-container {
    position: relative;
    height: 8px;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    overflow: visible;
    margin-bottom: 1rem;
  }

  .progress-bar-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, 
      hsl(142 76% 36%), 
      hsl(var(--primary)));
    border-radius: var(--radius-full);
    transition: width 0.5s ease;
  }

  .progress-bar-active {
    position: absolute;
    top: -4px;
    width: 16px;
    height: 16px;
    background: hsl(var(--primary));
    border-radius: 50%;
    box-shadow: 
      0 0 0 4px hsl(var(--primary) / 0.3),
      0 0 20px hsl(var(--primary) / 0.5);
    animation: active-pulse 1.5s ease-in-out infinite;
    transition: left 0.5s ease;
  }

  @keyframes active-pulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 0 4px hsl(var(--primary) / 0.3), 0 0 20px hsl(var(--primary) / 0.5);
    }
    50% { 
      transform: scale(1.2);
      box-shadow: 0 0 0 8px hsl(var(--primary) / 0.2), 0 0 30px hsl(var(--primary) / 0.6);
    }
  }

  .progress-message {
    font-size: 0.875rem;
    color: hsl(var(--foreground));
    text-align: center;
    margin: 0 0 1.5rem 0;
    padding: 0.75rem 1rem;
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
  }

  /* 에피소드 그리드 */
  .episode-grid {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .episode-dot {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  .episode-dot.completed {
    background: linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 45%));
    color: white;
    box-shadow: 0 4px 12px hsl(142 76% 36% / 0.4);
  }

  .episode-dot.active {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
    color: white;
    box-shadow: 
      0 0 0 4px hsl(var(--primary) / 0.3),
      0 4px 20px hsl(var(--primary) / 0.5);
    animation: dot-active 2s ease-in-out infinite;
  }

  @keyframes dot-active {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 0 4px hsl(var(--primary) / 0.3), 0 4px 20px hsl(var(--primary) / 0.5);
    }
    50% { 
      transform: scale(1.1);
      box-shadow: 0 0 0 6px hsl(var(--primary) / 0.2), 0 4px 25px hsl(var(--primary) / 0.6);
    }
  }

  .episode-dot.pending {
    background: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
    border-color: hsl(var(--border));
  }

  .dot-icon {
    font-size: 1rem;
  }

  .dot-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid transparent;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .dot-number {
    font-size: 0.875rem;
  }

  .progress-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin: 0;
  }

  .progress-hint .hint-icon {
    font-size: 1rem;
  }

  /* === 빈 상태 === */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
  }

  .empty-visual {
    position: relative;
    margin-bottom: 2rem;
  }

  .empty-icon-wrapper {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, 
      hsl(45 80% 50% / 0.2) 0%, 
      hsl(45 80% 50% / 0.05) 100%);
    border: 2px solid hsl(45 80% 50% / 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-icon {
    font-size: 3rem;
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0 0 0.5rem 0;
  }

  .empty-desc {
    font-size: 1rem;
    color: hsl(var(--muted-foreground));
    margin: 0 0 2rem 0;
    max-width: 400px;
  }

  .empty-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* === 에러 토스트 === */
  .error-toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: hsl(0 84.2% 60.2% / 0.95);
    color: white;
    border-radius: var(--radius-lg);
    box-shadow: 
      0 10px 40px hsl(0 84.2% 60.2% / 0.4),
      0 0 0 1px hsl(0 84.2% 60.2%);
    font-weight: 500;
    max-width: 90vw;
    z-index: 100;
    animation: toast-in 0.3s ease-out;
  }

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .error-icon {
    font-size: 1.25rem;
  }

  /* 반응형 */
  @media (max-width: 1024px) {
    .edit-main {
      grid-template-columns: 1fr;
    }

    .editor-panel {
      min-height: 300px;
    }
  }

  @media (max-width: 768px) {
    .edit-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .header-right {
      align-self: flex-end;
    }

    .edit-footer {
      flex-direction: column;
      gap: 1rem;
    }

    .footer-left, .footer-right {
      width: 100%;
    }

    .footer-right {
      display: flex;
      justify-content: flex-end;
    }

    .gen-animation {
      width: 140px;
      height: 140px;
    }

    .gen-core {
      width: 60px;
      height: 60px;
    }

    .gen-emoji {
      font-size: 2rem;
    }

    .orbit-1 { width: 90px; height: 90px; }
    .orbit-2 { width: 115px; height: 115px; }
    .orbit-3 { width: 140px; height: 140px; }

    .gen-title {
      font-size: 1.25rem;
    }

    .episode-grid {
      gap: 0.5rem;
    }

    .episode-dot {
      width: 32px;
      height: 32px;
      font-size: 0.75rem;
    }
  }
</style>
