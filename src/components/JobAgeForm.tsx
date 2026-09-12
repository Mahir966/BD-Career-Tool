import { Calculator, Trash2 } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { DateInput } from './DateInput';
import { Alert, Button, Card, Field, Select } from './ui';

export interface JobAgeFormState {
  mode: 'dob' | 'age';
  dob: string;
  age: string;
  ffDescendant: boolean;
  pwd: boolean;
  women: boolean;
  serving: boolean;
  freedomFighter: boolean;
}

export const emptyJobAgeForm: JobAgeFormState = {
  mode: 'dob',
  dob: '',
  age: '',
  ffDescendant: false,
  pwd: false,
  women: false,
  serving: false,
  freedomFighter: false,
};

export function JobAgeForm({
  state,
  onChange,
  onSubmit,
  onClear,
  errors,
}: {
  state: JobAgeFormState;
  onChange: (patch: Partial<JobAgeFormState>) => void;
  onSubmit: () => void;
  onClear: () => void;
  errors: { input?: string };
}) {
  const { t } = useI18n();
  return (
    <Card as="section" className="p-4 sm:p-6">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="grid gap-4"
      >
        <fieldset className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <legend className="px-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{t('job.dobOrAge')}</legend>
          <div role="radiogroup" aria-label={t('job.dobOrAge')} className="mb-3 flex gap-2">
            {[
              { key: 'dob', label: t('job.dob') },
              { key: 'age', label: t('job.age') },
            ].map((m) => (
              <label key={m.key} className={`flex min-h-[44px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold ${state.mode === m.key ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-white/10'}`}>
                <input type="radio" name="jobage-mode" className="sr-only" checked={state.mode === m.key} onChange={() => onChange({ mode: m.key as 'dob' | 'age' })} />
                {m.label}
              </label>
            ))}
          </div>
          {state.mode === 'dob' ? (
            <DateInput id="job-dob" label={t('job.dob')} required max value={state.dob} onChange={(v) => onChange({ dob: v })} error={errors.input} />
          ) : (
            <Field htmlFor="job-age" label={t('job.age')} hint={t('job.age.helper')} error={errors.input}>
              <Select id="job-age" value={state.age} onChange={(e) => onChange({ age: e.target.value })}>
                <option value="">—</option>
                {Array.from({ length: 111 }, (_, i) => 10 + i).map((a) => (
                  <option key={a} value={String(a)}>
                    {a}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </fieldset>

        <fieldset className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <legend className="px-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{t('job.status')}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { key: 'freedomFighter', label: t('ret.ff.yes') },
              { key: 'ffDescendant', label: t('job.status.ff') },
              { key: 'pwd', label: t('job.status.pwd') },
              { key: 'women', label: t('job.status.women') },
              { key: 'serving', label: t('job.status.serving') },
            ].map((o) => (
              <label key={o.key} className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${state[o.key as keyof JobAgeFormState] ? 'border-emerald-700 bg-emerald-700/10 text-emerald-900 dark:border-emerald-400 dark:text-emerald-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-white/10'}`}>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-emerald-700"
                  checked={Boolean(state[o.key as keyof JobAgeFormState])}
                  onChange={(e) => onChange({ [o.key]: e.target.checked } as Partial<JobAgeFormState>)}
                />
                {o.label}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t('job.note32')}</p>
        </fieldset>

        {state.pwd ? (
          <Alert tone="info">{t('job.pwd.note')}</Alert>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="submit" className="min-w-44">
            <Calculator aria-hidden className="h-4 w-4" />
            {t('common.calculate')}
          </Button>
          <Button variant="outline" onClick={onClear}>
            <Trash2 aria-hidden className="h-4 w-4" />
            {t('common.clear')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
