'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export default function LangSwitch({ locale }: { locale: 'zh' | 'en' }) {
  const t = useTranslations('a11y');
  const pathname = usePathname();
  const other = locale === 'zh' ? 'en' : 'zh';
  return (
    <nav aria-label={t('langSwitch')} className="fixed right-5 top-5 z-40 flex gap-4 font-mono text-xs" style={{ fontFamily: 'var(--font-mono-brand)' }}>
      <Link href={pathname} locale={other} className="text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
        {other === 'zh' ? '中' : 'EN'}
      </Link>
      <Link href="/info" className="text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">{t('staticVersion')}</Link>
    </nav>
  );
}
