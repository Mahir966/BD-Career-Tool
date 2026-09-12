import { ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import type { DefenceRecruitmentRule } from '../types';
import { ConfidencePill } from './ui';
import { sourceById } from '../data/sources';
import { FORCE_LABELS } from '../data/defenceRules';

function fmtCm(v?: number) {
  if (v == null) return null;
  const inch = Math.round(v / 2.54);
  const ft = Math.floor(inch / 12);
  const rem = inch % 12;
  return `${v} সেমি (${ft}'${rem}")`;
}

export function DefenceCard({ rule }: { rule: DefenceRecruitmentRule }) {
  const { t, tl, lang } = useI18n();
  const src = sourceById(rule.sourceId);
  const rows: { label: string; value: string | null }[] = [
    {
      label: t('def.age'),
      value:
        rule.minimumAge != null && rule.maximumAge != null
          ? `${rule.minimumAge}–${rule.maximumAge} ${t('common.year')}${rule.asOfNote ? ` · ${tl(rule.asOfNote)}` : ''}`
          : null,
    },
    { label: t('def.height'), value: rule.physical.heightMaleCm || rule.physical.heightFemaleCm ? `${rule.physical.heightMaleCm ? `♂ ${fmtCm(rule.physical.heightMaleCm) ?? `${rule.physical.heightMaleCm} cm`}` : ''}${rule.physical.heightFemaleCm ? ` · ♀ ${fmtCm(rule.physical.heightFemaleCm) ?? `${rule.physical.heightFemaleCm} cm`}` : ''}` : null },
    { label: t('def.chest'), value: rule.physical.chestMinCm ? `${rule.physical.chestMinCm} cm${rule.physical.chestExpansionCm ? ` · +${rule.physical.chestExpansionCm} cm` : ''}` : null },
    { label: t('def.weight'), value: rule.physical.weightNote ? tl(rule.physical.weightNote) : null },
    { label: t('def.vision'), value: rule.physical.visionNote ? tl(rule.physical.visionNote) : rule.physical.eyesight6over6 ? '6/6' : null },
    { label: t('def.edu'), value: rule.education ? tl(rule.education) : null },
    { label: t('def.marital'), value: rule.maritalNote ? tl(rule.maritalNote) : null },
    { label: t('def.nationality'), value: rule.nationalityNote ? tl(rule.nationalityNote) : null },
    { label: t('def.recType'), value: rule.recruitmentType ? tl(rule.recruitmentType) : null },
    { label: t('def.svcType'), value: rule.serviceType ? tl(rule.serviceType) : null },
    { label: t('def.other'), value: rule.otherConditions ? tl(rule.otherConditions) : null },
  ].filter((r) => r.value != null && r.value !== '');

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">{tl(FORCE_LABELS[rule.force])}</p>
          <h3 className="mt-0.5 text-[15px] font-bold leading-snug text-slate-900 dark:text-white">{tl(rule.entryType)}</h3>
        </div>
        <ConfidencePill confidence={rule.confidence} />
      </div>

      <dl className="mt-1 grid gap-1.5 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[9.5rem_1fr] gap-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{r.label}</dt>
            <dd className="text-slate-800 dark:text-slate-100">{r.value}</dd>
          </div>
        ))}
      </dl>

      {rule.notes ? <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{tl(rule.notes)}</p> : null}

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {rule.circularDate ? <span>{t('def.circular')}: <span className="font-mono tabular-nums">{rule.circularDate}</span></span> : null}
        <span>{t('common.verified')}: <span className="font-mono tabular-nums">{rule.verifiedDate}</span></span>
        {src ? (
          <a href={src.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline dark:text-emerald-300">
            {t('common.viewSource')} <ExternalLink aria-hidden className="h-3 w-3" />
          </a>
        ) : null}
        <span aria-hidden>{lang === 'bn' ? '⚠️ বিজ্ঞপ্তিভেদে পরিবর্তনশীল' : '⚠️ varies by circular'}</span>
      </div>
    </article>
  );
}
