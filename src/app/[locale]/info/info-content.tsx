import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { systems, clientSites } from '@/content/projects';
import { contact } from '@/content/contact';
import { Link } from '@/i18n/routing';

const ACCENT = '#0B7A3E';

export default function InfoContent({ locale }: { locale: 'zh' | 'en' }) {
  const t = useTranslations('info');
  return (
    <main className="min-h-dvh bg-[#F4F6FA] text-[#1A2233] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#D8DEE9] pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{t('title')}</h1>
            <p className="mt-2 text-[#5A6478]">{t('lede')}</p>
          </div>
          <Link href="/" className="rounded border border-[#0B7A3E] px-4 py-2 text-sm font-medium text-[#0B7A3E] hover:bg-[#0B7A3E] hover:text-white focus-visible:outline-2 focus-visible:outline-[#0B7A3E]">
            ← {t('backToInteractive')}
          </Link>
        </header>

        <h2 className="mt-12 text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{t('systemsHead')}</h2>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
          {systems.map((s) => (
            <article key={s.slug} className="overflow-hidden rounded-lg border border-[#D8DEE9] bg-white shadow-sm">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative aspect-[16/10] border-b border-[#E5EAF2]">
                  <Image src={s.shot} alt={`${s.name[locale]} 截圖`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-top" />
                </div>
              </a>
              <div className="p-5">
                <span className="font-mono text-[11px] tracking-widest" style={{ color: ACCENT, fontFamily: 'var(--font-mono-brand)' }}>{s.tag[locale]}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.name[locale]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5A6478]">{s.blurb[locale]}</p>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium underline underline-offset-4" style={{ color: ACCENT }}>
                  {t('visit')} ↗
                </a>
              </div>
            </article>
          ))}
        </div>

        <h2 className="mt-14 text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{t('clientsHead')}</h2>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
          {clientSites.map((c) => (
            <article key={c.domain} className="overflow-hidden rounded-lg border border-[#D8DEE9] bg-white shadow-sm">
              <a href={`https://${c.domain}`} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative aspect-[16/10] border-b border-[#E5EAF2]">
                  <Image src={c.shot} alt={`${c.name[locale]} 截圖`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-top" />
                </div>
              </a>
              <div className="p-5">
                <span className="font-mono text-[11px] tracking-widest" style={{ color: ACCENT, fontFamily: 'var(--font-mono-brand)' }}>
                  {t('platformLabel')}:{c.platform.toUpperCase()}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{c.name[locale]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5A6478]">{c.note[locale]}</p>
                <a href={`https://${c.domain}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium underline underline-offset-4" style={{ color: ACCENT }}>
                  {c.domain} ↗
                </a>
              </div>
            </article>
          ))}
        </div>

        <footer className="mt-14 rounded-lg border border-[#D8DEE9] bg-white p-6 shadow-sm">
          <p className="font-medium">
            {t('contact')}:<a className="underline underline-offset-4" style={{ color: ACCENT }} href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
