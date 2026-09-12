/**
 * Bangladesh government retirement calculation engine.
 *
 * Rules (enforced here, never in UI):
 *  • AGE_BASED / INSTITUTION_SPECIFIC retirement: retirement date = DOB +
 *    retirementAge. The joining date NEVER shifts it — it is used only for
 *    service-duration math.
 *  • Freedom Fighter uplift (59→60) applies ONLY when the resolved rule
 *    declares freedomFighterApplies (i.e. the service is covered by the
 *    general GSA-2018 s.43(1)(b) provision). Defence / institutional special
 *    rules are never silently overridden.
 *  • RANK_BASED / AGE_AND_SERVICE (armed forces): indicative retirement =
 *    earlier of (DOB + age cap) and (commission + service cap). Without
 *    rank/commission data → no date is invented.
 *  • MANUAL_VERIFICATION rules return the “requires verification” state with
 *    the mandated Bangla message — never a fabricated date.
 *
 * Pure function: pass `currentDate` (+ optional secondsOfDay) for
 * deterministic, unit-testable results.
 */
import { MIN_YEAR, addYears, compareYMD, diffYMD, isLeapYear, isValidYMD, toEpochDays } from './dateUtils';
import type {
  CalendarDuration,
  DateErrorCode,
  LText,
  RetirementInput,
  RetirementResult,
  RetirementStatus,
  RetirementRule,
  YMD,
} from '../types';

export const RETIREMENT_MESSAGES = {
  noDate: {
    en: 'Retirement date cannot be determined from date of birth alone for this service.',
    bn: 'এই সার্ভিসের অবসরের নিয়ম পদ/সার্ভিস/প্রযোজ্য বিধির উপর নির্ভরশীল। শুধুমাত্র জন্মতারিখ দিয়ে নির্ভুল অবসর তারিখ নির্ধারণ করা যাচ্ছে না।',
  } satisfies LText,
  rankRequired: {
    en: 'Select a rank to compute an indicative release/retirement window (subject to force regulations).',
    bn: 'পদ নির্বাচন করুন — বাহিনীর বিধি সাপেক্ষে নির্দেশক অবসর/মুক্তির সময়সীমা দেখানো হবে।',
  } satisfies LText,
  commissionRequired: {
    en: 'For service-length caps, the commission/joining date is required.',
    bn: 'চাকরির মেয়াদভিত্তিক সীমার জন্য কমিশন/যোগদানের তারিখ প্রয়োজন।',
  } satisfies LText,
  feb29: {
    en: 'February 29 birthday: in non-leap years this tool treats the day before 1 March (28 Feb) as the completion day. Force/cadre instructions may define this differently — verify.',
    bn: '২৯ ফেব্রুয়ারি জন্মতারিখ: অ-লিপবর্ষে এই টুল ১ মার্চের আগের দিন (২৮ ফেব্রুয়ারি) বয়স পূর্ণ হওয়ার দিন ধরে। বাহিনী/ক্যাডার নির্দেশনা ভিন্ন সংজ্ঞা দিতে পারে — যাচাই করুন।',
  } satisfies LText,
  joiningFuture: {
    en: 'Joining date is in the future — completed service is shown as 0.',
    bn: 'যোগদানের তারিখ ভবিষ্যতে — সম্পন্ন চাকরির মেয়াদ ০ দেখানো হচ্ছে।',
  } satisfies LText,
  joiningYoung: {
    en: 'Joining age below 15 is implausible for permanent government service — please re-check the date.',
    bn: '১৫ বছরের কম বয়সে স্থায়ী সরকারি চাকরিতে যোগদান যুক্তিসম্মত নয় — তারিখ পুনরায় দেখুন।',
  } satisfies LText,
  genericFallback: {
    en: 'Generic fallback estimate — not the legal retirement determination of any specific institution. Verify the applicable service rule.',
    bn: 'সাধারণ প্রাক্কলন — এটি কোনো নির্দিষ্ট প্রতিষ্ঠানের আইনগত অবসর সিদ্ধান্ত নয়। প্রযোজ্য service rule যাচাই করুন।',
  } satisfies LText,
  lowConfidence: {
    en: 'Low-confidence reference data — must be verified against the official rule/circular before relying on it.',
    bn: 'নিম্ন-আস্থার তথ্য — নির্ভর করার আগে অফিসিয়াল বিধি/বিজ্ঞপ্তি থেকে যাচাই বাধ্যতামূলক।',
  } satisfies LText,
  alreadyPast: {
    en: 'The computed retirement date has already passed. If the employee is still shown in service, check extension / re-employment orders.',
    bn: 'গণনাকৃত অবসরের তারিখ অতিক্রান্ত। কর্মচারী যদি এখনও চাকরিতে দেখানো হয় তবে বর্ধিতকাল/পুনর্নিয়োগ আদেশ যাচাই করুন।',
  } satisfies LText,
};

