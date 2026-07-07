'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { clientSites } from '@/content/projects';

type Props = { active: boolean; locale: 'zh' | 'en' };

export default function ClientSites({ locale }: Props) {
  const t = useTranslations('works');
  return (
    <div className="min-h-dvh bg-bg px-8 py-20">
      <h2 data-stagger className="text-4xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{t('clientsHead')}</h2>
      <p data-stagger className="mt-1 text-sm text-muted">{t('clientsSub')}</p>
      <div data-stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {clientSites.map((c) => (
          <a key={c.domain} href={`https://${c.domain}`} target="_blank" rel="noopener noreferrer"
            className="group block overflow-hidden rounded border border-line bg-bg transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-accent">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
              <Image src={c.shot} alt={`${c.name[locale]} 網站截圖`} fill sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-5">
              <b className="font-medium">{c.name[locale]}</b>
              <span className="mt-2 block font-mono text-[11px] tracking-wider text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>
                {c.domain.toUpperCase()} · {c.platform.toUpperCase()} / {c.note[locale]}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
