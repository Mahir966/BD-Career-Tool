import { useMemo } from 'react';
import { RotateCcw, Trash2, Calculator } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { RETIREMENT_CATEGORIES, rulesByCategory } from '../data/retirementRules';
import { DateInput } from './DateInput';
import { Button, Card, Field, Select, Alert } from './ui';
import type { RetirementFormState } from '../pages/RetirementPage';

export function RetirementForm({
  state,
  onChange,
  onSubmit,
  onClear,
  errors,
}: {
  state: RetirementFormState;
  onChange: (patch: Partial<RetirementFormState>) => void;
  onSubmit: () => void;
  onClear: () => void;
  errors: { dob?: string; joining?: string; category?: string };
}) {
  const { t, tl } = useI18n();
  const subRules = useMemo(() => (state.category ? rulesByCategory(state.category) : []), [state.category]);
  const selectedRule = subRules.find((r) => r.id === state.subcategory);
  const needsRank = Boolean(selectedRule?.requiresRank && selectedRule.rankCaps?.length);

  const selectSub = (id: string) => onChange({ subcategory: id, rank: '' });
  const selectCat = (key: string) => {
    const rules = rulesByCategory(key);
    onChange({ category: key, subcategory: rules.length ? rules[0].id : '', rank: '' });
  };

  return (
    <Card as="section" className="p-4 sm:p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="grid gap-4"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <DateInput
            id="ret-dob"
            label={t('ret.dob')}
            required
            max
            value={state.dob}
            onChange={(v) => onChange({ dob: v })}
            error={errors.dob}
            hint={t('common.required')}
          />
          <DateInput
            id="ret-joining"
            label={t('ret.joining')}
            max
            value={state.joining}
            onChange={(v) => onChange({ joining: v })}
            error={errors.joining}
            hint={t('common.optional')}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field htmlFor="ret-cat" label={t('ret.category')} required>
            <Select id="ret-cat" value={state.category} onChange={(e) => selectCat(e.target.value)}>
              <option value="">{t('err.category.missing')}</option>
              {RETIREMENT_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {tl(c.label)}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            htmlFor="ret-sub"
            label={t('ret.subcategory')}
            error={errors.category}
          >
            <Select id="ret-sub" value={state.subcategory} onChange={(e) => selectSub(e.target.value)} disabled={!state.category || state.category === 'OTHER'}>
              {subRules.map((r) => (
                <option key={r.id} value={r.id}>
                  {tl(r.name)}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {needsRank ? (
          <Field htmlFor="ret-rank" label={t('ret.rank')} hint={t('common.optional')}>
            <Select id="ret-rank" value={state.rank} onChange={(e) => onChange({ rank: e.target.value })}>
              <option value="">—</option>
              {selectedRule?.rankCaps?.map((c, i) => (
                <option key={i} value={String(i)}>
                  {tl(c.rank)}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}

        <fieldset className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <legend className="px-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{t('ret.ff')}</legend>
          <div className="flex flex-wrap gap-2">
            {[
              { v: false, label: t('ret.ff.no') },
              { v: true, label: t('ret.ff.yes') },
            ].map((o) => (
              <label key={String(o.v)} className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${state.freedomFighter === o.v ? 'border-emerald-700 bg-emerald-700/10 text-emerald-900 dark:border-emerald-400 dark:text-emerald-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-white/10'}`}>
                <input
                  type="radio"
                  name="ret-ff"
                  checked={state.freedomFighter === o.v}
                  onChange={() => onChange({ freedomFighter: o.v })}
                  className="h-4 w-4 accent-emerald-700"
                />
                {o.label}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t('ret.ff.note')}</p>
        </fieldset>

        {state.category === 'OTHER' ? (
          <Alert tone="warn">{t('err.rule.unknown')}</Alert>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="submit" className="min-w-36">
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

export function EditResetBar({ onEdit, onReset }: { onEdit: () => void; onReset: () => void }) {
  const { t } = useI18n();
  return (
    <div className="no-print flex flex-wrap gap-2">
      <Button variant="outline" onClick={onEdit}>
        {t('common.edit')}
      </Button>
      <Button variant="ghost" onClick={onReset}>
        <RotateCcw aria-hidden className="h-4 w-4" />
        {t('common.reset')}
      </Button>
    </div>
  );
}
