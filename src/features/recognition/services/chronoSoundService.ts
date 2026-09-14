import { storageService } from '../../../core/services/storage';

/**
 * Web Audio API procedural sound engine for "CHIẾN DỊCH KHÔI PHỤC DÒNG THỜI GIAN"
 * Zero external audio files, zero CORS issues, instant zero-latency playback.
 */

class ChronoSoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private bgmTimer: any = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    // Check saved mute preference via storageService
    this.isMuted = storageService.get<boolean>('chrono_muted', false);
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    storageService.set<boolean>('chrono_muted', muted);
    if (muted) {
      this.stopBgm();
    } else if (this.isBgmPlaying) {
      this.startBgm();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Short crisp mechanical/digital click
   */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio context error fallback
    }
  }

  /**
   * Card snap into timeline slot
   */
  public playSnap() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  }

  /**
   * Correct Restoration Chime (Harmonic ascending chime: C5, E5, G5, C6)
   */
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

        const startTime = ctx.currentTime + idx * 0.07;
        const duration = 0.35;
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch (e) {}
  }

  /**
   * Gentle incorrect feedback (Subtle dual-tone low thud, non-harsh)
   */
  public playWrong() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(196, ctx.currentTime); // G3
      osc.frequency.linearRampToValueAtTime(164.81, ctx.currentTime + 0.18); // E3

      // Low pass filter to keep it smooth and pleasant
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }

  /**
   * Chrono Gate opening resonant wave
   */
  public playGateOpen() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(440, ctx.currentTime);
      filter.Q.setValueAtTime(5, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch (e) {}
  }

  /**
   * Chrono Shard Crystal sparkle
   */
  public playShardCollected() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const freqs = [1318.51, 1567.98, 2093.0]; // E6, G6, C7
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

        const startTime = ctx.currentTime + idx * 0.05;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    } catch (e) {}
  }

  /**
   * Victory Fanfare: Grand victory progression
   */
  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const chords = [
        [523.25, 659.25, 783.99], // C major
        [587.33, 739.99, 880.0],  // D major
        [659.25, 830.61, 987.77], // E major
        [783.99, 987.77, 1174.66, 1567.98], // G majestic chord with octave
      ];

      chords.forEach((chord, chordIdx) => {
        const chordTime = ctx.currentTime + chordIdx * 0.22;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, chordTime);

          const dur = chordIdx === chords.length - 1 ? 0.9 : 0.28;
          gain.gain.setValueAtTime(0.12, chordTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, chordTime + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(chordTime);
          osc.stop(chordTime + dur);
        });
      });
    } catch (e) {}
  }

  /**
   * Gentle procedural adventure BGM (20% volume, ambient historical mystery)
   * Ambient chord pad loop created natively via Web Audio API oscillators
   */
  public startBgm() {
    this.isBgmPlaying = true;
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopBgmOscillators();

    try {
      // Atmospheric chord progression: Am -> F -> C -> G
      const progression = [
        [220, 261.63, 329.63], // Am (A3, C4, E4)
        [174.61, 220, 261.63], // F (F3, A3, C4)
        [261.63, 329.63, 392], // C (C4, E4, G4)
        [196, 246.94, 293.66], // G (G3, B3, D4)
      ];

      let step = 0;

      const playChordStep = () => {
        if (!this.isBgmPlaying || this.isMuted) return;
        const currentCtx = this.getContext();
        if (!currentCtx) return;

        const chord = progression[step % progression.length];
        step++;

        const stepDuration = 3.6;
        chord.forEach((freq) => {
          const osc = currentCtx.createOscillator();
          const gain = currentCtx.createGain();
          const filter = currentCtx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, currentCtx.currentTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, currentCtx.currentTime);

          // Gentle fade in and fade out (20% master volume ceiling)
          gain.gain.setValueAtTime(0.001, currentCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.035, currentCtx.currentTime + 1.2);
          gain.gain.linearRampToValueAtTime(0.001, currentCtx.currentTime + stepDuration);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(currentCtx.destination);

          osc.start(currentCtx.currentTime);
          osc.stop(currentCtx.currentTime + stepDuration);

          this.bgmOscillators.push(osc);
        });

        this.bgmTimer = setTimeout(playChordStep, (stepDuration - 0.4) * 1000);
      };

      playChordStep();
    } catch (e) {}
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.stopBgmOscillators();
  }

  private stopBgmOscillators() {
    this.bgmOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.bgmOscillators = [];
  }
}

export const chronoSoundService = new ChronoSoundService();
