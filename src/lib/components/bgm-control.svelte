<script lang="ts">
  import { bgmManager } from '$lib/stores/bgm-manager.svelte';
  import { Button } from '$lib/components/ui/button';

  let showVolumeSlider = $state(false);
</script>

<div class="bgm-control">
  {#if bgmManager.currentBgm}
    <div class="bgm-info">
      <span class="bgm-icon">🎵</span>
      <div class="bgm-details">
        <span class="bgm-mood">{bgmManager.currentBgm.mood}</span>
        <span class="bgm-filename">{bgmManager.currentBgm.filename}</span>
      </div>
    </div>

    <div class="bgm-controls">
      <!-- 재생/일시정지 버튼 -->
      <button
        class="control-btn"
        onclick={() => bgmManager.togglePlayPause()}
        title={bgmManager.isPlaying ? '일시정지' : '재생'}
      >
        {#if bgmManager.isPlaying}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="4" y="3" width="3" height="10" rx="1"/>
            <rect x="9" y="3" width="3" height="10" rx="1"/>
          </svg>
        {:else}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 3l8 5-8 5V3z"/>
          </svg>
        {/if}
      </button>

      <!-- 볼륨 버튼 -->
      <button
        class="control-btn"
        onclick={() => showVolumeSlider = !showVolumeSlider}
        title="볼륨 조절"
      >
        {#if bgmManager.isMuted}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3L4 6H1v4h3l4 3V3zM13 8l-2-2m0 4l2-2m-2-2l2 2m-2 2l2-2" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        {:else if bgmManager.volume < 0.3}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3L4 6H1v4h3l4 3V3z"/>
          </svg>
        {:else if bgmManager.volume < 0.7}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3L4 6H1v4h3l4 3V3zM11 6.5c.5.5.5 2.5 0 3" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        {:else}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3L4 6H1v4h3l4 3V3z"/>
            <path d="M11 5c1 1 1 5 0 6M13 3.5c1.5 1.5 1.5 6.5 0 8" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        {/if}
      </button>

      <!-- 볼륨 슬라이더 -->
      {#if showVolumeSlider}
        <div class="volume-slider">
          <input
            type="range"
            min="0"
            max="100"
            value={bgmManager.volume * 100}
            oninput={(e) => bgmManager.setVolume((e.target as HTMLInputElement).valueAsNumber / 100)}
            class="volume-input"
          />
          <span class="volume-label">{Math.round(bgmManager.volume * 100)}%</span>
        </div>
      {/if}

      <!-- 음소거 토글 -->
      <button
        class="control-btn"
        onclick={() => bgmManager.toggleMute()}
        title={bgmManager.isMuted ? '음소거 해제' : '음소거'}
      >
        {#if bgmManager.isMuted}
          🔇
        {:else}
          🔊
        {/if}
      </button>
    </div>
  {/if}
</div>

<style>
  .bgm-control {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: hsl(var(--card) / 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 12px hsla(0 0% 0% / 0.2);
  }

  .bgm-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .bgm-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .bgm-details {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  .bgm-mood {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--primary));
    text-transform: capitalize;
  }

  .bgm-filename {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bgm-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
  }

  .control-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .control-btn:hover {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    transform: scale(1.05);
  }

  .volume-slider {
    position: absolute;
    right: 0;
    top: calc(100% + 0.5rem);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    box-shadow: 0 8px 24px hsla(0 0% 0% / 0.3);
    z-index: 100;
    min-width: 150px;
  }

  .volume-input {
    width: 100%;
    cursor: pointer;
  }

  .volume-label {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    text-align: center;
  }

  /* 반응형 */
  @media (max-width: 768px) {
    .bgm-control {
      padding: 0.5rem 0.75rem;
      gap: 0.75rem;
    }

    .bgm-filename {
      display: none;
    }

    .control-btn {
      width: 28px;
      height: 28px;
    }
  }
</style>
