import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { MobileNav } from './MobileNav';
import { NAV_ITEMS } from './nav';


export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  // close mobile panel whenever the route changes
  const key = location.pathname;
  const close = () => setOpen(false);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-emerald-900/10 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-slate-950/80 dark:supports-[backdrop-filter]:bg-slate-950/70">
      <div className="hidden border-b border-slate-200/70 bg-emerald-950 text-[11px] text-emerald-100/90 sm:block dark:border-white/5">
        <div className="mx-auto flex max-w-page items-center justify-between px-4 py-1">
          <p>{t('app.unofficial')}</p>
          <p className="tabular-nums">সরকারি আইন/বিজ্ঞপ্তি অনুসরণ করুন · Follow official gazettes</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-page items-center gap-3 px-4 py-2.5" key={key}>
        <NavLink to="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600" aria-label={`${t('app.name')} — ${t('nav.home')}`}>
          <LogoMark />
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">{t('app.name')}</span>
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">{t('app.tagline')}</span>
          </span>
        </NavLink>

        <nav aria-label={t('nav.menu')} className="ml-auto hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={'end' in item ? item.end : false}
              className={({ isActive }) =>
                `rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                  isActive
                    ? 'bg-emerald-700/10 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <ThemeToggle />
          <LanguageToggle />
          <button
            type="button"
            className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 lg:hidden dark:border-slate-600 dark:text-slate-200 dark:hover:bg-white/10"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{t('nav.menu')}</span>
            {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <MobileNav open={open} onClose={close} />
    </header>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" role="img" aria-hidden focusable="false">
      <defs>
        <linearGradient id="bctlg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#006a4e" />
          <stop offset="1" stopColor="#0a8f6a" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="10" fill="url(#bctlg)" />
      <circle cx="20" cy="18" r="7.5" fill="#f42a41" />
      <path d="M10.5 30.5h19" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M13 26h14" stroke="#fff" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
