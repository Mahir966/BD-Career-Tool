import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { APP } from '../config';

export function Footer() {
  const { t } = useI18n();
  const col = 'text-sm';
  const li = 'py-0.5';
  const a =
    'text-slate-300 hover:text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400';

  return (
    <footer className="no-print mt-16 border-t border-emerald-900/10 bg-emerald-950 text-slate-200 dark:border-white/10">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-300">{t('footer.tools')}</h3>
          <ul className={`${col} leading-6`}>
            <li className={li}><Link className={a} to="/retirement">{t('footer.retirement')}</Link></li>
            <li className={li}><Link className={a} to="/job-age">{t('footer.jobAge')}</Link></li>
            <li className={li}><Link className={a} to="/job-age?category=GOVERNMENT">{t('footer.bcsAge')}</Link></li>
            <li className={li}><Link className={a} to="/defence?force=ARMY">{t('footer.defenceCareer')}</Link></li>
            <li className={li}><Link className={a} to="/defence?force=POLICE">{t('footer.policeCareer')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-300">{t('footer.fitness')}</h3>
          <ul className={`${col} leading-6`}>
            <li className={li}><Link className={a} to="/tools/bmi">{t('footer.bmi')}</Link></li>
            <li className={li}><Link className={a} to="/tools/bmr">{t('footer.bmr')}</Link></li>
            <li className={li}><Link className={a} to="/tools/body-fat">{t('footer.bodyfat')}</Link></li>
            <li className={li}><Link className={a} to="/tools/ideal-weight">{t('footer.ideal')}</Link></li>
            <li className={li}><Link className={a} to="/tools/fitness-analysis">{t('footer.analysis')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-300">{t('footer.rules')}</h3>
          <ul className={`${col} leading-6`}>
            <li className={li}><Link className={a} to="/rules?tab=retirement">{t('footer.retRules')}</Link></li>
            <li className={li}><Link className={a} to="/rules?tab=job">{t('footer.recAge')}</Link></li>
            <li className={li}><Link className={a} to="/rules?tab=defence">{t('footer.defStandards')}</Link></li>
            <li className={li}><Link className={a} to="/defence?force=POLICE">{t('footer.policeStandards')}</Link></li>
            <li className={li}><Link className={a} to="/rules?tab=sources">{t('footer.sources')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-300">{t('footer.info')}</h3>
          <ul className={`${col} leading-6`}>
            <li className={li}><Link className={a} to="/about">{t('footer.about')}</Link></li>
            <li className={li}><Link className={a} to="/faq">{t('footer.faq')}</Link></li>
            <li className={li}><Link className={a} to="/disclaimer">{t('footer.disclaimer')}</Link></li>
            <li className={li}><Link className={a} to="/privacy">{t('footer.privacy')}</Link></li>
            <li className={li}><Link className={a} to="/terms">{t('footer.terms')}</Link></li>
            <li className={li}><Link className={a} to="/contact">{t('footer.contact')}</Link></li>
            <li className={li}>
              <a className={`${a} inline-flex items-center gap-1`} href={APP.repoUrl} target="_blank" rel="noopener noreferrer">
                <Github aria-hidden className="h-4 w-4" /> {t('footer.github')}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.made')} · © {new Date().getFullYear()} — {t('app.name')}</p>
          <p className="max-w-xl">{t('common.disclaimerShort')}</p>
        </div>
      </div>
    </footer>
  );
}
