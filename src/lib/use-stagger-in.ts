'use client';
import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useReducedMotion } from './use-reduced-motion';

export function useStaggerIn(active: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!active || reduce || !ref.current) return;
    const els = ref.current.querySelectorAll('[data-stagger]');
    if (!els.length) return;
    const anim = animate(els, {
      opacity: [0, 1], translateY: [24, 0],
      delay: stagger(70, { start: 350 }), duration: 650, ease: 'outExpo',
    });
    return () => { anim.cancel(); };
  }, [active, reduce]);
  return ref;
}
