class AudioAlertService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private lastAlertTime: number = 0;
  private lastSpeechTime: number = 0;

  constructor() {
    const saved = localStorage.getItem('fogsafe_audio_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('fogsafe_audio_muted', String(this.isMuted));
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

  public playTone(freq: number, type: OscillatorType, durationMs: number, gainVal: number = 0.15) {
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

  public triggerRiskAlert(riskLevel: string) {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.lastAlertTime < 800) return; // Prevent sound flood
    this.lastAlertTime = now;

    if (riskLevel === 'CRITICAL') {
      // Rapid dual emergency siren
      this.playTone(880, 'sawtooth', 180, 0.25);
      setTimeout(() => this.playTone(720, 'sawtooth', 220, 0.25), 200);
      
      // Voice alert for STOP
      if (now - this.lastSpeechTime > 4500 && 'speechSynthesis' in window) {
        this.lastSpeechTime = now;
        try {
          const utterance = new SpeechSynthesisUtterance("Critical collision hazard. Stop vehicle immediately.");
          utterance.rate = 1.15;
          utterance.pitch = 1.0;
          utterance.volume = 0.8;
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore speech error
        }
      }
    } else if (riskLevel === 'WARNING') {
      // High beep
      this.playTone(660, 'sine', 150, 0.18);
      setTimeout(() => this.playTone(660, 'sine', 150, 0.18), 180);
    } else if (riskLevel === 'CAUTION') {
      // Single soft chime
      this.playTone(440, 'triangle', 200, 0.10);
    }
  }

  public triggerDriverDistractionAlert() {
    // Disabled - system focuses strictly on open-pit collision hazard classes
  }
}

export const audioAlerts = new AudioAlertService();
