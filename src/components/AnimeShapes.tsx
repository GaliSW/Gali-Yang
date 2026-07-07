'use client';
import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// animejs.com 風格背景:幾何圖形網格,從中心輻射的 stagger 波浪(anime.js 招牌手法)
const COLS = 16;
const ROWS = 9;
const GLYPHS = ['·', '○', '+', '◇', '△', '●', '□'];

export default function AnimeShapes() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const nodes = ref.current.querySelectorAll('[data-shape]');
    if (!nodes.length) return;
    const wave = animate(nodes, {
      scale: [{ to: 1.6, duration: 450 }, { to: 1, duration: 650 }],
      opacity: [{ to: 0.85, duration: 450 }, { to: 0.22, duration: 650 }],
      rotate: [{ to: 90, duration: 1100 }],
      delay: stagger(55, { grid: [COLS, ROWS], from: 'center' }),
      ease: 'inOutQuad',
      loop: true,
      loopDelay: 900,
    });
    return () => { wave.cancel(); };
  }, [reduce]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="grid h-full w-full place-items-center"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <span
            key={i}
            data-shape
            className={`select-none font-mono text-sm ${i % 13 === 0 ? 'text-accent' : 'text-muted'}`}
            style={{ opacity: 0.22, fontFamily: 'var(--font-mono-brand)' }}
          >
            {GLYPHS[i % GLYPHS.length]}
          </span>
        ))}
      </div>
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 65% 60% at 38% 45%, rgba(10,16,31,0.82), rgba(10,16,31,0.25) 60%, transparent)' }}
      />
    </div>
  );
}
