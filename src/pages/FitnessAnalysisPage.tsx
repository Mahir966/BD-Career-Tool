import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, Alert, Button, Card, Field, SectionTitle, Select } from '../components/ui';
import { HeightInput, WeightInput, emptyHeight, emptyWeight, heightCmOf, weightKgOf } from '../components/HeightWeightInputs';
import type { HeightValue, WeightValue } from '../components/HeightWeightInputs';
import { computeBmi } from '../lib/bmiCalculator';
import { FitnessResultView } from '../components/FitnessResult';
import { DEFENCE_RULES, FORCE_LABELS } from '../data/defenceRules';
import { DisclaimerNote } from '../components/Disclaimer';

export default function FitnessAnalysisPage() {
  const { t, tl, lang } = useI18n();
  usePageMeta(
    lang === 'bn' ? 'ফিটনেস অ্যানালাইসিস — প্রতিরক্ষা রেফারেন্স তুলনা' : 'Fitness Analysis — defence reference comparison',
    'Analyzed BMI result with plain-language interpretation plus an indicative comparison against published uniformed-service standards. Never a selection verdict.',
  );
  const [h, setH] = useState<HeightValue>(emptyHeight);
  const [w, setW] = useState<WeightValue>(emptyWeight);
  const [ruleId, setRuleId] = useState<string>('none');
  const [out, setOut] = useState<{ hc: number; wk: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const calc = () => {
    const hc = heightCmOf(h);
    const wk = weightKgOf(w);
    if (hc == null || wk == null) {
      setErr(t('err.height.invalid') + ' / ' + t('err.weight.invalid'));
      setOut(null);
      return;
    }
    setErr(null);
    setOut({ hc, wk });
  };

  const bmi = out ? computeBmi({ heightCm: out.hc, weightKg: out.wk }) : null;
  const rule = DEFENCE_RULES.find((r) => r.id === ruleId);

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">💪 {t('fit.analysis')}</h1>
        <p className="mt-2 max-w-3xl text-[15px] text-slate-600 dark:text-slate-300">{t('fit.analysis.d')}</p>
        <Alert tone="warn">
          <span className="inline-block mt-1 font-semibold">
            {lang === 'bn'
              ? 'স্বাস্থ্য-গণনা এবং অফিসিয়াল নিয়োগ-যোগ্যতা আলাদা — এই পৃষ্ঠার কোনো ফলাফল নির্বাচন নিশ্চয়তা দেয় না।'
              : 'Health math and official eligibility are different: nothing here guarantees selection.'}
          </span>
        </Alert>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card as="section" className="h-fit p-4 sm:p-6">
          <SectionTitle title={t('fit.analysis')} />
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              calc();
            }}
            className="grid gap-4"
          >
            <HeightInput id="fa" value={h} onChange={setH} />
            <WeightInput id="fa" value={w} onChange={setW} />
            <Field htmlFor="fa-rule" label={t('fit.recSelect')} hint={t('common.optional')}>
              <Select id="fa-rule" value={ruleId} onChange={(e) => setRuleId(e.target.value)}>
                <option value="none">— ({lang === 'bn' ? 'তুলনা ছাড়া' : 'no comparison'})</option>
                {DEFENCE_RULES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {tl(FORCE_LABELS[r.force])} — {tl(r.entryType)}
                  </option>
                ))}
              </Select>
            </Field>
            {err ? <Alert tone="error">{err}</Alert> : null}
            <div>
              <Button type="submit">{t('common.calculate')}</Button>
            </div>
          </form>
        </Card>

        <div>
          {bmi && out ? (
            <FitnessResultView kind="analysis" heightCm={out.hc} weightKg={out.wk} bmi={bmi} rule={rule} />
          ) : (
            <Card className="p-6 text-sm text-slate-500 dark:text-slate-400">
              {lang === 'bn'
                ? 'উচ্চতা-ওজন দিন; চাইলে একটি বাহিনীর এন্ট্রি বেছে নিন — ইনপুট, হিসাব, ফলাফল, ব্যাখ্যা ও (ঐচ্ছিক) নিয়োগ-মানদণ্ড তুলনা সবকিছু এখানে আসবে।'
                : 'Enter height & weight (optionally a force entry) — input summary, calculation, result, interpretation and recruitment-standard comparison appear here.'}
            </Card>
          )}
        </div>
      </div>

      <div className="mt-8">
        <DisclaimerNote />
      </div>
    </div>
  );
}
