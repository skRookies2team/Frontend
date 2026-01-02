/**
 * BGM Manager
 * 게임 전체에서 BGM을 관리하는 전역 스토어
 * 선택지 선택 시 페이지가 바뀌어도 BGM이 끊기지 않고 계속 재생됨
 *
 * 브라우저 자동 재생 정책(Autoplay Policy) 대응:
 * - 사용자 인터랙션 없이는 소리 있는 미디어 자동 재생이 차단됨
 * - 재생 실패 시 대기 상태로 저장하고, 사용자 인터랙션 감지 후 자동 재시도
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

  // 자동 재생 정책 대응을 위한 상태
  private hasUserInteracted = false; // 사용자가 페이지와 상호작용했는지
  pendingPlay = $state(false); // 재생 대기 중인지 (UI에서 표시용)
  private pendingBgm: { bgm: BgmDto; episodeId: string } | null = null; // 대기 중인 BGM 정보

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
        this.pendingPlay = false; // 재생 성공 시 대기 상태 해제
        this.pendingBgm = null;
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

      // 사용자 인터랙션 감지 - 한 번이라도 상호작용하면 이후 자동 재생 가능
      this.setupUserInteractionListeners();
    }
  }

  /**
   * 사용자 인터랙션 감지 설정
   * 클릭, 터치, 키 입력 시 대기 중인 BGM 자동 재생 시도
   */
  private setupUserInteractionListeners() {
    const interactionEvents = ['click', 'touchstart', 'keydown'];

    const handleInteraction = () => {
      if (this.hasUserInteracted) return;

      this.hasUserInteracted = true;
      console.log('[BGM] 사용자 인터랙션 감지됨');

      // 대기 중인 BGM이 있으면 재생 시도
      if (this.pendingBgm && this.pendingPlay) {
        console.log('[BGM] 대기 중인 BGM 재생 시도:', this.pendingBgm.bgm.filename);
        this.playInternal(this.pendingBgm.bgm, this.pendingBgm.episodeId);
      }
    };

    interactionEvents.forEach((event) => {
      document.addEventListener(event, handleInteraction, { once: false, passive: true });
    });
  }

  /**
   * 실제 오디오 재생 로직 (내부용)
   */
  private playInternal(bgm: BgmDto, episodeId: string) {
    if (!this.audio) return;

    this.currentBgm = bgm;
    this.currentEpisodeId = episodeId;
    this.audio.src = bgm.streamingUrl;
    this.audio.volume = this.isMuted ? 0 : this.volume;

    this.audio.play().then(() => {
      console.log('[BGM] 재생 시작:', bgm.filename);
      this.pendingPlay = false;
      this.pendingBgm = null;
    }).catch((error) => {
      // NotAllowedError: 자동 재생 정책에 의해 차단됨
      if (error.name === 'NotAllowedError') {
        console.warn('[BGM] 자동 재생 대기 중 (사용자 인터랙션 필요):', bgm.filename);
        this.pendingPlay = true;
        this.pendingBgm = { bgm, episodeId };
      } else {
        console.error('[BGM] 재생 실패:', error);
        this.pendingPlay = false;
        this.pendingBgm = null;
      }
    });
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

    // 대기 중인 상태에서 같은 BGM이면 중복 요청 무시
    if (
      this.pendingPlay &&
      this.pendingBgm?.bgm.streamingUrl === bgm.streamingUrl &&
      this.pendingBgm?.episodeId === episodeId
    ) {
      console.log('[BGM] 이미 대기 중인 BGM - 중복 요청 무시');
      return;
    }

    // 에피소드가 바뀌었거나 BGM이 달라졌으면 새로운 BGM 재생
    console.log('[BGM] BGM 변경:', {
      previousEpisode: this.currentEpisodeId,
      newEpisode: episodeId,
      previousBgm: this.currentBgm?.filename,
      newBgm: bgm.filename,
      mood: bgm.mood,
      userInteracted: this.hasUserInteracted
    });

    // 내부 재생 로직 호출
    this.playInternal(bgm, episodeId);
  }

  /**
   * 대기 중인 BGM 수동 재생 (UI에서 호출용)
   * 사용자가 직접 "재생" 버튼을 클릭할 때 사용
   */
  playPending() {
    if (this.pendingBgm && this.pendingPlay) {
      console.log('[BGM] 수동 재생 시도:', this.pendingBgm.bgm.filename);
      this.hasUserInteracted = true; // 버튼 클릭은 명확한 인터랙션
      this.playInternal(this.pendingBgm.bgm, this.pendingBgm.episodeId);
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
      pendingPlay: this.pendingPlay,
      volume: this.volume,
      isMuted: this.isMuted,
      hasUserInteracted: this.hasUserInteracted
    });
  }
}

// 싱글톤 인스턴스
export const bgmManager = new BgmManager();
