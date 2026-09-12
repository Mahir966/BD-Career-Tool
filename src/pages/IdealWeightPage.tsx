import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, Alert, Button, Card, Field, SectionTitle, Select, StatTile } from '../components/ui';
import { HeightInput, emptyHeight, heightCmOf } from '../components/HeightWeightInputs';
import type { HeightValue } from '../components/HeightWeightInputs';
import { devineIdealWeight, idealWeightRange, kgToLb } from '../lib/bmiCalculator';
import { DisclaimerNote } from '../components/Disclaimer';

export default function IdealWeightPage() {
  const { t, lang } = useI18n();
  usePageMeta(
    lang === 'bn' ? 'আদর্শ ওজন পরিসর বাংলাদেশ' : 'Ideal Weight Range Bangladesh',
    'Healthy weight range for your height (BMI 18.5–24.9) plus the Devine clinical reference — with feet+inches input support.',
  );
  const [h, setH] = useState<HeightValue>(emptyHeight);
  const [sex, setSex] = useState<'M' | 'F'>('M');
  const [res, setRes] = useState<{ min: number; max: number; devine: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const calc = () => {
    const cm = heightCmOf(h);
    if (cm == null) {
      setErr(t('err.height.invalid'));
      setRes(null);
      return;
    }
    setErr(null);
    const range = idealWeightRange(cm);
    setRes({ min: range.min, max: range.max, devine: devineIdealWeight(cm, sex) });
  };

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">🎯 {t('fit.iw')}</h1>
        <p className="mt-2 max-w-3xl text-[15px] text-slate-600 dark:text-slate-300">{t('fit.iw.d')}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card as="section" className="h-fit p-4 sm:p-6">
          <SectionTitle title={t('fit.iw')} />
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              calc();
            }}
            className="grid gap-4"
          >
            <HeightInput id="iw" value={h} onChange={setH} />
            <Field htmlFor="iw-sex" label={t('fit.sex')} hint={lang === 'bn' ? 'Devine-এর জন্য' : 'for Devine'}>
              <Select id="iw-sex" value={sex} onChange={(e) => setSex(e.target.value as 'M' | 'F')}>
                <option value="M">{t('fit.male')}</option>
                <option value="F">{t('fit.female')}</option>
              </Select>
            </Field>
            {err ? <Alert tone="error">{err}</Alert> : null}
            <div>
              <Button type="submit">{t('common.calculate')}</Button>
            </div>
          </form>
        </Card>

        <div className="grid gap-4">
          {res ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <StatTile accent label={t('fit.iwRange')} value={`${res.min}–${res.max} kg`} sub={`≈ ${kgToLb(res.min).toFixed(0)}–${kgToLb(res.max).toFixed(0)} lb`} />
                <StatTile label={t('fit.iwDevine')} value={`${res.devine} kg`} sub={`≈ ${kgToLb(res.devine).toFixed(0)} lb`} />
              </div>
              <Alert tone="info">
                {lang === 'bn'
                  ? '“আদর্শ ওজন” একটি পরিসর, একটি সংখ্যা নয়। পেশী, হাড়ের গঠন, বয়স ও সামগ্রিক স্বাস্থ্যের ওপর ভিত্তি করে একজনের সুস্থ ওজন ভিন্ন হয় — এটি চিকিৎসা পরামর্শ নয়।'
                  : '“Ideal weight” is a range, not one number. A person’s healthy weight varies with muscle, bone build, age and overall health — this is not medical advice.'}
              </Alert>
            </>
          ) : (
            <Card className="p-6 text-sm text-slate-500 dark:text-slate-400">{lang === 'bn' ? 'উচ্চতা দিয়ে হিসাব করুন।' : 'Enter height and calculate.'}</Card>
          )}
        </div>
      </div>

      <div className="mt-8">
        <DisclaimerNote />
      </div>
    </div>
  );
}
