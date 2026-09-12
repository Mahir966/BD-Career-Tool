import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

/**
 * Homepage hero — institutional green field with a subtle geometric grid
 * pattern (pure CSS/SVG, no images) + the 4 primary tool cards.
 */
export function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden border-b border-emerald-900/10 bg-gradient-to-b from-emerald-50/80 via-white to-white dark:from-emerald-950/40 dark:via-slate-950 dark:to-slate-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,106,78,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,106,78,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute -top-24 right-[-6rem] h-72 w-72 rounded-full border-[28px] border-rose-500/10" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 left-[-4rem] h-64 w-64 rounded-full border-[24px] border-emerald-600/10" />
      <div className="relative mx-auto max-w-page px-4 py-14 sm:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/25 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-300">
          <ShieldCheck aria-hidden className="h-3.5 w-3.5" />
          {t('home.hero.kicker')}
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          {t('home.hero.title')}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">{t('home.hero.sub')}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/retirement"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-emerald-700 px-5 text-[15px] font-bold text-white shadow-lift transition-colors hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            🏛️ {t('home.hero.cta')} <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
          <Link
            to="/job-age"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border-2 border-emerald-700/40 bg-white/80 px-5 text-[15px] font-bold text-emerald-800 transition-colors hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-emerald-400/40 dark:bg-transparent dark:text-emerald-200 dark:hover:bg-emerald-400/10"
          >
            🎯 {t('home.hero.cta2')}
          </Link>
        </div>
        <p className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900/5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
          <FileText aria-hidden className="h-3.5 w-3.5" /> {t('app.unofficial')}
        </p>
      </div>
    </section>
  );
}
