/**
 * Strat's Chess - Web Audio API Procedural Sound Synthesizer
 * Zero-dependency audio engine for realistic piece acoustics and UI interactions.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('strats_chess_muted');
        if (stored !== null) {
          this.muted = stored === 'true';
        }
      } catch {
        // Fallback if localStorage is inaccessible
      }
    }
  }

  getContext() {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('strats_chess_muted', String(this.muted));
        localStorage.setItem('chess_sound_muted', String(this.muted)); // backward compat
      } catch {}
    }
    return this.muted;
  }

  toggleMute() {
    return this.setMuted(!this.muted);
  }

  /**
   * 1. Realistic wooden piece snap on the board
   */
  playMove() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Body tone: low frequency decaying sine wave
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.075);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.085);

      // Wooden impact transient: brief filtered click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(680, now);
      clickOsc.frequency.exponentialRampToValueAtTime(140, now + 0.025);

      clickGain.gain.setValueAtTime(0.35, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.03);
    } catch (e) {
      console.debug('[SoundEngine] playMove error', e);
    }
  }

  /**
   * 2. Resonant wooden impact with secondary bounce
   */
  playCapture() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Heavy initial hit
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(780, now);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.045);

      gain1.gain.setValueAtTime(0.6, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.055);

      // Resonant follow-through (clack) delayed by 22ms
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(420, now + 0.022);
      osc2.frequency.exponentialRampToValueAtTime(80, now + 0.1);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.5, now + 0.022);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.022);
      osc2.stop(now + 0.105);
    } catch (e) {
      console.debug('[SoundEngine] playCapture error', e);
    }
  }

  /**
   * 3. Alerting, subtle high harmonic ping
   */
  playCheck() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Primary clear bell ping
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1174.66, now); // D6

      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.41);

      // Higher harmonic shimmer
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1760.00, now); // A6 overtone

      gain2.gain.setValueAtTime(0.2, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now);
      osc2.stop(now + 0.29);
    } catch (e) {
      console.debug('[SoundEngine] playCheck error', e);
    }
  }

  /**
   * 4. Soft haptic click for buttons, pills, and widget switches
   */
  playButtonClick() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.015);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch (e) {
      console.debug('[SoundEngine] playButtonClick error', e);
    }
  }

  /**
   * 5. Harmonious two-tone chord fanfare (Victory / Game End)
   */
  playVictory() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Two-phase royal fanfare:
      // Phase 1: Dual fifth chord (F4 + C5)
      // Phase 2: Majestic major triad resolving up (A4 + C5 + F5)
      const chords = [
        // Chord 1 (0.0s): Suspenseful fifth
        { freq: 349.23, start: 0.0, dur: 0.22, gain: 0.35 }, // F4
        { freq: 523.25, start: 0.0, dur: 0.22, gain: 0.3 },  // C5
        // Chord 2 (0.24s): Triumphant resolution
        { freq: 440.00, start: 0.24, dur: 0.65, gain: 0.35 }, // A4
        { freq: 523.25, start: 0.24, dur: 0.65, gain: 0.35 }, // C5
        { freq: 698.46, start: 0.24, dur: 0.75, gain: 0.4 },  // F5
      ];

      chords.forEach(({ freq, start, dur, gain: vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + start);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(vol, now + start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + dur + 0.05);
      });
    } catch (e) {
      console.debug('[SoundEngine] playVictory error', e);
    }
  }
}

export const soundEngine = new SoundEngine();

// Primary named API
export const playMove = () => soundEngine.playMove();
export const playCapture = () => soundEngine.playCapture();
export const playCheck = () => soundEngine.playCheck();
export const playButtonClick = () => soundEngine.playButtonClick();
export const playVictory = () => soundEngine.playVictory();
export const isMuted = () => soundEngine.isMuted();
export const setMuted = (m) => soundEngine.setMuted(m);
export const toggleMute = () => soundEngine.toggleMute();

// Compatible aliases
export const playMoveSound = playMove;
export const playCaptureSound = playCapture;
export const playCheckSound = playCheck;
export const playGameEndSound = playVictory;

export default soundEngine;
