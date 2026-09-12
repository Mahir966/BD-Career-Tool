import { useI18n } from '../i18n/I18nContext';
import { usePageMeta } from '../components/ui';
import { BMRCalculator } from '../components/BMRCalculator';
import { DisclaimerNote } from '../components/Disclaimer';
import { RelatedTools } from '../components/RelatedTools';
import { sourceById } from '../data/sources';
import { ExternalLink } from 'lucide-react';

export default function BmrPage() {
  const { t, tl, lang } = useI18n();
  usePageMeta(
    lang === 'bn' ? 'BMR ক্যালকুলেটর বাংলাদেশ | Mifflin-St Jeor + TDEE' : 'BMR Calculator Bangladesh | Mifflin-St Jeor + TDEE',
    'Basal metabolic rate & daily calorie needs (TDEE) using the Mifflin–St Jeor equation with documented activity multipliers. Estimates only — not medical advice.',
  );
  const src = sourceById('mifflin-st-jeor');
  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{t('fit.bmr')} 🔥</h1>
        <p className="mt-2 max-w-3xl text-[15px] text-slate-600 dark:text-slate-300">{t('fit.bmr.d')}</p>
      </header>

      <BMRCalculator />

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/70">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{lang === 'bn' ? 'অ্যাক্টিভিটি গুণক' : 'Activity multipliers'}</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{t('fit.activity')}</p>
          <ul className="mt-2 divide-y divide-slate-100 text-sm dark:divide-slate-800" />
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {lang === 'bn'
              ? 'সেডেন্টারি ×১.২ · লাইট ×১.৩৭৫ · মডারেট ×১.৫৫ · ভেরি ×১.৭২৫ · এক্সট্রা ×১.৯ (স্ট্যান্ডার্ড প্র্যাকটিস)।'
              : 'Sedentary ×1.2 · Light ×1.375 · Moderate ×1.55 · Very ×1.725 · Extra ×1.9 (standard practice).'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t('common.source')}</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{src ? tl(src.title) : 'Mifflin-St Jeor'}</p>
          {src ? (
            <a href={src.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:underline dark:text-emerald-300">
              {t('common.viewSource')} <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </section>

      <div className="mt-8">
        <DisclaimerNote />
      </div>
      <div className="mt-10">
        <RelatedTools
          title={lang === 'bn' ? 'সম্পর্কিত টুল' : 'Related tools'}
          items={[
            { to: '/tools/bmi', emoji: '📏', titleKey: 'fit.bmi', descKey: 'fit.bmi.d' },
            { to: '/tools/body-fat', emoji: '⚖️', titleKey: 'fit.bf', descKey: 'fit.bf.d' },
            { to: '/tools/ideal-weight', emoji: '🎯', titleKey: 'fit.iw', descKey: 'fit.iw.d' },
            { to: '/tools/fitness-analysis', emoji: '💪', titleKey: 'fit.analysis', descKey: 'fit.analysis.d' },
          ]}
        />
      </div>
    </div>
  );
}
