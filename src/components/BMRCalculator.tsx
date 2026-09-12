import { useMemo, useState } from 'react';
import { Calculator, Trash2 } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { Button, Card, Field, Alert, SectionTitle, Select } from './ui';
import { HeightInput, emptyHeight, heightCmOf } from './HeightWeightInputs';
import type { HeightValue } from './HeightWeightInputs';
import { computeBmr } from '../lib/bmrCalculator';
import type { Sex } from '../lib/bmrCalculator';
import { ACTIVITY_LEVELS } from '../data/fitnessRules';
import type { ActivityKey } from '../data/fitnessRules';
import { FitnessResultView } from './FitnessResult';
import { parseISODate, diffYMD, todayYMD } from '../lib/dateUtils';

export function BMRCalculator() {
  const { t, tl } = useI18n();
  const [dob, setDob] = useState('');
  const [height, setHeight] = useState<HeightValue>(emptyHeight);
  const [weightKg, setWeightKg] = useState('');
  const [sex, setSex] = useState<Sex>('M');
  const [activity, setActivity] = useState<ActivityKey | ''>('');
  const [submitted, setSubmitted] = useState<null | { age: number; heightCm: number; weight: number; sex: Sex; activity: ActivityKey | '' }>(null);
  const [err, setErr] = useState<string | null>(null);

  const calc = () => {
    const d = parseISODate(dob);
    const hc = heightCmOf(height);
    const w = Number(weightKg);
    if (!d) return setErr(t('err.dob.invalid'));
    const age = diffYMD(d, todayYMD()).years;
    if (hc == null) return setErr(t('err.height.invalid'));
    if (!Number.isFinite(w) || w <= 0) return setErr(t('err.weight.invalid'));
    setErr(null);
    setSubmitted({ age, heightCm: hc, weight: w, sex, activity: activity || '' });
  };
  const reset = () => {
    setDob('');
    setHeight(emptyHeight);
    setWeightKg('');
    setActivity('');
    setSubmitted(null);
    setErr(null);
  };

  const result = useMemo(() => {
    if (!submitted) return null;
    return computeBmr({
      sex: submitted.sex,
      ageYears: submitted.age,
      heightCm: submitted.heightCm,
      weightKg: submitted.weight,
      activity: submitted.activity ? (submitted.activity as ActivityKey) : undefined,
    });
  }, [submitted]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card as="section" className="h-fit p-4 sm:p-6">
        <SectionTitle title={t('fit.bmr')} sub={t('fit.bmr.d')} />
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            calc();
          }}
          className="grid gap-4"
        >
          <Field htmlFor="bmr-dob" label={t('job.dob')} hint={t('common.required')}>
            <input
              id="bmr-dob"
              type="date"
              value={dob}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDob(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-[15px] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </Field>
          <HeightInput id="bmr" value={height} onChange={setHeight} />
          <Field htmlFor="bmr-w" label={`${t('fit.weight')} (kg)`} required>
            <input
              id="bmr-w"
              inputMode="decimal"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="70"
              className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-[15px] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </Field>
          <Field htmlFor="bmr-sex" label={t('fit.sex')}>
            <Select id="bmr-sex" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
              <option value="M">{t('fit.male')}</option>
              <option value="F">{t('fit.female')}</option>
            </Select>
          </Field>
          <Field htmlFor="bmr-act" label={t('fit.activity')} hint={t('common.optional')}>
            <Select id="bmr-act" value={activity} onChange={(e) => setActivity(e.target.value as ActivityKey | '')}>
              <option value="">{t('fit.none')}</option>
              {ACTIVITY_LEVELS.map((a) => (
                <option key={a.key} value={a.key}>
                  {tl(a.label)} — ×{a.mult}
                </option>
              ))}
            </Select>
          </Field>
          {err ? <Alert tone="error">{err}</Alert> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit">
              <Calculator aria-hidden className="h-4 w-4" />
              {t('common.calculate')}
            </Button>
            <Button variant="outline" onClick={reset}>
              <Trash2 aria-hidden className="h-4 w-4" />
              {t('common.clear')}
            </Button>
          </div>
        </form>
      </Card>

      <div>
        {submitted && result?.ok ? (
          <FitnessResultView
            kind="bmr"
            heightCm={submitted.heightCm}
            weightKg={submitted.weight}
            bmi={null}
            bmr={{
              value: result.bmrMifflin ?? 0,
              hb: result.bmrHarrisBenedict,
              mult: result.activityMultiplier,
              tdee: result.tdee,
              formulaText: tl(result.formula),
              noteText: tl(result.note),
            }}
          />
        ) : submitted && result && !result.ok ? (
          <Alert tone="error">{tl(result.note)}</Alert>
        ) : (
          <Card className="p-6 text-sm text-slate-500 dark:text-slate-400">
            {t('fit.bmr.d')}
          </Card>
        )}
      </div>
    </div>
  );
}
