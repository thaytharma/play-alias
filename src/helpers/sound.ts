export type SoundLevel = 'off' | 'low' | 'high';

const SOUND_GAIN: Record<SoundLevel, number> = {
  off: 0,
  low: 0.12,
  high: 0.4,
};

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const Ctor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) {
    return null;
  }
  if (!audioContext) {
    audioContext = new Ctor();
  }
  return audioContext;
}

/**
 * Create/resume the audio context from within a user gesture. Mobile browsers
 * (notably iOS Safari) keep it suspended until this happens, so call it on the
 * tap that starts a round.
 */
export function unlockAudio(): void {
  const ctx = getContext();
  if (ctx && ctx.state === 'suspended') {
    void ctx.resume();
  }
}

interface Note {
  freq: number;
  /** Seconds from now to start the note. */
  delay?: number;
  /** Note length in seconds. */
  duration: number;
  /** 0..1, before the level multiplier. */
  volume: number;
}

/** Schedule one short tone with a quick attack and exponential decay. */
function tone(ctx: AudioContext, { freq, delay = 0, duration, volume }: Note): void {
  const start = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

/** Run `play` with a ready audio context, scaled to the chosen level. */
function withSound(level: SoundLevel, play: (ctx: AudioContext, volume: number) => void): void {
  const volume = SOUND_GAIN[level];
  if (!volume) {
    return;
  }
  const ctx = getContext();
  if (!ctx) {
    return;
  }
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }
  play(ctx, volume);
}

/** A short tick for each of the final countdown seconds. */
export function playTick(level: SoundLevel): void {
  withSound(level, (ctx, volume) => {
    tone(ctx, { freq: 880, duration: 0.05, volume });
  });
}

/** A soft, quiet blip when the word changes — subtle enough to repeat often. */
export function playWordChange(level: SoundLevel): void {
  withSound(level, (ctx, volume) => {
    tone(ctx, { freq: 520, duration: 0.04, volume: volume * 0.45 });
  });
}

/** A gentle descending two-note chime when the round's time is up. */
export function playTimeUp(level: SoundLevel): void {
  withSound(level, (ctx, volume) => {
    tone(ctx, { freq: 587.33, duration: 0.18, volume: volume * 0.8 });
    tone(ctx, { freq: 440, delay: 0.16, duration: 0.28, volume: volume * 0.8 });
  });
}
