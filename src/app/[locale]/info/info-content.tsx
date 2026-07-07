import { useTranslations } from 'next-intl';
import { systems, clientSites } from '@/content/projects';

export default function InfoContent({ locale }: { locale: 'zh' | 'en' }) {
  const t = useTranslations('info');
  return (
    <main className="min-h-dvh bg-[#F4F6FA] text-[#1A2233] px-6 py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-[#5A6478]">{t('lede')}</p>
        <h2 className="mt-10 text-lg font-semibold">{t('systemsHead')}</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          {systems.map((s) => (
            <li key={s.slug}>
              <a className="text-[#0B7A3E] underline" href={s.url}>{s.name[locale]}</a>
              :{s.blurb[locale]}
            </li>
          ))}
        </ul>
        <h2 className="mt-10 text-lg font-semibold">{t('clientsHead')}</h2>
        <ul className="mt-3 list-disc pl-5 space-y-2">
          {clientSites.map((c) => (
            <li key={c.domain}>
              <a className="text-[#0B7A3E] underline" href={`https://${c.domain}`}>{c.name[locale]}</a>
              :{c.note[locale]}({c.platform})
            </li>
          ))}
        </ul>
        <p className="mt-10">{t('contact')}:<a className="text-[#0B7A3E] underline" href="mailto:hello@yourname.dev">hello@yourname.dev</a></p>
      </div>
    </main>
  );
}
