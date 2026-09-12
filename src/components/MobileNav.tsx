import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { NAV_ITEMS } from './nav';

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    ref.current?.querySelector<HTMLElement>('a')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div ref={ref} id="mobile-nav" className="border-t border-slate-200 bg-white/95 px-4 pb-4 pt-2 lg:hidden dark:border-slate-800 dark:bg-slate-950/95">
      <nav aria-label={t('nav.menu')} className="grid gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={'end' in item ? item.end : false}
            onClick={onClose}
            className={({ isActive }) =>
              `rounded-xl px-3 py-3 text-[15px] font-semibold transition-colors ${
                isActive
                  ? 'bg-emerald-700/10 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
              }`
            }
          >
            {t(item.key)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
