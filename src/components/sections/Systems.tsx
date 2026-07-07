'use client';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { systems } from '@/content/projects';

const ProjectPlaneLazy = dynamic(() => import('@/components/gl/ProjectPlane'), { ssr: false });

type Props = { active: boolean; step?: number; locale: 'zh' | 'en' };

export default function Systems({ step = 0, locale, gl }: Props & { gl?: boolean }) {
  const t = useTranslations('works');
  return (
    <div className="min-h-dvh overflow-hidden bg-bg px-8 py-16">
      <h2 className="text-4xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{t('systemsHead')}</h2>
      <p className="mt-1 text-sm text-muted">{t('systemsSub')}</p>
      <div className="mt-10 flex transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${step * 100}%)` }}>
        {systems.map((s, i) => (
          <article key={s.slug} className="grid w-full shrink-0 grid-cols-1 items-center gap-8 md:grid-cols-12" aria-hidden={i !== step}>
            <div className="md:col-span-7">
              <div className="aspect-[16/10] overflow-hidden rounded border border-line">
                {gl && i === step ? <ProjectPlaneLazy palette={s.palette} /> : (
                  <div className="tex h-full w-full"
                    style={{ background: `linear-gradient(115deg, ${s.palette[0]}, ${s.palette[1]} 45%, ${s.palette[2]} 75%, #0A101F 95%)` }} />
                )}
              </div>
            </div>
            <div className="md:col-span-5">
              <span className="font-mono text-xs tracking-widest text-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{s.tag[locale]}</span>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{s.name[locale]}</h3>
              <p className="mt-3 max-w-[42ch] text-sm text-muted">{s.blurb[locale]}</p>
              <a href={s.url} className="mt-5 inline-block border-b border-accent pb-1 font-mono text-xs text-fg hover:text-accent" style={{ fontFamily: 'var(--font-mono-brand)' }}>{t('view')} →</a>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 flex gap-2" aria-hidden>
        {systems.map((s, i) => (
          <span key={s.slug} className={`h-px w-10 ${i === step ? 'bg-accent' : 'bg-line'}`} />
        ))}
      </div>
    </div>
  );
}
