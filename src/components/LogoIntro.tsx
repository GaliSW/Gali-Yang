'use client';
import { useEffect, useRef } from 'react';
import { animate, stagger, svg } from 'animejs';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export default function LogoIntro({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { onDone(); return; }
    const paths = ref.current!.querySelectorAll('path, line, rect');
    const drawables = svg.createDrawable(paths as NodeListOf<SVGPathElement>);
    const draw = animate(drawables, {
      draw: ['0 0', '0 1'], duration: 1100, delay: stagger(140), ease: 'inOutQuad',
      onComplete: () => {
        animate(ref.current!, { opacity: [1, 0], duration: 450, ease: 'outQuad', onComplete: onDone });
      },
    });
    return () => { draw.cancel(); };
  }, [onDone, reduce]);

  return (
    <div ref={ref} className="fixed inset-0 z-50 grid place-items-center bg-deep">
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#22C55E" strokeWidth="2" aria-label="GARY YANG">
        <rect x="14" y="14" width="72" height="72" />
        <line x1="14" y1="86" x2="86" y2="14" />
        <line x1="30" y1="70" x2="70" y2="70" />
      </svg>
    </div>
  );
}
