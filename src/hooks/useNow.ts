import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Ticking clock for live countdowns (1s). Auto-pauses while the tab is hidden
 * to save CPU, and stays static when the user prefers reduced motion.
 */
export function useNow(active: boolean): number {
  const reduced = useReducedMotion();
  const [ms, setMs] = useState(() => Date.now());
  const tick = active && !reduced;
  useEffect(() => {
    if (!tick) return;
    let id: number | undefined;
    const run = () => {
      window.clearInterval(id);
      if (!document.hidden) id = window.setInterval(() => setMs(Date.now()), 1000);
    };
    const vis = () => (document.hidden ? window.clearInterval(id) : run());
    run();
    document.addEventListener('visibilitychange', vis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', vis);
    };
  }, [tick]);
  return ms;
}
