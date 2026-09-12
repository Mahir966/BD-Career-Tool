/**
 * Job-age eligibility engine.
 * Evaluates a candidate age (with exact months/days) against recruitment
 * age-limit rules from src/data/jobAgeRules.ts. Pure logic, no UI.
 */
import type { EligibilityInput, EligibilityLevel, EligibilityOutcome, JobAgeRule, LText } from '../types';
import { parseISODate } from './dateUtils';
import type { YMD } from '../types';

export interface JobAgeEvaluationContext {
  /** Age already computed at the correct reference date (today or circular's as-on date). */
  age: { years: number; months: number; days: number };
  status: EligibilityInput['status'];
}

/**
 * Evaluate one rule.
 * `age` is expected to be pre-adjusted by the caller for the rule's `asOfDate`
 * (the eligibility page does that), so the engine stays deterministic & testable.
 */
export function evaluateJobAge(rule: JobAgeRule, ctx: JobAgeEvaluationContext): EligibilityOutcome {
  const ageYears = ctx.age.years;
  const totalMonths = ctx.age.years * 12 + ctx.age.months + (ctx.age.days >= 15 ? 0.5 : 0);
  const { status } = ctx;

  let effectiveMax = rule.maximumAge;
  const adjustments = rule.specialAgeRules;
  if (effectiveMax != null && adjustments) {
    if (status.ffDescendant && adjustments.freedomFighter) effectiveMax += adjustments.freedomFighter;
    if (status.pwd && adjustments.pwd) effectiveMax += adjustments.pwd;
    if (status.women && adjustments.women) effectiveMax += adjustments.women;
    if (status.servingMember && adjustments.servingMember) effectiveMax += adjustments.servingMember;
  }

  const monthsUntilCap = effectiveMax != null ? Math.max(0, Math.round(effectiveMax * 12 - totalMonths)) : null;

  let level: EligibilityLevel;
  let reason: LText;

  if (rule.requiresVerification || effectiveMax == null || rule.minimumAge == null) {
    level = 'REQUIRES_VERIFICATION';
    reason = {
      en: rule.marketPractice
        ? 'Private/institution-specific hiring has no universal legal age limit — treat the stated range as typical market practice only. Confirm on the current circular.'
        : 'This rule could not be fully verified from a current official source — do not rely on it; check the official circular.',
      bn: rule.marketPractice
        ? 'বেসরকারি/প্রতিষ্ঠানভিত্তিক নিয়োগে সার্বজনীন আইনি বয়সসীমা নেই — প্রদত্ত পরিসর কেবল প্রচলিত চর্চা। চলতি বিজ্ঞপ্তিতে নিশ্চিত হোন।'
        : 'এই নিয়ম বর্তমান অফিসিয়াল সূত্র থেকে পুরোপুরি যাচাই করা যায়নি — নির্ভর করবেন না; অফিসিয়াল বিজ্ঞপ্তি দেখুন।',
    };
    return { rule, level, reason, ageAtReference: ageYears, effectiveMax, monthsUntilCap };
  }

  const belowMin = ageYears < rule.minimumAge;
  const aboveMax = ageYears > effectiveMax;
  const nearLimit = !aboveMax && ageYears >= effectiveMax - 1;

  if (aboveMax) {
    level = 'NOT_ELIGIBLE';
    reason = {
      en: `Your age (${ageYears}) exceeds the published upper limit of ${effectiveMax} for this recruitment.`,
      bn: `আপনার বয়স (${ageYears} বছর) এই নিয়োগে প্রকাশিত ঊর্ধ্বসীমা ${effectiveMax} বছরের বেশি।`,
    };
  } else if (belowMin) {
    level = 'NOT_ELIGIBLE';
    reason = {
      en: `Your age (${ageYears}) is below the minimum ${rule.minimumAge} for this recruitment.`,
      bn: `আপনার বয়স (${ageYears} বছর) ন্যূনতম ${rule.minimumAge} বছরের কম।`,
    };
  } else if (nearLimit) {
    level = 'NEAR_LIMIT';
    reason = {
      en: `You are within the age band, but only ~${monthsUntilCap} month(s) remain before the ${effectiveMax}-year limit. Plan to apply in the current cycle.`,
      bn: `আপনি বয়সসীমার মধ্যে আছেন, তবে ঊর্ধ্বসীমা ${effectiveMax} বছর হওয়ার আগে প্রায় ${monthsUntilCap} মাস বাকি। চলতি চক্রে আবেদনের পরিকল্পনা করুন।`,
    };
  } else {
    level = 'ELIGIBLE';
    reason = {
      en: 'Your age falls within the published limit — you are age-eligible (other conditions still apply).',
      bn: 'আপনার বর্তমান বয়স প্রকাশিত বয়সসীমার মধ্যে রয়েছে — বয়সের দিক থেকে আবেদনযোগ্য (অন্যান্য শর্ত আলাদাভাবে প্রযোজ্য)।',
    };
  }

  return { rule, level, reason, ageAtReference: ageYears, effectiveMax, monthsUntilCap };
}

export function asOfDateOf(rule: JobAgeRule): YMD | null {
  return rule.asOfDate ? parseISODate(rule.asOfDate) : null;
}

export const ELIGIBILITY_META: Record<EligibilityLevel, { symbol: string; tone: 'ok' | 'warn' | 'bad' | 'info'; label: LText }> = {
  ELIGIBLE: { symbol: '🟢', tone: 'ok', label: { bn: 'যোগ্য (বয়স)', en: 'Eligible (age)' } },
  NEAR_LIMIT: { symbol: '🟡', tone: 'warn', label: { bn: 'বয়সসীমার কাছাকাছি', en: 'Near Age Limit' } },
  NOT_ELIGIBLE: { symbol: '🔴', tone: 'bad', label: { bn: 'যোগ্য নন', en: 'Not Eligible' } },
  REQUIRES_VERIFICATION: { symbol: '⚪', tone: 'info', label: { bn: 'নিয়ম যাচাই প্রয়োজন', en: 'Rule Requires Verification' } },
};
