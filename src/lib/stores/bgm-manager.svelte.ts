/**
 * BGM Manager
 * 게임 전체에서 BGM을 관리하는 전역 스토어
 * 선택지 선택 시 페이지가 바뀌어도 BGM이 끊기지 않고 계속 재생됨
 */

import type { BgmDto } from '$lib/api/types/backend-types';

class BgmManager {
  // 오디오 인스턴스 (전역으로 하나만 유지)
  private audio: HTMLAudioElement | null = $state(null);

  // 현재 재생 중인 BGM 정보
  currentBgm = $state<BgmDto | null>(null);

  // 재생 상태
  isPlaying = $state(false);
  isPaused = $state(false);

  // 볼륨 (0.0 ~ 1.0)
  volume = $state(0.5);

  // 음소거 상태
  isMuted = $state(false);

  // 현재 에피소드 ID (에피소드가 바뀔 때만 BGM 변경)
  currentEpisodeId = $state<string | null>(null);

  constructor() {
    // 브라우저 환경에서만 Audio 객체 생성
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.loop = true; // BGM은 반복 재생
      this.audio.volume = this.volume;

      // 오디오 이벤트 리스너
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.isPaused = false;
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.isPaused = true;
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
      });

      this.audio.addEventListener('error', (e) => {
        console.error('[BGM] 재생 오류:', e);
        this.isPlaying = false;
      });
    }
  }

  /**
   * BGM 재생 또는 변경
   * 같은 에피소드 내에서는 BGM을 변경하지 않음
   */
  play(bgm: BgmDto | undefined | null, episodeId: string) {
    // BGM 정보가 없으면 중지
    if (!bgm || !bgm.streamingUrl) {
      this.stop();
      return;
    }

    // 같은 에피소드의 같은 BGM이면 계속 재생 (변경하지 않음)
    if (
      this.currentEpisodeId === episodeId &&
      this.currentBgm?.streamingUrl === bgm.streamingUrl &&
      this.audio &&
      !this.audio.paused
    ) {
      console.log('[BGM] 같은 에피소드, 같은 BGM - 계속 재생');
      return;
    }

    // 에피소드가 바뀌었거나 BGM이 달라졌으면 새로운 BGM 재생
    console.log('[BGM] BGM 변경:', {
      previousEpisode: this.currentEpisodeId,
      newEpisode: episodeId,
      previousBgm: this.currentBgm?.filename,
      newBgm: bgm.filename,
      mood: bgm.mood
    });

    this.currentBgm = bgm;
    this.currentEpisodeId = episodeId;

    if (this.audio) {
      this.audio.src = bgm.streamingUrl;
      this.audio.volume = this.isMuted ? 0 : this.volume;

      // 재생 시작
      this.audio.play().catch((error) => {
        console.error('[BGM] 자동 재생 실패 (사용자 인터랙션 필요):', error);
      });
    }
  }

  /**
   * BGM 일시정지
   */
  pause() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      console.log('[BGM] 일시정지');
    }
  }

  /**
   * BGM 재개
   */
  resume() {
    if (this.audio && this.isPaused) {
      this.audio.play().catch((error) => {
        console.error('[BGM] 재생 실패:', error);
      });
      console.log('[BGM] 재개');
    }
  }

  /**
   * BGM 중지
   */
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      this.isPaused = false;
      console.log('[BGM] 중지');
    }
  }

  /**
   * 볼륨 설정 (0.0 ~ 1.0)
   */
  setVolume(value: number) {
    const clampedValue = Math.max(0, Math.min(1, value));
    this.volume = clampedValue;

    if (this.audio && !this.isMuted) {
      this.audio.volume = clampedValue;
    }

    console.log('[BGM] 볼륨 설정:', clampedValue);
  }

  /**
   * 음소거 토글
   */
  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }

    console.log('[BGM] 음소거:', this.isMuted);
  }

  /**
   * 재생/일시정지 토글
   */
  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * BGM 정보 로깅
   */
  logStatus() {
    console.log('[BGM] 현재 상태:', {
      bgm: this.currentBgm,
      episodeId: this.currentEpisodeId,
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      volume: this.volume,
      isMuted: this.isMuted
    });
  }
}

// 싱글톤 인스턴스
export const bgmManager = new BgmManager();
