<script lang="ts">
  export let endingConfig = { happy: 2, tragic: 1, neutral: 1, open: 1, bad: 0 };
  export let numEpisodes = 5;
  export let maxDepth = 3;
  export let numEpisodeEndings = 3;
  export let onEndingChange: (key: string, value: number) => void;
  export let onNumEpisodesChange: (value: number) => void;
  export let onMaxDepthChange: (value: number) => void;
  export let onNumEpisodeEndingsChange: (value: number) => void;
</script>

<div class="content-card">
  <div class="card-header">
    <h2 class="card-title">4단계: 예상 엔딩 설계</h2>
    <p class="card-desc">스토리에서 생성할 엔딩의 유형과 개수를 설정하세요</p>
  </div>
  <div class="card-body">
    <div class="config-layout">
      <div class="config-main">
        <div class="form-group">
          <label class="form-label">엔딩 구성</label>
          <div class="ending-config">
            <div class="ending-item">
              <label>😊 해피 엔딩</label>
              <input type="number" min="0" max="5" value={endingConfig.happy} oninput={(e) => onEndingChange('happy', + (e.target as HTMLInputElement).value)} class="ending-input" />
            </div>
            <div class="ending-item">
              <label>😢 비극 엔딩</label>
              <input type="number" min="0" max="5" value={endingConfig.tragic} oninput={(e) => onEndingChange('tragic', + (e.target as HTMLInputElement).value)} class="ending-input" />
            </div>
            <div class="ending-item">
              <label>😐 중립 엔딩</label>
              <input type="number" min="0" max="5" value={endingConfig.neutral} oninput={(e) => onEndingChange('neutral', + (e.target as HTMLInputElement).value)} class="ending-input" />
            </div>
            <div class="ending-item">
              <label>🤔 열린 엔딩</label>
              <input type="number" min="0" max="5" value={endingConfig.open} oninput={(e) => onEndingChange('open', + (e.target as HTMLInputElement).value)} class="ending-input" />
            </div>
            <div class="ending-item">
              <label>💀 배드 엔딩</label>
              <input type="number" min="0" max="5" value={endingConfig.bad} oninput={(e) => onEndingChange('bad', + (e.target as HTMLInputElement).value)} class="ending-input" />
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group form-group-half">
            <label class="form-label">에피소드 수 (1-10)</label>
            <div class="slider-container">
              <input type="range" min="1" max="10" value={numEpisodes} oninput={(e) => onNumEpisodesChange(+ (e.target as HTMLInputElement).value)} class="slider" />
              <span class="slider-value">{numEpisodes}화</span>
            </div>
          </div>

          <div class="form-group form-group-half">
            <label class="form-label">분기 깊이 (2-5)</label>
            <div class="slider-container">
              <input type="range" min="2" max="5" value={maxDepth} oninput={(e) => onMaxDepthChange(+ (e.target as HTMLInputElement).value)} class="slider" />
              <span class="slider-value">레벨 {maxDepth}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="config-sidebar">
        <div class="info-card">
          <h3 class="info-title">예상 생성 규모</h3>
          <ul class="info-list">
            <li>총 에피소드: <strong>{numEpisodes}화</strong></li>
            <li>분기 깊이: <strong>레벨 {maxDepth}</strong></li>
            <li>예상 노드 수: <strong>약 {Math.pow(2, maxDepth) * numEpisodes}개</strong></li>
            <li>총 엔딩 수: <strong>{Object.values(endingConfig).reduce((a, b) => a + b, 0)}개</strong></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

