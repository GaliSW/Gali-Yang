'use client';
import { useRouter } from '@/i18n/routing';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export default function TransitionLink({ href, children, className }: {
  href: string; children: React.ReactNode; className?: string;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  return (
    <a href={href} className={className}
      onClick={(e) => {
        e.preventDefault();
        if (reduce) { router.push(href); return; }
        const page = document.getElementById('page-root');
        if (!page) { router.push(href); return; }
        page.classList.add('flip-out');
        setTimeout(() => router.push(href), 560);
      }}>
      {children}
    </a>
  );
}
