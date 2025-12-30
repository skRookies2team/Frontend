<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { api, ApiError } from '$lib/api';
  import type { TreeNode } from './story-tree.svelte';
  import { getAccessibleImageUrl } from '$lib/utils/image-url';
  
  // Props
  let { 
    storyId = '',
    node = null as TreeNode | null,
    isLoading = false,
    episodeTitle = '',
    episodeOrder = 1,
    onapplychanges,
    oncancel
  } = $props();
  
  // 편집 상태
  let editedText = $state('');
  let editedChoices = $state<Array<{ text: string; tags: string[] }>>([]);
  let editedImagePrompt = $state('');
  let editedImageUrl = $state('');
  let hasChanges = $state(false);

  // 이미지 생성 상태
  let isGeneratingImage = $state(false);
  let imageGenerationError = $state('');
  let imageLoadError = $state(false);
  
  // 노드가 변경되면 편집 상태 초기화
  $effect(() => {
    if (node) {
      editedText = node.text;
      editedChoices = node.choices ? [...node.choices.map(c => ({ ...c }))] : [];
      editedImagePrompt = node.imagePrompt || '';
      editedImageUrl = node.imageUrl || '';
      hasChanges = false;
      imageGenerationError = '';
      imageLoadError = false;
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
  
  function handleImagePromptChange(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    editedImagePrompt = target.value;
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
    const imagePromptChanged = editedImagePrompt !== (node.imagePrompt || '');
    const imageUrlChanged = editedImageUrl !== (node.imageUrl || '');

    hasChanges = textChanged || choicesChanged || imagePromptChanged || imageUrlChanged;
  }
  
  function handleApply() {
    if (!node || !hasChanges) return;

    if (onapplychanges) {
      onapplychanges(new CustomEvent('applychanges', {
        detail: {
          nodeId: node.id,
          newText: editedText,
          newChoices: editedChoices,
          newImagePrompt: editedImagePrompt,
          newImageUrl: editedImageUrl
        }
      }));
    }
  }
  
  function handleCancel() {
    if (node) {
      editedText = node.text;
      editedChoices = node.choices ? [...node.choices.map(c => ({ ...c }))] : [];
      editedImagePrompt = node.imagePrompt || '';
      editedImageUrl = node.imageUrl || '';
      hasChanges = false;
    }
    if (oncancel) {
      oncancel();
    }
  }

  // 이미지 생성 요청
  async function handleGenerateImage() {
    if (!editedImagePrompt.trim()) {
      imageGenerationError = '이미지 프롬프트를 먼저 입력해주세요.';
      return;
    }
    if (!storyId || !node?.id) {
      imageGenerationError = '스토리 정보가 없어 이미지를 생성할 수 없습니다. (storyId/nodeId 없음)';
      return;
    }

    isGeneratingImage = true;
    imageGenerationError = '';
    imageLoadError = false;

    try {
      console.log('[NodeEditor] 이미지 생성 요청 시작:', { storyId, nodeId: node.id, prompt: editedImagePrompt });

      const response = await api.story.regenerateNodeImage(storyId, node.id, {
        customPrompt: editedImagePrompt,
      });

      console.log('[NodeEditor] 이미지 생성 응답:', response);
      console.log('[NodeEditor] 받은 이미지 URL:', response.imageUrl);
      console.log('[NodeEditor] 받은 파일 키:', response.fileKey);

      // S3 URL을 CloudFront URL로 변환 (Access Denied 방지)
      editedImageUrl = getAccessibleImageUrl(response.imageUrl, response.fileKey);
      // UX: AI가 최적화한 프롬프트도 저장(원하면 사용자가 다시 수정 가능)
      if (response.enhancedPrompt) {
        editedImagePrompt = response.enhancedPrompt;
      }
      checkChanges();

      console.log('[NodeEditor] 이미지 생성 완료! editedImageUrl이 설정됨:', editedImageUrl);

    } catch (error) {
      console.error('[NodeEditor] 이미지 생성 실패:', error);
      if (error instanceof ApiError) {
        imageGenerationError = error.data?.message || '이미지 생성에 실패했습니다. 다시 시도해주세요.';
      } else {
        imageGenerationError = '이미지 생성에 실패했습니다. 다시 시도해주세요.';
      }
    } finally {
      isGeneratingImage = false;
    }
  }

  function handleImageLoad() {
    console.log('[NodeEditor] 이미지 로드 성공:', editedImageUrl);
    imageLoadError = false;
  }

  function handleImageError() {
    console.error('[NodeEditor] 이미지 로드 실패:', editedImageUrl);
    imageLoadError = true;
    imageGenerationError = '이미지를 불러올 수 없습니다. URL을 확인하세요: ' + editedImageUrl;
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
      
      <!-- 이미지 프롬프트 편집 -->
      <div class="form-group">
        <label class="form-label">
          🖼️ 이미지 프롬프트
          <span class="label-hint">소설 분위기에 맞는 이미지를 위한 프롬프트를 입력하세요</span>
        </label>
        <textarea
          class="form-textarea image-prompt-textarea"
          value={editedImagePrompt}
          oninput={handleImagePromptChange}
          disabled={isLoading || isGeneratingImage}
          rows="3"
          placeholder="예: 어둡고 신비로운 숲 속 마법사의 탑, 판타지 스타일, 달빛이 비치는 밤..."
        ></textarea>

        <div class="image-actions">
          <Button
            onclick={handleGenerateImage}
            disabled={!editedImagePrompt.trim() || isLoading || isGeneratingImage}
            variant="outline"
            class="generate-image-btn"
          >
            {#if isGeneratingImage}
              <span class="btn-spinner"></span>
              <span>이미지 생성 중...</span>
            {:else}
              <span>✨ 이미지 생성</span>
            {/if}
          </Button>

          {#if editedImagePrompt}
            <p class="form-hint inline-hint">
              💡 백엔드 AI가 프롬프트를 기반으로 이미지를 생성합니다
            </p>
          {/if}
        </div>

        {#if imageGenerationError}
          <div class="error-message">
            ⚠️ {imageGenerationError}
          </div>
        {/if}

        {#if editedImageUrl}
          <div class="image-preview">
            <div class="preview-header">
              <span class="preview-title">🖼️ 생성된 이미지</span>
              <button
                class="remove-image-btn"
                onclick={() => {
                  editedImageUrl = '';
                  imageLoadError = false;
                }}
                disabled={isLoading || isGeneratingImage}
              >
                ✕
              </button>
            </div>
            <div class="preview-image-wrapper">
              {#if imageLoadError}
                <div class="image-load-error">
                  <p class="error-icon">⚠️</p>
                  <p class="error-text">이미지를 불러올 수 없습니다</p>
                  <p class="error-url">{editedImageUrl}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onclick={() => { imageLoadError = false; }}
                  >
                    다시 시도
                  </Button>
                </div>
              {:else}
                <img
                  src={editedImageUrl}
                  alt="Generated scene"
                  class="preview-image"
                  onload={handleImageLoad}
                  onerror={handleImageError}
                />
              {/if}
            </div>
            <p class="preview-hint">
              {#if imageLoadError}
                이미지 URL을 확인하거나 다시 생성해주세요
              {:else}
                변경사항을 적용하면 이 이미지가 노드에 저장됩니다
              {/if}
            </p>
          </div>
        {/if}
      </div>
      
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
  
  .label-hint {
    display: block;
    font-weight: 400;
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.25rem;
  }
  
  .image-prompt-textarea {
    min-height: 80px;
    font-family: inherit;
  }
  
  .form-hint {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.5rem;
    line-height: 1.4;
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

  /* 이미지 생성 관련 스타일 */
  .image-actions {
    margin-top: 0.75rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .generate-image-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .inline-hint {
    margin: 0;
    flex: 1;
  }

  .error-message {
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    background: hsl(0 84.2% 60.2% / 0.1);
    border: 1px solid hsl(0 84.2% 60.2% / 0.3);
    border-radius: var(--radius-md);
    color: hsl(0 84.2% 40%);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .image-preview {
    margin-top: 1rem;
    padding: 1rem;
    background: hsl(var(--muted) / 0.2);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .preview-title {
    font-weight: 600;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
  }

  .remove-image-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(var(--destructive) / 0.1);
    border: 1px solid hsl(var(--destructive) / 0.3);
    border-radius: var(--radius-sm);
    color: hsl(var(--destructive));
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .remove-image-btn:hover:not(:disabled) {
    background: hsl(var(--destructive));
    color: white;
  }

  .remove-image-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .preview-image-wrapper {
    position: relative;
    width: 100%;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: hsl(var(--muted));
  }

  .preview-image {
    width: 100%;
    height: auto;
    display: block;
    max-height: 300px;
    object-fit: cover;
  }

  .preview-hint {
    margin-top: 0.75rem;
    margin-bottom: 0;
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    text-align: center;
  }

  .image-load-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: hsl(var(--muted) / 0.5);
    min-height: 200px;
    text-align: center;
    gap: 0.75rem;
  }

  .image-load-error .error-icon {
    font-size: 2.5rem;
    margin: 0;
  }

  .image-load-error .error-text {
    font-weight: 600;
    color: hsl(var(--destructive));
    margin: 0;
  }

  .image-load-error .error-url {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    font-family: monospace;
    word-break: break-all;
    max-width: 100%;
    padding: 0.5rem;
    background: hsl(var(--background));
    border-radius: var(--radius-sm);
    margin: 0;
  }
</style>








