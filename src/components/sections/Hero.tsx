'use client';
import { useTranslations } from 'next-intl';
import ScrambleTitle from '@/components/ScrambleTitle';

type Props = { active: boolean; locale: 'zh' | 'en'; gl?: React.ReactNode };

export default function Hero({ gl }: Props) {
  const t = useTranslations('hero');
  return (
    <div className="relative min-h-dvh overflow-hidden bg-deep">
      <div className="absolute inset-0">{gl}</div>
      <div className="relative z-10 px-8 pt-28 pb-16">
        <h1 className="max-w-[11ch] text-[clamp(44px,8.5vw,108px)] font-semibold leading-[1.02] tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
          <span data-stagger className="block"><ScrambleTitle text={t('line1')} /></span>
          <span data-stagger className="block pl-[0.9em] text-accent"><ScrambleTitle text={t('line2')} /></span>
          <span data-stagger className="block"><ScrambleTitle text={t('line3')} /></span>
        </h1>
        <p data-stagger className="mt-8 max-w-[40ch] text-muted">{t('sub')}</p>
      </div>
    </div>
  );
}
