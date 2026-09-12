import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { APP } from '../config';

/** Site-wide educational disclaimer banner (dismissible; choice persisted locally). */
export function DisclaimerBanner() {
  const { t } = useI18n();
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    try {
      setHidden(localStorage.getItem(APP.ls.disclaimerHidden) === '1');
    } catch {
      setHidden(false);
    }
  }, []);
  if (hidden) return null;
  return (
    <div role="note" className="no-print border-b border-amber-500/30 bg-amber-50/95 text-amber-950 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
      <div className="mx-auto flex max-w-page items-start gap-2 px-4 py-2 text-[12.5px] leading-relaxed">
        <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="min-w-0 flex-1">
          {t('disc.full')}{' '}
          <Link to="/disclaimer" className="font-bold underline underline-offset-2">
            {t('disc.bannershow')}
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(APP.ls.disclaimerHidden, '1');
            } catch {
              /* ignore */
            }
            setHidden(true);
          }}
          className="shrink-0 rounded-md p-1 hover:bg-amber-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600"
          aria-label={t('disc.hide')}
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Inline note used beneath every result. */
export function DisclaimerNote() {
  const { t } = useI18n();
  return (
    <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
      <strong className="font-bold">{t('footer.disclaimer')}: </strong>
      {t('common.disclaimerShort')}
    </p>
  );
}
