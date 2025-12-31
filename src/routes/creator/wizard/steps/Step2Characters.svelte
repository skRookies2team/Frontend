<script lang="ts">
  import type { CharacterDto } from '$lib/api';
  import { ImagePlus, Upload, X, RefreshCw } from 'lucide-svelte';

  export let loadingAnalysis = false;
  export let summary = '';
  export let characters: CharacterDto[] = [];
  export let selectedCharacterNames: string[] = [];
  export let selectingCharacters = false;

  // 썸네일 관련 props
  export let thumbnailUrl = '';
  export let thumbnailLoading = false;
  export let thumbnailUploading = false;
  export let hasAiGenerated = false;
  export let onThumbnailUpload: (file: File) => void = () => {};
  export let onThumbnailRemove: () => void = () => {};

  let thumbnailFileInput: HTMLInputElement;

  function handleThumbnailSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      // 이미지 파일 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      // 5MB 제한
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }
      onThumbnailUpload(file);
    }
    // 같은 파일 다시 선택 가능하도록 초기화
    input.value = '';
  }
</script>

<div class="content-card">
  <div class="card-header">
    <h2 class="card-title">2단계: 등장인물 자동 추출</h2>
    <p class="card-desc">NPC 챗봇으로 만들 캐릭터를 1~2명 선택하세요</p>
  </div>
  <div class="card-body">
    {#if loadingAnalysis}
      <div class="extracting-state">
        <div class="spinner"></div>
        <p class="extracting-text">AI가 소설을 분석하고 있습니다...</p>
        <p class="extracting-hint">요약과 등장인물을 추출하는 중...</p>
      </div>
    {:else if characters.length > 0}
      <div class="analysis-results">
        <div class="analysis-layout">
          <!-- 썸네일 섹션 -->
          <div class="thumbnail-section">
            <div class="section-subtitle-row">
              <h3 class="section-subtitle">
                스토리 썸네일
                {#if hasAiGenerated}
                  <span class="ai-badge">AI 생성</span>
                {/if}
              </h3>
              <p class="section-hint">AI가 생성한 썸네일을 확인하거나 직접 업로드하세요</p>
            </div>

            <div class="thumbnail-container">
              {#if thumbnailLoading}
                <div class="thumbnail-loading">
                  <div class="spinner"></div>
                  <p>썸네일 로딩 중...</p>
                </div>
              {:else if thumbnailUrl}
                <div class="thumbnail-preview">
                  <img src={thumbnailUrl} alt="스토리 썸네일" class="thumbnail-image" />
                  <div class="thumbnail-overlay">
                    <button
                      type="button"
                      class="thumbnail-action-btn"
                      onclick={() => thumbnailFileInput.click()}
                      disabled={thumbnailUploading}
                      title="다른 이미지로 교체"
                    >
                      <RefreshCw size={20} />
                      <span>교체</span>
                    </button>
                  </div>
                </div>
              {:else}
                <div class="thumbnail-empty">
                  <ImagePlus size={48} strokeWidth={1.5} />
                  <p class="thumbnail-empty-text">썸네일이 없습니다</p>
                  <button
                    type="button"
                    class="thumbnail-upload-btn"
                    onclick={() => thumbnailFileInput.click()}
                    disabled={thumbnailUploading}
                  >
                    <Upload size={16} />
                    <span>이미지 업로드</span>
                  </button>
                </div>
              {/if}

              {#if thumbnailUploading}
                <div class="thumbnail-uploading-overlay">
                  <div class="spinner"></div>
                  <p>업로드 중...</p>
                </div>
              {/if}
            </div>

            <input
              type="file"
              accept="image/*"
              class="hidden-input"
              bind:this={thumbnailFileInput}
              onchange={handleThumbnailSelect}
            />

            <p class="thumbnail-hint">
              지원 형식: JPG, PNG, GIF, WebP (최대 5MB)
            </p>
          </div>

          <!-- 요약 -->
          {#if summary}
            <div class="summary-section">
              <h3 class="section-subtitle">소설 요약</h3>
              <div class="summary-box">
                {summary}
              </div>
            </div>
          {/if}

          <!-- 등장인물 -->
          <div class="characters-section">
            <div class="section-subtitle-row">
              <h3 class="section-subtitle">
                추출된 등장인물
                <span class="count-badge">{characters.length}명</span>
              </h3>
              <p class="section-hint">NPC로 만들 캐릭터를 선택하세요 (1~2명)</p>
            </div>
            <div class="character-list">
              <slot />
            </div>
          </div>
        </div>

        {#if selectedCharacterNames.length > 0}
          <div class="selection-info">
            <p class="selection-count" class:complete={selectedCharacterNames.length >= 1 && selectedCharacterNames.length <= 2}>
              {selectedCharacterNames.length}/2 선택됨 {selectedCharacterNames.length >= 1 && selectedCharacterNames.length <= 2 ? '✓' : ''}
            </p>
          </div>
        {/if}
        <div class="success-banner">
          ✅ 분석 완료! 등장인물 {characters.length}명 추출
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* 썸네일 섹션 스타일 */
  .thumbnail-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .ai-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    background: linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(270 60% 50% / 0.15));
    color: hsl(var(--primary));
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
    margin-left: 0.5rem;
  }

  .thumbnail-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: hsl(var(--muted) / 0.3);
    border: 2px dashed hsl(var(--border));
  }

  .thumbnail-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 0.75rem;
    color: hsl(var(--muted-foreground));
  }

  .thumbnail-preview {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumbnail-overlay {
    position: absolute;
    inset: 0;
    background: hsl(0 0% 0% / 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .thumbnail-preview:hover .thumbnail-overlay {
    opacity: 1;
  }

  .thumbnail-action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    background: hsl(var(--background) / 0.9);
    color: hsl(var(--foreground));
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .thumbnail-action-btn:hover:not(:disabled) {
    background: hsl(var(--background));
    transform: scale(1.05);
  }

  .thumbnail-action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .thumbnail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 0.75rem;
    color: hsl(var(--muted-foreground));
  }

  .thumbnail-empty-text {
    font-size: 0.875rem;
  }

  .thumbnail-upload-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: hsl(var(--primary));
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .thumbnail-upload-btn:hover:not(:disabled) {
    background: hsl(var(--primary) / 0.9);
    transform: translateY(-1px);
  }

  .thumbnail-upload-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .thumbnail-uploading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: hsl(var(--background) / 0.8);
    color: hsl(var(--foreground));
  }

  .hidden-input {
    display: none;
  }

  .thumbnail-hint {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
  }
</style>

