'use client';
import { useTranslations } from 'next-intl';
import AnimeShapes from '@/components/AnimeShapes';
import ScrambleTitle from '@/components/ScrambleTitle';

type Props = { active: boolean; locale: 'zh' | 'en'; gl?: React.ReactNode };

export default function Hero({ gl }: Props) {
  const t = useTranslations('hero');
  const site = useTranslations('site');
  return (
    <div className="relative min-h-dvh overflow-hidden bg-deep">
      <AnimeShapes />
      <div className="absolute inset-0">{gl}</div>
      <div className="relative z-10 px-8 pt-24 pb-16">
        <span data-stagger className="mb-6 block font-mono text-xs tracking-[0.22em] text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>{site('brand')}©</span>
        <h1 className="max-w-[13ch] text-[clamp(40px,7.5vw,96px)] font-semibold leading-[1.05] tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
          <span data-stagger className="block"><ScrambleTitle text={t('line1')} /></span>
          <span data-stagger className="block pl-[0.9em] text-accent"><ScrambleTitle text={t('line2')} /></span>
          <span data-stagger className="block"><ScrambleTitle text={t('line3')} /></span>
        </h1>
        <p data-stagger className="mt-8 max-w-[40ch] text-muted">{t('sub')}</p>
      </div>
    </div>
  );
}
