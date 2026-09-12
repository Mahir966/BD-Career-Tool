import { useCallback, useEffect, useState } from 'react';
import type { ThemeMode } from '../types';

const KEY = 'bct-theme';

function systemDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const s = localStorage.getItem(KEY);
      return s === 'light' || s === 'dark' || s === 'system' ? s : 'system';
    } catch {
      return 'system';
    }
  });

  useEffect(() => {
    const apply = () => {
      const dark = mode === 'dark' || (mode === 'system' && systemDark());
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.dataset.themeMode = mode;
    };
    apply();
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* ignore */
    }
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);
  return { mode, setMode };
}
