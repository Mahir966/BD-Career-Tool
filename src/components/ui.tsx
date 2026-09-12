import { useEffect } from 'react';
import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes } from 'react';
import type { Confidence } from '../types';
import { useI18n } from '../i18n/I18nContext';

/* ---------------- per-route metadata (SEO) ---------------- */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [title, description]);
}

/* ---------------- surfaces ---------------- */
export function Card({ children, className = '', as: As = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' | 'li' }) {
  return <As className={`rounded-2xl border border-emerald-900/10 bg-white/90 shadow-card backdrop-blur-[1px] dark:border-white/10 dark:bg-slate-900/80 ${className}`}>{children}</As>;
}

export function SectionTitle({ id, title, sub }: { id?: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <div id={id} className="mb-5">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">{title}</h2>
      {sub ? <p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{sub}</p> : null}
      <span aria-hidden className="mt-3 block h-1 w-16 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400" />
    </div>
  );
}

/* ---------------- buttons ---------------- */
type BtnProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
};
export function Button({ children, onClick, type = 'button', variant = 'primary', className = '', disabled, ariaLabel }: BtnProps) {
  const base =
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50';
  const styles = {
    primary: 'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500',
    outline:
      'border border-emerald-700/40 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-400/40 dark:text-emerald-200 dark:hover:bg-emerald-400/10',
    ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
  } as const;
  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

/* ---------------- badges / alerts ---------------- */
export function ConfidencePill({ confidence }: { confidence: Confidence }) {
  const { t } = useI18n();
  const map = {
    HIGH: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20',
    MEDIUM: 'bg-amber-100 text-amber-800 ring-amber-600/30 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/20',
    LOW: 'bg-rose-100 text-rose-800 ring-rose-600/30 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/20',
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${map[confidence]}`}>
      {confidence} · {t(`common.conf.${confidence}`)}
    </span>
  );
}

export function Alert({ tone = 'info', children }: { tone?: 'info' | 'warn' | 'error' | 'success'; children: ReactNode }) {
  const map = {
    info: 'border-sky-300/60 bg-sky-50 text-sky-900 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-200',
    warn: 'border-amber-300/70 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200',
    error: 'border-rose-300/70 bg-rose-50 text-rose-900 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200',
    success: 'border-emerald-300/70 bg-emerald-50 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200',
  } as const;
  const role = tone === 'error' ? 'alert' : 'status';
  return (
    <div role={role} className={`rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed ${map[tone]}`}>
      {children}
    </div>
  );
}

/* ---------------- form primitives ---------------- */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className = '',
}: {
  label: ReactNode;
  htmlFor: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        <span>
          {label}
          {required ? <span className="ml-1 text-rose-600 dark:text-rose-400" aria-hidden>*</span> : null}
        </span>
        {hint ? <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm font-medium text-rose-700 dark:text-rose-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputCls =
  'w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-[15px] text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500';

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input {...rest} className={`${inputCls} ${className}`} />;
}

export function Select({ className = '', children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={`${inputCls} ${className}`}>
      {children}
    </select>
  );
}

/* ---------------- misc ---------------- */
export function StatTile({ label, value, sub, accent }: { label: ReactNode; value: ReactNode; sub?: ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? 'border-emerald-600/30 bg-emerald-50/70 dark:border-emerald-400/25 dark:bg-emerald-500/10' : 'border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-800/60'}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-base font-bold leading-snug text-slate-900 dark:text-white">{value}</div>
      {sub ? <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{sub}</div> : null}
    </div>
  );
}

export function Divider() {
  return <hr className="my-6 border-slate-200 dark:border-slate-700" />;
}
