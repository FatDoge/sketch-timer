// Using Web Audio API to avoid external asset dependencies
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

const playTone = (freq: number, type: OscillatorType, duration: number, delay: number = 0) => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
  
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime + delay);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(audioCtx.currentTime + delay);
  oscillator.stop(audioCtx.currentTime + delay + duration);
};

export const playStartSound = () => {
  // A cheerful upward arpeggio
  playTone(440, 'sine', 0.3, 0);       // A4
  playTone(554.37, 'sine', 0.3, 0.1);  // C#5
  playTone(659.25, 'sine', 0.6, 0.2);  // E5
};

export const playEndSound = () => {
  // A gentle ding-dong pattern
  playTone(880, 'triangle', 1.0, 0);    // A5
  playTone(698.46, 'triangle', 1.5, 0.4); // F5
};

export const playTickSound = () => {
  // Very quiet tick
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.05);
};