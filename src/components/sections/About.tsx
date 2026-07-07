'use client';
import { useTranslations } from 'next-intl';

type Props = { active: boolean; locale: 'zh' | 'en' };
type Stat = { n: string; unit: string; t: string; d: string };
type Cap = { t: string; d: string };

export default function About(_: Props) {
  const t = useTranslations('about');
  const stats = t.raw('stats') as Stat[];
  const domains = t.raw('domains') as string[];
  const caps = t.raw('caps') as Cap[];
  return (
    <div className="grid min-h-dvh grid-cols-1 gap-8 bg-deep px-8 py-14 md:grid-cols-3 md:gap-10">
      <span data-stagger className="font-mono text-xs tracking-widest text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('label')}</span>
      <div className="md:col-span-2">
        <h2 data-stagger className="text-[clamp(22px,3vw,36px)] font-medium leading-snug tracking-tight" style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}>{t('head')}</h2>
        <p data-stagger className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">{t('p1')}</p>
        <p data-stagger className="mt-2 max-w-[62ch] text-sm leading-relaxed text-muted">{t('p2')}</p>

        <div data-stagger className="mt-7 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.unit} className="bg-deep p-5 transition-colors hover:bg-raise">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-accent" style={{ fontFamily: 'var(--font-display)' }}>{s.n}</span>
                <span className="font-mono text-xs text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>{s.unit}</span>
              </div>
              <div className="mt-2 text-sm font-medium">{s.t}</div>
              <div className="mt-0.5 text-xs text-muted">{s.d}</div>
            </div>
          ))}
        </div>

        <div data-stagger className="mt-7">
          <span className="font-mono text-[11px] tracking-widest text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('domainsHead').toUpperCase()}</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {domains.map((d) => (
              <span key={d} className="rounded-full border border-line px-3 py-1 text-xs text-fg transition-colors hover:border-accent">{d}</span>
            ))}
          </div>
          <p className="mt-3 max-w-[62ch] text-xs leading-relaxed text-muted">{t('domainNote')}</p>
        </div>

        <div data-stagger className="mt-7">
          <span className="font-mono text-[11px] tracking-widest text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('stackHead').toUpperCase()}</span>
          <ul className="mt-3 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {caps.map((c) => (
              <li key={c.t} className="bg-deep p-4 transition-colors hover:bg-raise">
                <div className="font-mono text-xs font-medium" style={{ fontFamily: 'var(--font-mono-brand)' }}>{c.t}</div>
                <small className="mt-1 block text-[11px] leading-relaxed text-muted">{c.d}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
