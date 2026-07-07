'use client';
import { useTranslations } from 'next-intl';
import Magnetic from '@/components/Magnetic';
import { contact } from '@/content/contact';

type Props = { active: boolean; locale: 'zh' | 'en' };

export default function Contact(_: Props) {
  const t = useTranslations('contact');
  const ctaHref = contact.lineUrl || `mailto:${contact.email}?subject=${encodeURIComponent(t('cta'))}`;
  return (
    <div className="flex min-h-dvh flex-col justify-center bg-bg px-8 py-20">
      <h2 data-stagger className="text-[clamp(32px,6.5vw,84px)] font-semibold leading-none tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
        <a href={`mailto:${contact.email}`} className="bg-gradient-to-r from-accent to-accent bg-[length:0%_4px] bg-[position:0_96%] bg-no-repeat transition-all duration-500 hover:bg-[length:100%_4px] hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">{contact.email}</a>
      </h2>
      <p data-stagger className="mt-6 text-sm text-muted">{t('line')}</p>
      <div data-stagger className="mt-6">
        <Magnetic>
          <a href={ctaHref} target={contact.lineUrl ? '_blank' : undefined} rel={contact.lineUrl ? 'noopener noreferrer' : undefined}
            className="inline-block rounded-sm border border-accent bg-accent px-9 py-4 font-mono text-base font-semibold text-[#06130A] transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(34,197,94,0.35)] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            style={{ fontFamily: 'var(--font-mono-brand)' }}>
            {t('cta')} →
          </a>
        </Magnetic>
      </div>
      <div data-stagger className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-5 font-mono text-xs text-muted" style={{ fontFamily: 'var(--font-mono-brand)' }}>
        {contact.lineUrl && (
          <a href={contact.lineUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
            {t('lineLabel')} ↗
          </a>
        )}
        {contact.instagram && (
          <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
            {t('igLabel')}:@{contact.instagram} ↗
          </a>
        )}
        {contact.phone && (
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
            {t('phoneLabel')}:{contact.phone}
          </a>
        )}
        <span className="ml-auto">© GARY YANG</span>
      </div>
    </div>
  );
}
