import { useState } from 'react';
import { Check, Printer, Share2, Copy, Info } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import type { RetirementResult as Result } from '../types';
import { Alert, Button, Card, StatTile } from './ui';
import { ServiceProgress } from './ServiceProgress';
import { RetirementCountdown } from './RetirementCountdown';
import { RuleSourceCard } from './RuleSourceCard';
import { EditResetBar } from './RetirementForm';
import { durationText, num } from '../lib/formatters';
import { formatDate } from '../lib/dateUtils';
import { copyText, shareText } from '../lib/share';
import { sourceById } from '../data/sources';

export function RetirementResultView({ result, onEdit, onReset }: { result: Result; onEdit: () => void; onReset: () => void }) {
  const { t, tl, lang } = useI18n();
  const [copied, setCopied] = useState(false);
  const r = result;

  const buildText = () => {
    const lines: string[] = [];
    lines.push(lang === 'bn' ? 'বাংলাদেশ সরকারি চাকরি অবসর গণনা' : 'Bangladesh Govt Job Retirement Calculation');
    if (r.requiresVerification) lines.push(tl(r.requiresVerification.message));
    if (r.currentAge) lines.push(`${t('ret.currentAge')}: ${durationText(r.currentAge, lang, { hideZeroes: true })}`);
    if (r.serviceCompleted) lines.push(`${t('ret.serviceDone')}: ${durationText(r.serviceCompleted, lang, { hideZeroes: true })}`);
    if (r.retirementAge != null) lines.push(`${t('ret.retAge')}: ${r.retirementAge} ${t('common.year')}${r.freedomFighterApplied ? ' (FF s.43(1)(b))' : ''}`);
    if (r.retirementDate) lines.push(`${t('ret.retDate')}: ${formatDate(r.retirementDate, lang)}`);
    if (r.remaining && r.remaining.totalDays >= 0) lines.push(`${t('ret.remaining')}: ${durationText(r.remaining, lang)}`);
    if (r.remaining && r.remaining.totalDays >= 0) lines.push(`${t('ret.remainingTotalDays')}: ${num(r.remaining.totalDays)}`);
    if (r.projectedService) lines.push(`${t('ret.projectedService')}: ${durationText(r.projectedService, lang, { hideZeroes: true })}`);
    if (r.completionPercent != null) lines.push(`${t('ret.completed')}: ${r.completionPercent.toFixed(1)}% · ${t('ret.remainingPct')}: ${(100 - r.completionPercent).toFixed(1)}%`);
    const src = sourceById(r.ruleUsed.sourceId);
    if (src) lines.push(`${t('common.source')}: ${src.title[lang]} — ${src.url} (${t('common.verified')}: ${r.ruleUsed.verifiedDate})`);
    lines.push(t('common.disclaimerShort'));
    return lines.join('\n');
  };

  const onCopy = async () => {
    const ok = await copyText(buildText());
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };
  const onShare = async () => {
    await shareText(t('ret.title'), buildText());
  };

  if (r.requiresVerification) {
    return (
      <div className="grid gap-4" data-testid="retirement-result">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <span aria-hidden className="text-2xl">⚪</span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('ret.status.RULE_REQUIRES_VERIFICATION')}</h3>
              <p className="mt-1 max-w-prose leading-relaxed text-slate-700 dark:text-slate-200">{tl(r.requiresVerification.message)}</p>
              {r.currentAge ? (
                <p className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {t('ret.currentAge')}: <span className="font-mono tabular-nums">{durationText(r.currentAge, lang)}</span>
                  {r.serviceCompleted ? <span> · {t('ret.serviceDone')}: <span className="font-mono tabular-nums">{durationText(r.serviceCompleted, lang)}</span></span> : null}
                </p>
              ) : null}
            </div>
          </div>
        </Card>
        <RuleSourceCard rule={{ ...r.ruleUsed, ruleName: r.ruleUsed.name }} />
        <WarnList warnings={r.warnings} />
        <EditResetBar onEdit={onEdit} onReset={onReset} />
      </div>
    );
  }

  const statusLabel = r.status ? t(`ret.status.${r.status}`) : '';
  const statusTone = r.status === 'ALREADY_RETIRED' || r.status === 'RETIREMENT_DUE' ? 'warn' : r.status === 'NEARING_RETIREMENT' ? 'info' : 'success';

  return (
    <div className="grid gap-4" data-testid="retirement-result">
      {r.remaining && r.retirementDate && r.remaining.totalDays >= 0 ? (
        <RetirementCountdown remaining={r.remaining} retirementDate={r.retirementDate} status={r.status} />
      ) : (
        <Card className="p-5">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('ret.remaining')}</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
            {r.remaining ? durationText({ ...r.remaining, years: Math.abs(r.remaining.years), months: Math.abs(r.remaining.months), days: Math.abs(r.remaining.days) }, lang) : '—'}
          </p>
        </Card>
      )}

      <Card className="p-4 sm:p-5">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('ret.retDate')}</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {r.retirementDate ? formatDate(r.retirementDate, lang) : '—'}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={
              statusTone === 'success'
                ? 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-inset ring-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-300'
                : statusTone === 'warn'
                  ? 'inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 ring-1 ring-inset ring-amber-600/30 dark:bg-amber-500/15 dark:text-amber-300'
                  : 'inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 ring-1 ring-inset ring-sky-600/25 dark:bg-sky-500/15 dark:text-sky-300'
            }
          >
            {statusLabel}
          </span>
          {r.freedomFighterApplied ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300">
              {t('ret.ffApplied')}
            </span>
          ) : null}
          {r.bindingCap ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-800 dark:text-slate-200">
              {t('ret.bindingCap')}: {r.bindingCap === 'AGE' ? t('ret.capAGE') : t('ret.capSERVICE')}
            </span>
          ) : null}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile accent label={t('ret.currentAge')} value={r.currentAge ? durationText(r.currentAge, lang, { hideZeroes: true }) : '—'} />
        <StatTile accent label={t('ret.retAge')} value={r.retirementAge != null ? `${r.retirementAge} ${t('common.year')}` : '—'} />
        <StatTile label={t('ret.joinLabel')} value={r.serviceCompleted && r.projectedService ? '✓' : '—'} sub={r.projectedService ? `${t('ret.projectedService')}: ${Math.floor(r.projectedService.approxYears)} ${t('common.year')}` : undefined} />
        <StatTile label={t('ret.serviceDone')} value={r.serviceCompleted ? durationText(r.serviceCompleted, lang, { hideZeroes: true }) : '—'} />
        <StatTile label={t('ret.projectedService')} value={r.projectedService ? durationText(r.projectedService, lang, { hideZeroes: true }) : '—'} />
        <StatTile label={t('ret.remainingTotalDays')} value={r.remaining ? num(Math.max(0, r.remaining.totalDays)) : '—'} />
      </div>

      {r.remaining ? (
        <Card className="p-4">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('ret.remainingPrecise')}</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-white">
            {durationText({ ...r.remaining, years: Math.abs(r.remaining.years), months: Math.abs(r.remaining.months), days: Math.abs(r.remaining.days) }, lang)}
          </p>
        </Card>
      ) : null}

      {r.completionPercent != null && r.remainingPercent != null ? (
        <ServiceProgress completionPercent={r.completionPercent} remainingPercent={r.remainingPercent} />
      ) : null}

      {r.note ? (
        <Alert tone="info">
          <span className="inline-flex items-start gap-2">
            <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /> {tl(r.note)}
          </span>
        </Alert>
      ) : null}

      <WarnList warnings={r.warnings} />

      <RuleSourceCard rule={{ ...r.ruleUsed, ruleName: r.ruleUsed.name }} />

      <div className="no-print flex flex-wrap gap-2">
        <Button variant="outline" onClick={onCopy}>
          {copied ? <Check aria-hidden className="h-4 w-4 text-emerald-600" /> : <Copy aria-hidden className="h-4 w-4" />}
          {copied ? t('common.copied') : t('common.copy')}
        </Button>
        <Button variant="outline" onClick={onShare}>
          <Share2 aria-hidden className="h-4 w-4" />
          {t('common.share')}
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer aria-hidden className="h-4 w-4" />
          {t('common.print')}
        </Button>
        <EditResetBar onEdit={onEdit} onReset={onReset} />
      </div>
    </div>
  );
}

function WarnList({ warnings }: { warnings: Result['warnings'] }) {
  const { tl } = useI18n();
  if (!warnings.length) return null;
  return (
    <div className="grid gap-2" role="status" aria-live="polite">
      {warnings.map((w, i) => (
        <Alert key={i} tone="warn">
          {tl(w)}
        </Alert>
      ))}
    </div>
  );
}
