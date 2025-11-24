<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { api, type StoryData, ApiError } from '$lib/api';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  // 단계 상태
  let currentStep = $state(1);
  
  // 1단계: 소설 텍스트 입력
  let title = $state('');
  let description = $state('');
  let novelText = $state('');
  
  // 2단계: 설정
  let numEpisodes = $state(5);
  let maxDepth = $state(3);
  
  // 생성 상태
  let generating = $state(false);
  let progress = $state(0);
  let generatedStory: StoryData | null = $state(null);
  let error = $state('');
  
  // 인증 확인
  onMount(() => {
    if (!api.auth.isAuthenticated()) {
      alert('로그인이 필요합니다.');
      goto('/login');
    }
  });
  
  const steps = [
    { number: 1, title: '소설 입력', desc: '텍스트 입력' },
    { number: 2, title: '설정', desc: '에피소드/깊이' },
    { number: 3, title: '생성', desc: 'AI 스토리 생성' },
    { number: 4, title: '완료', desc: '확인 및 저장' },
  ];
  
  function canGoNext(): boolean {
    switch (currentStep) {
      case 1: return novelText.length >= 100 && title.length > 0;
      case 2: return true;
      case 3: return generatedStory !== null;
      default: return false;
    }
  }
  
  function nextStep() {
    if (currentStep < 4 && canGoNext()) {
      if (currentStep === 2) {
        // 2단계에서 3단계로 넘어갈 때 자동 생성
        generateStory();
      } else {
        currentStep++;
      }
    }
  }
  
  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }
  
  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    try {
      const content = await file.text();
      novelText = content;
      if (!title) {
        title = file.name.replace('.txt', '');
      }
    } catch (err) {
      console.error('파일 읽기 실패:', err);
      error = '파일을 읽을 수 없습니다.';
    }
  }
  
  async function generateStory() {
    currentStep = 3;
    generating = true;
    error = '';
    progress = 0;
    
    // 진행률 시뮬레이션
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 5;
      }
    }, 1000);
    
    try {
      const story = await api.game.generateStory({
        title,
        description,
        novelText,
        numEpisodes,
        maxDepth
      });
      
      progress = 100;
      generatedStory = story;
      currentStep = 4;
    } catch (err: any) {
      console.error('스토리 생성 실패:', err);
      if (err instanceof ApiError) {
        error = err.data?.message || '스토리 생성에 실패했습니다.';
      } else {
        error = '네트워크 오류가 발생했습니다.';
      }
    } finally {
      clearInterval(progressInterval);
      generating = false;
    }
  }
  
  function startPlaying() {
    if (generatedStory) {
      goto(`/play/${generatedStory.id}`);
    }
  }
  
  function createNew() {
    currentStep = 1;
    title = '';
    description = '';
    novelText = '';
    numEpisodes = 5;
    maxDepth = 3;
    generatedStory = null;
    error = '';
    progress = 0;
  }
</script>

