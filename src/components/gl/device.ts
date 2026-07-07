export function shouldLoadGL(
  nav: { deviceMemory?: number }, isMobile: boolean, reduce: boolean,
): boolean {
  if (reduce) return false;
  if (!isMobile) return true;
  return (nav.deviceMemory ?? 0) >= 4;
}
