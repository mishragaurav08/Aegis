// "Organic & Natural" Audio Engine
// Uses Pink Noise and Harmonic Overtones for a non-robotic, tactile feel

class AudioManager {
  constructor() {
    this.ctx = null;
    this.lastPlayTime = { click: 0, hover: 0 };
  }

  _initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generates an "Organic Tap" (Wood/Plastic character)
  _organicTap() {
    this._initCtx();
    const t = this.ctx.currentTime;
    
    // 1. ORGANIC BODY (Harmonic Series)
    const fundamental = 180;
    [1, 1.5, 2.2].forEach((ratio, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * ratio, t);
      g.gain.setValueAtTime(0.2 / (i + 1), t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    });

    // 2. NATURAL TEXTURE (Filtered Pink-ish Noise)
    const bufferSize = this.ctx.sampleRate * 0.03;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Rough approximation of pink noise texture
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; 
      b6 = white * 0.115926;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gNoise = this.ctx.createGain();
    gNoise.gain.setValueAtTime(0.05, t);
    gNoise.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    noise.connect(gNoise);
    gNoise.connect(this.ctx.destination);
    noise.start(t);
  }

  playClick() {
    const now = Date.now();
    if (now - this.lastPlayTime.click < 50) return;
    this._organicTap();
    this.lastPlayTime.click = now;
  }

  playHover() {
    const now = Date.now();
    if (now - this.lastPlayTime.hover < 150) return;
    this._initCtx();
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    g.gain.setValueAtTime(0.005, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.04);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
    this.lastPlayTime.hover = now;
  }

  playSuccess() {
    this._initCtx();
    const t = this.ctx.currentTime;
    // Warm "Morning Bell" (Harmonic series)
    const base = 440; // A4
    [1, 1.25, 1.5].forEach((ratio, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(base * ratio, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.8);
    });
  }

  playAlert() {
    this._organicTap();
    setTimeout(() => this._organicTap(), 120);
  }

  playTransition() {
    this._initCtx();
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(330, this.ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.1);
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
}

export const audioManager = new AudioManager();
