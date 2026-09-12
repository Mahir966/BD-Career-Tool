import { useI18n } from '../i18n/I18nContext';
import { FAQ_KEYS } from '../i18n/faqData';
import { SectionTitle } from './ui';

/** Accordion built on native <details> — keyboard & screen-reader friendly for free. */
export function FAQ({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  return (
    <section aria-labelledby="faq-h" className="grid gap-3">
      {!compact ? <SectionTitle id="faq-h" title={t('nav.faq')} /> : <h2 id="faq-h" className="text-lg font-bold text-slate-900 dark:text-white">{t('nav.faq')}</h2>}
      <div className="grid gap-2.5">
        {FAQ_KEYS.map(([q, a], i) => (
          <details key={q} className="group rounded-xl border border-slate-200 bg-white px-4 py-3 open:shadow-card dark:border-slate-700 dark:bg-slate-900/70">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-bold text-slate-900 [&::-webkit-details-marker]:hidden dark:text-white">
              <span>
                <span className="mr-2 font-mono text-xs text-emerald-700 dark:text-emerald-400">Q{i + 1}</span>
                {t(q)}
              </span>
              <span aria-hidden className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-sm text-slate-600 transition-transform group-open:rotate-45 dark:bg-slate-800 dark:text-slate-300">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{t(a)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
