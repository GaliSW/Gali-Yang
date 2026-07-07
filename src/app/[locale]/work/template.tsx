'use client';
export default function Template({ children }: { children: React.ReactNode }) {
  return <div id="page-root" className="flip-in">{children}</div>;
}
