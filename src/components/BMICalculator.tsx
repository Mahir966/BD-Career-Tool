import { useMemo, useState } from 'react';
import { Calculator, Trash2 } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { Button, Card, Alert, SectionTitle } from './ui';
import { HeightInput, WeightInput, heightCmOf, weightKgOf, emptyHeight, emptyWeight } from './HeightWeightInputs';
import type { HeightValue, WeightValue } from './HeightWeightInputs';
import { computeBmi } from '../lib/bmiCalculator';
import { BMI_FORMULA } from '../data/fitnessRules';
import { FitnessResultView } from './FitnessResult';

export function BMICalculator() {
  const { t, tl, lang } = useI18n();
  const [h, setH] = useState<HeightValue>(emptyHeight);
  const [w, setW] = useState<WeightValue>(emptyWeight);
  const [submitted, setSubmitted] = useState<{ heightCm: number; weightKg: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const heightCm = useMemo(() => heightCmOf(h), [h]);
  const weightKg = useMemo(() => weightKgOf(w), [w]);

  const calc = () => {
    if (heightCm == null || weightKg == null) {
      setErr(t('err.height.invalid') + ' / ' + t('err.weight.invalid'));
      return;
    }
    setErr(null);
    setSubmitted({ heightCm, weightKg });
  };
  const reset = () => {
    setH(emptyHeight);
    setW(emptyWeight);
    setSubmitted(null);
    setErr(null);
  };

  const bmi = submitted ? computeBmi({ heightCm: submitted.heightCm, weightKg: submitted.weightKg }) : null;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card as="section" className="h-fit p-4 sm:p-6">
        <SectionTitle title={t("fit.bmi")} sub={t("home.card.fitness.d")} />
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            calc();
          }}
          className="grid gap-4"
        >
          <HeightInput id="bmi" value={h} onChange={setH} />
          <WeightInput id="bmi" value={w} onChange={setW} />
          {err ? <Alert tone="error">{err}</Alert> : null}
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700">
            <strong className="font-semibold">{t('fit.formulaShown')}:</strong>{' '}
            <span className="font-mono">{tl(BMI_FORMULA)}</span>
            <p className="mt-1 text-xs">{lang === 'bn' ? 'ইনপুট দেওয়া ft/in স্বয়ংক্রিয়ভাবে cm-এ রূপান্তরিত হয়: ৫×৩০.৪৮ + ৬×২.৫৪।' : 'feet/inches convert automatically: 5×30.48 + 6×2.54 cm.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit">
              <Calculator aria-hidden className="h-4 w-4" />
              {t('common.calculate')}
            </Button>
            <Button variant="outline" onClick={reset} type="button">
              <Trash2 aria-hidden className="h-4 w-4" />
              {t('common.clear')}
            </Button>
          </div>
        </form>
      </Card>

      <div>
        {bmi && submitted ? (
          <FitnessResultView
            kind="bmi"
            heightCm={submitted.heightCm}
            weightKg={submitted.weightKg}
            bmi={bmi}
          />
        ) : (
          <Card className="p-6 text-sm text-slate-500 dark:text-slate-400">
            {lang === 'bn' ? 'উচ্চতা ও ওজন দিয়ে “হিসাব করুন” চাপুন — ফলাফল, ব্যাখ্যা ও স্বাস্থ্য পরিসর এখানে আসবে।' : 'Enter height & weight and press “Calculate” — the result, interpretation and healthy-range reference appear here.'}
          </Card>
        )}
      </div>
    </div>
  );
}
