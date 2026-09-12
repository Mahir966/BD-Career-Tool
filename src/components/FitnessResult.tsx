import { useState } from 'react';
import { Check, Copy, Printer, Share2 } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { Card, Alert } from './ui';
import type { BmiResult } from '../lib/bmiCalculator';
import { buildFitnessAnalysis } from '../lib/fitnessAnalysis';
import type { DefenceRecruitmentRule } from '../types';
import { copyText, shareText } from '../lib/share';
import { cmToFtIn } from '../lib/bmiCalculator';

export interface BmrViewData {
  value: number;
  hb?: number;
  mult?: number;
  tdee?: number;
  formulaText: string;
  noteText: string;
}

export function FitnessResultView({
  kind,
  heightCm,
  weightKg,
  bmi,
  bmr,
  rule,
}: {
  kind: 'bmi' | 'bmr' | 'analysis';
  heightCm: number;
  weightKg?: number;
  bmi: BmiResult | null;
  bmr?: BmrViewData;
  rule?: DefenceRecruitmentRule;
}) {
  const { t, tl } = useI18n();
  const [copied, setCopied] = useState(false);
  const analysis = bmi && weightKg != null ? buildFitnessAnalysis({ heightCm, weightKg, bmi, rule }) : null;

  const ftin = cmToFtIn(heightCm);

  const copyPayload = () => {
    const lines: string[] = [];
    lines.push(`Height: ${heightCm.toFixed(1)} cm (${ftin.feet}ft ${ftin.inches}in)`);
    if (weightKg != null) lines.push(`Weight: ${weightKg.toFixed(1)} kg`);
    if (bmi?.ok && bmi.bmi != null) {
      lines.push(`BMI: ${bmi.bmi} — ${bmi.band ? tl(bmi.band.label) : ''}`);
      if (bmi.healthyWeightRangeKg) lines.push(`Healthy range: ${bmi.healthyWeightRangeKg.min}–${bmi.healthyWeightRangeKg.max} kg`);
    }
    if (bmr) {
      lines.push(`BMR (Mifflin-St Jeor): ${bmr.value} kcal/day`);
      if (bmr.mult && bmr.tdee) lines.push(`TDEE x${bmr.mult}: ${bmr.tdee} kcal/day`);
    }
    lines.push(t('common.disclaimerShort'));
    return lines.join('\n');
  };

  const btnCls =
    'inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800';

  return (
    <div className="grid gap-4" data-testid="fitness-result">
      <Card className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {kind === 'bmr' ? t('fit.bmr') : kind === 'analysis' ? t('fit.analysis') : t('fit.bmiResult')}
        </p>
        {bmi?.ok && bmi.bmi != null ? (
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <p className="font-mono text-4xl font-extrabold tabular-nums text-slate-900 dark:text-white">{bmi.bmi.toFixed(1)}</p>
            <span
              className={`mb-1 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${
                bmi.band?.key === 'NORMAL'
                  ? 'bg-emerald-100 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300'
                  : bmi.band && ['PRE_OBESITY', 'MILD_THINNESS', 'MODERATE_THINNESS', 'SEVERE_THINNESS'].includes(bmi.band.key)
                    ? 'bg-amber-100 text-amber-800 ring-amber-600/25 dark:bg-amber-500/15 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 ring-rose-600/25 dark:bg-rose-500/15 dark:text-rose-300'
              }`}
            >
              {bmi.band ? tl(bmi.band.label) : ''}
            </span>
          </div>
        ) : null}
        {bmr ? (
          <div className="mt-1">
            <p className="font-mono text-4xl font-extrabold tabular-nums text-slate-900 dark:text-white">
              {bmr.value} <span className="text-base font-semibold">kcal/day</span>
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t('fit.tdee')}: <strong className="font-mono">{bmr.tdee ?? '—'}</strong>
              {bmr.tdee ? ' kcal/day' : ''}
              {bmr.mult ? <span> · {t('fit.activityMult')} ×{bmr.mult}</span> : null}
            </p>
            {bmr.hb ? (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t('fit.compareHB')}: {bmr.hb} kcal
              </p>
            ) : null}
          </div>
        ) : null}
        {bmi && !bmi.ok ? <Alert tone="error">{tl(bmi.interpretation)}</Alert> : null}
        {kind !== 'bmr' ? (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {t('fit.height')}: {heightCm.toFixed(1)} cm ({ftin.feet}′{ftin.inches}″)
            {weightKg != null ? ` · ${t('fit.weight')}: ${weightKg.toFixed(1)} kg` : ''}
          </p>
        ) : null}
      </Card>

      {analysis ? (
        <div className="grid gap-3">
          {analysis.summary.map((s) => (
            <Card key={s.key} as="section" className="p-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tl(s.title)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{tl(s.body)}</p>
            </Card>
          ))}
          {bmi?.asiaPacificNote ? <Alert tone="info">{tl(bmi.asiaPacificNote)}</Alert> : null}
          {analysis.recruitmentComparison ? (
            <Card as="section" className="border-emerald-700/30 bg-emerald-50/60 p-4 dark:border-emerald-400/25 dark:bg-emerald-500/10">
              <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{t('fit.recCompare')}</h3>
              <p className="mt-1 text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">{tl(analysis.recruitmentComparison.body)}</p>
            </Card>
          ) : null}
          <Card as="section" className="p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('fit.importantNote')}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{tl(analysis.disclaimer)}</p>
          </Card>
        </div>
      ) : bmr ? (
        <Card as="section" className="p-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('fit.whatMeans')}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{bmr.formulaText}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{bmr.noteText}</p>
        </Card>
      ) : null}

      <div className="no-print flex flex-wrap gap-2">
        <button
          type="button"
          onClick={async () => {
            const ok = await copyText(copyPayload());
            if (ok) {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            }
          }}
          className={btnCls}
        >
          <span aria-hidden className="[&_svg]:h-4 [&_svg]:w-4">
            {copied ? <Check className="text-emerald-600" /> : <Copy />}
          </span>
          {copied ? t('common.copied') : t('common.copy')}
        </button>
        <button type="button" onClick={async () => void (await shareText(t('fit.title'), copyPayload()))} className={btnCls}>
          <Share2 aria-hidden className="h-4 w-4" />
          {t('common.share')}
        </button>
        <button type="button" onClick={() => window.print()} className={btnCls}>
          <Printer aria-hidden className="h-4 w-4" />
          {t('common.print')}
        </button>
      </div>
    </div>
  );
}
