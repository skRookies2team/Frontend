/**
 * BGM Manager
 * 게임 전체에서 BGM을 관리하는 전역 스토어
 * 선택지 선택 시 페이지가 바뀌어도 BGM이 끊기지 않고 계속 재생됨
 *
 * 주요 기능:
 * - 브라우저 자동 재생 정책(Autoplay Policy) 대응
 * - 볼륨/음소거 설정 localStorage 저장
 * - 네트워크 에러 시 자동 재시도
 * - BGM 전환 시 페이드 인/아웃 효과
 * - 로딩/버퍼링 상태 표시
 */

import type { BgmDto } from '$lib/api/types/backend-types';

// localStorage 키
const STORAGE_KEYS = {
  VOLUME: 'bgm_volume',
  MUTED: 'bgm_muted'
} as const;

// 설정 상수
const CONFIG = {
  DEFAULT_VOLUME: 0.5,
  FADE_DURATION: 500, // 페이드 효과 지속 시간 (ms)
  FADE_INTERVAL: 50, // 페이드 업데이트 간격 (ms)
  RETRY_DELAY: 2000, // 재시도 대기 시간 (ms)
  MAX_RETRIES: 3 // 최대 재시도 횟수
} as const;

class BgmManager {
  // 오디오 인스턴스 (전역으로 하나만 유지)
  private audio: HTMLAudioElement | null = $state(null);

  // 현재 재생 중인 BGM 정보
  currentBgm = $state<BgmDto | null>(null);

  // 재생 상태
  isPlaying = $state(false);
  isPaused = $state(false);
  isLoading = $state(false); // 로딩/버퍼링 중

  // 볼륨 (0.0 ~ 1.0)
  volume = $state(CONFIG.DEFAULT_VOLUME);

  // 음소거 상태
  isMuted = $state(false);

  // 현재 에피소드 ID (에피소드가 바뀔 때만 BGM 변경)
  currentEpisodeId = $state<string | null>(null);

  // 자동 재생 정책 대응을 위한 상태
  private hasUserInteracted = false;
  pendingPlay = $state(false);
  private pendingBgm: { bgm: BgmDto; episodeId: string } | null = null;

  // 네트워크 에러 재시도
  private retryCount = 0;
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // 페이드 효과
  private fadeIntervalId: ReturnType<typeof setInterval> | null = null;
  private isFading = false;

