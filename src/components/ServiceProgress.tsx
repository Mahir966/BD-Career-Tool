import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { percent } from '../lib/formatters';

/**
 * Service progress bar — elapsed ÷ projected total.
 * Explicitly labelled as arithmetic only (no legal-entitlement meaning).
 */
export function ServiceProgress({ completionPercent, remainingPercent }: { completionPercent: number; remainingPercent: number }) {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? completionPercent : 0);
  useEffect(() => {
    if (reduced) {
      setShown(completionPercent);
      return;
    }
    const id = requestAnimationFrame(() => setShown(completionPercent));
    return () => cancelAnimationFrame(id);
  }, [completionPercent, reduced]);

  const blocks = 18;
  const filled = Math.round((completionPercent / 100) * blocks);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('ret.serviceProgress')}</h3>
        <span className="font-mono text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-300">{percent(completionPercent)}</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(completionPercent * 10) / 10}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${t('ret.completed')} ${percent(completionPercent)} — ${t('ret.remainingPct')} ${percent(remainingPercent)}`}
        className="h-3.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 ${reduced ? '' : 'transition-[width] duration-700 ease-out'}`}
          style={{ width: `${Math.max(2, Math.min(100, shown))}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between gap-2 font-mono text-[11px] tracking-tight text-slate-600 dark:text-slate-300" aria-hidden>
        <span>
          {'█'.repeat(filled)}
          <span className="text-slate-300 dark:text-slate-600">{'░'.repeat(blocks - filled)}</span>
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-emerald-50 px-2.5 py-1.5 dark:bg-emerald-500/10">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">{t('ret.completed')}</span>
          <p className="font-mono font-bold tabular-nums text-emerald-900 dark:text-emerald-200">{percent(completionPercent)}</p>
        </div>
        <div className="rounded-lg bg-slate-100 px-2.5 py-1.5 dark:bg-slate-800">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('ret.remainingPct')}</span>
          <p className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-100">{percent(remainingPercent)}</p>
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t('ret.progressNote')}</p>
    </div>
  );
}
