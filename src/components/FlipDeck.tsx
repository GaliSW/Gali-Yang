'use client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from '@/i18n/routing';
import { flipReducer, initialState, type FlipEvent, type SectionDef } from '@/lib/flip-machine';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { useStaggerIn } from '@/lib/use-stagger-in';
import LogoIntro from '@/components/LogoIntro';
import NavBar from '@/components/NavBar';
import { shouldLoadGL } from './gl/device';
import Gate from './sections/Gate';
import Hero from './sections/Hero';
import Systems from './sections/Systems';
import ClientSites from './sections/ClientSites';
import About from './sections/About';
import Contact from './sections/Contact';

const ParticleField = dynamic(() => import('./gl/ParticleField'), { ssr: false });

const SECTIONS: SectionDef[] = [
  { id: 'gate', steps: 1 }, { id: 'hero', steps: 1 }, { id: 'systems', steps: 3 },
  { id: 'clients', steps: 1 }, { id: 'about', steps: 1 }, { id: 'contact', steps: 1 },
];
const WHEEL_THRESHOLD = 30;
const TOUCH_THRESHOLD = 50;
const WHEEL_IDLE_RESET_MS = 150;
const POST_FLIP_COOLDOWN_MS = 250;

let introSeen = false;
// 保留使用者離開時的板塊位置:語言切換、從 /work 返回都會還原,不再跳回閘門
let savedPosition: { section: number; step: number } | null = null;

export default function FlipDeck({ locale }: { locale: 'zh' | 'en' }) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [intro, setIntro] = useState(() => !introSeen);
  const [glOk, setGlOk] = useState(false);
  const [state, rawDispatch] = useReducer(
    (s: typeof initialState, e: FlipEvent) => flipReducer(s, SECTIONS, e),
    undefined,
    () => (savedPosition ? { ...initialState, ...savedPosition } : initialState));
  const prevSection = useRef(state.section);
  const wheelAcc = useRef(0);
  const lastWheelAt = useRef(0);
  const cooldownUntil = useRef(0);
  const touchY = useRef(0);
  const touchEdge = useRef({ top: true, bottom: true });

  const dispatch = useCallback((e: FlipEvent) => rawDispatch(e), []);
  const handleIntroDone = useCallback(() => { introSeen = true; setIntro(false); }, []);

  useEffect(() => {
    const isMobile = matchMedia('(max-width: 768px)').matches;
    const canvas = document.createElement('canvas');
    const hasGL = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    setGlOk(hasGL && shouldLoadGL(navigator as { deviceMemory?: number }, isMobile, reduce));
  }, [reduce]);

  useEffect(() => {
    if (reduce) return; // reduced-motion:一般文件流,不劫持
    // 內容超過視窗高度的板塊:先滾動內部,滾到邊緣才翻頁
    const activeSectionEl = () =>
      document.querySelector<HTMLElement>('[data-flip-active="true"]');
    const edgeState = (el: HTMLElement | null) => ({
      top: !el || el.scrollTop <= 2,
      bottom: !el || el.scrollTop + el.clientHeight >= el.scrollHeight - 2,
    });

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const el = activeSectionEl();
      if (el && el.scrollHeight > el.clientHeight + 4) {
        const edge = edgeState(el);
        if ((e.deltaY > 0 && !edge.bottom) || (e.deltaY < 0 && !edge.top)) {
          el.scrollTop += e.deltaY; // 板塊內部滾動,不觸發翻頁
          wheelAcc.current = 0;
          return;
        }
      }
      const now = performance.now();
      if (now < cooldownUntil.current) { wheelAcc.current = 0; return; } // 翻轉剛結束:吃掉慣性尾巴
      if (now - lastWheelAt.current > WHEEL_IDLE_RESET_MS) wheelAcc.current = 0; // 新手勢,不累計舊值
      if (Math.sign(e.deltaY) !== Math.sign(wheelAcc.current)) wheelAcc.current = 0; // 換方向即重置
      lastWheelAt.current = now;
      wheelAcc.current += e.deltaY;
      if (Math.abs(wheelAcc.current) > WHEEL_THRESHOLD) {
        dispatch({ type: wheelAcc.current > 0 ? 'advance' : 'retreat' });
        wheelAcc.current = 0;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('button, a, input, textarea, select')) return;
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); dispatch({ type: 'advance' }); }
      if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); dispatch({ type: 'retreat' }); }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY;
      // 記錄觸控開始時是否已在邊緣:內容先滾完,下一次滑動才翻頁
      touchEdge.current = edgeState(activeSectionEl());
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;
      if (dy > 0 && touchEdge.current.bottom) dispatch({ type: 'advance' });
      else if (dy < 0 && touchEdge.current.top) dispatch({ type: 'retreat' });
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
  useEffect(() => {
    savedPosition = { section: state.section, step: state.step };
    if (!state.locked) cooldownUntil.current = performance.now() + POST_FLIP_COOLDOWN_MS;
  }, [state.section, state.step, state.locked]);

  const sectionProps = (i: number) => ({
    active: state.section === i, locale, step: state.section === i ? state.step : 0,
  });
  const bodies = [
    <Gate key="gate" {...sectionProps(0)} onEnter={() => dispatch({ type: 'enter' })} onRead={() => router.push('/info')} />,
    <Hero key="hero" {...sectionProps(1)} gl={glOk ? <ParticleField /> : null} />,
    <Systems key="systems" {...sectionProps(2)} gl={glOk} staticAll={reduce} />,
    <ClientSites key="clients" {...sectionProps(3)} />,
    <About key="about" {...sectionProps(4)} />,
    <Contact key="contact" {...sectionProps(5)} />,
  ];

  if (reduce) return (
    <>
      {intro && <LogoIntro onDone={handleIntroDone} />}
      <NavBar locale={locale} current={state.section} reduce onJump={() => {}} />
      <main className="pt-14">
        {bodies.slice(1).map((body, i) => (
          <div key={SECTIONS[i + 1].id} id={SECTIONS[i + 1].id}>{body}</div>
        ))}
        <div className="hidden">{bodies[0]}</div>
      </main>
    </>
  );

  return (
    <>
      {intro && <LogoIntro onDone={handleIntroDone} />}
      {state.section >= 1 && (
        <NavBar locale={locale} current={state.section} reduce={false}
          onJump={(s) => dispatch({ type: 'jump', section: s })} />
      )}
      <main id="page-root" className="fixed inset-0 overflow-hidden" aria-live="polite">
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
    </>
  );
}

function SectionShell({ children, className, active, onSettled }: {
  children: React.ReactNode; className: string; active: boolean; onSettled?: () => void;
}) {
  const ref = useStaggerIn(active);
  return (
    <div ref={ref} data-flip-active={active}
      className={`absolute inset-0 overflow-y-auto overscroll-contain ${className}`}
      onAnimationEnd={(e) => { if (e.animationName.startsWith('flipIn')) onSettled?.(); }}>
      {children}
    </div>
  );
}
