import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { systems, getSystem } from '@/content/projects';
import WorkContent from './work-content';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => systems.map((s) => ({ locale, slug: s.slug })));
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!getSystem(slug)) notFound();
  return <WorkContent slug={slug} locale={locale as 'zh' | 'en'} />;
}
