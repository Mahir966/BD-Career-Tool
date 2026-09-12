import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export function CalculatorCard({
  to,
  emoji,
  title,
  desc,
  badge,
  primary,
}: {
  to: string;
  emoji: string;
  title: string;
  desc: string;
  badge?: string;
  primary?: boolean;
}) {
  const { t } = useI18n();
  return (
    <Link
      to={to}
      className={`group relative flex h-full flex-col rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        primary
          ? 'border-emerald-700/60 bg-gradient-to-br from-emerald-800 to-emerald-700 text-white shadow-lift dark:from-emerald-800 dark:to-emerald-950'
          : 'border-slate-200 bg-white/90 text-slate-900 shadow-card dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100'
      }`}
    >
      <span aria-hidden className="text-3xl">
        {emoji}
      </span>
      <h3 className={`mt-3 text-base font-bold leading-snug ${primary ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{title}</h3>
      <p className={`mt-1.5 flex-1 text-sm leading-relaxed ${primary ? 'text-emerald-50/90' : 'text-slate-600 dark:text-slate-300'}`}>{desc}</p>
      <span className={`mt-3 inline-flex items-center gap-1 text-sm font-bold ${primary ? 'text-white' : 'text-emerald-800 dark:text-emerald-300'}`}>
        {t('common.open')}
        {badge ? (
          <span className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${primary ? 'bg-white/15 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'}`}>{badge}</span>
        ) : null}
        <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
