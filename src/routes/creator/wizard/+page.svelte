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
  }
</style>
</svelte:head>
