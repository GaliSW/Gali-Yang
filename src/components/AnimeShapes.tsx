'use client';
import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// animejs.com 風格背景:科技字元資料場
// 1) stagger grid 從中心輻射波浪(anime.js 招牌)
// 2) Matrix 式字元隨機重寫 + 霓虹熱點
// 3) 電路格線底層
const COLS = 16;
const ROWS = 9;
const GLYPHS = ['0', '1', '+', '◢', '◣', '░', '▚', '╱', '<', '>', '#', 'ア', 'ニ', 'メ', '·', '%'];
const REROLL_MS = 160;
const REROLL_BATCH = 7;
const HOT_CHANCE = 0.18;

export default function AnimeShapes({ vignette = 'center' }: { vignette?: 'center' | 'left' }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const nodes = ref.current.querySelectorAll<HTMLElement>('[data-shape]');
    if (!nodes.length) return;

    const wave = animate(nodes, {
      scale: [{ to: 1.6, duration: 450 }, { to: 1, duration: 650 }],
      opacity: [{ to: 0.85, duration: 450 }, { to: 0.22, duration: 650 }],
      delay: stagger(55, { grid: [COLS, ROWS], from: 'center' }),
      ease: 'inOutQuad',
      loop: true,
      loopDelay: 900,
    });

    // 資料重寫:每 tick 隨機挑幾格換字元,少數變成霓虹熱點
    const reroll = setInterval(() => {
      for (let k = 0; k < REROLL_BATCH; k++) {
        const el = nodes[Math.floor(Math.random() * nodes.length)];
        el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const hot = Math.random() < HOT_CHANCE;
        el.style.color = hot ? '#22C55E' : '';
        el.style.textShadow = hot ? '0 0 10px rgba(34,197,94,0.8)' : '';
      }
    }, REROLL_MS);

    return () => { wave.cancel(); clearInterval(reroll); };
  }, [reduce]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 電路格線底層 */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
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
        style={{
          background: vignette === 'left'
            ? 'radial-gradient(ellipse 65% 60% at 38% 45%, rgba(10,16,31,0.82), rgba(10,16,31,0.25) 60%, transparent)'
            : 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(10,16,31,0.85), rgba(10,16,31,0.3) 62%, transparent)',
        }}
      />
    </div>
  );
}
