import type { SoundEffect } from '../types/game';

const melodies: Partial<Record<SoundEffect, number[]>> = {
  correct: [523, 659, 784], wrong: [196, 147], unlock: [392, 523, 659, 1046],
  hint: [440, 554], 'fragment-collect': [523, 659, 784, 1046],
  warp: [130, 196, 294, 440, 659, 988], victory: [523, 659, 784, 1046, 784, 1046, 1318],
  'tick-tock': [900], 'button-click': [660],
};

export function synthesizeSound(ctx: AudioContext, sound: SoundEffect, volume: number) {
  if (sound === 'page-flip') {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * .18), ctx.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);
    const source = ctx.createBufferSource(); const filter = ctx.createBiquadFilter(); const gain = ctx.createGain();
    source.buffer = buffer; filter.type = 'highpass'; filter.frequency.value = 1800; gain.gain.value = volume;
    source.connect(filter); filter.connect(gain); gain.connect(ctx.destination); source.start(); return;
  }
  const notes = melodies[sound] ?? [440];
  notes.forEach((frequency, i) => {
    const oscillator = ctx.createOscillator(); const gain = ctx.createGain();
    const start = ctx.currentTime + i * .12;
    oscillator.type = sound === 'wrong' ? 'triangle' : 'sine'; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(volume, start + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, start + (sound === 'tick-tock' ? .04 : .35));
    oscillator.connect(gain); gain.connect(ctx.destination); oscillator.start(start); oscillator.stop(start + .4);
  });
}
