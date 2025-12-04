<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import type { TreeNode } from './story-tree.svelte';
  
  // Props
  let { 
    node = null as TreeNode | null,
    isLoading = false,
    episodeTitle = '',
    episodeOrder = 1
  } = $props();
  
  // 편집 상태
  let editedText = $state('');
  let editedChoices = $state<Array<{ text: string; tags: string[] }>>([]);
  let hasChanges = $state(false);
  
  const dispatch = createEventDispatcher<{
    applyChanges: { 
      nodeId: string; 
      newText: string; 
      newChoices: Array<{ text: string; tags: string[] }>;
    };
    cancel: void;
  }>();
  
  // 노드가 변경되면 편집 상태 초기화
  $effect(() => {
    if (node) {
      editedText = node.text;
      editedChoices = node.choices ? [...node.choices.map(c => ({ ...c }))] : [];
      hasChanges = false;
    }
  });
  
  function handleTextChange(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    editedText = target.value;
    checkChanges();
  }
  
  function handleChoiceChange(index: number, newText: string) {
    editedChoices[index].text = newText;
    checkChanges();
  }
  
  function checkChanges() {
    if (!node) {
      hasChanges = false;
      return;
    }
    
    const textChanged = editedText !== node.text;
    const choicesChanged = editedChoices.some((choice, i) => 
      node.choices && node.choices[i] && choice.text !== node.choices[i].text
    );
    
    hasChanges = textChanged || choicesChanged;
  }
  
  function handleApply() {
    if (!node || !hasChanges) return;
    
    dispatch('applyChanges', {
      nodeId: node.id,
      newText: editedText,
      newChoices: editedChoices
    });
  }
  
  function handleCancel() {
    if (node) {
      editedText = node.text;
      editedChoices = node.choices ? [...node.choices.map(c => ({ ...c }))] : [];
      hasChanges = false;
    }
    dispatch('cancel');
  }
</script>

<div class="editor-panel">
  {#if node}
    <div class="editor-header">
      <h3 class="editor-title">✏️ 노드 편집</h3>
      <div class="node-info">
        <span class="info-badge">ID: {node.id}</span>
        <span class="info-badge">깊이: {node.depth}</span>
      </div>
    </div>
    
    <div class="editor-body">
      <!-- 노드 텍스트 편집 -->
      <div class="form-group">
        <label class="form-label">노드 텍스트</label>
        <textarea
          class="form-textarea"
          value={editedText}
          oninput={handleTextChange}
          disabled={isLoading}
          rows="4"
          placeholder="스토리 텍스트를 입력하세요..."
        ></textarea>
      </div>
      
      <!-- 선택지 편집 -->
      {#if editedChoices.length > 0}
        <div class="form-group">
          <label class="form-label">선택지 ({editedChoices.length}개)</label>
          <div class="choices-list">
            {#each editedChoices as choice, index}
              <div class="choice-item">
                <span class="choice-number">{index + 1}</span>
                <input
                  type="text"
                  class="choice-input"
                  value={choice.text}
                  oninput={(e) => handleChoiceChange(index, (e.target as HTMLInputElement).value)}
                  disabled={isLoading}
                  placeholder="선택지 텍스트..."
                />
                {#if choice.tags && choice.tags.length > 0}
                  <div class="choice-tags">
                    {#each choice.tags as tag}
                      <span class="tag">{tag}</span>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- 노드 상세 정보 (읽기 전용) -->
      {#if node.details}
        <div class="details-section">
          <h4 class="details-title">📋 상세 정보</h4>
          {#if node.details.situation}
            <div class="detail-item">
              <span class="detail-label">상황:</span>
              <span class="detail-value">{node.details.situation}</span>
            </div>
          {/if}
          {#if node.details.npc_emotions && Object.keys(node.details.npc_emotions).length > 0}
            <div class="detail-item">
              <span class="detail-label">NPC 감정:</span>
              <span class="detail-value">
                {Object.entries(node.details.npc_emotions).map(([k, v]) => `${k}: ${v}`).join(', ')}
              </span>
            </div>
          {/if}
        </div>
      {/if}
    </div>
    
    <div class="editor-footer">
      <div class="status-info">
        {#if hasChanges}
          <span class="status-changed">⚠️ 변경사항이 있습니다</span>
        {:else}
          <span class="status-saved">✓ 저장됨</span>
        {/if}
      </div>
      
      <div class="editor-actions">
        <Button 
          variant="outline" 
          onclick={handleCancel}
          disabled={isLoading}
        >
          취소
        </Button>
        <Button 
          onclick={handleApply}
          disabled={!hasChanges || isLoading}
        >
          {#if isLoading}
            ⏳ 적용 중...
          {:else}
            🔄 적용 (서브트리 재생성)
          {/if}
        </Button>
      </div>
    </div>
  {:else}
    <div class="no-selection">
      <div class="no-selection-icon">👆</div>
      <p class="no-selection-text">편집할 노드를 선택하세요</p>
      <p class="no-selection-hint">트리에서 노드를 클릭하면 여기서 편집할 수 있습니다</p>
    </div>
  {/if}
</div>

<style>
  .editor-panel {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .editor-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid hsl(var(--border));
    background: hsl(var(--muted) / 0.3);
  }
  
  .editor-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
  }
  
  .node-info {
    display: flex;
    gap: 0.5rem;
  }
  
  .info-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-sm);
    color: hsl(var(--muted-foreground));
    font-family: monospace;
  }
  
  .editor-body {
    flex: 1;
    padding: 1.25rem;
    overflow-y: auto;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .form-label {
    display: block;
    font-weight: 600;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
  }
  
  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    line-height: 1.5;
    resize: vertical;
    min-height: 100px;
  }
  
  .form-textarea:focus {
    outline: none;
    border-color: hsl(var(--primary));
  }
  
  .form-textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .choices-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .choice-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
  }
  
  .choice-number {
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(var(--primary));
    color: white;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  
  .choice-input {
    flex: 1;
    padding: 0.5rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-sm);
    color: hsl(var(--foreground));
    font-size: 0.875rem;
  }
  
  .choice-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
  }
  
  .choice-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.25rem;
  }
  
  .tag {
    font-size: 0.65rem;
    padding: 0.125rem 0.375rem;
    background: hsl(var(--accent) / 0.2);
    color: hsl(var(--accent-foreground));
    border-radius: var(--radius-sm);
  }
  
  .details-section {
    padding: 1rem;
    background: hsl(var(--muted) / 0.2);
    border-radius: var(--radius-md);
    margin-top: 1rem;
  }
  
  .details-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-bottom: 0.75rem;
  }
  
  .detail-item {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  .detail-label {
    color: hsl(var(--muted-foreground));
    margin-right: 0.5rem;
  }
  
  .detail-value {
    color: hsl(var(--foreground));
  }
  
  .editor-footer {
    padding: 1rem 1.25rem;
    border-top: 1px solid hsl(var(--border));
    background: hsl(var(--muted) / 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .status-info {
    font-size: 0.8rem;
  }
  
  .status-changed {
    color: hsl(45, 100%, 50%);
    font-weight: 600;
  }
  
  .status-saved {
    color: hsl(142, 76%, 36%);
  }
  
  .editor-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .no-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 3rem;
    text-align: center;
  }
  
  .no-selection-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .no-selection-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
  }
  
  .no-selection-hint {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }
</style>








