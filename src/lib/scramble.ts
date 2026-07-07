export function scrambleFrame(target: string, progress: number, pool: string, rand: () => number): string {
  const chars = Array.from(target);
  const keep = Math.floor(progress * chars.length);
  return chars
    .map((ch, i) => (i < keep || ch === ' ' ? ch : pool[Math.floor(rand() * pool.length)]))
    .join('');
}
