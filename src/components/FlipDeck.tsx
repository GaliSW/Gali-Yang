'use client';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { flipReducer, initialState, type FlipEvent, type SectionDef } from '@/lib/flip-machine';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { useStaggerIn } from '@/lib/use-stagger-in';
import Gate from './sections/Gate';
import Hero from './sections/Hero';
import Systems from './sections/Systems';
import ClientSites from './sections/ClientSites';
import About from './sections/About';
import Contact from './sections/Contact';

const SECTIONS: SectionDef[] = [
  { id: 'gate', steps: 1 }, { id: 'hero', steps: 1 }, { id: 'systems', steps: 3 },
  { id: 'clients', steps: 1 }, { id: 'about', steps: 1 }, { id: 'contact', steps: 1 },
];
const WHEEL_THRESHOLD = 80;
const TOUCH_THRESHOLD = 50;

export default function FlipDeck({ locale }: { locale: 'zh' | 'en' }) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [state, rawDispatch] = useReducer(
    (s: typeof initialState, e: FlipEvent) => flipReducer(s, SECTIONS, e), initialState);
  const prevSection = useRef(state.section);
  const wheelAcc = useRef(0);
  const touchY = useRef(0);

  const dispatch = useCallback((e: FlipEvent) => rawDispatch(e), []);

  useEffect(() => {
    if (reduce) return; // reduced-motion:一般文件流,不劫持
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAcc.current += e.deltaY;
      if (Math.abs(wheelAcc.current) > WHEEL_THRESHOLD) {
        dispatch({ type: wheelAcc.current > 0 ? 'advance' : 'retreat' });
        wheelAcc.current = 0;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); dispatch({ type: 'advance' }); }
      if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); dispatch({ type: 'retreat' }); }
    };
    const onTouchStart = (e: TouchEvent) => { touchY.current = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) > TOUCH_THRESHOLD) dispatch({ type: dy > 0 ? 'advance' : 'retreat' });
    };
    addEventListener('wheel', onWheel, { passive: false });
    addEventListener('keydown', onKey);
    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      removeEventListener('wheel', onWheel);
      removeEventListener('keydown', onKey);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchend', onTouchEnd);
    };
  }, [dispatch, reduce]);

  useEffect(() => { prevSection.current = state.section; }, [state.section]);

  const sectionProps = (i: number) => ({
    active: state.section === i, locale, step: state.section === i ? state.step : 0,
  });
  const bodies = [
    <Gate key="gate" {...sectionProps(0)} onEnter={() => dispatch({ type: 'enter' })} onRead={() => router.push('/info')} />,
    <Hero key="hero" {...sectionProps(1)} />,
    <Systems key="systems" {...sectionProps(2)} />,
    <ClientSites key="clients" {...sectionProps(3)} />,
    <About key="about" {...sectionProps(4)} />,
    <Contact key="contact" {...sectionProps(5)} />,
  ];

  if (reduce) return <main>{bodies.slice(1)}<div className="hidden">{bodies[0]}</div></main>;

  return (
    <main className="fixed inset-0 overflow-hidden" aria-live="polite">
      {SECTIONS.map((def, i) => {
        const isCur = i === state.section;
        const isPrev = state.locked && i === prevSection.current && prevSection.current !== state.section;
        if (!isCur && !isPrev) return null;
        const cls = state.locked
          ? isCur
            ? state.direction === 1 ? 'flip-in' : 'flip-in flip-in-rev'
            : state.direction === 1 ? 'flip-out' : 'flip-out flip-out-rev'
          : '';
        return (
          <SectionShell key={def.id} className={cls} active={isCur}
            onSettled={isCur ? () => dispatch({ type: 'settle' }) : undefined}>
            {bodies[i]}
          </SectionShell>
        );
      })}
    </main>
  );
}

function SectionShell({ children, className, active, onSettled }: {
  children: React.ReactNode; className: string; active: boolean; onSettled?: () => void;
}) {
  const ref = useStaggerIn(active);
  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}
      onAnimationEnd={(e) => { if (e.animationName.startsWith('flipIn')) onSettled?.(); }}>
      {children}
    </div>
  );
}
