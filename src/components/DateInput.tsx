import { CalendarDays, Eraser } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { Field, TextInput, Button } from './ui';
import { toISO, todayYMD } from '../lib/dateUtils';

export function DateInput({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required,
  max,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  max?: boolean;
}) {
  const { t } = useI18n();
  return (
    <Field htmlFor={id} label={label} error={error} hint={hint} required={required}>
      <div className="flex gap-2">
        <TextInput
          id={id}
          type="date"
          inputMode="numeric"
          value={value}
          max={max ? toISO(todayYMD()) : undefined}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="flex-1"
        />
        <Button variant="outline" onClick={() => onChange(toISO(todayYMD()))} ariaLabel={`${label}: ${t('common.today')}`} className="shrink-0 px-3">
          <CalendarDays aria-hidden className="h-4 w-4" />
          <span className="hidden sm:inline">{t('common.today')}</span>
        </Button>
        <Button variant="ghost" onClick={() => onChange('')} ariaLabel={`${label}: ${t('common.clear')}`} className="shrink-0 px-3">
          <Eraser aria-hidden className="h-4 w-4" />
          <span className="sr-only">{t('common.clear')}</span>
        </Button>
      </div>
    </Field>
  );
}
