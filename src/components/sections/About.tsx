'use client';
import { useTranslations } from 'next-intl';

type Props = { active: boolean; locale: 'zh' | 'en' };

export default function About(_: Props) {
  const t = useTranslations('about');
  const caps = t.raw('caps') as { t: string; d: string }[];
  return (
    <div className="grid min-h-dvh grid-cols-1 gap-10 bg-deep px-8 py-24 md:grid-cols-3">
      <span data-stagger className="font-mono text-xs tracking-widest text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('label')}</span>
      <div className="md:col-span-2">
        <h2 data-stagger className="text-[clamp(26px,4vw,44px)] font-medium leading-snug tracking-tight" style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}>{t('head')}</h2>
        <p data-stagger className="mt-6 max-w-[58ch] text-muted">{t('p1')}</p>
        <ul data-stagger className="mt-9 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
          {caps.map((c) => (
            <li key={c.t} className="bg-deep p-5 font-mono text-sm transition-colors hover:bg-raise" style={{ fontFamily: 'var(--font-mono-brand)' }}>
              {c.t}<small className="mt-1 block text-[11px] text-muted">{c.d}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
