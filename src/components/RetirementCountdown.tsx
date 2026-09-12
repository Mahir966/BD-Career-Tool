import { useI18n } from '../i18n/I18nContext';
import { useNow } from '../hooks/useNow';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { heroDuration } from '../lib/formatters';
import { compareYMD, pad2, toEpochDays, todayYMD } from '../lib/dateUtils';
import type { CalendarDuration, RetirementStatus, YMD } from '../types';

/**
 * Hero countdown: “অবসরের আর — 08 বছর 04 মাস 17 দিন” + a live h:m:s ticker.
 * The live clock stays static under prefers-reduced-motion or a hidden tab.
 * Seconds are measured to local midnight of the retirement date using pure
 * epoch-day arithmetic (timezone-consistent within the day).
 */
export function RetirementCountdown({
  remaining,
  retirementDate,
  status,
}: {
  remaining: CalendarDuration;
  retirementDate: YMD;
  status?: RetirementStatus;
}) {
  const { t, lang } = useI18n();
  const reduced = useReducedMotion();
  const nowMs = useNow(true);
  const future = compareYMD(todayYMD(), retirementDate) > 0;
  const live = future && !reduced;

  let h = 0;
  let m = 0;
  let s = 0;
  if (live) {
    const now = new Date(nowMs);
    const todaySecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const localMidnightNowUnix = Math.floor(nowMs / 1000) - todaySecs;
    const retirementUnix = toEpochDays(retirementDate) * 86400;
    const totalSecs = Math.max(0, retirementUnix - localMidnightNowUnix);
    h = Math.floor((totalSecs % 86400) / 3600);
    m = Math.floor((totalSecs % 3600) / 60);
    s = totalSecs % 60;
  }

  const abs: CalendarDuration = {
    ...remaining,
    years: Math.abs(remaining.years),
    months: Math.abs(remaining.months),
    days: Math.abs(remaining.days),
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 p-5 text-white shadow-lift sm:p-7 dark:from-emerald-950 dark:via-emerald-900 dark:to-slate-950">
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-100/90">{t('ret.remaining')}</p>
      <p className="mt-2 font-mono text-4xl font-extrabold tabular-nums leading-tight sm:text-5xl" aria-live="polite">
        {heroDuration(abs, lang)}
      </p>
      {live ? (
        <p className="mt-1.5 font-mono text-sm tabular-nums text-emerald-100/80">
          {pad2(h)}:{pad2(m)}:{pad2(s)} <span className="font-sans">· {t('ret.liveClock')}</span>
        </p>
      ) : future ? (
        <p className="mt-1.5 text-sm text-emerald-100/80">
          {lang === 'bn' ? 'লাইভ ঘড়ি (রিডিউসড-মোশন নিষ্ক্রিয়)' : 'Live clock disabled by reduced-motion'}
        </p>
      ) : (
        <p className="mt-1.5 text-sm text-emerald-100/80">
          {status === 'RETIREMENT_DUE'
            ? lang === 'bn'
              ? 'আজই অবসরের দিন'
              : 'Today is the retirement day'
            : lang === 'bn'
              ? 'অবসরের তারিখ অতিক্রান্ত'
              : 'Retirement date has passed'}
        </p>
      )}
    </div>
  );
}
