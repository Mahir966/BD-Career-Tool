import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Target } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, Card, Alert, Button, Select } from '../components/ui';
import { JobAgeForm, emptyJobAgeForm } from '../components/JobAgeForm';
import type { JobAgeFormState } from '../components/JobAgeForm';
import { EligibilityCard } from '../components/EligibilityCard';
import { EligibilitySummary } from '../components/EligibilitySummary';
import { DisclaimerNote } from '../components/Disclaimer';
import { JOB_AGE_RULES, JOB_CATEGORY_ORDER } from '../data/jobAgeRules';
import { evaluateJobAge } from '../lib/eligibilityCalculator';
import { parseISODate, todayYMD, diffYMD } from '../lib/dateUtils';
import type { EligibilityOutcome, JobCategoryKey } from '../types';

const ORDER: EligibilityOutcome['level'][] = ['ELIGIBLE', 'NEAR_LIMIT', 'REQUIRES_VERIFICATION', 'NOT_ELIGIBLE'];

export default function JobAgePage() {
  const { t, lang } = useI18n();
  usePageMeta(
    lang === 'bn' ? 'বাংলাদেশ চাকরির বয়সসীমা ক্যালকুলেটর ২০২৬' : 'Bangladesh Job Age Eligibility Calculator 2026',
    'Check which Bangladesh government, defence, police, bank, teaching and private jobs you are age-eligible for — based on current 2026 rules with sources (uniform 32-year cap, 50th BCS, force circulars).',
  );
  const [params, setParams] = useSearchParams();
  const catFilter = params.get('category') ?? 'ALL';

  const [form, setForm] = useState<JobAgeFormState>(emptyJobAgeForm);
  const [errors, setErrors] = useState<{ input?: string }>({});
  const [outcomes, setOutcomes] = useState<EligibilityOutcome[] | null>(null);
  const [usedAgeText, setUsedAgeText] = useState('');

  const patch = (p: Partial<JobAgeFormState>) => setForm((s) => ({ ...s, ...p }));

  const submit = () => {
    const today = todayYMD();
    let age: { years: number; months: number; days: number } | null = null;
    if (form.mode === 'dob') {
      const dob = parseISODate(form.dob);
      if (!dob) return setErrors({ input: t('err.dob.invalid') });
      const d = diffYMD(dob, today);
      if (d.totalDays < 0) return setErrors({ input: t('err.dob.future') });
      age = { years: d.years, months: d.months, days: d.days };
      setUsedAgeText(`${age.years} ${t('common.year')} ${age.months} ${t('common.months')} ${age.days} ${t('common.days')}`);
    } else {
      const a = Number(form.age);
      if (!Number.isInteger(a) || a < 10 || a > 120) return setErrors({ input: t('err.age.invalid') });
      age = { years: a, months: 0, days: 0 };
      setUsedAgeText(`${a} ${t('common.year')}`);
    }
    setErrors({});
    const list = JOB_AGE_RULES.map((rule) => {
      // For circulars with an “as on” date, adjust age when DOB is provided
      let refAge = age!;
      if (form.mode === 'dob' && rule.asOfDate) {
        const asOf = parseISODate(rule.asOfDate);
        if (asOf) {
          const dob = parseISODate(form.dob)!;
          const dd = diffYMD(dob, asOf);
          refAge = dd.totalDays >= 0 ? { years: dd.years, months: dd.months, days: dd.days } : { years: 0, months: 0, days: 0 };
        }
      }
      return evaluateJobAge(rule, {
        age: refAge,
        status: {
          freedomFighter: form.freedomFighter,
          ffDescendant: form.ffDescendant,
          pwd: form.pwd,
          women: form.women,
          servingMember: form.serving,
        },
      });
    });
    setOutcomes(list);
  };

  const filtered = useMemo(() => {
    if (!outcomes) return null;
    const list = catFilter === 'ALL' ? outcomes : outcomes.filter((o) => o.rule.category === catFilter);
    return [...list].sort((a, b) => ORDER.indexOf(a.level) - ORDER.indexOf(b.level));
  }, [outcomes, catFilter]);

  const counts = useMemo(() => {
    if (!outcomes) return null;
    return {
      eligible: outcomes.filter((o) => o.level === 'ELIGIBLE').length,
      near: outcomes.filter((o) => o.level === 'NEAR_LIMIT').length,
      not: outcomes.filter((o) => o.level === 'NOT_ELIGIBLE').length,
      verify: outcomes.filter((o) => o.level === 'REQUIRES_VERIFICATION').length,
    };
  }, [outcomes]);

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <header className="mb-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/25 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Target aria-hidden className="h-3.5 w-3.5" /> 🇧🇩 {lang === 'bn' ? 'বাংলাদেশ জব মার্কেট ২০২৬' : 'Bangladesh Job Market 2026'}
        </p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{t('job.title')}</h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">{t('job.intro')}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <JobAgeForm state={form} onChange={patch} onSubmit={submit} onClear={() => { setForm(emptyJobAgeForm); setOutcomes(null); setErrors({}); }} errors={errors} />
        </div>

        <div className="grid gap-4 lg:col-span-3">
          {filtered ? (
            <>
              {counts ? <EligibilitySummary outcomes={outcomes ?? []} ageText={usedAgeText} /> : null}
              <Card className="flex flex-wrap items-center justify-between gap-3 p-3">
                <label htmlFor="job-cat" className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {lang === 'bn' ? 'খাত ফিল্টার' : 'Filter category'}
                </label>
                <Select id="job-cat" className="max-w-[16rem]" value={catFilter} onChange={(e) => setParams(e.target.value === 'ALL' ? {} : { category: e.target.value })}>
                  <option value="ALL">{t('job.filter.all')}</option>
                  {JOB_CATEGORY_ORDER.map((c) => (
                    <option key={c.key} value={c.key as JobCategoryKey}>
                      {t(`job.cat.${c.key}`)}
                    </option>
                  ))}
                </Select>
                <Button variant="ghost" onClick={submit}>
                  {t('common.calculate')}
                </Button>
              </Card>
              {filtered.length === 0 ? (
                <Alert tone="info">{t('common.notFound')}</Alert>
              ) : (
                <ul className="grid gap-3">
                  {filtered.map((o) => (
                    <EligibilityCard key={o.rule.id} outcome={o} />
                  ))}
                </ul>
              )}
            </>
          ) : (
            <Card className="p-6 text-sm text-slate-500 dark:text-slate-400">
              {lang === 'bn'
                ? 'বাম পাশে জন্মতারিখ বা বয়স দিয়ে “হিসাব করুন” চাপুন — সব খাতের নিয়োগ-বয়সসীমার তালিকা এখানে আসবে, প্রতিটির পাশে কারণ (🟢🟡🔴⚪) ও সোর্স।'
                : 'Enter DOB or age and press “Calculate” — every sector’s recruitment age limits appear here with per-result reasons (🟢🟡🔴⚪) and sources.'}
            </Card>
          )}
          <Alert tone="info">{t('job.disclaimerAge')}</Alert>
        </div>
      </div>

      <div className="mt-8">
        <DisclaimerNote />
      </div>
    </div>
  );
}
