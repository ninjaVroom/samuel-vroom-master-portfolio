const GLYPHS = "abcdefghijklmnopqrstuvwxyz";

export const prefersReducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scrambles text into `to`, left to right. Returns a cancel function. */
export function scramble(to: string, set: (text: string) => void, ms = 300) {
  if (prefersReducedMotion()) {
    set(to);
    return () => {};
  }
  const start = performance.now();
  let raf = 0;
  const tick = (now: number) => {
    const done = Math.floor((Math.min((now - start) / ms, 1)) * to.length);
    let out = to.slice(0, done);
    for (let i = done; i < to.length; i++) {
      out += to[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
    set(out);
    if (done < to.length) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
