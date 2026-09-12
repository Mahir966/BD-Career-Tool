import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, Alert, Button, Card, Field, SectionTitle, Select, StatTile } from '../components/ui';
import { HeightInput, emptyHeight, heightCmOf } from '../components/HeightWeightInputs';
import type { HeightValue } from '../components/HeightWeightInputs';
import { computeBmi, estimateBodyFatDeurenberg, estimateBodyFatTape } from '../lib/bmiCalculator';
import { DisclaimerNote } from '../components/Disclaimer';

export default function BodyFatPage() {
  const { t, lang } = useI18n();
  usePageMeta(
    lang === 'bn' ? 'বডি ফ্যাট প্রাক্কলন বাংলাদেশ' : 'Body Fat Estimate Bangladesh',
    'Estimated body-fat percentage from BMI+age (Deurenberg) or tape measurements (US-DoD method). Screening estimate only — not a medical measurement.',
  );
  const [h, setH] = useState<HeightValue>(emptyHeight);
  const [w, setW] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'M' | 'F'>('M');
  const [neck, setNeck] = useState('');
  const [abdomen, setAbdomen] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [out, setOut] = useState<{ deu: number; tape: number | null } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const calc = () => {
    const hc = heightCmOf(h);
    const wk = Number(w);
    const ag = Number(age);
    if (hc == null || !Number.isFinite(wk) || wk <= 0 || !Number.isInteger(ag) || ag < 10 || ag > 100) {
      setErr(t('err.height.invalid') + ' / ' + t('err.weight.invalid') + ' / ' + t('err.age.invalid'));
      setOut(null);
      return;
    }
    setErr(null);
    const bmi = computeBmi({ heightCm: hc, weightKg: wk });
    if (!bmi.ok || bmi.bmi == null) {
      setErr(tl2(bmi.interpretation));
      return;
    }
    const deu = estimateBodyFatDeurenberg(bmi.bmi, ag, sex).percent;
    const nk = Number(neck);
    const tape =
      Number.isFinite(nk) && nk > 0
        ? sex === 'M'
          ? estimateBodyFatTape({ sex, heightCm: hc, neckCm: nk, abdomenCm: Number(abdomen) })
          : estimateBodyFatTape({ sex, heightCm: hc, neckCm: nk, waistCm: Number(waist), hipCm: Number(hip) })
        : null;
    setOut({ deu, tape: tape != null && Number.isFinite(tape) ? tape : null });
  };
  const tl2 = (x: { bn: string; en: string }) => (lang === 'bn' ? x.bn : x.en);

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">⚖️ {t('fit.bf')}</h1>
        <p className="mt-2 max-w-3xl text-[15px] text-slate-600 dark:text-slate-300">{t('fit.bf.d')}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card as="section" className="h-fit p-4 sm:p-6">
          <SectionTitle title={t('fit.bf')} />
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              calc();
            }}
            className="grid gap-4"
          >
            <HeightInput id="bf" value={h} onChange={setH} />
            <div className="grid grid-cols-2 gap-4">
              <Field htmlFor="bf-w" label={`${t('fit.weight')} (kg)`} required>
                <input id="bf-w" inputMode="decimal" value={w} onChange={(e) => setW(e.target.value)} placeholder="70" className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 text-[15px] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
              </Field>
              <Field htmlFor="bf-age" label={t('fit.age')} required>
                <input id="bf-age" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} placeholder="24" className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 text-[15px] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
              </Field>
            </div>
            <Field htmlFor="bf-sex" label={t('fit.sex')}>
              <Select id="bf-sex" value={sex} onChange={(e) => setSex(e.target.value as 'M' | 'F')}>
                <option value="M">{t('fit.male')}</option>
                <option value="F">{t('fit.female')}</option>
              </Select>
            </Field>
            <details className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
              <summary className="cursor-pointer font-semibold text-slate-800 dark:text-slate-100">
                {lang === 'bn' ? 'বিকল্প: টেপ-মেজার পদ্ধতি (ঐচ্ছিক)' : 'Optional: tape-measure method'}
              </summary>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field htmlFor="bf-neck" label={t('fit.neck')}>
                  <input id="bf-neck" inputMode="decimal" value={neck} onChange={(e) => setNeck(e.target.value)} className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 text-[15px] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
                </Field>
                {sex === 'M' ? (
                  <Field htmlFor="bf-ab" label={t('fit.abdomen')}>
                    <input id="bf-ab" inputMode="decimal" value={abdomen} onChange={(e) => setAbdomen(e.target.value)} className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 text-[15px] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
                  </Field>
                ) : (
                  <>
                    <Field htmlFor="bf-waist" label={t('fit.waist')}>
                      <input id="bf-waist" inputMode="decimal" value={waist} onChange={(e) => setWaist(e.target.value)} className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 text-[15px] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
                    </Field>
                    <Field htmlFor="bf-hip" label={t('fit.hip')}>
                      <input id="bf-hip" inputMode="decimal" value={hip} onChange={(e) => setHip(e.target.value)} className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 text-[15px] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
                    </Field>
                  </>
                )}
              </div>
            </details>
            {err ? <Alert tone="error">{err}</Alert> : null}
            <div>
              <Button type="submit">{t('common.calculate')}</Button>
            </div>
          </form>
        </Card>

        <div className="grid gap-4">
          {out ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <StatTile accent label={t('fit.bodyfatEst') + ' · Deurenberg'} value={`${out.deu}%`} sub={`BMI-based`} />
                <StatTile label={'Tape method (US DoD)'} value={out.tape != null ? `${out.tape}%` : '—'} sub={out.tape == null ? (lang === 'bn' ? 'টেপ মাপ দিন' : 'enter tape measures') : ' '} />
              </div>
              <Alert tone="info">
                {lang === 'bn'
                  ? 'এগুলো পরিসংখ্যানগত প্রাক্কলন — DEXA/হাইড্রোডেনসিমেট্রির মতো মেজারমেন্ট নয়। বডি কাম্পোজিটিং নিয়ে প্রশ্নে স্বাস্থ্য-পেশাদারের পরামর্শ নিন।'
                  : 'These are statistical estimates — not measurements like DEXA. For real body-composition questions consult a health professional.'}
              </Alert>
            </>
          ) : (
            <Card className="p-6 text-sm text-slate-500 dark:text-slate-400">{lang === 'bn' ? 'মাপ দিয়ে হিসাব করুন — আনুমানিক বডি ফ্যাট % এখানে দেখা যাবে।' : 'Enter measurements and calculate — estimated body-fat % appears here.'}</Card>
          )}
        </div>
      </div>

      <div className="mt-8">
        <DisclaimerNote />
      </div>
    </div>
  );
}
