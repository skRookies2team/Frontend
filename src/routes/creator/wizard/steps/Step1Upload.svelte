<script lang="ts">
  export let title = '';
  export let description = '';
  export let uploadedFile: File | null = null;
  export let uploading = false;
  export let uploadProgress = 0;
  export let canGoNext = false;
  export let error = '';
  export let onTitleChange: (value: string) => void;
  export let onDescriptionChange: (value: string) => void;
  export let onFileChange: (event: Event) => void;
  export let onRemoveFile: () => void;
</script>

<!-- 1단계: 소설 텍스트 입력 -->
<div class="content-card">
  <div class="card-header">
    <h2 class="card-title">1단계: 소설 텍스트 입력</h2>
    <p class="card-desc">인터랙티브 게임으로 만들 소설의 전문을 입력하세요</p>
  </div>
  <div class="card-body">
    <!-- 기본 정보 섹션 -->
    <div class="section-block">
      <div class="section-header">
        <h3 class="section-title">기본 정보</h3>
        <p class="section-subtitle">소설의 제목과 설명을 입력하세요</p>
      </div>
      <div class="section-content">
        <div class="form-row">
          <div class="form-group form-group-half">
            <label class="form-label">소설 제목 *</label>
            <input
              type="text"
              class="form-input"
              value={title}
              oninput={(e) => onTitleChange((e.target as HTMLInputElement).value)}
              placeholder="예: 파리대왕"
            />
          </div>

          <div class="form-group form-group-half">
            <label class="form-label">설명 (선택)</label>
            <input
              type="text"
              class="form-input"
              value={description}
              oninput={(e) => onDescriptionChange((e.target as HTMLInputElement).value)}
              placeholder="소설에 대한 간단한 설명"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 소설 내용 입력 섹션 -->
    <div class="section-block">
      <div class="section-header">
        <h3 class="section-title">소설 내용 입력</h3>
        <p class="section-subtitle">파일을 업로드하거나 텍스트를 직접 입력하세요</p>
      </div>
      <div class="section-content">
        <div class="input-method-card">
          <div class="method-header">
            <label class="form-label">파일 업로드</label>
            <p class="field-hint">
              지원 형식: .txt, .pdf, .doc, .docx (최대 10MB)
            </p>
          </div>
          <div class="file-upload-wrapper">
            <label for="file-upload" class="file-upload-button">
              <span class="file-upload-icon">📁</span>
              <span class="file-upload-text">파일 선택</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              class="file-input-hidden"
              onchange={onFileChange}
              disabled={uploading}
            />
          </div>
          {#if uploadedFile}
            <div class="file-info">
              <span class="file-icon">📄</span>
              <span class="file-name">{uploadedFile.name}</span>
              <span class="file-size">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
              <button 
                type="button" 
                class="file-remove"
                onclick={onRemoveFile}
                disabled={uploading}
              >
                ✕
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>

    {#if error}
      <div class="error-banner">
        ❌ {error}
      </div>
    {/if}
    
    {#if uploading}
      <div class="info-banner">
        <div class="upload-status">
          <div class="upload-icon">⏳</div>
          <div class="upload-info">
            {#if uploadProgress > 0 && uploadProgress < 100}
              <p class="upload-text">S3에 파일 업로드 중...</p>
              <div class="upload-progress-bar">
                <div class="upload-progress-fill" style="width: {uploadProgress}%"></div>
              </div>
              <p class="upload-percentage">{uploadProgress.toFixed(1)}%</p>
            {:else if uploadProgress === 100}
              <p class="upload-text upload-processing">
                <span class="inline-spinner" aria-hidden="true"></span>
                업로드 완료! 분석을 시작합니다...
              </p>
            {:else}
              <p class="upload-text">소설을 업로드하고 있습니다...</p>
            {/if}
          </div>
        </div>
      </div>
    {:else if canGoNext}
      <div class="success-banner">
        ✅ 준비 완료! 소설 업로드 버튼을 클릭하세요
      </div>
    {/if}
  </div>
</div>

