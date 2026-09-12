import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n/I18nContext';

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const { t } = useI18n();
  const options = [
    { key: 'light', icon: Sun, label: t('theme.light') },
    { key: 'dark', icon: Moon, label: t('theme.dark') },
    { key: 'system', icon: Monitor, label: t('theme.system') },
  ] as const;
  return (
    <div
      role="radiogroup"
      aria-label={t('theme.aria')}
      className="inline-flex items-center rounded-lg border border-slate-300 bg-white/70 p-0.5 dark:border-slate-600 dark:bg-slate-800/70"
    >
      {options.map((o) => {
        const active = mode === o.key;
        const Icon = o.icon;
        return (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.label}
            onClick={() => setMode(o.key)}
            className={`min-h-[36px] rounded-md px-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-600 ${
              active
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
            }`}
          >
            <Icon aria-hidden className="h-4 w-4" />
            <span className="sr-only">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
