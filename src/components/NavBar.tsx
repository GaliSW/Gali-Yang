'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';

export type NavTarget = { id: string; section: number };
export const NAV_TARGETS: NavTarget[] = [
  { id: 'systems', section: 2 },
  { id: 'clients', section: 3 },
  { id: 'about', section: 4 },
  { id: 'contact', section: 5 },
];

type Props = {
  locale: 'zh' | 'en';
  current: number;
  reduce: boolean;
  onJump: (section: number) => void;
};

export default function NavBar({ locale, current, reduce, onJump }: Props) {
  const t = useTranslations('nav');
  const a11y = useTranslations('a11y');
  const pathname = usePathname();
  const other = locale === 'zh' ? 'en' : 'zh';

  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-deep/75 px-5 backdrop-blur-md"
      style={{ fontFamily: 'var(--font-mono-brand)' }}>
      <button
        onClick={() => (reduce ? window.scrollTo({ top: 0 }) : onJump(1))}
        className="cursor-pointer font-mono text-xs font-semibold tracking-[0.22em] text-fg hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
        GARY YANG©
      </button>
      <div className="flex items-center gap-5 font-mono text-xs">
        {NAV_TARGETS.map((n) =>
          reduce ? (
            <a key={n.id} href={`#${n.id}`}
              className="hidden text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent sm:inline">
              {t(n.id)}
            </a>
          ) : (
            <button key={n.id} onClick={() => onJump(n.section)}
              className={`hidden cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-accent sm:inline ${current === n.section ? 'text-accent' : 'text-muted hover:text-fg'}`}>
              {t(n.id)}
            </button>
          ),
        )}
        <span className="h-4 w-px bg-line" aria-hidden />
        <Link href="/info" className="text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
          {t('static')}
        </Link>
        <Link href={pathname} locale={other} aria-label={a11y('langSwitch')}
          className="text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
          {other === 'zh' ? '中' : 'EN'}
        </Link>
      </div>
    </nav>
  );
}
