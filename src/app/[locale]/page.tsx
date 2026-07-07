import { setRequestLocale } from 'next-intl/server';
import FlipDeck from '@/components/FlipDeck';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FlipDeck locale={locale as 'zh' | 'en'} />;
}
