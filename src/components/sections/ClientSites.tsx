'use client';
import { useTranslations } from 'next-intl';
import { clientSites } from '@/content/projects';

type Props = { active: boolean; locale: 'zh' | 'en' };

export default function ClientSites({ locale }: Props) {
  const t = useTranslations('works');
  return (
    <div className="min-h-dvh bg-bg px-8 py-20">
      <h2 data-stagger className="text-4xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{t('clientsHead')}</h2>
      <p data-stagger className="mt-1 text-sm text-muted">{t('clientsSub')}</p>
      <div data-stagger className="mt-10 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-3">
        {clientSites.map((c) => (
          <a key={c.domain} href={`https://${c.domain}`} className="block bg-bg p-6 transition-colors hover:bg-raise focus-visible:outline-2 focus-visible:outline-accent">
            <b className="font-medium">{c.name[locale]}</b>
            <span className="mt-2 block font-mono text-[11px] tracking-wider text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>
              {c.domain.toUpperCase()} · {c.platform.toUpperCase()} / {c.note[locale]}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
