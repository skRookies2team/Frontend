<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  export let metadata: any = null;
  export let storyDataId: number | null = null;
  export let startPlaying: () => void;
  export let createNew: () => void;
</script>

<div class="content-card">
  <div class="card-header">
    <h2 class="card-title">7단계: 생성 완료</h2>
    <p class="card-desc">인터랙티브 스토리가 성공적으로 생성되었습니다</p>
  </div>
  <div class="card-body">
    {#if metadata && storyDataId}
      <div class="success-state">
        <div class="success-icon">✨</div>
        <h3 class="success-title">{metadata.title}</h3>
        {#if metadata.description}
          <p class="success-desc">{metadata.description}</p>
        {/if}
        
        <div class="story-stats">
          <div class="stat-item">
            <span class="stat-label">총 에피소드</span>
            <span class="stat-value">{metadata.totalEpisodes}화</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">총 노드</span>
            <span class="stat-value">{metadata.totalNodes}개</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">게이지 수</span>
            <span class="stat-value">{metadata.totalGauges}개</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">생성일</span>
            <span class="stat-value">{new Date(metadata.createdAt).toLocaleDateString('ko-KR')}</span>
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

