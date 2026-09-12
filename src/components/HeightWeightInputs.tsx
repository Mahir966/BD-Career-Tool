import { useI18n } from '../i18n/I18nContext';
import { Field, TextInput } from './ui';
import { feetInchesToCm, kgToLb, lbToKg } from '../lib/bmiCalculator';

export type HeightUnit = 'imperial' | 'metric';
export interface HeightValue {
  unit: HeightUnit;
  feet: string;
  inches: string;
  cm: string;
}
export interface WeightValue {
  unit: 'kg' | 'lb';
  kg: string;
  lb: string;
}

export const emptyHeight: HeightValue = { unit: 'imperial', feet: '', inches: '', cm: '' };
export const emptyWeight: WeightValue = { unit: 'kg', kg: '', lb: '' };

/** null when missing/invalid. Imperial path is exactly 5×30.48 + 6×2.54 for 5ft6in. */
export function heightCmOf(h: HeightValue): number | null {
  if (h.unit === 'metric') {
    const cm = Number(h.cm);
    return Number.isFinite(cm) && cm > 0 ? cm : null;
  }
  const ft = h.feet === '' ? 0 : Number(h.feet);
  const inch = h.inches === '' ? 0 : Number(h.inches);
  if (!Number.isFinite(ft) || !Number.isFinite(inch) || ft < 0 || inch < 0 || inch >= 12) return null;
  if (ft === 0 && inch === 0) return null;
  return feetInchesToCm(ft, inch);
}

export function weightKgOf(w: WeightValue): number | null {
  const raw = w.unit === 'kg' ? Number(w.kg) : Number(w.lb);
  if (!Number.isFinite(raw) || raw <= 0) return null;
  return w.unit === 'kg' ? raw : lbToKg(raw);
}

export function HeightInput({ id, value, onChange }: { id: string; value: HeightValue; onChange: (v: HeightValue) => void }) {
  const { t } = useI18n();
  const toggle = (unit: HeightUnit) => {
    if (unit === value.unit) return;
    if (unit === 'metric') {
      const cm = heightCmOf(value);
      onChange({ unit, feet: value.feet, inches: value.inches, cm: cm != null ? cm.toFixed(1) : '' });
    } else {
      const cm = Number(value.cm);
      if (Number.isFinite(cm) && cm > 0) {
        const totalIn = cm / 2.54;
        const feet = Math.floor(totalIn / 12);
        const inches = Math.round(totalIn - feet * 12);
        onChange({ unit, feet: String(feet), inches: String(inches >= 12 ? 11 : inches), cm: value.cm });
      } else {
        onChange({ ...value, unit });
      }
    }
  };
  return (
    <Field
      htmlFor={`${id}-h`}
      label={
        <span className="flex w-full items-center justify-between gap-2">
          <span>{t('fit.height')}</span>
          <span className="inline-flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600" role="group" aria-label={t('fit.heightMode')}>
            <button type="button" onClick={() => toggle('imperial')} aria-pressed={value.unit === 'imperial'} className={`px-2 py-0.5 text-xs font-semibold ${value.unit === 'imperial' ? 'bg-emerald-700 text-white' : 'text-slate-600 dark:text-slate-300'}`}>
              {t('fit.mode.imperial')}
            </button>
            <button type="button" onClick={() => toggle('metric')} aria-pressed={value.unit === 'metric'} className={`px-2 py-0.5 text-xs font-semibold ${value.unit === 'metric' ? 'bg-emerald-700 text-white' : 'text-slate-600 dark:text-slate-300'}`}>
              {t('fit.mode.metric')}
            </button>
          </span>
        </span>
      }
    >
      {value.unit === 'imperial' ? (
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <TextInput id={`${id}-h`} inputMode="decimal" placeholder="5" value={value.feet} onChange={(e) => onChange({ ...value, feet: e.target.value })} aria-label={`${t('fit.height')} ${t('fit.feet')}`} />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 dark:text-slate-400">{t('fit.feet')}</span>
          </div>
          <div className="relative">
            <TextInput inputMode="decimal" placeholder="7" value={value.inches} onChange={(e) => onChange({ ...value, inches: e.target.value })} aria-label={`${t('fit.height')} ${t('fit.inches')}`} />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 dark:text-slate-400">{t('fit.inches')}</span>
          </div>
        </div>
      ) : (
        <div className="relative">
          <TextInput id={`${id}-h`} inputMode="decimal" placeholder="170" value={value.cm} onChange={(e) => onChange({ ...value, cm: e.target.value })} aria-label={`${t('fit.height')} (cm)`} />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 dark:text-slate-400">cm</span>
        </div>
      )}
    </Field>
  );
}

export function WeightInput({ id, value, onChange }: { id: string; value: WeightValue; onChange: (v: WeightValue) => void }) {
  const { t } = useI18n();
  const toggle = (unit: 'kg' | 'lb') => {
    if (unit === value.unit) return;
    if (unit === 'lb') {
      const kg = Number(value.kg);
      onChange({ unit, kg: value.kg, lb: Number.isFinite(kg) && kg > 0 ? kgToLb(kg).toFixed(1) : '' });
    } else {
      const lb = Number(value.lb);
      onChange({ unit, kg: Number.isFinite(lb) && lb > 0 ? lbToKg(lb).toFixed(1) : '', lb: value.lb });
    }
  };
  return (
    <Field
      htmlFor={`${id}-w`}
      label={
        <span className="flex w-full items-center justify-between gap-2">
          <span>{t('fit.weight')}</span>
          <span className="inline-flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600" role="group" aria-label={t('fit.weight')}>
            <button type="button" onClick={() => toggle('kg')} aria-pressed={value.unit === 'kg'} className={`px-2 py-0.5 text-xs font-semibold ${value.unit === 'kg' ? 'bg-emerald-700 text-white' : 'text-slate-600 dark:text-slate-300'}`}>
              {t('fit.kg')}
            </button>
            <button type="button" onClick={() => toggle('lb')} aria-pressed={value.unit === 'lb'} className={`px-2 py-0.5 text-xs font-semibold ${value.unit === 'lb' ? 'bg-emerald-700 text-white' : 'text-slate-600 dark:text-slate-300'}`}>
              {t('fit.lb')}
            </button>
          </span>
        </span>
      }
    >
      <div className="relative">
        <TextInput
          id={`${id}-w`}
          inputMode="decimal"
          placeholder={value.unit === 'kg' ? '70' : '154'}
          value={value.unit === 'kg' ? value.kg : value.lb}
          onChange={(e) => onChange(value.unit === 'kg' ? { ...value, kg: e.target.value } : { ...value, lb: e.target.value })}
          aria-label={`${t('fit.weight')} (${value.unit})`}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 dark:text-slate-400">{value.unit}</span>
      </div>
    </Field>
  );
}
