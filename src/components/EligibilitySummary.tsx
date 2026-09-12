import { useI18n } from '../i18n/I18nContext';
import type { EligibilityOutcome } from '../types';
import { Card, StatTile } from './ui';

export function EligibilitySummary({ outcomes, ageText }: { outcomes: EligibilityOutcome[]; ageText: string }) {
  const { t } = useI18n();
  const count = (lv: EligibilityOutcome['level']) => outcomes.filter((o) => o.level === lv).length;
  return (
    <Card as="section" className="p-4" aria-label={t('job.summary')}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">{t('job.summary')}</h3>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {t('job.dob')}: <span className="font-mono tabular-nums">{ageText}</span>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile accent label={`🟢 ${t('job.counts.eligible')}`} value={count('ELIGIBLE')} />
        <StatTile label={`🟡 ${t('job.counts.near')}`} value={count('NEAR_LIMIT')} />
        <StatTile label={`🔴 ${t('job.counts.not')}`} value={count('NOT_ELIGIBLE')} />
        <StatTile label={`⚪ ${t('job.counts.verify')}`} value={count('REQUIRES_VERIFICATION')} />
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t('job.legend')}</p>
    </Card>
  );
}