<div class="wizard-page">
  <div class="wizard-container">
    <!-- 헤더 -->
    <div class="wizard-header">
      <h1 class="wizard-title">🧙‍♂️ 인터랙티브 스토리 마법사</h1>
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
                class:active={currentStep === step.number}
                class:completed={currentStep > step.number}
              >
                {#if currentStep > step.number}
                  ✓
                {:else}
                  {step.number}
                {/if}
              </div>
              <div class="step-info">
                <div class="step-title">{step.title}</div>
                <div class="step-desc">{step.desc}</div>
              </div>
            </div>
            {#if index < steps.length - 1}
              <div class="step-connector" class:completed={currentStep > step.number}></div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- 현재 단계 콘텐츠 -->
    <div class="step-content">
      {#if currentStep === 1}
        <!-- 1단계: 소설 텍스트 입력 -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">📝 1단계: 소설 텍스트 입력</h2>
            <p class="card-desc">인터랙티브 게임으로 만들 소설의 전문을 입력하세요</p>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">소설 제목 *</label>
              <input
                type="text"
                class="form-input"
                bind:value={title}
                placeholder="예: 파리대왕"
              />
            </div>

            <div class="form-group">
              <label class="form-label">설명 (선택)</label>
              <input
                type="text"
                class="form-input"
                bind:value={description}
                placeholder="소설에 대한 간단한 설명"
              />
            </div>

            <div class="form-group">
              <label class="form-label">소설 본문 *</label>
              <textarea
                class="form-textarea"
                bind:value={novelText}
                placeholder="소설 전체 텍스트를 여기에 붙여넣기 하세요...

최소 100자 이상 입력해주세요. 더 긴 텍스트일수록 더 풍부한 스토리가 생성됩니다."
              />
              <div class="textarea-info">
                {#if novelText.length > 0}
                  <span class="text-success">
                    ✓ {novelText.length.toLocaleString()}자 입력됨
                    {#if novelText.length < 1000}
                      (최소 1000자 권장)
                    {/if}
                  </span>
                {:else}
                  <span class="text-muted">소설 텍스트를 입력해주세요 (최소 100자)</span>
                {/if}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">또는 파일 업로드</label>
              <input
                type="file"
                accept=".txt"
                class="file-input"
                onchange={handleFileUpload}
              />
            </div>

            {#if canGoNext()}
              <div class="success-banner">
                ✅ 준비 완료! 다음 단계로 진행하세요
              </div>
            {/if}
          </div>
        </div>

      {:else if currentStep === 2}
        <!-- 2단계: 설정 -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">⚙️ 2단계: 스토리 설정</h2>
            <p class="card-desc">생성할 스토리의 규모를 설정하세요</p>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label">에피소드 수 (1-10)</label>
              <div class="slider-container">
                <input
                  type="range"
                  min="1"
                  max="10"
                  bind:value={numEpisodes}
                  class="slider"
                />
                <span class="slider-value">{numEpisodes}화</span>
              </div>
              <p class="field-hint">더 많은 에피소드는 더 긴 스토리를 생성합니다</p>
            </div>

            <div class="form-group">
              <label class="form-label">분기 깊이 (1-5)</label>
              <div class="slider-container">
                <input
                  type="range"
                  min="1"
                  max="5"
                  bind:value={maxDepth}
                  class="slider"
                />
                <span class="slider-value">레벨 {maxDepth}</span>
              </div>
              <p class="field-hint">더 깊은 분기는 더 복잡한 선택을 제공합니다</p>
            </div>

            <div class="info-card">
              <h3 class="info-title">📊 예상 생성 규모</h3>
              <ul class="info-list">
                <li>총 에피소드: <strong>{numEpisodes}화</strong></li>
                <li>분기 깊이: <strong>레벨 {maxDepth}</strong></li>
                <li>예상 노드 수: <strong>약 {Math.pow(2, maxDepth) * numEpisodes}개</strong></li>
                <li>생성 시간: <strong>약 {Math.ceil((numEpisodes * maxDepth) / 2)}분</strong></li>
              </ul>
            </div>
          </div>
        </div>

      {:else if currentStep === 3}
        <!-- 3단계: 생성 중 -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">✨ 3단계: AI 스토리 생성 중</h2>
            <p class="card-desc">AI가 당신의 소설을 분석하고 인터랙티브 게임으로 변환하고 있습니다...</p>
          </div>
          <div class="card-body">
            {#if generating}
              <div class="generating-state">
                <div class="spinner"></div>
                <div class="progress-info">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: {progress}%"></div>
                  </div>
                  <p class="progress-text">{Math.round(progress)}% 완료</p>
                </div>
                <div class="generating-steps">
                  <div class="gen-step" class:active={progress >= 0}>
                    🔍 소설 분석 중...
                  </div>
                  <div class="gen-step" class:active={progress >= 25}>
                    👥 등장인물 추출 중...
                  </div>
                  <div class="gen-step" class:active={progress >= 50}>
                    🎭 스토리 분기 생성 중...
                  </div>
                  <div class="gen-step" class:active={progress >= 75}>
                    📝 노드 상세화 중...
                  </div>
                  <div class="gen-step" class:active={progress >= 90}>
                    ✅ 최종 검증 중...
                  </div>
                </div>
              </div>
            {:else if error}
              <div class="error-state">
                <div class="error-icon">❌</div>
                <h3 class="error-title">생성 실패</h3>
                <p class="error-message">{error}</p>
                <div class="error-actions">
                  <Button onclick={() => generateStory()}>다시 시도</Button>
                  <Button variant="outline" onclick={() => currentStep = 2}>설정 수정</Button>
                </div>
              </div>
            {/if}
          </div>
        </div>

      {:else if currentStep === 4}
        <!-- 4단계: 완료 -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">🎉 4단계: 생성 완료!</h2>
            <p class="card-desc">인터랙티브 스토리가 성공적으로 생성되었습니다</p>
          </div>
          <div class="card-body">
            {#if generatedStory}
              <div class="success-state">
                <div class="success-icon">✨</div>
                <h3 class="success-title">{generatedStory.title}</h3>
                <p class="success-desc">{generatedStory.description}</p>
                
                <div class="story-stats">
                  <div class="stat-item">
                    <span class="stat-label">총 에피소드</span>
                    <span class="stat-value">{generatedStory.totalEpisodes}화</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">총 노드</span>
                    <span class="stat-value">{generatedStory.totalNodes}개</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">생성일</span>
                    <span class="stat-value">{new Date(generatedStory.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>

                <div class="action-buttons">
                  <Button size="lg" onclick={startPlaying}>
                    🎮 지금 플레이하기
                  </Button>
                  <Button size="lg" variant="outline" onclick={createNew}>
                    ➕ 새로 만들기
                  </Button>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <!-- 네비게이션 버튼 -->
    <div class="navigation">
      <Button
        onclick={prevStep}
        disabled={currentStep === 1 || generating}
        variant="outline"
        size="lg"
      >
        ← 이전
      </Button>

      <div class="step-indicator">
        {currentStep} / 4 단계
      </div>

      <Button
        onclick={nextStep}
        disabled={!canGoNext() || currentStep === 4 || generating}
        size="lg"
      >
        다음 →
      </Button>
    </div>
  </div>
</div>

<style>
  .wizard-page {
    min-height: calc(100vh - 60px);
    background: linear-gradient(135deg, 
      hsl(var(--primary) / 0.1), 
      hsl(var(--accent) / 0.1)
    );
    padding: 2rem;
  }

  .wizard-container {
    max-width: 900px;
    margin: 0 auto;
  }

  /* 헤더 */
  .wizard-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .wizard-title {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
  }

  .wizard-subtitle {
    font-size: 1.125rem;
    color: hsl(var(--muted-foreground));
  }

  /* 진행 단계 */
  .progress-bar-container {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .steps-container {
    display: flex;
    justify-content: space-between;
  }

  .step-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .step-circle {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 2px solid hsl(var(--border));
    background: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.125rem;
    transition: all 0.3s;
  }

  .step-circle.active {
    background: hsl(var(--primary));
    border-color: hsl(var(--primary));
    color: white;
    transform: scale(1.1);
  }

  .step-circle.completed {
    background: hsl(142 76% 36%);
    border-color: hsl(142 76% 36%);
    color: white;
  }

  .step-info {
    text-align: center;
  }

  .step-title {
    font-weight: 600;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
  }

  .step-desc {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
  }

  .step-connector {
    flex: 1;
    height: 2px;
    background: hsl(var(--border));
    margin: 0 0.5rem;
    margin-bottom: 3rem;
  }

  .step-connector.completed {
    background: hsl(142 76% 36%);
  }

  /* 콘텐츠 카드 */
  .step-content {
    margin-bottom: 2rem;
  }

  .content-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .card-header {
    padding: 2rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .card-desc {
    color: hsl(var(--muted-foreground));
  }

  .card-body {
    padding: 2rem;
  }

  /* 폼 요소 */
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 1rem;
  }

  .form-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
  }

  .form-textarea {
    width: 100%;
    min-height: 300px;
    padding: 1rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    font-family: monospace;
    resize: vertical;
  }

  .form-textarea:focus {
    outline: none;
    border-color: hsl(var(--primary));
  }

  .textarea-info {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }

  .text-success {
    color: hsl(142 76% 36%);
  }

  .text-muted {
    color: hsl(var(--muted-foreground));
  }

  .file-input {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
  }

  .success-banner {
    padding: 1rem;
    background: hsl(142 76% 36% / 0.1);
    border: 1px solid hsl(142 76% 36%);
    border-radius: var(--radius-md);
    color: hsl(142 76% 36%);
    font-weight: 600;
    text-align: center;
  }

  /* 슬라이더 */
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
    width: 1.5rem;
    height: 1.5rem;
    background: hsl(var(--primary));
    border-radius: 50%;
    cursor: pointer;
  }

  .slider-value {
    min-width: 5rem;
    font-weight: 600;
    color: hsl(var(--primary));
  }

  .field-hint {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .info-card {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
    margin-top: 1.5rem;
  }

  .info-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
  }

  .info-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-list li {
    color: hsl(var(--muted-foreground));
  }

  .info-list strong {
    color: hsl(var(--foreground));
  }

  /* 생성 중 상태 */
  .generating-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 3rem 0;
  }

  .spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid hsl(var(--muted));
    border-top-color: hsl(var(--primary));
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

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
    margin-bottom: 0.75rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)));
    transition: width 0.5s;
  }

  .progress-text {
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .generating-steps {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    max-width: 400px;
  }

  .gen-step {
    padding: 0.75rem 1rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-md);
    color: hsl(var(--muted-foreground));
    transition: all 0.3s;
  }

  .gen-step.active {
    background: hsl(var(--primary) / 0.1);
    color: hsl(var(--primary));
    font-weight: 600;
  }

  /* 에러 상태 */
  .error-state {
    text-align: center;
    padding: 3rem 0;
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .error-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(0 84.2% 60.2%);
    margin-bottom: 0.5rem;
  }

  .error-message {
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
  }

  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  /* 성공 상태 */
  .success-state {
    text-align: center;
    padding: 2rem 0;
  }

  .success-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .success-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .success-desc {
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
  }

  .story-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-bottom: 2rem;
    padding: 2rem 0;
    border-top: 1px solid hsl(var(--border));
    border-bottom: 1px solid hsl(var(--border));
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(var(--foreground));
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  /* 네비게이션 */
  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .step-indicator {
    font-weight: 600;
    color: hsl(var(--muted-foreground));
  }

  @media (max-width: 768px) {
    .wizard-title {
      font-size: 2rem;
    }

    .steps-container {
      flex-direction: column;
      gap: 1rem;
    }

    .step-connector {
      display: none;
    }

    .story-stats {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>

