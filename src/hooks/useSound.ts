import { useCallback, useRef } from "react";
import * as Tone from "tone";

let _init = false;
let _reverb: Tone.Reverb;
let _freeverb: Tone.Freeverb;
let _master: Tone.Gain;
let _noise: Tone.Noise;
let _ambientLoop: Tone.Loop | null = null;

function init() {
  if (_init) return;
  _init = true;

  _master = new Tone.Gain(-18).toDestination();

  _reverb = new Tone.Reverb({ decay: 1.5, preDelay: 0.01 }).connect(_master);
  _reverb.wet.value = 0.3;

  _freeverb = new Tone.Freeverb({ roomSize: 0.7, dampening: 3000 }).connect(_master);
  _freeverb.wet.value = 0.2;
}

function ensureStarted() {
  init();
  if (Tone.context.state === "suspended") {
    Tone.start();
  }
}

function shortNoise({ duration, freq, gain }: { duration: number; freq?: number; gain?: number }) {
  const now = Tone.now();
  const g = gain ?? 0.05;
  const src = new Tone.Noise("white");
  const gainNode = new Tone.Gain(g).connect(_master);
  const env = new Tone.AmplitudeEnvelope({
    attack: 0.002,
    decay: duration,
    release: 0,
  }).connect(gainNode);
  src.connect(env);
  if (freq) {
    const filter = new Tone.Filter(freq, "bandpass");
    filter.connect(gainNode);
    src.disconnect(env);
    src.connect(filter);
    filter.connect(env);
  }
  src.start(now);
  env.triggerAttack(now);
  env.triggerRelease(now + duration);
  src.stop(now + duration + 0.05);
}

