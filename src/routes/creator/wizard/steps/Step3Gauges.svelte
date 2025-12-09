<script lang="ts">
  import type { GaugeDto } from '$lib/api';
  export let proposedGauges: GaugeDto[] = [];
  export let selectedGaugeIds: string[] = [];
  export let loadingGauges = false;
  export let selectingGauges = false;
  export let toggleGauge: (id: string) => void;
</script>

<div class="content-card">
  <div class="card-header">
    <h2 class="card-title">3단계: 게이지 선택</h2>
    <p class="card-desc">스토리에서 사용할 상태 지표를 선택하세요 (최소 2개)</p>
  </div>
  <div class="card-body">
    {#if loadingGauges}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>AI가 소설 주제에 맞는 게이지를 제안하고 있습니다...</p>
      </div>
    {:else if proposedGauges.length > 0}
      <div class="form-group">
        <label class="form-label">AI가 제안한 게이지 (정확히 2개 선택) <span class="required">*</span></label>
        <p class="field-hint">소설의 주제와 내용에 맞춰 AI가 선택한 5가지 게이지입니다</p>
        <div class="gauge-grid">
          {#each proposedGauges as gauge}
            <button
              type="button"
              class="gauge-option"
              class:selected={selectedGaugeIds.includes(gauge.id)}
              onclick={() => toggleGauge(gauge.id)}
              disabled={selectingGauges}
            >
              <div class="gauge-check">
                {#if selectedGaugeIds.includes(gauge.id)}
                  ✓
                {/if}
              </div>
              <div class="gauge-info">
                <div class="gauge-name">{gauge.name}</div>
                <div class="gauge-desc">{gauge.meaning || gauge.description}</div>
                {#if gauge.min_label && gauge.max_label}
                  <div class="gauge-range">
                    {gauge.min_label} ↔ {gauge.max_label}
                  </div>
                {/if}
              </div>
            </button>
          {/each}
        </div>
        {#if selectedGaugeIds.length > 0}
          <p class="selection-count" class:complete={selectedGaugeIds.length === 2}>
            {selectedGaugeIds.length}/2 선택됨 {selectedGaugeIds.length === 2 ? '✓' : ''}
          </p>
        {/if}
      </div>
    {/if}
  </div>
</div>

