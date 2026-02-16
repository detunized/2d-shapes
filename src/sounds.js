let ctx;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function tone(freq, start, duration, type = 'sine', gain = 0.25) {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + duration);
}

export function playCorrect() {
  tone(523, 0, 0.15);
  tone(659, 0.1, 0.2);
}

export function playWrong() {
  tone(200, 0, 0.3, 'square', 0.15);
  tone(160, 0.15, 0.3, 'square', 0.12);
}

export function playComplete() {
  tone(523, 0, 0.15);
  tone(659, 0.12, 0.15);
  tone(784, 0.24, 0.15);
  tone(1047, 0.36, 0.35);
}
