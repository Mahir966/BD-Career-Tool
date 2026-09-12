import { ExternalLink, ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { sourceById } from '../data/sources';
import { Alert, ConfidencePill } from './ui';
import type { Confidence, LText } from '../types';
import { formatDate, parseISODate } from '../lib/dateUtils';

export interface RuleDisplay {
  sourceId: string;
  legalReference?: LText;
  confidence: Confidence;
  verifiedDate: string;
  notes?: LText;
  ruleName?: LText;
}

/**
 * “Source / Authority / Legal reference / Verified” transparency card.
 * Rendered under every important result.
 */
export function RuleSourceCard({ rule }: { rule: RuleDisplay }) {
  const { t, tl, lang } = useI18n();
  const src = sourceById(rule.sourceId);
  const verified = parseISODate(rule.verifiedDate);
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
        <ShieldCheck aria-hidden className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
        {t('common.source')}
      </div>
      {rule.ruleName ? <p className="mb-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{tl(rule.ruleName)}</p> : null}
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('common.source')}</dt>
          <dd className="mt-0.5 text-slate-800 dark:text-slate-100">{src ? tl(src.title) : '—'}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('common.viewSource')}</dt>
          <dd className="mt-0.5">
            {src ? (
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
              >
                {src.authority.en} <ExternalLink aria-hidden className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </dd>
        </div>
        {rule.legalReference ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Legal reference</dt>
            <dd className="mt-0.5 text-slate-800 dark:text-slate-100">{tl(rule.legalReference)}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('ret.lastVerified')}</dt>
          <dd className="mt-0.5 tabular-nums text-slate-800 dark:text-slate-100">{verified ? formatDate(verified, lang) : rule.verifiedDate}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('common.confidence')}</span>
        <ConfidencePill confidence={rule.confidence} />
      </div>
      {rule.notes ? <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{tl(rule.notes)}</p> : null}
      {rule.confidence === 'LOW' ? (
        <div className="mt-3">
          <Alert tone="warn">{t('common.lowConfidenceWarn')}</Alert>
        </div>
      ) : null}
    </div>
  );
}
