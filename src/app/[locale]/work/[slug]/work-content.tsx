'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import { useTranslations } from 'next-intl';
import { getSystem } from '@/content/projects';
import { Link } from '@/i18n/routing';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export default function WorkContent({ slug, locale }: { slug: string; locale: 'zh' | 'en' }) {
  const t = useTranslations('work');
  const reduce = useReducedMotion();
  const project = getSystem(slug)!;

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis();
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, [reduce]);

  return (
    <main className="min-h-dvh bg-bg px-8 py-16">
      <Link href="/" className="font-mono text-xs text-muted hover:text-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>← {t('back')}</Link>
      <div className="relative mt-10 aspect-[16/7] overflow-hidden rounded border border-line">
        <Image src={project.shot} alt={`${project.name[locale]} 截圖`} fill priority sizes="100vw" className="object-cover object-top" />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(115deg, ${project.palette[0]}66, transparent 40%, transparent 70%, #0A101FAA 100%)` }} />
      </div>
      <span className="mt-10 block font-mono text-xs tracking-widest text-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{project.tag[locale]}</span>
      <h1 className="mt-3 max-w-[16ch] text-[clamp(32px,5vw,64px)] font-semibold leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{project.name[locale]}</h1>
      <p className="mt-5 max-w-[58ch] text-muted">{project.blurb[locale]}</p>
      <dl className="mt-8 border-t border-line pt-5">
        <dt className="font-mono text-xs text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('roleLabel')}</dt>
        <dd className="mt-1 text-sm">{t('role')}</dd>
      </dl>
      <a href={project.url} className="mt-10 inline-block border-b border-accent pb-1 font-mono text-sm hover:text-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>
        {t('visit')}:{new URL(project.url).host} →
      </a>
    </main>
  );
}