function shortTone({
  freq,
  duration,
  type = "sine",
  gain = 0.06,
  reverb = false,
}: {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  reverb?: boolean;
}) {
  const now = Tone.now();
  const osc = new Tone.Oscillator(freq, type);
  const amp = new Tone.Gain(gain).connect(reverb ? _reverb : _master);
  osc.connect(amp);
  amp.gain.setValueAtTime(gain, now);
  amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

function twoTone({
  f1,
  f2,
  delay,
  d1,
  d2,
  type = "sine",
  gain = 0.05,
  reverb = false,
}: {
  f1: number;
  f2: number;
  delay: number;
  d1: number;
  d2: number;
  type?: OscillatorType;
  gain?: number;
  reverb?: boolean;
}) {
  shortTone({ freq: f1, duration: d1, type, gain, reverb });
  setTimeout(() => shortTone({ freq: f2, duration: d2, type, gain, reverb }), delay * 1000);
}

function noiseSweep({
  duration,
  fLow,
  fHigh,
  gain = 0.04,
  type = "white",
}: {
  duration: number;
  fLow: number;
  fHigh: number;
  gain?: number;
  type?: Tone.NoiseOptions["type"];
}) {
  const now = Tone.now();
  const src = new Tone.Noise(type);
  const filter = new Tone.AutoFilter({
    frequency: 1 / duration,
    baseFrequency: fLow,
    depth: (fHigh - fLow) / fHigh,
  }).connect(_master);
  src.connect(filter);
  const amp = new Tone.Gain(gain);
  filter.connect(amp);
  amp.gain.setValueAtTime(gain, now);
  amp.gain.exponentialRampToValueAtTime(0.001, now + duration);
  src.start(now);
  src.stop(now + duration + 0.05);
}

function bellNote(freq: number, gain: number, delay: number) {
  setTimeout(() => {
    const now = Tone.now();
    const osc = new Tone.Oscillator(freq, "sine");
    const amp = new Tone.Gain(0).connect(_reverb);
    osc.connect(amp);
    amp.gain.setValueAtTime(0, now);
    amp.gain.linearRampToValueAtTime(gain, now + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + 0.2);
    osc.start(now);
    osc.stop(now + 0.8);
  }, delay * 1000);
}

export function useSound() {
  const startedRef = useRef(false);

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    ensureStarted();
  }, []);

  const playClick = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 800, duration: 0.04, type: "sine", gain: 0.045 });
  }, [start]);

  const playPop = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 600, duration: 0.08, type: "sine", gain: 0.05 });
  }, [start]);

  const playRotateLastRef = useRef(0);
  const playRotate = useCallback(() => {
    const now = Date.now();
    if (now - playRotateLastRef.current < 80) return;
    playRotateLastRef.current = now;
    start();
    ensureStarted();
    shortTone({ freq: 420, duration: 0.06, type: "triangle", gain: 0.025 });
  }, [start]);

  const playShatter = useCallback(() => {
    start();
    ensureStarted();
    shortNoise({ duration: 0.3, freq: 8000, gain: 0.05 });
    shortTone({ freq: 200, duration: 0.15, type: "sawtooth", gain: 0.02, reverb: true });
  }, [start]);

  const playSuccess = useCallback(() => {
    start();
    ensureStarted();
    bellNote(523, 0.05, 0);
    bellNote(659, 0.05, 0.12);
    bellNote(784, 0.05, 0.24);
  }, [start]);

  const playSwipe = useCallback(() => {
    start();
    ensureStarted();
    noiseSweep({ duration: 0.15, fLow: 400, fHigh: 1200, gain: 0.03 });
  }, [start]);

  const playTock = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 400, duration: 0.05, type: "triangle", gain: 0.04 });
    shortTone({ freq: 600, duration: 0.03, type: "triangle", gain: 0.02 });
  }, [start]);

  // --- Natural/organic rewrite ---

  const playCursorMove = useCallback(() => {
    start();
    ensureStarted();
    shortNoise({ duration: 0.03, freq: 2000, gain: 0.02 });
  }, [start]);

  const playCursorHover = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 800, duration: 0.08, type: "sine", gain: 0.04 });
  }, [start]);

  const playCursorExpand = useCallback(() => {
    start();
    ensureStarted();
    noiseSweep({ duration: 0.12, fLow: 200, fHigh: 800, gain: 0.03 });
  }, [start]);

  const playWoodTap = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 300, duration: 0.05, type: "sine", gain: 0.045 });
    shortNoise({ duration: 0.04, freq: 2000, gain: 0.02 });
  }, [start]);

  const playIceCrack = useCallback(() => {
    start();
    ensureStarted();
    shortNoise({ duration: 0.15, freq: 10000, gain: 0.04 });
    setTimeout(() => {
      shortNoise({ duration: 0.4, freq: 4000, gain: 0.025 });
    }, 50);
    shortTone({ freq: 800, duration: 0.8, type: "sine", gain: 0.015, reverb: true });
  }, [start]);

  const playBambooKnock = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 120, duration: 0.04, type: "sine", gain: 0.05 });
    shortTone({ freq: 600, duration: 0.03, type: "sine", gain: 0.035 });
  }, [start]);

  const playWoodCreak = useCallback(() => {
    start();
    ensureStarted();
    const now = Tone.now();
    const osc = new Tone.Oscillator(220, "sine");
    const amp = new Tone.Gain(0.03).connect(_master);
    osc.connect(amp);
    amp.gain.setValueAtTime(0.03, now);
    amp.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.frequency.linearRampToValueAtTime(180, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.2);
  }, [start]);

  const playStoneClick = useCallback(() => {
    start();
    ensureStarted();
    shortNoise({ duration: 0.05, freq: 400, gain: 0.035 });
  }, [start]);

  const playWoodSlide = useCallback(() => {
    start();
    ensureStarted();
    shortNoise({ duration: 0.08, freq: 600, gain: 0.03 });
    shortTone({ freq: 250, duration: 0.08, type: "sine", gain: 0.02 });
  }, [start]);

  const playPaperShuffle = useCallback(() => {
    start();
    ensureStarted();
    shortNoise({ duration: 0.12, freq: 3000, gain: 0.025 });
  }, [start]);

  const playBlockSettle = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 180, duration: 0.09, type: "sine", gain: 0.045, reverb: true });
  }, [start]);

  const playExhale = useCallback(() => {
    start();
    ensureStarted();
    noiseSweep({ duration: 0.3, fLow: 100, fHigh: 500, gain: 0.025, type: "pink" });
  }, [start]);

  const playWoodTick = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 200, duration: 0.03, type: "sine", gain: 0.03 });
  }, [start]);

  const playSingingBowl = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 432, duration: 2, type: "sine", gain: 0.035, reverb: true });
    shortTone({ freq: 864, duration: 1.5, type: "sine", gain: 0.015, reverb: true });
  }, [start]);

  const playWindChime = useCallback(() => {
    start();
    ensureStarted();
    const pentatonic = [196, 220, 261, 294, 349];
    const count = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const f = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      bellNote(f, 0.04, i * 0.15);
    }
  }, [start]);

  const playWaterDrop = useCallback(() => {
    start();
    ensureStarted();
    const now = Tone.now();
    const osc = new Tone.Oscillator(1200, "sine");
    const amp = new Tone.Gain(0.04).connect(_reverb);
    osc.connect(amp);
    amp.gain.setValueAtTime(0.04, now);
    amp.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.frequency.linearRampToValueAtTime(1185, now + 0.06);
    osc.start(now);
    osc.stop(now + 0.1);
  }, [start]);

  const playAirPuff = useCallback(() => {
    start();
    ensureStarted();
    noiseSweep({ duration: 0.1, fLow: 600, fHigh: 1000, gain: 0.025 });
  }, [start]);

  const playWhoosh = useCallback(() => {
    start();
    ensureStarted();
    noiseSweep({ duration: 0.5, fLow: 200, fHigh: 1200, gain: 0.03, type: "pink" });
  }, [start]);

  const playLowBell = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 196, duration: 0.8, type: "sine", gain: 0.04, reverb: true });
  }, [start]);

  const playFocusPull = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 300, duration: 0.2, type: "sine", gain: 0.02 });
  }, [start]);

  const playFeltTap = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 240, duration: 0.04, type: "sine", gain: 0.035 });
  }, [start]);

  const playWaterPour = useCallback(() => {
    start();
    ensureStarted();
    noiseSweep({ duration: 0.4, fLow: 2000, fHigh: 6000, gain: 0.025 });
    setTimeout(() => {
      shortNoise({ duration: 0.3, freq: 3000, gain: 0.02 });
    }, 50);
  }, [start]);

  const playDidic = useCallback(() => {
    start();
    ensureStarted();
    shortTone({ freq: 880, duration: 0.06, type: "sine", gain: 0.04 });
    setTimeout(() => shortTone({ freq: 1040, duration: 0.06, type: "sine", gain: 0.035 }), 80);
    setTimeout(() => shortTone({ freq: 880, duration: 0.06, type: "sine", gain: 0.04 }), 300);
    setTimeout(() => shortTone({ freq: 1040, duration: 0.06, type: "sine", gain: 0.035 }), 380);
  }, [start]);

  const playAmbientStart = useCallback(() => {
    start();
    ensureStarted();
    if (_ambientLoop) {
      _ambientLoop.stop();
      _ambientLoop.dispose();
      _ambientLoop = null;
    }
    const now = Tone.now();
    const src = new Tone.Noise("brown");
    const filter = new Tone.Filter(80, "lowpass").connect(_master);
    src.connect(filter);
    const amp = new Tone.Gain(0.015);
    filter.connect(amp);
    src.start(now);
    _ambientLoop = new Tone.Loop((time) => {
      amp.gain.rampTo(0.015 + Math.random() * 0.005, 1);
    }, 4);
    _ambientLoop.start(0);
  }, [start]);

  const playAmbientStop = useCallback(() => {
    if (_ambientLoop) {
      _ambientLoop.stop();
      _ambientLoop.dispose();
      _ambientLoop = null;
    }
  }, []);

  return {
    start,
    playClick,
    playPop,
    playRotate,
    playShatter,
    playSuccess,
    playSwipe,
    playTock,

    // Natural sounds
    playCursorMove,
    playCursorHover,
    playCursorExpand,
    playWoodTap,
    playWindChime,
    playWaterDrop,
    playAirPuff,
    playWhoosh,
    playLowBell,
    playFocusPull,
    playFeltTap,
    playWaterPour,
    playDidic,
    playAmbientStart,
    playAmbientStop,
  };
}