const ZERO: CalendarDuration = { years: 0, months: 0, days: 0, totalDays: 0, totalMonths: 0, approxYears: 0 };

function validate(
  dob: YMD | null,
  joiningDate: YMD | null,
  today: YMD,
): { errors: { dob?: DateErrorCode; joining?: DateErrorCode }; dobOk: boolean } {
  const errors: { dob?: DateErrorCode; joining?: DateErrorCode } = {};
  let dobOk = true;
  if (!dob) {
    errors.dob = 'EMPTY';
    dobOk = false;
  } else if (!isValidYMD(dob)) {
    errors.dob = 'INVALID';
    dobOk = false;
  } else if (compareYMD(dob, today) > 0) {
    errors.dob = 'FUTURE';
    dobOk = false;
  } else if (dob.year < MIN_YEAR || today.year - dob.year > 120) {
    errors.dob = 'OUT_OF_RANGE';
    dobOk = false;
  }
  if (dobOk && joiningDate && !isValidYMD(joiningDate)) errors.joining = 'INVALID';
  return { errors, dobOk };
}

export interface RetirementOptions {
  /** seconds elapsed since local midnight, for the live clock display */
  secondsOfDay?: number;
}

export function computeRetirement(input: RetirementInput, opts: RetirementOptions = {}): RetirementResult {
  const { dob, joiningDate, rankKey, freedomFighter } = input;
  const rule: RetirementRule = input.rule;
  const today = input.currentDate;
  const warnings: LText[] = [];

  const { errors, dobOk } = validate(dob, joiningDate, today);
  if (!dobOk || Object.keys(errors).length > 0) {
    return { ok: false, errors, ruleUsed: rule, warnings };
  }
  const dobSafe = dob as YMD;
  const currentAge = diffYMD(dobSafe, today);

  const joinValid = Boolean(joiningDate && isValidYMD(joiningDate));
  const joinStarted = joinValid && compareYMD(joiningDate as YMD, today) <= 0;
  const serviceCompleted = joinStarted ? diffYMD(joiningDate as YMD, today) : ZERO;
  if (joinValid && !joinStarted) warnings.push(RETIREMENT_MESSAGES.joiningFuture);
  if (joinStarted) {
    const joinAge = diffYMD(dobSafe, joiningDate as YMD);
    if (joinAge.years < 15) warnings.push(RETIREMENT_MESSAGES.joiningYoung);
  }

  const limited = (message: LText, extra: Partial<RetirementResult> = {}): RetirementResult => ({
    ok: true,
    errors: {},
    ruleUsed: rule,
    warnings,
    currentAge,
    serviceCompleted,
    status: 'RULE_REQUIRES_VERIFICATION',
    requiresVerification: { message },
    ...extra,
  });

  // Freedom-fighter status never silently overrides special rules — say so loudly.
  if (freedomFighter && !rule.freedomFighterApplies) {
    warnings.push({
      en: 'The Freedom-Fighter retirement uplift (60y) is not automatically applied to this service — its special rules govern. Verify with the force/institution.',
      bn: 'মুক্তিযোদ্ধা অবসর বয়সছাড় (৬০ বছর) এই সেবায় স্বয়ংক্রিয়ভাবে প্রযোজ্য নয় — সংশ্লিষ্ট বাহিনী/প্রতিষ্ঠানের বিশেষ বিধি প্রাধান্য পায়। অফিসিয়ালভাবে যাচাই করুন।',
    });
  }

  // ---------------- manual verification rules ----------------
  if (rule.manualVerification) return limited(RETIREMENT_MESSAGES.noDate);

  // ---------------- resolve retirement date ----------------
  let retirementAge: number | undefined;
  let retirementDate: YMD | undefined;
  let freedomFighterApplied = false;
  let rankUsed: LText | undefined;
  let bindingCap: RetirementResult['bindingCap'] = null;
  let note: LText | undefined;

  switch (rule.calculationType) {
    case 'AGE_BASED':
    case 'INSTITUTION_SPECIFIC': {
      retirementAge = rule.retirementAge;
      if (retirementAge == null) return limited(RETIREMENT_MESSAGES.noDate);
      if (freedomFighter && rule.freedomFighterApplies && rule.freedomFighterRetirementAge) {
        retirementAge = rule.freedomFighterRetirementAge;
        freedomFighterApplied = true;
      }
      retirementDate = addYears(dobSafe, retirementAge);
      if (dobSafe.month === 2 && dobSafe.day === 29 && !isLeapYear(retirementDate.year)) {
        warnings.push(RETIREMENT_MESSAGES.feb29);
      }
      if (rule.genericFallback) warnings.push(RETIREMENT_MESSAGES.genericFallback);
      break;
    }
    case 'RANK_BASED':
    case 'AGE_AND_SERVICE': {
      const caps = rule.rankCaps ?? [];
      if (rule.requiresRank && rankKey == null) return limited(RETIREMENT_MESSAGES.rankRequired);
      const idx = rankKey != null ? Number(rankKey) : NaN;
      const cap = Number.isInteger(idx) && idx >= 0 && idx < caps.length ? caps[idx] : undefined;
      if (!cap) return limited(RETIREMENT_MESSAGES.noDate);
      rankUsed = cap.rank;
      if (cap.serviceCapYears != null && !joinValid) return limited(RETIREMENT_MESSAGES.commissionRequired, { rankUsed });
      const candidates: { date: YMD; kind: 'AGE' | 'SERVICE' }[] = [];
      if (cap.ageCapYears != null) {
        candidates.push({ date: addYears(dobSafe, cap.ageCapYears), kind: 'AGE' });
        retirementAge = cap.ageCapYears;
      }
      if (cap.serviceCapYears != null && joinValid) {
        const svcDate = addYears(joiningDate as YMD, cap.serviceCapYears);
        candidates.push({ date: svcDate, kind: 'SERVICE' });
        if (retirementAge == null) {
          retirementAge = diffYMD(dobSafe, svcDate).years;
          note = {
            en: 'Date shown by the SERVICE cap; the age at that date is informational only.',
            bn: 'তারিখ চাকরির মেয়াদ-সীমা থেকে; সেই দিনের বয়স কেবল তথ্যসূরূপ।',
          };
        }
      }
      if (candidates.length === 0) return limited(RETIREMENT_MESSAGES.noDate, { rankUsed });
      candidates.sort((a, b) => compareYMD(a.date, b.date));
      retirementDate = candidates[0].date;
      bindingCap = candidates[0].kind;
      warnings.push({
        en: 'Armed-forces release/retirement follows force regulations. The earlier of (age cap / service cap) is shown as indicative only — NOT a legal determination.',
        bn: 'সশস্ত্র বাহিনীর অবসর/মুক্তি বাহিনীর বিধি অনুযায়ী। বয়স-সীমা ও চাকরিসীমার মধ্যে আগেরটি নির্দেশক হিসেবে দেখানো হয়েছে — এটি আইনগত সিদ্ধান্ত নয়।',
      });
      warnings.push(RETIREMENT_MESSAGES.lowConfidence);
      break;
    }
    case 'SERVICE_BASED': {
      if (!joinValid || rule.serviceLimitYears == null) return limited(RETIREMENT_MESSAGES.noDate);
      retirementDate = addYears(joiningDate as YMD, rule.serviceLimitYears);
      retirementAge = diffYMD(dobSafe, retirementDate).years;
      note = {
        en: 'Retirement date derives from the service-length cap, not a fixed age.',
        bn: 'অবসরের তারিখ চাকরির মেয়াদ-সীমা থেকে নির্ধারিত, স্থির বয়স থেকে নয়।',
      };
      break;
    }
    case 'CONTRACT_SPECIFIC':
    default:
      return limited(RETIREMENT_MESSAGES.noDate, {
        note: rule.notes,
      });
  }

  if (!retirementDate) return limited(RETIREMENT_MESSAGES.noDate);

  // ---------------- joining-after-retirement guard ----------------
  const finalErrors: { dob?: DateErrorCode; joining?: DateErrorCode } = {};
  if (joinValid && compareYMD(joiningDate as YMD, retirementDate) > 0) finalErrors.joining = 'JOINING_AFTER_RETIREMENT';

  // ---------------- durations ----------------
  // daysToRetirement > 0 → still serving; 0 → today; < 0 → date passed.
  const daysToRetirement = toEpochDays(retirementDate) - toEpochDays(today);
  const remaining = daysToRetirement >= 0 ? diffYMD(today, retirementDate) : negate(diffYMD(retirementDate, today));
  const projectedService = joinValid ? absDuration(diffYMD(joiningDate as YMD, retirementDate)) : undefined;

  let completionPercent: number;
  if (projectedService && projectedService.totalDays > 0) {
    completionPercent = Math.max(0, Math.min(100, (Math.max(0, serviceCompleted.totalDays) / projectedService.totalDays) * 100));
  } else {
    completionPercent = daysToRetirement <= 0 ? 100 : 0;
  }

  if (daysToRetirement < 0) warnings.push(RETIREMENT_MESSAGES.alreadyPast);
  if (rule.confidence === 'LOW' && !warnings.includes(RETIREMENT_MESSAGES.lowConfidence)) {
    warnings.push(RETIREMENT_MESSAGES.lowConfidence);
  }

  const status = statusFor(daysToRetirement, completionPercent, today, retirementDate);
  const remainingClock = buildClock(daysToRetirement, today, retirementDate, opts.secondsOfDay ?? 0);

  return {
    ok: true,
    errors: finalErrors,
    ruleUsed: rule,
    warnings,
    currentAge,
    serviceCompleted,
    retirementAge,
    freedomFighterApplied,
    retirementDate,
    remaining,
    remainingClock,
    projectedService,
    completionPercent,
    remainingPercent: Math.max(0, 100 - completionPercent),
    status,
    rankUsed,
    bindingCap,
    note,
  };
}

