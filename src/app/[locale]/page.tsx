import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('site');
  return <main className="min-h-dvh grid place-items-center">{t('brand')}</main>;
}
