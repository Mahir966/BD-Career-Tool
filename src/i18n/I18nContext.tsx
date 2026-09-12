import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DICT } from './dictionary';
import type { Lang, LText } from '../types';

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tl: (pair: LText) => string;
}

const Ctx = createContext<I18nValue | null>(null);
const STORAGE_KEY = 'bct-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s === 'en' ? 'en' : 'bn';
    } catch {
      return 'bn';
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode — ignore */
    }
  }, [lang]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const entry = DICT[key];
      let s = entry ? entry[lang] : key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      }
      return s;
    },
    [lang],
  );

  const tl = useCallback((pair: LText) => (lang === 'bn' ? pair.bn : pair.en), [lang]);

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang: setLangState, t, tl }),
    [lang, t, tl],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n outside I18nProvider');
  return v;
}
