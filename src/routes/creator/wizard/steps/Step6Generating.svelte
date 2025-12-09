<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  export let generating = false;
  export let progressMessage = '';
  export let currentEpisode = 1;
  export let actualTotalEpisodes = 0;
  export let numEpisodes = 0;
  export let totalEpisodesGenerated = 0;
  export let error = '';
  export let onBackToStep4: () => void;
</script>

<div class="content-card">
  <div class="card-header">
    <h2 class="card-title">6단계: 에피소드 생성 중</h2>
    <p class="card-desc">AI가 스토리와 디테일을 생성하고 있습니다...</p>
  </div>
  <div class="card-body">
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
          동기 방식으로 생성 중입니다. 약 1-2분 소요됩니다...
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
    {#if error}
      <div class="error-state">
        <div class="error-icon">❌</div>
        <h3 class="error-title">생성 실패</h3>
        <div class="error-detail">
          {#each error.split('\n') as line}
            <p class="error-line">{line}</p>
          {/each}
        </div>
        <div class="error-actions">
          <Button onclick={onBackToStep4}>
            ← 설정 수정
          </Button>
          <Button variant="outline" onclick={() => { alert('콘솔(F12)에서 상세 정보를 확인하세요'); }}>
            🔍 콘솔에서 자세히 보기
          </Button>
        </div>
      </div>
    {/if}
  </div>
</div>

