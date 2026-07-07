'use client';
import { useTranslations } from 'next-intl';
import Magnetic from '@/components/Magnetic';
import AnimeShapes from '@/components/AnimeShapes';
import ScrambleTitle from '@/components/ScrambleTitle';

type Props = { active: boolean; locale: 'zh' | 'en'; onEnter: () => void; onRead: () => void };

export default function Gate({ onEnter, onRead }: Props) {
  const t = useTranslations('gate');
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-deep px-6 text-center">
      <AnimeShapes vignette="center" />
      {/* CRT 掃描線 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(248,250,252,0.6) 2px 3px)' }}
      />
      <div className="relative max-w-2xl px-4 py-10">
        {/* HUD 四角框 */}
        <div aria-hidden className="pointer-events-none absolute -inset-2 sm:-inset-8">
          <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-accent/70" />
          <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-accent/70" />
          <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-accent/70" />
          <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-accent/70" />
        </div>

        <p data-stagger className="font-mono text-[11px] tracking-[0.3em] text-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>
          {t('eyebrow')}<span className="cursor-blink">▌</span>
        </p>
        <h2 data-stagger className="neon-green glitch-flicker mt-4 text-[clamp(46px,9vw,104px)] font-semibold leading-none tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
          <ScrambleTitle text={t('head')} />
        </h2>
        <p data-stagger className="mt-5 text-base font-medium text-fg sm:text-lg">{t('tagline')}</p>
        <p data-stagger className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">{t('body')}</p>
        <div data-stagger className="mt-9 flex flex-wrap justify-center gap-4">
          <Magnetic>
            <button onClick={onEnter} className="cursor-pointer rounded-sm border border-accent bg-accent px-8 py-3.5 font-mono text-sm font-semibold text-[#06130A] shadow-[0_0_24px_rgba(34,197,94,0.35)] transition hover:-translate-y-px hover:shadow-[0_0_36px_rgba(34,197,94,0.55)] focus-visible:outline-2 focus-visible:outline-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('enter')}</button>
          </Magnetic>
          <Magnetic>
            <button onClick={onRead} className="cursor-pointer rounded-sm border border-line px-8 py-3.5 font-mono text-sm text-fg transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('read')}</button>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
