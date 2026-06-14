import { useCallback, useRef } from 'react';
import { useEditorStore } from '../store/useEditorStore';

export function useSound() {
  const soundEnabled = useEditorStore((state) => state.soundEnabled);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playClick = useCallback((key: string) => {
    if (!soundEnabled) return;

    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;

      // Master gain node
      const masterGain = ctx.createGain();
      // Spacebar is slightly louder, default keys are moderate
      const isSpace = key === ' ' || key === 'Spacebar' || key === 'Enter';
      masterGain.gain.setValueAtTime(isSpace ? 0.4 : 0.25, now);
      masterGain.connect(ctx.destination);

      // 1. High-frequency tick (simulates plastic contact)
      const oscTick = ctx.createOscillator();
      const gainTick = ctx.createGain();
      
      oscTick.type = 'triangle';
      // Subtle pitch variance per key press
      const tickFreq = 1800 + Math.random() * 400;
      oscTick.frequency.setValueAtTime(tickFreq, now);
      
      gainTick.gain.setValueAtTime(0.06, now);
      gainTick.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
      
      oscTick.connect(gainTick);
      gainTick.connect(masterGain);
      oscTick.start(now);
      oscTick.stop(now + 0.02);

      // 2. Low-frequency thud (simulates key bottoming out in the housing)
      const oscThud = ctx.createOscillator();
      const gainThud = ctx.createGain();
      
      oscThud.type = 'sine';
      
      const baseFreq = isSpace ? (75 + Math.random() * 15) : (120 + Math.random() * 25);
      const duration = isSpace ? 0.08 : 0.05;
      
      oscThud.frequency.setValueAtTime(baseFreq, now);
      oscThud.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, now + duration);
      
      gainThud.gain.setValueAtTime(isSpace ? 0.35 : 0.2, now);
      gainThud.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      
      oscThud.connect(gainThud);
      gainThud.connect(masterGain);
      oscThud.start(now);
      oscThud.stop(now + duration + 0.01);
      
    } catch (error) {
      console.warn('Failed to synthesize mechanical click:', error);
    }
  }, [soundEnabled, initAudio]);

  return { playClick, initAudio };
}
export default useSound;
