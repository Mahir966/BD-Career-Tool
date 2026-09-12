import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, Button } from '../components/ui';

export default function NotFound() {
  const { t } = useI18n();
  usePageMeta(t('notfound.title'), 'Page not found');
  return (
    <div className="mx-auto flex max-w-page flex-col items-start px-4 py-20">
      <p className="font-mono text-6xl font-extrabold text-emerald-700 dark:text-emerald-400">404</p>
      <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{t('notfound.title')}</h1>
      <p className="mt-2 max-w-md text-[15px] text-slate-600 dark:text-slate-300">{t('notfound.body')}</p>
      <Link to="/" className="mt-6">
        <Button>{t('nav.home')}</Button>
      </Link>
    </div>
  );
}
