// Synthesized Web Audio Sound Effects & Procedural Lo-Fi Ambiance
// 100% Zero external MP3/audio assets needed!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private campfireSource: AudioBufferSourceNode | null = null;
  private campfireGain: GainNode | null = null;
  private isCampfirePlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopCampfireAmbiance();
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopCampfireAmbiance();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  public playCoin() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playPlantTree() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  public playShipSuccess() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    });
  }

  public playLevelUp() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const chords = [
      { freq: 440.0, time: 0.0 },
      { freq: 554.37, time: 0.1 },
      { freq: 659.25, time: 0.2 },
      { freq: 880.0, time: 0.35 },
      { freq: 1108.73, time: 0.5 },
    ];

    chords.forEach(({ freq, time }) => {
      const now = ctx.currentTime + time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  // Procedural Lo-Fi Campfire Crackle Synthesizer
  public startCampfireAmbiance(): boolean {
    if (this.isMuted || this.isCampfirePlaying) return false;
    const ctx = this.getContext();
    if (!ctx) return false;

    try {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate brown noise with random crackle pops
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter
        lastOut = (lastOut + 0.02 * white) / 1.02;
        // Random crackle pops
        const pop = Math.random() > 0.997 ? (Math.random() * 2 - 1) * 0.8 : 0;
        output[i] = (lastOut * 3.5 + pop) * 0.2;
      }

      this.campfireSource = ctx.createBufferSource();
      this.campfireSource.buffer = noiseBuffer;
      this.campfireSource.loop = true;

      // Filter to simulate warm campfire resonance
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      this.campfireGain = ctx.createGain();
      this.campfireGain.gain.setValueAtTime(0.08, ctx.currentTime);

      this.campfireSource.connect(filter);
      filter.connect(this.campfireGain);
      this.campfireGain.connect(ctx.destination);

      this.campfireSource.start();
      this.isCampfirePlaying = true;
      return true;
    } catch {
      return false;
    }
  }

  public stopCampfireAmbiance() {
    if (this.campfireSource && this.isCampfirePlaying) {
      try {
        this.campfireSource.stop();
        this.campfireSource.disconnect();
      } catch {
        // Safe catch
      }
      this.campfireSource = null;
      this.isCampfirePlaying = false;
    }
  }

  public toggleCampfireAmbiance(): boolean {
    if (this.isCampfirePlaying) {
      this.stopCampfireAmbiance();
      return false;
    } else {
      return this.startCampfireAmbiance();
    }
  }

  public isCampfireActive(): boolean {
    return this.isCampfirePlaying;
  }
}

export const sound = new SoundEngine();
