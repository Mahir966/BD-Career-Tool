/**
 * Pure proleptic-Gregorian calendar utilities.
 *
 * Every duration/age calculation in the app goes through these functions so the
 * engine never touches wall-clock Date objects (timezone-safe, unit-testable,
 * exact for leap years and month-end dates).
 */
import type { CalendarDuration, YMD } from '../types';

export const MIN_YEAR = 1900;
export const MAX_YEAR = 2200;

export const BN_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
];
export const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function daysInMonth(y: number, m: number): number {
  if (m < 1 || m > 12) return 0;
  if (m === 2 && isLeapYear(y)) return 29;
  return MONTH_DAYS[m - 1];
}

export function isValidYMD(d: YMD | null | undefined): d is YMD {
  if (!d) return false;
  const { year, month, day } = d;
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (year < MIN_YEAR || year > MAX_YEAR) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > daysInMonth(year, month)) return false;
  return true;
}

/** Parse `YYYY-MM-DD` strictly. Returns null for any impossible/invalid date (e.g. 2025-02-29). */
export function parseISODate(s: string | null | undefined): YMD | null {
  if (!s || typeof s !== 'string') return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const ymd: YMD = { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
  return isValidYMD(ymd) ? ymd : null;
}

export function toISO(d: YMD): string {
  return `${String(d.year).padStart(4, '0')}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
}

/** Days since 1970-01-01 (Howard Hinnant's civil_from_days / days_from_civil). */
export function toEpochDays(d: YMD): number {
  const y = d.year - (d.month <= 2 ? 1 : 0);
  const era = Math.floor((y >= 0 ? y : y - 399) / 400);
  const yoe = y - era * 400; // [0, 399]
  const doy = Math.floor((153 * (d.month + (d.month > 2 ? -3 : 9)) + 2) / 5) + d.day - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

export function fromEpochDays(z: number): YMD {
  z += 719468;
  const era = Math.floor((z >= 0 ? z : z - 146096) / 146097);
  const doe = z - era * 146097;
  const yoe =
    Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp < 10 ? mp + 3 : mp - 9;
  return { year: y + (m <= 2 ? 1 : 0), month: m, day: d };
}

/**
 * Add whole calendar years, clamping Feb 29 → Feb 28 when the target year is not a leap year.
 * Note: Bangladesh practice for 29-Feb birthdays is not explicitly codified in the law texts
 * reviewed; Feb 28 is used (common "anniversary-before" convention) and results are labelled
 * with a verification warning by the engine.
 */
export function addYears(d: YMD, n: number): YMD {
  const year = d.year + n;
  let day = d.day;
  if (d.month === 2 && d.day === 29 && !isLeapYear(year)) day = 28;
  return { year, month: d.month, day };
}

export function compareYMD(a: YMD, b: YMD): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

/** Local "today" as a pure calendar date. */
export function todayYMD(now: Date = new Date()): YMD {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

/**
 * Calendar difference from → to. If `to` is before `from`, the aggregate totals
 * (totalDays / totalMonths / approxYears) go negative while the years/months/days
 * components stay the non-negative breakdown of the absolute span.
 *
 * Algorithm: count whole years, then whole months via day-clamped month
 * arithmetic, then the residual day count in exact epoch days. This handles
 * leap years, Feb-29 anniversaries and month-end dates deterministically.
 */
export function diffYMD(from: YMD, to: YMD): CalendarDuration {
  let sign = 1;
  let a = from;
  let b = to;
  if (compareYMD(a, b) > 0) {
    sign = -1;
    a = to;
    b = from;
  }

  let years = b.year - a.year;
  let months = b.month - a.month;
  if (b.day < a.day) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  let anchor = addMonthsClamped(a, years * 12 + months);
  if (compareYMD(anchor, b) > 0) {
    months -= 1;
    if (months < 0) {
      years -= 1;
      months = 11;
    }
    anchor = addMonthsClamped(a, years * 12 + months);
  }
  const days = toEpochDays(b) - toEpochDays(anchor);
  const totalDays = toEpochDays(b) - toEpochDays(a);
  const totalMonths = years * 12 + months;

  return {
    years,
    months,
    days,
    totalDays: sign * totalDays,
    totalMonths: sign * totalMonths,
    approxYears: (sign * totalDays) / 365.2425,
  };
}

/** Add calendar months with day clamping (e.g. Jan 31 + 1 month → Feb 28/29). */
export function addMonthsClamped(d: YMD, months: number): YMD {
  const totalMonths = (d.year * 12 + (d.month - 1)) + months;
  const year = Math.floor(totalMonths / 12);
  const month = (totalMonths % 12) + 1;
  const day = Math.min(d.day, daysInMonth(year, month));
  return { year, month, day };
}

/** Exact age at a reference date. */
export function ageAt(dob: YMD, ref: YMD): CalendarDuration {
  return diffYMD(dob, ref);
}

/** "10 May 2030" / "10 মে 2030" */
export function formatDate(ymd: YMD, lang: 'bn' | 'en'): string {
  const months = lang === 'bn' ? BN_MONTHS : EN_MONTHS;
  return `${ymd.day} ${months[ymd.month - 1]} ${ymd.year}`;
}

/** "2030-05-10" style ISO with Bengali digits option kept elsewhere; here plain ISO. */
export function formatDateISO(ymd: YMD): string {
  return toISO(ymd);
}

/** Break total seconds into h/m/s for live countdown displays. */
export function splitClock(totalSeconds: number): { hours: number; minutes: number; seconds: number } {
  const s = Math.max(0, Math.floor(totalSeconds));
  return {
    hours: Math.floor(s / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
