'use client';
import { useTranslations } from 'next-intl';
import Magnetic from '@/components/Magnetic';

type Props = { active: boolean; locale: 'zh' | 'en'; onEnter: () => void; onRead: () => void };

export default function Gate({ onEnter, onRead }: Props) {
  const t = useTranslations('gate');
  return (
    <div className="grid min-h-dvh place-items-center bg-deep px-6 text-center">
      <div className="max-w-md">
        <h2 data-stagger className="text-3xl font-medium tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{t('head')}</h2>
        <p data-stagger className="mt-4 text-sm text-muted">{t('body')}</p>
        <div data-stagger className="mt-8 flex flex-wrap justify-center gap-4">
          <Magnetic>
            <button onClick={onEnter} className="cursor-pointer rounded-sm border border-accent bg-accent px-7 py-3 font-mono text-sm font-semibold text-[#06130A] transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('enter')}</button>
          </Magnetic>
          <Magnetic>
            <button onClick={onRead} className="cursor-pointer rounded-sm border border-line px-7 py-3 font-mono text-sm text-fg transition hover:border-muted focus-visible:outline-2 focus-visible:outline-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('read')}</button>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
