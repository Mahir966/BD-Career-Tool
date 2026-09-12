/**
 * BMR / TDEE engine — Mifflin–St Jeor (documented standard), with the
 * revised Harris–Benedict equation available as a secondary comparison.
 * Results are estimates, not medical advice.
 */
import { ACTIVITY_LEVELS, type ActivityKey } from '../data/fitnessRules';
import type { LText } from '../types';

export type Sex = 'M' | 'F';

export interface BmrInput {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  activity?: ActivityKey;
}

export type BmrErrorCode = 'INVALID' | 'RANGE';

export interface BmrResult {
  ok: boolean;
  error?: BmrErrorCode;
  bmrMifflin?: number;
  bmrHarrisBenedict?: number;
  activityKey?: ActivityKey;
  activityMultiplier?: number;
  tdee?: number;
  formula: LText;
  note: LText;
}

const B = (n: number) => Math.round(n);

export function computeBmr({ sex, ageYears, heightCm, weightKg, activity }: BmrInput): BmrResult {
  const invalid = (error: BmrErrorCode): BmrResult => ({
    ok: false,
    error,
    formula: { en: '', bn: '' },
    note: {
      en: error === 'RANGE' ? 'Values look outside plausible ranges (age 10–100, height 100–250 cm, weight 25–350 kg).' : 'Please fill valid age, height and weight.',
      bn: error === 'RANGE' ? 'মানগুলো সম্ভাব্য পরিসরের বাইরে (বয়স ১০–১০০, উচ্চতা ১০০–২৫০ সেমি, ওজন ২৫–৩৫০ কেজি)।' : 'সঠিক বয়স, উচ্চতা ও ওজন দিন।',
    },
  });
  if (![ageYears, heightCm, weightKg].every((v) => Number.isFinite(v))) return invalid('INVALID');
  if (ageYears < 10 || ageYears > 100 || heightCm < 100 || heightCm > 250 || weightKg < 25 || weightKg > 350) return invalid('RANGE');

  const sexOffset = sex === 'M' ? 5 : -161;
  const mifflin = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + sexOffset;
  // Revised Harris–Benedict (Roza & Shizgal, 1984)
  const hb =
    sex === 'M'
      ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears
      : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears;

  const level = ACTIVITY_LEVELS.find((a) => a.key === activity);
  const mult = level?.mult;
  const tdee = mult != null ? mifflin * mult : undefined;

  return {
    ok: true,
    bmrMifflin: B(mifflin),
    bmrHarrisBenedict: B(hb),
    activityKey: level?.key,
    activityMultiplier: mult,
    tdee: tdee != null ? B(tdee) : undefined,
    formula: {
      en: 'Mifflin–St Jeor: 10×weight(kg) + 6.25×height(cm) − 5×age + 5 (male) / − 161 (female).',
      bn: 'মিফলিন–সেন্ট জিয়ার: ১০×ওজন(কেজি) + ৬.২৫×উচ্চতা(সেমি) − ৫×বয়স + ৫ (পুরুষ) / − ১৬১ (নারী)।',
    },
    note: {
      en: 'BMR/TDEE are statistical estimates (±10%). They are not medical or dietary prescriptions; individual metabolism varies. Consult a professional for health decisions.',
      bn: 'BMR/TDEE পরিসংখ্যানগত প্রাক্কলন (±১০%)। এটি চিকিৎসাগত বা আহারীয় পরামর্শ নয়; ব্যক্তিগত বিপাক ভিন্ন হতে পারে। স্বাস্থ্যসিদ্ধান্তে বিশেষজ্ঞের পরামর্শ নিন।',
    },
  };
}

export { ACTIVITY_LEVELS };