function statusFor(daysToRetirement: number, completionPercent: number, today: YMD, retirementDate: YMD): RetirementStatus {
  if (daysToRetirement === 0) return 'RETIREMENT_DUE';
  if (daysToRetirement < 0) return 'ALREADY_RETIRED';
  if (retirementDate.year === today.year) return 'RETIREMENT_THIS_YEAR';
  const remainingYears = daysToRetirement / 365.2425;
  if (remainingYears <= 2 || completionPercent >= 75) return 'NEARING_RETIREMENT';
  if (completionPercent >= 25) return 'MID_CAREER';
  return 'ACTIVE';
}

function absDuration(d: CalendarDuration): CalendarDuration {
  if (d.totalDays >= 0) return d;
  return {
    years: Math.abs(d.years),
    months: Math.abs(d.months),
    days: Math.abs(d.days),
    totalDays: Math.abs(d.totalDays),
    totalMonths: Math.abs(d.totalMonths),
    approxYears: Math.abs(d.approxYears),
  };
}

function negate(d: CalendarDuration): CalendarDuration {
  return {
    years: -d.years,
    months: -d.months,
    days: -d.days,
    totalDays: -Math.abs(d.totalDays),
    totalMonths: -Math.abs(d.totalMonths),
    approxYears: -Math.abs(d.approxYears),
  };
}

/** Days/h/m/s remaining until the retirement date at local midnight (or days since, when past). */
function buildClock(daysToRetirement: number, today: YMD, retirementDate: YMD, secondsOfDay: number): RetirementResult['remainingClock'] {
  if (daysToRetirement < 0) {
    const days = toEpochDays(today) - toEpochDays(retirementDate);
    return { days, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
  }
  if (daysToRetirement === 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
  const dayDiff = daysToRetirement;
  const totalSeconds = Math.max(0, dayDiff * 86400 - secondsOfDay);
  const rem = totalSeconds % 86400;
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(rem / 3600),
    minutes: Math.floor((rem % 3600) / 60),
    seconds: rem % 60,
    totalSeconds,
  };
}
