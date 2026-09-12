/**
 * Exact-age calculation. Always calendar-based — never `currentYear - birthYear`.
 */
import { addYears, ageAt, compareYMD, todayYMD } from './dateUtils';
import type { CalendarDuration, YMD } from '../types';

export function currentAge(dob: YMD, ref: YMD = todayYMD()): CalendarDuration {
  return ageAt(dob, ref);
}

/** Age at a recruitment circular's reference date (used for “as on …” rules). */
export function ageAtDate(dob: YMD, asOf: YMD): CalendarDuration {
  return ageAt(dob, asOf);
}

/** True when `ref` is exactly the anniversary of `dob`. */
export function isAgeAnniversary(dob: YMD, ref: YMD): boolean {
  const age = ageAt(dob, ref);
  return compareYMD(ref, dob) > 0 && age.months === 0 && age.days === 0;
}

/**
 * Date on which a person born on `dob` completes `ageYears`.
 * Feb-29 birthdays resolve to Feb-28 of non-leap target years (see dateUtils note).
 */
export function completionDate(dob: YMD, ageYears: number): YMD {
  return addYears(dob, ageYears);
}
