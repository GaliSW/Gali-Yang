'use client';
import { useRef } from 'react';
import { animate, createSpring } from 'animejs';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export default function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    animate(ref.current, {
      translateX: (e.clientX - r.left - r.width / 2) * strength,
      translateY: (e.clientY - r.top - r.height / 2) * strength,
      duration: 300, ease: 'outQuad',
    });
  };
  const onLeave = () => {
    if (reduce || !ref.current) return;
    animate(ref.current, { translateX: 0, translateY: 0, ease: createSpring({ stiffness: 120, damping: 12 }) });
  };
  return <div ref={ref} className="inline-block" onMouseMove={onMove} onMouseLeave={onLeave}>{children}</div>;
}
