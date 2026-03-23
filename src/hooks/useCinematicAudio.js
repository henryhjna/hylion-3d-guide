/**
 * Procedural cyberpunk audio for the onboarding cinematic.
 * Zero file downloads — all sounds generated via Web Audio API.
 */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// ── Deep bass drone (ambient background) ────────────────────────────────────
export function startDrone() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Sub bass
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(55, now); // A1
  osc1.frequency.linearRampToValueAtTime(48, now + 60);

  // Harmonic
  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(110, now);
  osc2.frequency.linearRampToValueAtTime(95, now + 60);

  // LFO for subtle wobble
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.3;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 3;
  lfo.connect(lfoGain);
  lfoGain.connect(osc1.frequency);

  // Mix
  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.12, now + 2); // fade in

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.05, now + 3);

  // Low-pass filter for warmth
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 200;
  filter.Q.value = 1;

  osc1.connect(gain1);
  osc2.connect(gain2);
  gain1.connect(filter);
  gain2.connect(filter);
  filter.connect(ctx.destination);
  lfo.start(now);
  osc1.start(now);
  osc2.start(now);

  return {
    stop: (fadeOut = 2) => {
      const t = ctx.currentTime;
      gain1.gain.linearRampToValueAtTime(0, t + fadeOut);
      gain2.gain.linearRampToValueAtTime(0, t + fadeOut);
      setTimeout(() => {
        osc1.stop(); osc2.stop(); lfo.stop();
      }, fadeOut * 1000 + 100);
    },
  };
}

// ── Section transition "whoosh" ─────────────────────────────────────────────
export function playWhoosh() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Noise burst filtered as whoosh
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(3000, now + 0.15);
  filter.frequency.exponentialRampToValueAtTime(200, now + 0.35);
  filter.Q.value = 2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.4);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
}

// ── Digital "ping" for highlights ───────────────────────────────────────────
export function playPing(freq = 1200) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.3);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

// ── Startup chime (cinematic open) ──────────────────────────────────────────
export function playStartupChime() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    const t = now + i * 0.12;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    // Reverb-like with delay
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.15;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.3;

    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 1.0);
  });
}

// ── Final "ready" sound ─────────────────────────────────────────────────────
export function playReady() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Ascending sweep
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(4000, now + 0.3);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.5);

  // Confirmation ping
  setTimeout(() => playPing(1568), 350); // G6
}

// ── Cleanup ─────────────────────────────────────────────────────────────────
export function closeAudio() {
  if (audioCtx) {
    audioCtx.close().catch(() => {});
    audioCtx = null;
  }
}
