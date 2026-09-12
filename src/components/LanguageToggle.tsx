import { Languages } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-white/10"
      aria-label={t('lang.aria')}
      title={t('lang.aria')}
    >
      <Languages aria-hidden className="h-4 w-4" />
      <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
    </button>
  );
}
