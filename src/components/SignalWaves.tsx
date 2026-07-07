'use client';
import { useEffect, useMemo, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// 信號/水波背景:
// 1) 點陣如水面般起伏(stagger grid 從中心向外傳遞的波)
// 2) 雷達 ping:數個定點的同心圓環持續向外擴散
// 3) 底部示波器波形線(程式生成的正弦折線,anime.js 反覆描繪)
const COLS = 24;
const ROWS = 13;
const PINGS = [
  { left: '18%', top: '28%', offset: 0 },
  { left: '78%', top: '22%', offset: 1100 },
  { left: '64%', top: '72%', offset: 2200 },
  { left: '28%', top: '78%', offset: 600 },
];
const RINGS_PER_PING = 3;
const RING_DURATION = 3400;

export default function SignalWaves({ vignette = 'center' }: { vignette?: 'center' | 'left' }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 示波器波形:程式生成的正弦折線(確定性,SSR/CSR 一致)
  const wavePoints = useMemo(() => {
    const pts: string[] = [];
    for (let x = 0; x <= 1200; x += 8) {
      const y = 50 + Math.sin(x / 46) * 16 + Math.sin(x / 130) * 10;
      pts.push(`${x},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const root = ref.current;

    // 水波點陣:translateY 起伏由中心向外傳遞
    const dots = root.querySelectorAll<HTMLElement>('[data-dot]');
    const ripple = dots.length
      ? animate(dots, {
          translateY: [{ to: -9, duration: 750 }, { to: 0, duration: 750 }],
          opacity: [{ to: 0.55, duration: 750 }, { to: 0.14, duration: 750 }],
          delay: stagger(42, { grid: [COLS, ROWS], from: 'center' }),
          ease: 'inOutSine',
          loop: true,
        })
      : null;

    // 雷達 ping:圓環放大淡出,環與環之間等距相位
    const ringAnims = Array.from(root.querySelectorAll<HTMLElement>('[data-ring]')).map((el) => {
      const delay = Number(el.dataset.ring ?? 0);
      return animate(el, {
        scale: [0.15, 14],
        opacity: [{ from: 0.6, to: 0 }],
        duration: RING_DURATION,
        delay,
        ease: 'outSine',
        loop: true,
      });
    });

    // 波形線:反覆描繪
    const path = root.querySelector<SVGPolylineElement>('[data-wave]');
    let waveAnim: ReturnType<typeof animate> | null = null;
    if (path) {
      const len = path.getTotalLength?.() ?? 1400;
      path.style.strokeDasharray = `${len}`;
      waveAnim = animate(path, {
        strokeDashoffset: [len, -len],
        duration: 9000,
        ease: 'linear',
        loop: true,
      });
    }

    return () => {
      ripple?.cancel();
      ringAnims.forEach((a) => a.cancel());
      waveAnim?.cancel();
    };
  }, [reduce]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 水波點陣 */}
      <div
        className="grid h-full w-full place-items-center"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <span
            key={i}
            data-dot
            className={`h-[3px] w-[3px] rounded-full ${i % 17 === 0 ? 'bg-accent' : 'bg-muted'}`}
            style={{ opacity: 0.14 }}
          />
        ))}
      </div>

      {/* 雷達 ping */}
      {PINGS.map((p, pi) => (
        <span key={pi} className="absolute" style={{ left: p.left, top: p.top }}>
          {Array.from({ length: RINGS_PER_PING }, (_, ri) => (
            <span
              key={ri}
              data-ring={p.offset + ri * (RING_DURATION / RINGS_PER_PING)}
              className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/50"
              style={{ opacity: reduce ? 0.12 : 0 }}
            />
          ))}
          <span className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/70"
            style={{ boxShadow: '0 0 10px rgba(34,197,94,0.6)' }} />
        </span>
      ))}

      {/* 示波器波形線 */}
      <svg
        className="absolute inset-x-0 bottom-[12%] h-24 w-full"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <polyline
          data-wave
          points={wavePoints}
          stroke="#22C55E"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
      </svg>

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
