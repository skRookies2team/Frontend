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
  let isLoadingNodeImage = $state(false);

  // 이미지 업로드 상태
  let isUploadingImage = $state(false);
  let uploadProgress = $state(0);
  let fileInputRef: HTMLInputElement | null = null;

  // 민감한 주제 감지 (AI 생성 실패 시)
  let isSensitiveContent = $state(false);

  // 노드가 변경되면 편집 상태 초기화 + 이미지 조회
  $effect(() => {
    if (node) {
      // 기본 정보 초기화
      editedText = node.text;
      editedChoices = node.choices ? [...node.choices.map(c => ({ ...c }))] : [];
      editedImagePrompt = node.imagePrompt || '';
      hasChanges = false;
      imageGenerationError = '';
      imageLoadError = false;
      isSensitiveContent = false;

      // 백엔드에서 이미지 정보 조회
      loadNodeImage();
    }
  });

  // 노드 이미지 조회
  async function loadNodeImage() {
    if (!storyId || !node?.id) {
      editedImageUrl = '';
      return;
    }

    isLoadingNodeImage = true;
    imageGenerationError = '';

    try {
      console.log('[NodeEditor] 노드 이미지 조회:', { storyId, nodeId: node.id });

      const imageInfo = await api.story.getNodeImage(storyId, node.id);

      console.log('[NodeEditor] 노드 이미지 조회 성공:', imageInfo);

      // 이미지 URL 설정
      if (imageInfo.imageUrl) {
        editedImageUrl = getAccessibleImageUrl(imageInfo.imageUrl, imageInfo.imageFileKey);
        console.log('[NodeEditor] 기존 이미지 로드됨:', editedImageUrl);
      } else {
        editedImageUrl = '';
        console.log('[NodeEditor] 이미지 없음');
      }
    } catch (error) {
      console.log('[NodeEditor] 노드 이미지 조회 실패 (이미지가 아직 없을 수 있음):', error);
      // 이미지가 없는 것은 정상 상황이므로 에러로 표시하지 않음
      editedImageUrl = '';
    } finally {
      isLoadingNodeImage = false;
    }
  }
  
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
    isSensitiveContent = false;

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

      // 민감한 주제 감지
      const errorMessage = error instanceof ApiError
        ? (error.data?.message || error.message || '')
        : String(error);

      const sensitiveKeywords = [
        'sensitive', 'policy', 'content', 'violation',
        'inappropriate', 'safety', 'rejected', 'blocked',
        '민감한', '정책', '위반', '부적절', '거부', '차단'
      ];

      const isSensitive = sensitiveKeywords.some(keyword =>
        errorMessage.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isSensitive) {
        isSensitiveContent = true;
        imageGenerationError = '⚠️ 민감한 주제가 포함되어 AI 이미지 생성이 제한되었습니다.';
        console.warn('[NodeEditor] 민감한 주제 감지:', errorMessage);
      } else {
        if (error instanceof ApiError) {
          imageGenerationError = error.data?.message || '이미지 생성에 실패했습니다. 다시 시도해주세요.';
        } else {
          imageGenerationError = '이미지 생성에 실패했습니다. 다시 시도해주세요.';
        }
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

  // 이미지 직접 업로드
  function handleFileSelect() {
    if (fileInputRef) {
      fileInputRef.click();
    }
  }

  async function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      imageGenerationError = '이미지 파일만 업로드 가능합니다.';
      return;
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      imageGenerationError = '파일 크기는 10MB 이하여야 합니다.';
      return;
    }

    if (!storyId || !node?.id) {
      imageGenerationError = '스토리 정보가 없어 이미지를 업로드할 수 없습니다.';
      return;
    }

    isUploadingImage = true;
    imageGenerationError = '';
    imageLoadError = false;
    isSensitiveContent = false;
    uploadProgress = 0;

    try {
      console.log('[NodeEditor] 이미지 업로드 시작:', {
        storyId,
        nodeId: node.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      // 1. 업로드 URL 발급
      uploadProgress = 10;
      const uploadUrlResponse = await api.story.getImageUploadUrl(storyId, node.id, {
        contentType: file.type
      });

      console.log('[NodeEditor] 업로드 URL 발급 완료:', uploadUrlResponse);

      // 2. S3에 파일 업로드
      uploadProgress = 30;
      const uploadResponse = await fetch(uploadUrlResponse.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error(`S3 업로드 실패: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      console.log('[NodeEditor] S3 업로드 완료');
      uploadProgress = 70;

      // 3. 업로드된 이미지 정보 조회
      const imageInfo = await api.story.getNodeImage(storyId, node.id);

      console.log('[NodeEditor] 업로드된 이미지 정보 조회 완료:', imageInfo);

      // 4. 이미지 URL 설정
      if (imageInfo.imageUrl) {
        editedImageUrl = getAccessibleImageUrl(imageInfo.imageUrl, imageInfo.imageFileKey);
        checkChanges();
        uploadProgress = 100;
        console.log('[NodeEditor] 이미지 업로드 성공!');
      }

    } catch (error) {
      console.error('[NodeEditor] 이미지 업로드 실패:', error);
      if (error instanceof ApiError) {
        imageGenerationError = error.data?.message || '이미지 업로드에 실패했습니다.';
      } else {
        imageGenerationError = '이미지 업로드에 실패했습니다. 다시 시도해주세요.';
      }
    } finally {
      isUploadingImage = false;
      uploadProgress = 0;
      // input 초기화
      if (input) {
        input.value = '';
      }
    }
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
          🖼️ 노드 이미지
          <span class="label-hint">AI로 생성하거나 직접 업로드할 수 있습니다</span>
        </label>
        <textarea
          class="form-textarea image-prompt-textarea"
          value={editedImagePrompt}
          oninput={handleImagePromptChange}
          disabled={isLoading || isGeneratingImage}
          rows="3"
          placeholder="AI 생성을 위한 프롬프트 (선택사항): 어둡고 신비로운 숲 속 마법사의 탑, 판타지 스타일, 달빛이 비치는 밤..."
        ></textarea>

        <div class="image-actions">
          <!-- AI 생성 버튼 -->
          <Button
            onclick={handleGenerateImage}
            disabled={!editedImagePrompt.trim() || isLoading || isGeneratingImage || isUploadingImage}
            variant="outline"
            class="generate-image-btn"
          >
            {#if isGeneratingImage}
              <span class="btn-spinner"></span>
              <span>이미지 생성 중...</span>
            {:else}
              <span>✨ AI 생성</span>
            {/if}
          </Button>

          <!-- 직접 업로드 버튼 -->
          <Button
            onclick={handleFileSelect}
            disabled={isLoading || isGeneratingImage || isUploadingImage}
            variant="outline"
            class="upload-image-btn {isSensitiveContent ? 'highlighted' : ''}"
          >
            {#if isUploadingImage}
              <span class="btn-spinner"></span>
              <span>업로드 중... {uploadProgress}%</span>
            {:else}
              <span>📁 직접 업로드</span>
            {/if}
          </Button>

          <!-- 숨겨진 파일 input -->
          <input
            type="file"
            accept="image/*"
            bind:this={fileInputRef}
            onchange={handleFileChange}
            style="display: none;"
          />

          <p class="form-hint inline-hint">
            {#if isUploadingImage}
              📤 이미지를 업로드하고 있습니다...
            {:else if isGeneratingImage}
              ✨ AI가 이미지를 생성하고 있습니다...
            {:else}
              💡 프롬프트로 AI 생성하거나, 파일 업로드 (최대 10MB)
            {/if}
          </p>
        </div>

        {#if imageGenerationError}
          <div class="error-message" class:sensitive-content-error={isSensitiveContent}>
            {imageGenerationError}
            {#if isSensitiveContent}
              <div class="sensitive-content-guide">
                <p class="guide-text">📁 대신 <strong>직접 업로드</strong> 버튼을 사용하여 이미지를 추가하세요.</p>
              </div>
            {/if}
          </div>
        {/if}

        {#if isLoadingNodeImage}
          <div class="loading-message">
            <span class="btn-spinner"></span>
            <span>기존 이미지 조회 중...</span>
          </div>
        {/if}

        {#if isUploadingImage && uploadProgress > 0}
          <div class="upload-progress">
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: {uploadProgress}%"></div>
            </div>
            <span class="progress-text">업로드 중... {uploadProgress}%</span>
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
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .generate-image-btn,
  .upload-image-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  /* 민감한 주제일 때 업로드 버튼 강조 */
  :global(.upload-image-btn.highlighted:not(:disabled)) {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border-color: hsl(var(--primary));
    animation: pulse-highlight 2s ease-in-out infinite;
    font-weight: 600;
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.2);
  }

  :global(.upload-image-btn.highlighted:hover:not(:disabled)) {
    background: hsl(var(--primary) / 0.9);
    transform: scale(1.05);
  }

  :global(.upload-image-btn.highlighted:disabled) {
    animation: none;
  }

  @keyframes pulse-highlight {
    0%, 100% {
      box-shadow: 0 0 0 3px hsl(var(--primary) / 0.2);
    }
    50% {
      box-shadow: 0 0 0 6px hsl(var(--primary) / 0.4);
    }
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

  .error-message.sensitive-content-error {
    background: hsl(45 100% 50% / 0.15);
    border: 2px solid hsl(45 100% 50% / 0.5);
    color: hsl(30 100% 35%);
    font-weight: 600;
  }

  .sensitive-content-guide {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid hsl(45 100% 50% / 0.3);
  }

  .guide-text {
    margin: 0;
    font-size: 0.875rem;
    color: hsl(30 100% 30%);
    line-height: 1.5;
  }

  .guide-text strong {
    color: hsl(var(--primary));
    text-decoration: underline;
  }

  .loading-message {
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    background: hsl(var(--primary) / 0.1);
    border: 1px solid hsl(var(--primary) / 0.3);
    border-radius: var(--radius-md);
    color: hsl(var(--primary));
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .upload-progress {
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    background: hsl(var(--primary) / 0.05);
    border: 1px solid hsl(var(--primary) / 0.2);
    border-radius: var(--radius-md);
  }

  .progress-bar-container {
    width: 100%;
    height: 8px;
    background: hsl(var(--muted));
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-bar {
    height: 100%;
    background: hsl(var(--primary));
    border-radius: var(--radius-sm);
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.75rem;
    color: hsl(var(--primary));
    font-weight: 500;
    display: block;
    text-align: center;
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

  /* 반응형 */
  @media (max-width: 768px) {
    .image-actions {
      flex-direction: column;
      align-items: stretch;
    }

    .generate-image-btn,
    .upload-image-btn {
      width: 100%;
      justify-content: center;
    }

    .inline-hint {
      width: 100%;
      text-align: center;
    }
  }
</style>








