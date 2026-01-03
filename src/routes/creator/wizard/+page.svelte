<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';
  import Step1Upload from './steps/Step1Upload.svelte';
  import Step2Characters from './steps/Step2Characters.svelte';
  import Step3Gauges from './steps/Step3Gauges.svelte';
  import Step4Ending from './steps/Step4Ending.svelte';
  import Step5Tree from './steps/Step5Tree.svelte';
  import Step6Generating from './steps/Step6Generating.svelte';
  import Step7Complete from './steps/Step7Complete.svelte';
  import { wizardStore } from './wizard-store.svelte';

  const steps = [
    { number: 1, title: '소설 텍스트', desc: '전문 입력' },
    { number: 2, title: '등장인물', desc: '자동 추출' },
    { number: 3, title: '게이지', desc: '5개 → 2개 선택' },
    { number: 4, title: '엔딩', desc: '예상 엔딩 설계' },
    { number: 5, title: '트리 편집', desc: '노드 수정/검토' },
    { number: 6, title: '에피소드 생성', desc: '순차 생성' },
    { number: 7, title: '완료', desc: '체크/등록' },
  ];

  // 인증 확인 및 상태 복원
  onMount(() => {
    const cleanup = wizardStore.initialize();
    return cleanup;
  });
</script>

<div class="wizard-page">
  <div class="wizard-container">
    <!-- 헤더 -->
    <div class="wizard-header">
      <h1 class="wizard-title">인터랙티브 스토리 생성</h1>
      <p class="wizard-subtitle">
        소설을 입력하면 AI가 자동으로 인터랙티브 게임으로 변환합니다
      </p>
    </div>

    <!-- 진행 단계 표시 -->
    <div class="progress-bar-container">
      <div class="steps-container">
        {#each steps as step, index}
          <div class="step-wrapper">
            <div class="step-item">
              <div
                class="step-circle"
                class:active={wizardStore.currentStep === step.number}
                class:completed={wizardStore.currentStep > step.number}
              >
                {#if wizardStore.currentStep > step.number}
                  ✓
                {:else}
                  {step.number}
                {/if}
              </div>
              <div class="step-info">
                <div
                  class="step-title"
                  class:active-title={wizardStore.currentStep === step.number}
                  class:completed-title={wizardStore.currentStep > step.number}
                >
                  {step.title}
                </div>
                <div
                  class="step-desc"
                  class:active-desc={wizardStore.currentStep === step.number}
                  class:completed-desc={wizardStore.currentStep > step.number}
                >
                  {step.desc}
                </div>
              </div>
            </div>
            {#if index < steps.length - 1}
              <div
                class="step-connector"
                class:completed={wizardStore.currentStep > step.number}
                class:active={wizardStore.currentStep === step.number || wizardStore.currentStep === step.number + 1}
              ></div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- 현재 단계 콘텐츠 -->
    <div class="step-content">
      {#if wizardStore.currentStep === 1}
        <Step1Upload
          title={wizardStore.title}
          description={wizardStore.description}
          genre={wizardStore.genre}
          uploadedFile={wizardStore.uploadedFile}
          uploading={wizardStore.uploading}
          uploadProgress={wizardStore.uploadProgress}
          canGoNext={wizardStore.canGoNext()}
          error={wizardStore.error}
          onTitleChange={wizardStore.setTitleValue}
          onDescriptionChange={wizardStore.setDescriptionValue}
          onGenreChange={wizardStore.setGenreValue}
          onFileChange={wizardStore.handleFileUpload.bind(wizardStore)}
          onRemoveFile={wizardStore.clearUploadedFile}
        />

      {:else if wizardStore.currentStep === 2}
        <Step2Characters
          loadingAnalysis={wizardStore.loadingAnalysis}
          summary={wizardStore.summary}
          characters={wizardStore.characters}
          selectedCharacterNames={wizardStore.selectedCharacterNames}
          selectingCharacters={wizardStore.selectingCharacters}
          thumbnailUrl={wizardStore.thumbnailUrl}
          thumbnailLoading={wizardStore.thumbnailLoading}
          thumbnailUploading={wizardStore.thumbnailUploading}
          hasAiGenerated={wizardStore.hasAiGenerated}
          onThumbnailUpload={wizardStore.handleThumbnailUpload.bind(wizardStore)}
          onThumbnailRemove={wizardStore.handleThumbnailRemove}
        >
          {#each wizardStore.characters as character}
            <div class="character-card-wrapper">
              <button
                type="button"
                class="character-card"
                class:expanded={wizardStore.expandedCharacters.has(character.name)}
                class:selected={wizardStore.selectedCharacterNames.includes(character.name)}
                onclick={() => wizardStore.toggleCharacter(character.name)}
                disabled={wizardStore.selectingCharacters}
              >
                <div class="character-avatar">
                  {character.name.charAt(0)}
                </div>
                <div class="character-details">
                  <div class="character-name">{character.name}</div>
                  {#if character.aliases && character.aliases.length > 0}
                    <div class="character-aliases">별칭: {character.aliases.join(', ')}</div>
                  {/if}
                  <div class="character-description" class:expanded={wizardStore.expandedCharacters.has(character.name)}>
                    {wizardStore.expandedCharacters.has(character.name)
                      ? character.description
                      : wizardStore.truncate(character.description, 140)}
                  </div>
                  <div class="character-toggle">
                    {wizardStore.expandedCharacters.has(character.name) ? '접기' : '더보기'}
                  </div>
                </div>
              </button>
              <button
                type="button"
                class="character-select-btn"
                class:selected={wizardStore.selectedCharacterNames.includes(character.name)}
                onclick={() => wizardStore.toggleCharacterSelection(character.name)}
                disabled={wizardStore.selectingCharacters}
              >
                {#if wizardStore.selectedCharacterNames.includes(character.name)}
                  ✓ 선택됨
                {:else}
                  {wizardStore.selectedCharacterNames.length >= 2 ? '선택 불가' : 'NPC로 선택'}
                {/if}
              </button>
            </div>
          {/each}
        </Step2Characters>

      {:else if wizardStore.currentStep === 3}
        <Step3Gauges
          proposedGauges={wizardStore.proposedGauges}
          selectedGaugeIds={wizardStore.selectedGaugeIds}
          loadingGauges={wizardStore.loadingGauges}
          selectingGauges={wizardStore.selectingGauges}
          toggleGauge={wizardStore.toggleGauge}
        />

      {:else if wizardStore.currentStep === 4}
        <Step4Ending
          endingConfig={wizardStore.endingConfig}
          numEpisodes={wizardStore.numEpisodes}
          maxDepth={wizardStore.maxDepth}
          onEndingChange={wizardStore.handleEndingChange}
          onNumEpisodesChange={wizardStore.handleNumEpisodesChange}
          onMaxDepthChange={wizardStore.handleMaxDepthChange}
        />

      {:else if wizardStore.currentStep === 5}
        <Step5Tree
          storyId={wizardStore.storyId}
          treeEditMode={wizardStore.treeEditMode}
          currentEpisodeTree={wizardStore.currentEpisodeTree}
          selectedNode={wizardStore.selectedNode}
          regenerating={wizardStore.regenerating}
          currentEpisodeTitle={wizardStore.currentEpisodeTitle}
          currentEpisode={wizardStore.currentEpisode}
          actualTotalEpisodes={wizardStore.actualTotalEpisodes}
          generating={wizardStore.generating}
          progressMessage={wizardStore.progressMessage}
          totalEpisodesGenerated={wizardStore.totalEpisodesGenerated}
          numEpisodes={wizardStore.numEpisodes}
          error={wizardStore.error}
          maxDepth={wizardStore.maxDepth}
          onSelectNode={wizardStore.handleNodeSelect}
          onApplyChanges={wizardStore.handleApplyChanges.bind(wizardStore)}
          onCancelSelect={() => { wizardStore.selectedNode = null; }}
          onGenerateNextEpisodeFromTree={wizardStore.generateNextEpisodeFromTree.bind(wizardStore)}
          onBackToSettings={() => { wizardStore.currentStep = 4; wizardStore.error = ''; }}
        />

      {:else if wizardStore.currentStep === 6}
        <Step6Generating
          generating={wizardStore.generating}
          progressMessage={wizardStore.progressMessage}
          currentEpisode={wizardStore.currentEpisode}
          actualTotalEpisodes={wizardStore.actualTotalEpisodes}
          numEpisodes={wizardStore.numEpisodes}
          totalEpisodesGenerated={wizardStore.totalEpisodesGenerated}
          error={wizardStore.error}
          onBackToStep4={() => { wizardStore.currentStep = 4; wizardStore.error = ''; }}
        />

      {:else if wizardStore.currentStep === 7}
        <Step7Complete
          metadata={wizardStore.metadata}
          storyDataId={wizardStore.storyDataId}
          startPlaying={wizardStore.startPlaying}
          createNew={wizardStore.createNew}
        />
      {/if}
    </div>

    <!-- 네비게이션 버튼 -->
    <div class="navigation">
      <Button
        onclick={wizardStore.prevStep}
        disabled={wizardStore.currentStep === 1 || wizardStore.generating}
        variant="outline"
        size="lg"
      >
        ← 이전
      </Button>

      <div class="step-indicator">
        {wizardStore.currentStep} / 7 단계
      </div>

      <Button
        onclick={async () => await wizardStore.nextStep()}
        disabled={!wizardStore.canGoNext() || wizardStore.currentStep >= 5 || wizardStore.uploading || wizardStore.loadingAnalysis || wizardStore.loadingGauges || wizardStore.selectingCharacters || wizardStore.selectingGauges || wizardStore.configuringStory || wizardStore.generating}
        size="lg"
      >
        {#if wizardStore.currentStep === 1}
          {wizardStore.uploading ? '업로드 중...' : '소설 업로드 →'}
        {:else if wizardStore.currentStep === 2}
          {wizardStore.selectingCharacters ? '선택 중...' : '캐릭터 선택 →'}
        {:else if wizardStore.currentStep === 3}
          {wizardStore.selectingGauges ? '선택 중...' : '게이지 선택 →'}
        {:else if wizardStore.currentStep === 4}
          {wizardStore.configuringStory ? '시작 중...' : '생성 시작 →'}
        {:else}
          다음 →
        {/if}
      </Button>
    </div>
  </div>
</div>

<svelte:head>
<style>
  /* Content Card */
  .content-card {
    background: hsl(var(--card));
    border: none;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 2px 8px hsl(var(--foreground) / 0.05);
  }

  .card-header {
    padding: 1.75rem 2rem;
    border-bottom: 2px solid hsl(0 0% 50% / 0.3);
    background: hsl(var(--muted) / 0.3);
  }

  .card-title {
    font-size: 1.375rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .card-desc {
    color: hsl(var(--muted-foreground));
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  .card-body {
    padding: 2rem;
    background: hsl(var(--card));
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Section Block */
  .section-block {
    margin-bottom: 2.5rem;
    background: hsl(var(--muted) / 0.4);
    border: 3px solid hsl(0 0% 50% / 0.5);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 4px 12px hsl(var(--foreground) / 0.15);
  }

  .section-block:last-child {
    margin-bottom: 0;
  }

  .section-header {
    padding: 1.25rem 1.5rem;
    background: hsl(var(--muted) / 0.6);
    border-bottom: 2px solid hsl(0 0% 50% / 0.3);
  }

  .section-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0 0 0.25rem 0;
  }

  .section-subtitle {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin: 0;
  }

  .section-content {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.1);
  }

  /* Form Elements */
  .form-group {
    margin-bottom: 0;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 0;
  }

  .form-group-half {
    margin-bottom: 0;
  }

  .form-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.625rem;
    color: hsl(var(--foreground));
    font-size: 0.9375rem;
  }

  .form-input {
    width: 100%;
    padding: 0.875rem 1rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 0.9375rem;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
  }

  .field-hint {
    font-size: 0.8125rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.375rem;
  }

  /* File Upload */
  .file-upload-wrapper {
    position: relative;
    width: 100%;
  }

  .file-input-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .file-upload-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    padding: 1rem 1.5rem;
    background: hsl(var(--primary));
    color: white;
    border: 3px solid hsl(0 0% 50% / 0.5);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .file-upload-button:hover:not(:disabled) {
    background: hsl(var(--primary) / 0.9);
    border-color: hsl(0 0% 50% / 0.7);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px hsl(var(--primary) / 0.3);
  }

  .file-upload-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .file-upload-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .file-upload-icon {
    font-size: 1.25rem;
  }

  .file-upload-text {
    font-size: 1rem;
  }

  .file-info {
    margin-top: 0.75rem;
    padding: 1rem 1.25rem;
    background: hsl(var(--muted) / 0.2);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 0.875rem;
    transition: all 0.2s ease;
  }

  .file-info:hover {
    background: hsl(var(--muted) / 0.3);
  }

  .file-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .file-name {
    flex: 1;
    font-weight: 600;
    color: hsl(var(--foreground));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.9375rem;
  }

  .file-size {
    font-size: 0.8125rem;
    color: hsl(var(--muted-foreground));
    flex-shrink: 0;
  }

  .file-remove {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1px solid hsl(var(--border));
    background: hsl(var(--background));
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .file-remove:hover:not(:disabled) {
    background: hsl(0 84.2% 60.2% / 0.1);
    border-color: hsl(0 84.2% 60.2%);
    color: hsl(0 84.2% 60.2%);
    transform: scale(1.1);
  }

  .file-remove:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input-method-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: hsl(var(--background));
    border: none;
    border-radius: var(--radius-md);
  }

  .method-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Upload Progress */
  .upload-status {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .upload-icon {
    font-size: 2rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .upload-info {
    flex: 1;
  }

  .upload-text {
    font-weight: 600;
    color: hsl(var(--primary));
    margin-bottom: 0.5rem;
  }

  .upload-processing {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: hsl(var(--foreground));
    font-weight: 700;
  }

  .inline-spinner {
    width: 1rem;
    height: 1rem;
    border: 3px solid #ffffff44;
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .upload-progress-bar {
    width: 100%;
    height: 0.5rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: 0.25rem;
  }

  .upload-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)));
    transition: width 0.3s ease;
  }

  .upload-percentage {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--primary));
    text-align: right;
  }

  /* Banners */
  .success-banner {
    padding: 1rem 1.25rem;
    background: hsl(142 76% 36% / 0.1);
    border: 1px solid hsl(142 76% 36% / 0.3);
    border-radius: var(--radius-md);
    color: hsl(142 76% 36%);
    font-weight: 600;
    text-align: center;
    font-size: 0.9375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .error-banner {
    padding: 1rem 1.25rem;
    background: hsl(0 84.2% 60.2% / 0.1);
    border: 1px solid hsl(0 84.2% 60.2% / 0.3);
    border-radius: var(--radius-md);
    color: hsl(0 84.2% 60.2%);
    font-weight: 600;
    text-align: center;
    font-size: 0.9375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .info-banner {
    padding: 1rem 1.25rem;
    background: hsl(var(--primary) / 0.1);
    border: 1px solid hsl(var(--primary) / 0.3);
    border-radius: var(--radius-md);
    color: hsl(var(--primary));
    font-weight: 600;
    text-align: center;
    font-size: 0.9375rem;
  }

  .wizard-page {
    min-height: calc(100vh - 60px);
    background: hsl(0 0% 4%);
    padding: 2.5rem 1.5rem;
  }

  .wizard-container {
    max-width: 1200px;
    width: min(1200px, 96vw);
    margin: 0 auto;
  }

  /* 헤더 */
  .wizard-header {
    text-align: center;
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .wizard-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    color: hsl(var(--foreground));
    letter-spacing: -0.02em;
  }

  .wizard-subtitle {
    font-size: 1rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.6;
  }

  /* 진행 단계 */
  .progress-bar-container {
    background: linear-gradient(135deg, hsl(var(--card) / 0.9), hsl(var(--card) / 0.8));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.75rem;
    margin-bottom: 2rem;
    box-shadow:
      0 4px 18px hsl(var(--foreground) / 0.15),
      0 0 0 1px hsl(var(--card) / 0.7);
    backdrop-filter: blur(6px);
  }

  .steps-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .step-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .step-circle {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid hsl(var(--border));
    background: radial-gradient(circle, hsl(var(--muted) / 0.2) 0%, hsl(var(--muted) / 0.05) 60%, transparent 100%);
    color: hsl(var(--foreground));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9375rem;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .step-circle.active {
    background: radial-gradient(circle at 50% 40%, #ff4d4f, #d9353a);
    border-color: #ff4d4f;
    color: white;
    transform: scale(1.15);
    box-shadow:
      0 0 0 4px #ff4d4f44,
      0 0 20px #ff4d4f88,
      0 0 40px #ff4d4f66;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow:
        0 0 0 4px hsl(var(--primary) / 0.2),
        0 0 20px hsl(var(--primary) / 0.6),
        0 0 40px hsl(var(--primary) / 0.4);
    }
    50% {
      box-shadow:
        0 0 0 8px hsl(var(--primary) / 0.3),
        0 0 30px hsl(var(--primary) / 0.8),
        0 0 60px hsl(var(--primary) / 0.6);
    }
  }

  .step-circle.completed {
    background: hsl(142 76% 36%);
    border-color: hsl(142 76% 36%);
    color: white;
  }

  .step-info {
    text-align: center;
    width: 100%;
  }

  .step-title {
    font-weight: 700;
    font-size: 0.9rem;
    color: hsl(var(--foreground));
    margin-bottom: 0.35rem;
    transition: all 0.3s ease;
  }

  .step-title.active-title {
    color: #ff4d4f;
    text-shadow: 0 0 8px #ff4d4fcc;
  }

  .step-title.completed-title {
    color: hsl(142 76% 45%);
  }

  .step-desc {
    transition: all 0.3s ease;
    color: hsl(var(--muted-foreground));
  }

  .step-desc.active-desc {
    color: #ffd7d8;
    text-shadow: 0 0 6px #ff4d4fcc;
  }

  .step-desc.completed-desc {
    color: hsl(142 76% 45%);
  }

  .step-desc {
    font-size: 0.6875rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.4;
  }

  .step-connector {
    flex: 1;
    height: 2px;
    background: hsl(var(--border));
    margin: 0 0.25rem;
    margin-top: -1.25rem;
    transition: all 0.3s ease;
  }

  .step-connector.completed {
    background: hsl(142 76% 36%);
  }

  .step-connector.active {
    background: linear-gradient(90deg, hsl(142 76% 36%), hsl(var(--primary)));
    animation: connector-flow 2s ease-in-out infinite;
  }

  @keyframes connector-flow {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  /* 콘텐츠 카드 */
  .step-content {
    margin-bottom: 2rem;
  }

  /* Step 2: 등장인물 추출 */
  .extracting-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 3rem;
  }

  .extracting-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .extracting-hint {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.5rem;
  }

  .spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid hsl(var(--muted));
    border-top-color: hsl(var(--primary));
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .analysis-results {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .analysis-layout {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .summary-section {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.15);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    max-height: 360px;
    overflow: auto;
  }

  .summary-box {
    padding: 1.25rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    line-height: 1.8;
    color: hsl(var(--foreground));
    margin-top: 1rem;
  }

  .characters-section {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.15);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .section-subtitle-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .section-subtitle {
    font-size: 1.25rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0;
  }

  .section-hint {
    font-size: 0.85rem;
    color: hsl(var(--muted-foreground));
  }

  .count-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-left: 0.5rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    background: hsl(var(--primary) / 0.15);
    color: hsl(var(--primary));
    font-size: 0.85rem;
    font-weight: 700;
  }

  .character-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
    margin-top: 1rem;
  }

  .selection-info {
    padding: 1rem 1.5rem;
    background: hsl(var(--muted) / 0.1);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    margin-top: 1rem;
  }

  .selection-count {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    text-align: center;
  }

  .selection-count.complete {
    color: hsl(142 76% 36%);
  }

  /* Step 3: 게이지 선택 */
  .gauge-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    margin-top: 1rem;
    padding: 1rem;
    background: hsl(var(--muted) / 0.1);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .gauge-option {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1.25rem;
    background: hsl(var(--card));
    border: 2px solid hsl(var(--border));
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .gauge-option:hover {
    border-color: hsl(var(--primary) / 0.5);
    background: hsl(var(--muted) / 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px hsl(var(--foreground) / 0.05);
  }

  .gauge-option.selected {
    border-color: hsl(var(--primary));
    background: hsl(var(--primary) / 0.1);
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
  }

  .gauge-check {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid hsl(var(--border));
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.75rem;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .gauge-option.selected .gauge-check {
    border-color: hsl(var(--primary));
    background: hsl(var(--primary));
    color: white;
  }

  .gauge-info {
    flex: 1;
  }

  .gauge-name {
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-bottom: 0.25rem;
    font-size: 1rem;
  }

  .gauge-desc {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.5;
  }

  /* Step 4: 엔딩 설정 */
  .config-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
    align-items: start;
  }

  .config-main {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.1);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .config-sidebar {
    position: sticky;
    top: 2rem;
  }

  .ending-config {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
    padding: 1rem;
    background: hsl(var(--muted) / 0.1);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .ending-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ending-item label {
    font-weight: 600;
    color: hsl(var(--foreground));
    font-size: 0.875rem;
  }

  .ending-input {
    padding: 0.5rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    font-size: 1rem;
    color: hsl(var(--foreground));
    font-weight: 600;
    text-align: center;
    transition: all 0.2s ease;
  }

  .ending-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .slider {
    flex: 1;
    height: 0.5rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    outline: none;
    appearance: none;
  }

  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    background: hsl(var(--primary));
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 0 4px hsl(var(--primary) / 0.2);
  }

  .slider-value {
    min-width: 5rem;
    font-weight: 600;
    color: hsl(var(--primary));
    text-align: center;
  }

  /* Step 5: 트리 편집 */
  .tree-edit-card {
    min-height: 600px;
    overflow: visible;
  }

  .tree-edit-layout {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 1.5rem;
    min-height: 500px;
    overflow: visible;
  }

  .tree-panel {
    background: hsl(var(--muted) / 0.2);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .tree-scroll-container {
    flex: 1;
    overflow-x: auto !important;
    overflow-y: auto;
    padding: 1rem;
    max-height: 70vh;
  }

  .tree-scroll-container::-webkit-scrollbar {
    height: 12px;
    width: 12px;
  }

  .tree-scroll-container::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.3);
    border-radius: 6px;
  }

  .tree-scroll-container::-webkit-scrollbar-thumb {
    background: hsl(var(--primary) / 0.5);
    border-radius: 6px;
    border: 2px solid hsl(var(--muted) / 0.3);
  }

  .tree-scroll-container::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary));
  }

  .editor-panel-container {
    min-height: 400px;
    display: flex;
    flex-direction: column;
  }

  .tree-edit-footer {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid hsl(var(--border));
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .episode-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    background: hsl(var(--primary));
    color: white;
    border-radius: var(--radius-full);
    font-weight: 600;
  }

  /* Step 6: 에피소드 생성 */
  .progress-info {
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .progress-bar {
    width: 100%;
    height: 0.75rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)));
    transition: width 0.5s ease;
  }

  .progress-text {
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
  }

  .progress-message {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.5rem;
  }

  .progress-hint {
    font-size: 0.875rem;
    color: hsl(var(--primary));
    margin-top: 1rem;
    font-weight: 500;
  }

  .episode-progress {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    background: hsl(var(--muted) / 0.1);
    border-radius: var(--radius-md);
  }

  .episode-label {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .episode-count {
    font-size: 1.25rem;
    font-weight: 700;
    color: hsl(var(--primary));
  }

  .episode-list {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }

  .episode-item {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid hsl(var(--border));
    background: hsl(var(--muted));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    transition: all 0.2s ease;
  }

  .episode-item.completed {
    background: hsl(142 76% 36%);
    border-color: hsl(142 76% 36%);
    color: white;
  }

  .episode-item.active {
    background: hsl(var(--primary));
    border-color: hsl(var(--primary));
    color: white;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .generating-steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
  }

  /* Step 7: 완료 */
  .metadata-card {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.1);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    margin-bottom: 1.5rem;
  }

  .metadata-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid hsl(var(--border));
  }

  .metadata-row:last-child {
    border-bottom: none;
  }

  .metadata-label {
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
  }

  .metadata-value {
    font-weight: 600;
    color: hsl(var(--foreground));
    font-size: 0.875rem;
  }

  .complete-card {
    text-align: center;
    padding: 3rem 2rem;
  }

  .complete-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .complete-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 0.75rem;
  }

  .complete-desc {
    font-size: 1rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
  }

  .complete-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* 네비게이션 */
  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 0;
    border-top: 1px solid hsl(var(--border));
    margin-top: 2rem;
  }

  .step-indicator {
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    font-size: 0.9375rem;
  }

  /* 등장인물 */
  .character-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: hsl(var(--primary));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .character-name {
    font-weight: 700;
    color: hsl(var(--foreground));
    text-align: left;
    font-size: 1rem;
  }

  .character-card-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .character-card {
    display: flex;
    gap: 1rem;
    padding: 1rem 1rem 0.75rem 1rem;
    background: hsl(var(--background));
    border: 1.5px solid hsl(var(--border));
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
    cursor: pointer;
    text-align: left;
    box-shadow: 0 2px 8px hsl(var(--foreground) / 0.08);
    width: 100%;
  }

  .character-card:hover {
    border-color: hsl(var(--primary) / 0.3);
    box-shadow: 0 4px 12px hsl(var(--foreground) / 0.08);
    background: hsl(var(--muted) / 0.1);
  }

  .character-card.expanded {
    border-color: hsl(var(--primary));
    box-shadow: 0 6px 16px hsl(var(--primary) / 0.15);
    background: hsl(var(--muted) / 0.15);
  }

  .character-card.selected {
    border-color: hsl(142 76% 36%);
    background: hsl(142 76% 36% / 0.1);
  }

  .character-card.selected:hover {
    border-color: hsl(142 76% 36%);
    background: hsl(142 76% 36% / 0.15);
  }

  .character-select-btn {
    padding: 0.625rem 1rem;
    background: hsl(var(--muted));
    border: 1.5px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }

  .character-select-btn:hover:not(:disabled) {
    background: hsl(var(--primary) / 0.1);
    border-color: hsl(var(--primary));
    color: hsl(var(--primary));
  }

  .character-select-btn.selected {
    background: hsl(142 76% 36%);
    border-color: hsl(142 76% 36%);
    color: white;
  }

  .character-select-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .character-details {
    flex: 1;
  }

  .character-aliases {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.25rem;
  }

  .character-description {
    margin-top: 0.35rem;
    line-height: 1.55;
    color: hsl(var(--foreground));
    max-height: 4.6rem;
    overflow: hidden;
    position: relative;
  }

  .character-description:not(.expanded)::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 55%, hsl(var(--background)) 100%);
    pointer-events: none;
  }

  .character-description.expanded {
    max-height: none;
  }

  .character-toggle {
    margin-top: 0.6rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: hsl(var(--primary));
  }

  @media (max-width: 768px) {
    .wizard-page {
      padding: 1.5rem 1rem;
    }

    .wizard-title {
      font-size: 2rem;
    }

    .wizard-header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
    }

    .progress-bar-container {
      padding: 1.25rem;
    }

    .steps-container {
      flex-wrap: wrap;
      gap: 1rem;
    }

    .step-wrapper {
      flex: 0 0 calc(50% - 0.5rem);
      min-width: 0;
    }

    .step-connector {
      display: none;
    }

    .navigation {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .step-indicator {
      text-align: center;
    }

    .character-list {
      grid-template-columns: 1fr;
    }

    .gauge-grid {
      grid-template-columns: 1fr;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .config-layout {
      grid-template-columns: 1fr;
    }

    .config-sidebar {
      position: static;
    }

    .tree-edit-layout {
      grid-template-columns: 1fr;
    }

    .editor-panel-container {
      min-height: 300px;
    }

    .ending-config {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
</svelte:head>
