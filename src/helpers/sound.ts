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

/**
 * Play a short countdown tick at the given level. A no-op when the level is
 * `off` or the Web Audio API is unavailable.
 */
export function playTick(level: SoundLevel): void {
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

  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  // Quick attack, short decay — a clean tick rather than a sustained beep.
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.06);
}
