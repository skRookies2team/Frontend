<script lang="ts">
  import type { CharacterDto } from '$lib/api';
  export let loadingAnalysis = false;
  export let summary = '';
  export let characters: CharacterDto[] = [];
  export let selectedCharacterNames: string[] = [];
  export let selectingCharacters = false;
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

