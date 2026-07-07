'use client';
import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// 科技感背景:格線 + 掃描線 + 隨機閃爍節點(anime.js 驅動)
// 節點位置為固定常數,避免 SSR/CSR 不一致
const NODES: { left: string; top: string }[] = [
  { left: '8%', top: '18%' }, { left: '22%', top: '64%' }, { left: '31%', top: '30%' },
  { left: '44%', top: '78%' }, { left: '52%', top: '12%' }, { left: '61%', top: '48%' },
  { left: '70%', top: '82%' }, { left: '78%', top: '26%' }, { left: '86%', top: '58%' },
  { left: '14%', top: '86%' }, { left: '92%', top: '10%' }, { left: '38%', top: '52%' },
];

export default function TechGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const scanline = ref.current.querySelector('[data-scanline]');
    const nodes = ref.current.querySelectorAll('[data-node]');
    const scan = scanline
      ? animate(scanline, { translateY: ['-8vh', '108vh'], duration: 7000, ease: 'inOutSine', loop: true })
      : null;
    const blink = nodes.length
      ? animate(nodes, {
          opacity: [0.08, 0.85],
          duration: 1500,
          delay: stagger(240, { from: 'random' }),
          alternate: true,
          loop: true,
          ease: 'inOutQuad',
        })
      : null;
    return () => { scan?.cancel(); blink?.cancel(); };
  }, [reduce]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        data-scanline
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.55), transparent)',
          boxShadow: '0 0 24px rgba(34,197,94,0.35)',
        }}
      />
      {NODES.map((n, i) => (
        <span
          key={i}
          data-node
          className="absolute h-1 w-1 bg-accent opacity-10"
          style={{ left: n.left, top: n.top }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 55%, transparent, rgba(10,16,31,0.75))' }}
      />
    </div>
  );
}