  // 이벤트 리스너 정리용
  private eventListeners: Array<{
    target: EventTarget;
    event: string;
    handler: EventListener;
  }> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
      this.loadSettings();
      this.setupUserInteractionListeners();
    }
  }

  /**
   * 오디오 초기화
   */
  private initAudio() {
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.preload = 'auto';

    // 이벤트 리스너 등록 (정리 가능하도록)
    this.addAudioListener('play', () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.isLoading = false;
      this.pendingPlay = false;
      this.pendingBgm = null;
      this.retryCount = 0;
    });

    this.addAudioListener('pause', () => {
      this.isPlaying = false;
      this.isPaused = true;
    });

    this.addAudioListener('ended', () => {
      this.isPlaying = false;
    });

    this.addAudioListener('waiting', () => {
      this.isLoading = true;
    });

    this.addAudioListener('canplay', () => {
      this.isLoading = false;
    });

    this.addAudioListener('error', (e) => {
      console.error('[BGM] 재생 오류:', e);
      this.isPlaying = false;
      this.isLoading = false;
      this.handleNetworkError();
    });
  }

  /**
   * 오디오 이벤트 리스너 추가 (정리 가능하도록 추적)
   */
  private addAudioListener(event: string, handler: EventListener) {
    if (this.audio) {
      this.audio.addEventListener(event, handler);
      this.eventListeners.push({ target: this.audio, event, handler });
    }
  }

  /**
   * localStorage에서 설정 로드
   */
  private loadSettings() {
    try {
      const savedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME);
      const savedMuted = localStorage.getItem(STORAGE_KEYS.MUTED);

      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
      if (savedMuted !== null) {
        this.isMuted = savedMuted === 'true';
      }

      if (this.audio) {
        this.audio.volume = this.isMuted ? 0 : this.volume;
      }

      console.log('[BGM] 설정 로드:', { volume: this.volume, muted: this.isMuted });
    } catch (e) {
      console.warn('[BGM] 설정 로드 실패:', e);
    }
  }

  /**
   * localStorage에 설정 저장
   */
  private saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, this.volume.toString());
      localStorage.setItem(STORAGE_KEYS.MUTED, this.isMuted.toString());
    } catch (e) {
      console.warn('[BGM] 설정 저장 실패:', e);
    }
  }

  /**
   * 사용자 인터랙션 감지 설정
   */
  private setupUserInteractionListeners() {
    const interactionEvents = ['click', 'touchstart', 'keydown'];

    const handleInteraction = () => {
      if (this.hasUserInteracted) return;

      this.hasUserInteracted = true;
      console.log('[BGM] 사용자 인터랙션 감지됨');

      if (this.pendingBgm && this.pendingPlay) {
        console.log('[BGM] 대기 중인 BGM 재생 시도:', this.pendingBgm.bgm.filename);
        this.playInternal(this.pendingBgm.bgm, this.pendingBgm.episodeId);
      }
    };

    interactionEvents.forEach((event) => {
      document.addEventListener(event, handleInteraction, { once: false, passive: true });
      this.eventListeners.push({
        target: document,
        event,
        handler: handleInteraction as EventListener
      });
    });
  }

  /**
   * 네트워크 에러 처리 및 재시도
   */
  private handleNetworkError() {
    if (this.retryCount >= CONFIG.MAX_RETRIES) {
      console.error('[BGM] 최대 재시도 횟수 초과');
      this.retryCount = 0;
      return;
    }

    this.retryCount++;
    console.log(`[BGM] 네트워크 에러 - ${this.retryCount}/${CONFIG.MAX_RETRIES} 재시도 예정`);

    this.retryTimeoutId = setTimeout(() => {
      if (this.currentBgm && this.audio) {
        console.log('[BGM] 재시도 중...');
        const currentTime = this.audio.currentTime;
        this.audio.load();
        this.audio.currentTime = currentTime;
        this.audio.play().catch((error) => {
          console.error('[BGM] 재시도 실패:', error);
        });
      }
    }, CONFIG.RETRY_DELAY);
  }

  /**
   * 페이드 아웃 효과
   */
  private fadeOut(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audio || this.isFading) {
        resolve();
        return;
      }

      this.isFading = true;
      const startVolume = this.audio.volume;
      const steps = CONFIG.FADE_DURATION / CONFIG.FADE_INTERVAL;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      this.fadeIntervalId = setInterval(() => {
        currentStep++;
        if (this.audio) {
          this.audio.volume = Math.max(0, startVolume - volumeStep * currentStep);
        }

        if (currentStep >= steps) {
          this.clearFadeInterval();
          this.isFading = false;
          resolve();
        }
      }, CONFIG.FADE_INTERVAL);
    });
  }

  /**
   * 페이드 인 효과
   */
  private fadeIn() {
    if (!this.audio || this.isFading) return;

    this.isFading = true;
    const targetVolume = this.isMuted ? 0 : this.volume;
    this.audio.volume = 0;

    const steps = CONFIG.FADE_DURATION / CONFIG.FADE_INTERVAL;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    this.fadeIntervalId = setInterval(() => {
      currentStep++;
      if (this.audio) {
        this.audio.volume = Math.min(targetVolume, volumeStep * currentStep);
      }

      if (currentStep >= steps) {
        this.clearFadeInterval();
        this.isFading = false;
      }
    }, CONFIG.FADE_INTERVAL);
  }

  /**
   * 페이드 인터벌 정리
   */
  private clearFadeInterval() {
    if (this.fadeIntervalId) {
      clearInterval(this.fadeIntervalId);
      this.fadeIntervalId = null;
    }
  }

  /**
   * 실제 오디오 재생 로직 (내부용)
   */
  private async playInternal(bgm: BgmDto, episodeId: string, withFade = true) {
    if (!this.audio) return;

    // 기존 BGM이 재생 중이면 페이드 아웃
    if (withFade && this.isPlaying && this.currentBgm) {
      await this.fadeOut();
      this.audio.pause();
    }

    this.currentBgm = bgm;
    this.currentEpisodeId = episodeId;
    this.isLoading = true;
    this.audio.src = bgm.streamingUrl;

    try {
      await this.audio.play();
      console.log('[BGM] 재생 시작:', bgm.filename);

      // 페이드 인 효과
      if (withFade) {
        this.fadeIn();
      } else {
        this.audio.volume = this.isMuted ? 0 : this.volume;
      }

      this.pendingPlay = false;
      this.pendingBgm = null;
    } catch (error: unknown) {
      const err = error as Error;
      if (err.name === 'NotAllowedError') {
        console.warn('[BGM] 자동 재생 대기 중 (사용자 인터랙션 필요):', bgm.filename);
        this.pendingPlay = true;
        this.pendingBgm = { bgm, episodeId };
        this.isLoading = false;
      } else {
        console.error('[BGM] 재생 실패:', error);
        this.pendingPlay = false;
        this.pendingBgm = null;
      }
    }
  }

  /**
   * BGM 재생 또는 변경
   */
  play(bgm: BgmDto | undefined | null, episodeId: string) {
    if (!bgm || !bgm.streamingUrl) {
      this.stop();
      return;
    }

    // 같은 에피소드의 같은 BGM이면 계속 재생
    if (
      this.currentEpisodeId === episodeId &&
      this.currentBgm?.streamingUrl === bgm.streamingUrl &&
      this.audio &&
      !this.audio.paused
    ) {
      console.log('[BGM] 같은 에피소드, 같은 BGM - 계속 재생');
      return;
    }

    // 대기 중인 상태에서 같은 BGM이면 중복 요청 무시
    if (
      this.pendingPlay &&
      this.pendingBgm?.bgm.streamingUrl === bgm.streamingUrl &&
      this.pendingBgm?.episodeId === episodeId
    ) {
      console.log('[BGM] 이미 대기 중인 BGM - 중복 요청 무시');
      return;
    }

    console.log('[BGM] BGM 변경:', {
      previousBgm: this.currentBgm?.filename,
      newBgm: bgm.filename,
      mood: bgm.mood
    });

    this.playInternal(bgm, episodeId);
  }

  /**
   * 대기 중인 BGM 수동 재생
   */
  playPending() {
    if (this.pendingBgm && this.pendingPlay) {
      console.log('[BGM] 수동 재생 시도:', this.pendingBgm.bgm.filename);
      this.hasUserInteracted = true;
      this.playInternal(this.pendingBgm.bgm, this.pendingBgm.episodeId, false);
    }
  }

  /**
   * 대기 상태 취소
   */
  cancelPending() {
    this.pendingPlay = false;
    this.pendingBgm = null;
    console.log('[BGM] 대기 상태 취소');
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
  async stop() {
    if (this.audio) {
      // 페이드 아웃 후 중지
      if (this.isPlaying) {
        await this.fadeOut();
      }
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      this.isPaused = false;
      this.currentBgm = null;
      this.currentEpisodeId = null;
      console.log('[BGM] 중지');
    }
  }

  /**
   * 볼륨 설정 (0.0 ~ 1.0)
   */
  setVolume(value: number) {
    const clampedValue = Math.max(0, Math.min(1, value));
    this.volume = clampedValue;

    if (this.audio && !this.isMuted && !this.isFading) {
      this.audio.volume = clampedValue;
    }

    this.saveSettings();
    console.log('[BGM] 볼륨 설정:', clampedValue);
  }

  /**
   * 음소거 토글
   */
  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.audio && !this.isFading) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }

    this.saveSettings();
    console.log('[BGM] 음소거:', this.isMuted);
  }

  /**
   * 음소거 설정
   */
  setMuted(muted: boolean) {
    this.isMuted = muted;

    if (this.audio && !this.isFading) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }

    this.saveSettings();
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
   * 리소스 정리
   */
  destroy() {
    // 타이머 정리
    this.clearFadeInterval();
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }

    // 이벤트 리스너 정리
    this.eventListeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this.eventListeners = [];

    // 오디오 정리
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }

    console.log('[BGM] 리소스 정리 완료');
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
      isLoading: this.isLoading,
      pendingPlay: this.pendingPlay,
      volume: this.volume,
      isMuted: this.isMuted,
      hasUserInteracted: this.hasUserInteracted,
      retryCount: this.retryCount
    });
  }
}

// 싱글톤 인스턴스
export const bgmManager = new BgmManager();
