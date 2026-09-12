import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, Alert, Card, Field, SectionTitle, Select } from '../components/ui';
import { DefenceCard } from '../components/DefenceCard';
import { DisclaimerNote } from '../components/Disclaimer';
import { RelatedTools } from '../components/RelatedTools';
import { DEFENCE_RULES, FORCE_LABELS } from '../data/defenceRules';
import { heightRequirementCheck } from '../lib/fitnessAnalysis';
import { HeightInput, emptyHeight, heightCmOf } from '../components/HeightWeightInputs';
import type { HeightValue } from '../components/HeightWeightInputs';
import type { DefenceRecruitmentRule } from '../types';

export default function DefencePage() {
  const { t, tl, lang } = useI18n();
  usePageMeta(
    lang === 'bn' ? 'বাংলাদেশ প্রতিরক্ষা ক্যারিয়ার ও ফিটনেস ক্যালকুলেটর' : 'Bangladesh Defence Career & Fitness Calculator',
    'Defence & uniformed-service entry standards for Bangladesh — Army, Navy, Air Force, Police, BGB, Ansar & VDP — with circular sources, verification dates and a height-check helper that never claims official selection power.',
  );
  const [params, setParams] = useSearchParams();
  const force = params.get('force') ?? 'ALL';

  const rules = useMemo(() => (force === 'ALL' ? DEFENCE_RULES : DEFENCE_RULES.filter((r) => r.force === force)), [force]);

  // height-check helper state
  const [entryId, setEntryId] = useState(DEFENCE_RULES[0].id);
  const [sex, setSex] = useState<'M' | 'F'>('M');
  const [h, setH] = useState<HeightValue>(emptyHeight);
  const [checked, setChecked] = useState<{ rule: DefenceRecruitmentRule; meets: boolean | null; text: string } | null>(null);
  const entry = DEFENCE_RULES.find((r) => r.id === entryId) ?? DEFENCE_RULES[0];

  const doCheck = () => {
    const cm = heightCmOf(h);
    if (cm == null) {
      setChecked(null);
      return;
    }
    const res = heightRequirementCheck(cm, entry, sex);
    setChecked({ rule: entry, meets: res.meets, text: tl(res.text) });
  };

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <header className="mb-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/25 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-300">
          <ShieldAlert aria-hidden className="h-3.5 w-3.5" /> 🪖 {t('nav.defence')}
        </p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{t('def.title')}</h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">{t('def.intro')}</p>
      </header>

      <div className="mb-5 flex flex-wrap gap-1.5" role="group" aria-label={t('def.selectForce')}>
        {[{ key: 'ALL', label: t('job.filter.all') }, ...Object.entries(FORCE_LABELS).map(([k, v]) => ({ key: k, label: tl(v) }))].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setParams(f.key === 'ALL' ? {} : { force: f.key })}
            aria-pressed={force === f.key}
            className={`min-h-[40px] rounded-full px-4 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
              force === f.key ? 'bg-emerald-700 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Alert tone="warn" >{t('def.retirementNote')}</Alert>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rules.map((r) => (
          <DefenceCard key={r.id} rule={r} />
        ))}
        {!rules.length ? <p className="text-sm text-slate-500">{t('common.notFound')}</p> : null}
      </div>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <Card as="section" className="p-4 sm:p-6">
          <SectionTitle title={t('def.checker')} sub={t('def.checker.d')} />
          <div className="grid gap-4">
            <Field htmlFor="def-entry" label={t('def.entry')}>
              <Select id="def-entry" value={entryId} onChange={(e) => { setEntryId(e.target.value); setChecked(null); }}>
                {DEFENCE_RULES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {tl(FORCE_LABELS[r.force])} — {tl(r.entryType)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field htmlFor="def-sex" label={t('def.sex')}>
              <Select id="def-sex" value={sex} onChange={(e) => setSex(e.target.value as 'M' | 'F')}>
                <option value="M">{t('def.male')}</option>
                <option value="F">{t('def.female')}</option>
              </Select>
            </Field>
            <HeightInput id="def" value={h} onChange={(v) => { setH(v); setChecked(null); }} />
            <div>
              <button
                type="button"
                onClick={doCheck}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                {t('def.check')}
              </button>
            </div>
            {checked ? (
              <Alert tone={checked.meets ? 'success' : checked.meets === false ? 'warn' : 'info'}>
                <span className="mr-2" aria-hidden>
                  {checked.meets ? '🟢' : checked.meets === false ? '🟠' : '⚪'}
                </span>
                {checked.text}
              </Alert>
            ) : null}
          </div>
        </Card>
        <Card as="section" className="p-4 sm:p-6">
          <SectionTitle title={t('fit.analysis')} sub={t('fit.analysis.d')} />
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {lang === 'bn'
              ? 'BMI ও উচ্চতার স্বাস্থ্য-স্ক্রিনিং এবং অফিসিয়াল নিয়োগ-যোগ্যতা দুটো আলাদা জিনিস। এই সাইট শুধু প্রকাশিত মানদণ্ডের সঙ্গে তুলনা দেখায় — চূড়ান্ত রায় বাহিনীর মেডিকেল বোর্ডের।'
              : 'Health screening (BMI etc.) and official recruitment eligibility are different things. This site only compares against published standards — final fitness is decided by each force’s medical board.'}
          </p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li><a className="font-bold text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-300" href="#/tools/fitness-analysis">{lang === 'bn' ? 'ফিটনেস অ্যানালাইসিস খুলুন →' : 'Open Fitness Analysis →'}</a></li>
            <li><a className="font-bold text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-300" href="#/tools/bmi">{lang === 'bn' ? 'BMI ক্যালকুলেটর →' : 'BMI Calculator →'}</a></li>
          </ul>
        </Card>
      </section>

      <div className="mt-8">
        <DisclaimerNote />
      </div>
      <div className="mt-10">
        <RelatedTools
          title={lang === 'bn' ? 'সম্পর্কিত টুল' : 'Related tools'}
          items={[
            { to: '/retirement', emoji: '🏛️', titleKey: 'nav.retirement', descKey: 'home.card.retirement.d' },
            { to: '/job-age?category=DEFENCE', emoji: '🎯', titleKey: 'nav.jobAge', descKey: 'home.card.jobage.d' },
            { to: '/tools/bmi', emoji: '💪', titleKey: 'footer.bmi', descKey: 'home.card.fitness.d' },
            { to: '/rules?tab=defence', emoji: '📚', titleKey: 'footer.defStandards', descKey: 'home.method.body' },
          ]}
        />
      </div>
    </div>
  );
}
