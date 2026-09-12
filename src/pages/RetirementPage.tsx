import { useState } from 'react';
import { Landmark } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, Card, Alert } from '../components/ui';
import { RetirementForm } from '../components/RetirementForm';
import { RetirementResultView } from '../components/RetirementResult';
import { DisclaimerNote } from '../components/Disclaimer';
import { RelatedTools } from '../components/RelatedTools';
import { parseISODate, todayYMD, isValidYMD } from '../lib/dateUtils';
import { computeRetirement } from '../lib/retirementCalculator';
import { resolveRetirementRule } from '../data/retirementRules';
import type { RetirementResult } from '../types';

export interface RetirementFormState {
  dob: string;
  joining: string;
  category: string;
  subcategory: string;
  rank: string;
  freedomFighter: boolean;
}

const EMPTY: RetirementFormState = { dob: '', joining: '', category: '', subcategory: '', rank: '', freedomFighter: false };

export default function RetirementPage() {
  const { t, lang } = useI18n();
  usePageMeta(
    lang === 'bn'
      ? 'বাংলাদেশ সরকারি চাকরির অবসর ক্যালকুলেটর ২০২৬ | Retirement Calculator'
      : 'Bangladesh Government Job Retirement Calculator 2026',
    'Exact age, service completed, statutory retirement date, countdown and service progress for Bangladesh government employees — every rule shows its source (Government Service Act 2018 s.43) and verification date.',
  );

  const [state, setState] = useState<RetirementFormState>(EMPTY);
  const [showForm, setShowForm] = useState(true);
  const [result, setResult] = useState<RetirementResult | null>(null);
  const [errors, setErrors] = useState<{ dob?: string; joining?: string; category?: string }>({});

  const patch = (p: Partial<RetirementFormState>) => setState((s) => ({ ...s, ...p }));

  const errFor = (code?: string) => {
    if (!code) return undefined;
    const map: Record<string, string> = {
      EMPTY: t('err.dob.empty'),
      INVALID: t('err.dob.invalid'),
      FUTURE: t('err.dob.future'),
      OUT_OF_RANGE: t('err.dob.range'),
      JOINING_FUTURE: t('err.dob.future'),
      JOINING_AFTER_RETIREMENT: t('err.joining.afterRetirement'),
    };
    return map[code] ?? t('err.dob.invalid');
  };

  const submit = () => {
    const next: typeof errors = {};
    const dob = parseISODate(state.dob);
    if (!state.dob) next.dob = t('err.dob.empty');
    else if (!dob) next.dob = t('err.dob.invalid');
    const joining = state.joining ? parseISODate(state.joining) : null;
    if (state.joining && !joining) next.joining = t('err.joining.invalid');
    if (!state.category) next.category = t('err.category.missing');
    setErrors(next);
    if (Object.keys(next).length) return;

    const rule = resolveRetirementRule(state.category, state.subcategory);
    if (!rule) {
      setErrors({ category: t('err.rule.unknown') });
      return;
    }
    const res = computeRetirement({
      dob: dob as ReturnType<typeof parseISODate>,
      joiningDate: joining,
      rule,
      rankKey: state.rank || undefined,
      freedomFighter: state.freedomFighter,
      currentDate: todayYMD(),
      currentSecondsOfDay: new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds(),
    });
    if (!res.ok) {
      const e: typeof errors = {};
      if (res.errors.dob) e.dob = errFor(res.errors.dob);
      if (res.errors.joining) e.joining = errFor(res.errors.joining);
      setErrors(e);
      setResult(null);
      return;
    }
    setErrors({});
    setResult(res);
    setShowForm(false);
    window.setTimeout(() => document.getElementById('ret-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  };

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <header className="mb-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/25 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Landmark aria-hidden className="h-3.5 w-3.5" /> 🏛️ {t('nav.retirement')}
        </p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{t('ret.title')}</h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">{t('ret.intro')}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className={`lg:col-span-3 ${showForm ? '' : 'lg:order-2'}`}>
          {showForm ? (
            <RetirementForm state={state} onChange={patch} onSubmit={submit} onClear={() => { setState(EMPTY); setErrors({}); setResult(null); }} errors={errors} />
          ) : null}
        </div>
        <div className={`grid gap-4 ${showForm ? 'lg:col-span-2' : 'lg:col-span-5 lg:order-1'}`} id="ret-result">
          {!showForm && result ? (
            <>
              <RetirementResultView result={result} onEdit={() => setShowForm(true)} onReset={() => { setState(EMPTY); setResult(null); setShowForm(true); }} />
            </>
          ) : (
            <>
              <Card className="p-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('common.rule')}</h2>
                <ul className="mt-2 grid gap-1.5 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                  <li>🏛️ {lang === 'bn' ? 'সাধারণ সরকারি কর্মচারী — ৫৯ বছর (সরকারি চাকরি আইন ২০১৮, ধারা ৪৩)' : 'General govt employee — 59y (Govt Service Act 2018, s.43)'}</li>
                  <li>🎖️ {lang === 'bn' ? 'মুক্তিযোদ্ধা সরকারি কর্মচারী — ৬০ বছর' : 'Freedom-fighter govt employee — 60y'}</li>
                  <li>🎓 {lang === 'bn' ? 'পাবলিক বিশ্ববিদ্যালয়ের শিক্ষক — ৬৫ (আলাদা আইন)' : 'Public university teachers — 65 (special Act)'}</li>
                  <li>⚖️ {lang === 'bn' ? 'বিচারপতি ৬৭ / জেলা বিচারক ৬৫ (সংবিধান)' : 'SC judges 67 / district judges 65 (Constitution)'}</li>
                  <li>🪖 {lang === 'bn' ? 'সশস্ত্র বাহিনী — পদ ও চাকরির মেয়াদভিত্তিক (৫৯ নয়!)' : 'Armed forces — rank & service caps (NOT 59!)'}</li>
                </ul>
              </Card>
              <Alert tone="info">{t('common.disclaimerShort')}</Alert>
            </>
          )}
        </div>
      </div>

      {result && !showForm ? (
        <details className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50">
          <summary className="cursor-pointer font-bold text-slate-800 dark:text-slate-100">{lang === 'bn' ? 'কীভাবে হিসাব করা হয়েছে' : 'How this was calculated'}</summary>
          <div className="mt-2 grid gap-2 text-slate-600 dark:text-slate-300">
            <p>
              {lang === 'bn'
                ? 'অবসরের তারিখ = জন্মতারিখ + নির্ধারিত অবসর বয়স পূর্ণ হওয়া (লিপ-ইয়ার ও ২৯ ফেব্রুয়ারিসহ সঠিক ক্যালেন্ডার গণনা)। যোগদানের তারিখ অবসরের তারিখ বদলায় না — এটি কেবল সম্পন্ন/সম্ভাব্য চাকরির মেয়াদ ও অগ্রগতির শতাংশের জন্য ব্যবহৃত হয়।'
                : 'Retirement date = DOB + completion of the statutory age (true calendar math incl. leap years & Feb-29 clamping). The joining date never shifts the retirement date; it is used only for completed/projected service and progress percentage.'}
            </p>
            {isValidYMD(parseISODate(state.joining) ?? todayYMD()) && state.joining ? (
              <p className="font-mono text-xs">dob + {result.retirementAge ?? '?'}y → {result.retirementDate ? `${result.retirementDate.year}-${result.retirementDate.month}-${result.retirementDate.day}` : '—'}</p>
            ) : null}
          </div>
        </details>
      ) : null}

      <div className="mt-8">
        <DisclaimerNote />
      </div>
      <div className="mt-10">
        <RelatedTools />
      </div>
    </div>
  );
}
