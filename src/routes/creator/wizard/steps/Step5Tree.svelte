<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import StoryTree from '$lib/components/story-tree.svelte';
  import NodeEditor from '$lib/components/node-editor.svelte';
  import type { TreeNode } from '$lib/components/story-tree.svelte';

  export let treeEditMode = false;
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
  export let onApplyChanges: (e: CustomEvent<{ nodeId: string; newText: string; newChoices: Array<{ text: string; tags: string[] }>;}>) => void;
  export let onCancelSelect: () => void;
  export let onGenerateNextEpisodeFromTree: () => void;
  export let onBackToSettings: () => void;
</script>

<div class="content-card tree-edit-card">
  <div class="card-header">
    <h2 class="card-title">5단계: 에피소드 트리 편집</h2>
    <p class="card-desc">
      {#if treeEditMode}
        에피소드 {currentEpisode}의 스토리 트리를 검토하고 필요시 수정하세요
      {:else}
        AI가 에피소드 {currentEpisode}을(를) 생성하고 있습니다...
      {/if}
    </p>
  </div>
  <div class="card-body">
    {#if treeEditMode}
      {#if currentEpisodeTree}
      <div class="tree-edit-layout">
        <!-- 트리 시각화 영역 -->
        <div class="tree-panel">
          <div class="panel-header">
            <span class="panel-title">📊 스토리 트리</span>
            <span class="episode-badge">EP {currentEpisode} / {actualTotalEpisodes}</span>
          </div>
          <div class="tree-scroll-container">
            <StoryTree 
              rootNode={currentEpisodeTree}
              selectedNodeId={selectedNode?.id || ''}
              maxDepth={maxDepth}
              episodeTitle={currentEpisodeTitle}
              on:selectNode={onSelectNode}
            />
          </div>
        </div>
        
        <!-- 노드 편집 패널 -->
        <div class="editor-panel-container">
          <NodeEditor 
            node={selectedNode}
            isLoading={regenerating}
            episodeTitle={currentEpisodeTitle}
            episodeOrder={currentEpisode}
            on:applyChanges={onApplyChanges}
            on:cancel={onCancelSelect}
          />
        </div>
      </div>
      
      <!-- 하단 안내 -->
      <div class="tree-edit-footer">
        <div class="edit-instructions">
          <p>💡 <strong>사용법:</strong> 노드를 클릭하여 선택 → 내용 수정 → "적용" 버튼 클릭</p>
          <p>수정된 노드의 하위 트리가 자동으로 재생성됩니다.</p>
        </div>
        
        <div class="edit-actions">
          <Button 
            variant="outline"
            onclick={() => { 
              if (confirm('현재 에피소드를 수정 없이 확정하시겠습니까?')) {
                onGenerateNextEpisodeFromTree();
              }
            }}
            disabled={generating || regenerating}
          >
            {#if currentEpisode >= actualTotalEpisodes}
              ✅ 완료하기
            {:else}
              ⏭️ 다음 에피소드 생성
            {/if}
          </Button>
        </div>
      </div>
      {:else}
        <!-- 트리 데이터 없음 -->
        <div class="empty-tree-state">
          <div class="empty-icon">⚠️</div>
          <h3 class="empty-title">트리 데이터를 불러올 수 없습니다</h3>
          <p class="empty-message">
            에피소드가 생성되었지만 트리 구조를 불러오지 못했습니다.
          </p>
          <div class="empty-actions">
            <Button 
              onclick={() => { 
                if (confirm('현재 에피소드를 건너뛰고 다음 에피소드를 생성하시겠습니까?')) {
                  onGenerateNextEpisodeFromTree();
                }
              }}
              disabled={generating || regenerating}
            >
              ⏭️ 다음 에피소드 생성
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
    {:else}
      <!-- 생성 중 상태 (동기 방식) -->
      <div class="generating-state">
        <div class="spinner"></div>
        <div class="progress-info">
          <!-- 에피소드 진행 표시 -->
          <div class="episode-progress">
            <span class="episode-label">에피소드 생성</span>
            <span class="episode-count">{currentEpisode} / {actualTotalEpisodes || numEpisodes}</span>
          </div>
          
          {#if progressMessage}
            <p class="progress-message">{progressMessage}</p>
          {/if}
          
          <p class="progress-hint">
            AI가 스토리를 생성하고 있습니다. 잠시만 기다려주세요...
          </p>
          
          <!-- 에피소드 상태 표시 -->
          <div class="episode-list">
            {#each Array(actualTotalEpisodes || numEpisodes) as _, i}
              <div 
                class="episode-item"
                class:completed={i < totalEpisodesGenerated}
                class:active={i === totalEpisodesGenerated && generating}
              >
                {#if i < totalEpisodesGenerated}
                  ✓
                {:else if i === totalEpisodesGenerated && generating}
                  ⏳
                {:else}
                  {i + 1}
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
    
    {#if error}
      <div class="error-banner">
        ❌ {error}
      </div>
    {/if}
  </div>
</div>

