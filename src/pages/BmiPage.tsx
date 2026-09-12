import { useI18n } from '../i18n/I18nContext';
import { usePageMeta } from '../components/ui';
import { BMICalculator } from '../components/BMICalculator';
import { DisclaimerNote } from '../components/Disclaimer';
import { RelatedTools } from '../components/RelatedTools';
import { WHO_BMI_BANDS } from '../data/fitnessRules';
import { ASIA_PACIFIC_RISK_NOTE } from '../data/fitnessRules';
import { sourceById } from '../data/sources';
import { ExternalLink } from 'lucide-react';

export default function BmiPage() {
  const { t, tl, lang } = useI18n();
  usePageMeta(
    lang === 'bn' ? 'BMI ক্যালকুলেটর বাংলাদেশ (ফুট/ইঞ্চি সাপোর্ট)' : 'BMI Calculator Bangladesh (ft/in supported)',
    'BMI calculator for Bangladesh using the international formula kg/m² with feet+inches input, WHO classification and healthy-range analysis. Screening only — not a medical diagnosis.',
  );
  const src = sourceById('who-bmi');
  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{t('fit.bmi')} 📏</h1>
        <p className="mt-2 max-w-3xl text-[15px] text-slate-600 dark:text-slate-300">{t('home.card.bmi.d')}</p>
      </header>

      <BMICalculator />

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/70">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{lang === 'bn' ? 'WHO শ্রেণিবিভাগ (প্রাপ্তবয়স্ক)' : 'WHO classification (adults)'}</h2>
          <ul className="mt-2 divide-y divide-slate-100 text-sm dark:divide-slate-800">
            {WHO_BMI_BANDS.map((b) => (
              <li key={b.key} className="flex items-center justify-between gap-3 py-1.5">
                <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                  {b.minInclusive}–{b.maxExclusive ?? '∞'}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{tl(b.label)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{tl(ASIA_PACIFIC_RISK_NOTE)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('common.source')}</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{src ? tl(src.title) : 'WHO'}</p>
          {src ? (
            <a href={src.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:underline dark:text-emerald-300">
              {t('common.viewSource')} <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </a>
          ) : null}
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {t('common.verified')}: <span className="font-mono">{src?.verifiedDate}</span>
          </p>
        </div>
      </section>

      <div className="mt-8">
        <DisclaimerNote />
      </div>
      <div className="mt-10">
        <RelatedTools
          title={lang === 'bn' ? 'সম্পর্কিত টুল' : 'Related tools'}
          items={[
            { to: '/tools/bmr', emoji: '🔥', titleKey: 'fit.bmr', descKey: 'fit.bmr.d' },
            { to: '/tools/body-fat', emoji: '⚖️', titleKey: 'fit.bf', descKey: 'fit.bf.d' },
            { to: '/tools/ideal-weight', emoji: '🎯', titleKey: 'fit.iw', descKey: 'fit.iw.d' },
            { to: '/tools/fitness-analysis', emoji: '💪', titleKey: 'fit.analysis', descKey: 'fit.analysis.d' },
          ]}
        />
      </div>
    </div>
  );
}
