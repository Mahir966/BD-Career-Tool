import { ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import type { EligibilityOutcome } from '../types';
import { ELIGIBILITY_META } from '../lib/eligibilityCalculator';
import { ConfidencePill } from './ui';
import { sourceById } from '../data/sources';
import { JOB_CATEGORY_ORDER } from '../data/jobAgeRules';

export function EligibilityCard({ outcome }: { outcome: EligibilityOutcome }) {
  const { t, tl, lang } = useI18n();
  const meta = ELIGIBILITY_META[outcome.level];
  const src = sourceById(outcome.rule.sourceId);
  const cat = JOB_CATEGORY_ORDER.find((c) => c.key === outcome.rule.category);
  const toneCls =
    outcome.level === 'ELIGIBLE'
      ? 'border-emerald-600/40 bg-emerald-50/60 dark:border-emerald-400/30 dark:bg-emerald-500/10'
      : outcome.level === 'NEAR_LIMIT'
        ? 'border-amber-500/50 bg-amber-50/70 dark:border-amber-400/30 dark:bg-amber-500/10'
        : outcome.level === 'NOT_ELIGIBLE'
          ? 'border-rose-500/40 bg-rose-50/60 dark:border-rose-400/30 dark:bg-rose-500/10'
          : 'border-slate-300 bg-slate-50/70 dark:border-slate-600 dark:bg-slate-800/50';

  return (
    <li className={`rounded-2xl border p-4 ${toneCls}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {cat ? `${cat.emoji} ${tl(cat.label)}` : ''}
          </p>
          <h4 className="mt-0.5 text-[15px] font-bold leading-snug text-slate-900 dark:text-white">{tl(outcome.rule.jobTitle)}</h4>
        </div>
        <p className="flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-xs font-extrabold text-slate-800 ring-1 ring-slate-300/70 dark:bg-slate-900/70 dark:text-slate-100 dark:ring-slate-600">
          <span aria-hidden>{meta.symbol}</span>
          <span>{tl(meta.label)}</span>
        </p>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-lg bg-white/85 px-2 py-1 font-semibold text-slate-700 ring-1 ring-slate-300/60 dark:bg-slate-900/70 dark:text-slate-200 dark:ring-slate-600">
          {outcome.rule.minimumAge != null && outcome.rule.maximumAge != null
            ? `${outcome.rule.minimumAge}–${outcome.effectiveMax ?? outcome.rule.maximumAge} ${t('common.year')}`
            : outcome.rule.maximumAge != null
              ? `≤ ${outcome.effectiveMax ?? outcome.rule.maximumAge} ${t('common.year')}`
              : outcome.rule.minimumAge != null
                ? `≥ ${outcome.rule.minimumAge} ${t('common.year')}`
                : '—'}
          {outcome.rule.asOfDate ? ` (${lang === 'bn' ? 'যেমন' : 'as on'} ${outcome.rule.asOfDate})` : ''}
        </span>
        {outcome.monthsUntilCap != null && outcome.rule.maximumAge != null ? (
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {lang === 'bn' ? `সীমা পর্যন্ত ≈ ${outcome.monthsUntilCap} মাস` : `~${outcome.monthsUntilCap} months to cap`}
          </span>
        ) : null}
        {outcome.rule.marketPractice ? (
          <span className="text-xs font-semibold text-slate-600">{lang === 'bn' ? 'প্রচলন — আইনি সীমা নয়' : 'market practice — not a legal limit'}</span>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{tl(outcome.reason)}</p>
      {outcome.rule.notes ? <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{tl(outcome.rule.notes)}</p> : null}
      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
        <ConfidencePill confidence={outcome.rule.confidence} />
        {src ? (
          <a href={src.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-emerald-800 underline-offset-2 hover:underline dark:text-emerald-300">
            {t('common.viewSource')} <ExternalLink aria-hidden className="h-3.5 w-3.5" />
          </a>
        ) : null}
        <span className="text-slate-500 dark:text-slate-400">
          {t('common.verified')}: {outcome.rule.verifiedDate}
        </span>
      </div>
    </li>
  );
}
