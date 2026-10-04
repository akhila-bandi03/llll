/* ==========================================================
   WEB AUDIO API PROCEDURAL SOUND ENGINE
   Zero external audio assets needed! 100% synthesized in real-time.
   ========================================================== */

class BirthdayAudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicPlaying = false;
    this.bgInterval = null;
    this.tempo = 125;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSFX() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  // Helper note frequencies
  getFreq(note, octave = 4) {
    const notes = { 'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88 };
    const base = notes[note.toUpperCase()] || 440;
    return base * Math.pow(2, octave - 4);
  }

  // 1. POP / CONFETTI SOUND
  playPop() {
    if (!this.sfxEnabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  // 2. AIR HORN (MLG STYLE)
  playAirHorn() {
    if (!this.sfxEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    // Multi-tone chord for signature airhorn
    const freqs = [466.16, 466.16 * 1.5, 466.16 * 2]; // Bb4
    const pulses = [0, 0.14, 0.28, 0.44];

    pulses.forEach((offset, idx) => {
      const dur = (idx === pulses.length - 1) ? 0.35 : 0.09;
      freqs.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + offset);
        osc.frequency.exponentialRampToValueAtTime(f * 1.02, now + offset + dur);

        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + dur);
      });
    });
  }

  // 3. LASER BLAST
  playLaser() {
    if (!this.sfxEnabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // 4. CANDLE BLOW / WHOOSH
  playBlow() {
    if (!this.sfxEnabled) return;
    this.init();
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.4);
  }

  // 5. APPLAUSE / CROWD CHEERING (Filtered white noise + chirps)
  playApplause() {
    if (!this.sfxEnabled) return;
    this.init();
    const dur = 2.0;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + dur);

    // Add playful party whistle
    this.playWhistle(0.2);
  }

  // 6. PARTY WHISTLE
  playWhistle(delay = 0) {
    if (!this.sfxEnabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const start = this.ctx.currentTime + delay;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, start);
    osc.frequency.exponentialRampToValueAtTime(2200, start + 0.25);
    osc.frequency.setValueAtTime(2000, start + 0.35);
    osc.frequency.exponentialRampToValueAtTime(3000, start + 0.5);

    gain.gain.setValueAtTime(0.25, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(start);
    osc.stop(start + 0.55);
  }

  // 7. VICTORY FANFARE
  playVictory() {
    if (!this.sfxEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const melody = [
      { note: 'C', oct: 4, time: 0, dur: 0.15 },
      { note: 'C', oct: 4, time: 0.15, dur: 0.15 },
      { note: 'C', oct: 4, time: 0.30, dur: 0.15 },
      { note: 'G', oct: 4, time: 0.45, dur: 0.45 },
      { note: 'G#', oct: 4, time: 0.95, dur: 0.3 },
      { note: 'A#', oct: 4, time: 1.25, dur: 0.3 },
      { note: 'C', oct: 5, time: 1.55, dur: 0.6 }
    ];

    melody.forEach(item => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(this.getFreq(item.note, item.oct), now + item.time);
      gain.gain.setValueAtTime(0.2, now + item.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.time + item.dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + item.time);
      osc.stop(now + item.time + item.dur);
    });
  }

  // 8. 8-BIT HAPPY BIRTHDAY TUNE
  playHappyBirthdayTune() {
    if (!this.sfxEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const score = [
      { n: 'G', o: 4, d: 0.25, t: 0 },
      { n: 'G', o: 4, d: 0.25, t: 0.3 },
      { n: 'A', o: 4, d: 0.5,  t: 0.6 },
      { n: 'G', o: 4, d: 0.5,  t: 1.2 },
      { n: 'C', o: 5, d: 0.5,  t: 1.8 },
      { n: 'B', o: 4, d: 0.9,  t: 2.4 },

      { n: 'G', o: 4, d: 0.25, t: 3.4 },
      { n: 'G', o: 4, d: 0.25, t: 3.7 },
      { n: 'A', o: 4, d: 0.5,  t: 4.0 },
      { n: 'G', o: 4, d: 0.5,  t: 4.6 },
      { n: 'D', o: 5, d: 0.5,  t: 5.2 },
      { n: 'C', o: 5, d: 0.9,  t: 5.8 },

      { n: 'G', o: 4, d: 0.25, t: 6.8 },
      { n: 'G', o: 4, d: 0.25, t: 7.1 },
      { n: 'G', o: 5, d: 0.5,  t: 7.4 },
      { n: 'E', o: 5, d: 0.5,  t: 8.0 },
      { n: 'C', o: 5, d: 0.5,  t: 8.6 },
      { n: 'B', o: 4, d: 0.5,  t: 9.2 },
      { n: 'A', o: 4, d: 0.7,  t: 9.8 },

      { n: 'F', o: 5, d: 0.25, t: 10.6 },
      { n: 'F', o: 5, d: 0.25, t: 10.9 },
      { n: 'E', o: 5, d: 0.5,  t: 11.2 },
      { n: 'C', o: 5, d: 0.5,  t: 11.8 },
      { n: 'D', o: 5, d: 0.5,  t: 12.4 },
      { n: 'C', o: 5, d: 1.2,  t: 13.0 }
    ];

    score.forEach(item => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.getFreq(item.n, item.o), now + item.t);
      gain.gain.setValueAtTime(0.25, now + item.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + item.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + item.t);
      osc.stop(now + item.t + item.d);
    });
  }

  // 9. SLOT MACHINE SPIN & COIN
  playSlotTinkle() {
    if (!this.sfxEnabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const f = 600 + Math.random() * 800;
    osc.frequency.setValueAtTime(f, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // 10. SUSPENSE DRUM ROLL
  playDrumroll() {
    if (!this.sfxEnabled) return;
    this.init();
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90 + Math.random() * 30, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1 + (i / 20) * 0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      }, i * 60);
    }
  }

  // 11. BACKGROUND PARTY DISCO SYNTH LOOP
  togglePartyMusic(forceState = null) {
    this.init();
    const nextState = forceState !== null ? forceState : !this.musicPlaying;
    if (nextState) {
      this.musicPlaying = true;
      this.startDiscoLoop();
    } else {
      this.musicPlaying = false;
      this.stopDiscoLoop();
    }
    return this.musicPlaying;
  }

  startDiscoLoop() {
    this.stopDiscoLoop();
    let step = 0;
    const bassline = ['C3', 'C3', 'D#3', 'F3', 'G3', 'G3', 'A#3', 'C4'];
    const chordSeq = [
      ['C4', 'E4', 'G4'],
      ['C4', 'E4', 'G4'],
      ['A3', 'C4', 'E4'],
      ['F3', 'A3', 'C4']
    ];

    const stepDuration = 60 / this.tempo / 2; // 16th notes approx

    this.bgInterval = setInterval(() => {
      if (!this.musicPlaying) return;
      const now = this.ctx.currentTime;

      // Kick drum on 1, 5, 9, 13
      if (step % 4 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      }

      // Snare on 4, 12
      if (step % 8 === 4) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      }

      // Funky Synth Bass
      const bassNote = bassline[step % bassline.length];
      const noteName = bassNote.slice(0, -1);
      const oct = parseInt(bassNote.slice(-1));
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'sawtooth';
      bOsc.frequency.setValueAtTime(this.getFreq(noteName, oct), now);
      bGain.gain.setValueAtTime(0.12, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.9);
      bOsc.connect(bGain);
      bGain.connect(this.ctx.destination);
      bOsc.start(now);
      bOsc.stop(now + stepDuration);

      step++;
    }, stepDuration * 1000);
  }

  stopDiscoLoop() {
    if (this.bgInterval) {
      clearInterval(this.bgInterval);
      this.bgInterval = null;
    }
  }
}

// Global Audio Instance
window.birthdayAudio = new BirthdayAudioEngine();
