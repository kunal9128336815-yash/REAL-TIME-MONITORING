class AudioAlertService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private lastAlertTime: number = 0;
  private lastSpeechTime: number = 0;

  // Real-time ultrasonic proximity buzzer state
  private currentBuzzerMode: 'OFF' | 'LONG_BEEP' | 'BEEP_BEEP' = 'OFF';
  private buzzerIntervalId: number | null = null;
  private continuousOsc: OscillatorNode | null = null;
  private continuousGain: GainNode | null = null;

  constructor() {
    const saved = localStorage.getItem('fogsafe_audio_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('fogsafe_audio_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopBuzzer();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playTone(freq: number, type: OscillatorType, durationMs: number, gainVal: number = 0.20) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  /**
   * Stop active buzzer sounds immediately
   */
  public stopBuzzer() {
    if (this.buzzerIntervalId !== null) {
      clearInterval(this.buzzerIntervalId);
      this.buzzerIntervalId = null;
    }
    if (this.continuousOsc) {
      try {
        if (this.continuousGain && this.ctx) {
          this.continuousGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        }
        this.continuousOsc.stop();
        this.continuousOsc.disconnect();
      } catch {}
      this.continuousOsc = null;
      this.continuousGain = null;
    }
    this.currentBuzzerMode = 'OFF';
  }

  /**
   * Real-time hardware buzzer control based on ultrasonic proximity:
   *  - < 10cm (< 0.10m): STOP / CRITICAL -> Rapid "beep beep" sound!
   *  - 10cm to 15cm (0.10m to 0.15m): WARNING -> Continuous "long beep" sound!
   *  - > 15cm (> 0.15m): SAFE -> No sound (silent)!
   */
  public updateHardwareBuzzer(distanceMeters: number | null | undefined, riskLevel: string) {
    if (this.isMuted) {
      this.stopBuzzer();
      return;
    }

    // Determine target mode
    let targetMode: 'OFF' | 'LONG_BEEP' | 'BEEP_BEEP' = 'OFF';

    if (distanceMeters !== null && distanceMeters !== undefined && distanceMeters > 0) {
      if (distanceMeters <= 0.105 || riskLevel === 'CRITICAL') {
        targetMode = 'BEEP_BEEP'; // < 0.10m: stop -> beep beep sound
      } else if (distanceMeters <= 0.155 || riskLevel === 'WARNING') {
        targetMode = 'LONG_BEEP'; // 0.10m to 0.15m: warning -> long beep sound
      } else {
        targetMode = 'OFF'; // > 0.15m: safe -> no sound
      }
    } else {
      if (riskLevel === 'CRITICAL') {
        targetMode = 'BEEP_BEEP';
      } else if (riskLevel === 'WARNING') {
        targetMode = 'LONG_BEEP';
      } else {
        targetMode = 'OFF';
      }
    }

    if (this.currentBuzzerMode === targetMode) {
      return; // Already in target mode
    }

    // Stop prior sounds before switching modes
    this.stopBuzzer();
    this.currentBuzzerMode = targetMode;

    if (targetMode === 'LONG_BEEP') {
      // 0.10m to 0.15m WARNING: Continuous long beep sound
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(840, ctx.currentTime);
        gain.gain.setValueAtTime(0.24, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        this.continuousOsc = osc;
        this.continuousGain = gain;
      } catch (e) {
        console.warn("Long beep buzzer error:", e);
      }
    } else if (targetMode === 'BEEP_BEEP') {
      // < 0.10m STOP / CRITICAL: Rapid urgent beep beep sound
      const beep = () => {
        this.playTone(950, 'square', 100, 0.28);
      };
      beep();
      this.buzzerIntervalId = window.setInterval(beep, 220);
    }
  }

  public triggerRiskAlert(riskLevel: string) {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.lastAlertTime < 800) return;
    this.lastAlertTime = now;

    if (riskLevel === 'CRITICAL') {
      this.playTone(880, 'sawtooth', 180, 0.25);
      setTimeout(() => this.playTone(720, 'sawtooth', 220, 0.25), 200);
    } else if (riskLevel === 'WARNING') {
      this.playTone(660, 'sine', 150, 0.18);
    }
  }

  public triggerDriverDistractionAlert() {
    // No-op
  }
}

export const audioAlerts = new AudioAlertService();
