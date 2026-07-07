import { setRequestLocale } from 'next-intl/server';
import InfoContent from './info-content';

export default async function InfoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <InfoContent locale={locale as 'zh' | 'en'} />;
}
