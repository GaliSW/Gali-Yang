'use client';
import { useRef, useState, useEffect } from 'react';
import { scrambleFrame } from '@/lib/scramble';
import { useReducedMotion } from '@/lib/use-reduced-motion';

const POOL = 'アイウエオ01<>/*+#=△▲◼';
const DURATION = 350;

export default function ScrambleTitle({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const raf = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const play = () => {
    if (reduce) return;
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION);
      setDisplay(scrambleFrame(text, p, POOL, Math.random));
      if (p < 1) raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
  };

  return <span className={className} onMouseEnter={play}>{display}</span>;
}
