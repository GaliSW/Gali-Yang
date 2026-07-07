'use client';
import { useTranslations } from 'next-intl';

type Props = { active: boolean; locale: 'zh' | 'en' };

export default function Contact(_: Props) {
  const t = useTranslations('contact');
  return (
    <div className="flex min-h-dvh flex-col justify-center bg-bg px-8 py-20">
      <h2 data-stagger className="text-[clamp(40px,7.5vw,96px)] font-semibold leading-none tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
        <a href={`mailto:${t('email')}`} className="bg-gradient-to-r from-accent to-accent bg-[length:0%_4px] bg-[position:0_96%] bg-no-repeat transition-all duration-500 hover:bg-[length:100%_4px] hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">{t('email')}</a>
      </h2>
      <p data-stagger className="mt-8 border-t border-line pt-5 font-mono text-xs text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('line')}</p>
    </div>
  );
}
