/**
 * BMI / body-metrics engine.
 *  • Imperial input: cm = ft × 30.48 + in × 2.54 (exact international inch).
 *  • BMI = kg / m². BMI is a screening measure, not a medical diagnosis.
 */
import { WHO_BMI_BANDS } from '../data/fitnessRules';
import type { BmiBand, LText } from '../types';

export const INCH_CM = 2.54;
export const FOOT_CM = 30.48;
export const LB_KG = 0.45359237;

export function feetInchesToCm(feet: number, inches: number): number {
  return feet * FOOT_CM + inches * INCH_CM;
}
export function lbToKg(lb: number): number {
  return lb * LB_KG;
}
export function kgToLb(kg: number): number {
  return kg / LB_KG;
}

/** cm → ft + remaining inches (rounded to 1 decimal inch, for display). */
export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalIn = cm / INCH_CM;
  let feet = Math.floor(totalIn / 12);
  let inches = Math.round((totalIn - feet * 12) * 10) / 10;
  if (inches >= 12) {
    feet += 1;
    inches -= 12;
  }
  return { feet, inches };
}

export interface BmiInput {
  heightCm: number;
  weightKg: number;
  age?: number;
}

export type BmiErrorCode = 'HEIGHT_RANGE' | 'WEIGHT_RANGE' | 'NON_POSITIVE';

export interface BmiResult {
  ok: boolean;
  error?: BmiErrorCode;
  bmi?: number;
  band?: BmiBand;
  healthyWeightRangeKg?: { min: number; max: number };
  currentVsHealthyKg?: { diffMin: number; diffMax: number };
  heightM?: number;
  interpretation: LText;
  asiaPacificNote?: LText;
}

const ROUND = (n: number) => Math.round(n * 100) / 100;

export function computeBmi({ heightCm, weightKg }: BmiInput): BmiResult {
  if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg) || heightCm <= 0 || weightKg <= 0) {
    return { ok: false, error: 'NON_POSITIVE', interpretation: { en: 'Enter valid height and weight.', bn: 'সঠিক উচ্চতা ও ওজন দিন।' } };
  }
  if (heightCm < 80 || heightCm > 260) {
    return { ok: false, error: 'HEIGHT_RANGE', interpretation: { en: 'Height looks outside a plausible range (80–260 cm).', bn: 'উচ্চতা সম্ভাব্য পরিসরের (৮০–২৬০ সেমি) বাইরে মনে হচ্ছে।' } };
  }
  if (weightKg < 20 || weightKg > 400) {
    return { ok: false, error: 'WEIGHT_RANGE', interpretation: { en: 'Weight looks outside a plausible range (20–400 kg).', bn: 'ওজন সম্ভাব্য পরিসরের (২০–৪০০ কেজি) বাইরে মনে হচ্ছে।' } };
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const band =
    WHO_BMI_BANDS.find((b) => bmi >= b.minInclusive && (b.maxExclusive == null || bmi < b.maxExclusive)) ?? WHO_BMI_BANDS[WHO_BMI_BANDS.length - 1];
  const minHealthy = 18.5 * heightM * heightM;
  const maxHealthy = 24.99 * heightM * heightM;

  const interpretation = interpretBmi(band, bmi);
  const asiaPacificNote: LText | undefined =
    bmi >= 23 && bmi < 25
      ? {
          en: 'By Asia-Pacific screening guidance for South-Asian populations, BMI 23–24.9 is already “increased-risk” territory even though the WHO band is normal.',
          bn: 'দক্ষিণ এশীয় জনগোষ্ঠীর জন্য এশিয়া-প্যাসিফিক স্ক্রিনিং নির্দেশনায় ২৩–২৪.৯ BMI WHO স্বাভাবিক পরিসরে থাকলেও “বাড়তি ঝুঁকি” হিসেবে চিহ্নিত।',
        }
      : undefined;

  return {
    ok: true,
    bmi: ROUND(bmi),
    band,
    healthyWeightRangeKg: { min: ROUND(minHealthy), max: ROUND(maxHealthy) },
    currentVsHealthyKg: {
      diffMin: ROUND(weightKg - minHealthy),
      diffMax: ROUND(weightKg - maxHealthy),
    },
    heightM,
    interpretation,
    asiaPacificNote,
  };
}

function interpretBmi(band: BmiBand, bmi: number): LText {
  const b = band.key;
  if (b === 'NORMAL') {
    return {
      en: `Your BMI of ${ROUND(bmi)} falls inside the normal band (18.5–24.9). BMI is a population-level screening measure; it cannot diagnose health, fitness or nutritional status.`,
      bn: `আপনার BMI ${ROUND(bmi)} স্বাভাবিক পরিসরের (১৮.৫–২৪.৯) মধ্যে রয়েছে। BMI একটি জনগোষ্ঠী-স্তরের স্ক্রিনিং সূচক; এটি স্বাস্থ্য, ফিটনেস বা পুষ্টির রোগ নির্ণয় করতে পারে না।`,
    };
  }
  if (b === 'PRE_OBESITY') {
    return {
      en: `BMI ${ROUND(bmi)} is in the overweight band (25–29.9). Consider activity, diet and a clinician’s advice — BMI alone does not measure body fat or disease.`,
      bn: `BMI ${ROUND(bmi)} অতিরিক্ত ওজনের পরিসরে (২৫–২৯.৯)। কার্যক্রম, খাদ্যাভ্যাস ও চিকিৎসকের পরামর্শ বিবেচনা করুন — BMI একা শারীরিক চর্বি বা রোগ মাপে না।`,
    };
  }
  if (b.startsWith('OBESITY')) {
    return {
      en: `BMI ${ROUND(bmi)} is in the obesity range. A clinician can interpret this alongside waist, bloodwork and history; screening values are not diagnoses.`,
      bn: `BMI ${ROUND(bmi)} স্থূলতার পরিসরে। কোমরের মাপ, রক্তপরীক্ষা ও চিকিৎসা-ইতিহাসের সঙ্গে চিকিৎসক ব্যাখ্যা করতে পারেন; স্ক্রিনিং মান রোগ নির্ণয় নয়।`,
    };
  }
  return {
    en: `BMI ${ROUND(bmi)} is below the healthy band (<18.5). Consider a clinician/nutritionist review; screening values are not diagnoses.`,
    bn: `BMI ${ROUND(bmi)} সুস্থ পরিসরের নিচে (<১৮.৫)। চিকিৎসক/পুষ্টিবিদের পরামর্শ নিন; স্ক্রিনিং মান রোগ নির্ণয় নয়।`,
  };
}

/* -------------------- body fat (screening estimates) -------------------- */

/** Deurenberg 1991: BF% = 1.20·BMI + 0.23·age − 10.8·(sex: male=1) − 5.4 */
export function estimateBodyFatDeurenberg(bmi: number, age: number, sex: 'M' | 'F'): { percent: number; formula: string } {
  const sexFactor = sex === 'M' ? 1 : 0;
  const percent = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
  return { percent: ROUND(percent), formula: 'BF% = 1.20×BMI + 0.23×age − 10.8×sex − 5.4 (Deurenberg et al., 1991)' };
}

/** US-DoD tape method (cm inputs). Male uses abdomen; female waist+hip. */
export function estimateBodyFatTape(opts: {
  sex: 'M' | 'F';
  heightCm: number;
  neckCm: number;
  abdomenCm?: number;
  waistCm?: number;
  hipCm?: number;
}): number | null {
  const log10 = (x: number) => Math.log10(x);
  if (opts.sex === 'M') {
    if (!opts.abdomenCm) return null;
    const v = 86.010 * log10(opts.abdomenCm - opts.neckCm) - 70.041 * log10(opts.heightCm) + 36.76;
    return ROUND(clampPct(v));
  }
  if (opts.waistCm == null || opts.hipCm == null) return null;
  const v = 163.205 * log10(opts.waistCm + opts.hipCm - opts.neckCm) - 97.684 * log10(opts.heightCm) - 78.387;
  return ROUND(clampPct(v));
}
function clampPct(v: number): number {
  if (!Number.isFinite(v)) return NaN;
  return Math.max(2, Math.min(70, v));
}

/** Healthy body-fat reference bands (ACE-style, for display only). */
export const BODY_FAT_BANDS = {
  M: { athlete: 6, fit: [14, 17], ok: 24, high: 'above 25%' },
  F: { athlete: 14, fit: [21, 24], ok: 31, high: 'above 32%' },
} as const;

/* -------------------- ideal weight -------------------- */

export function idealWeightRange(heightCm: number): { min: number; max: number; method: string } {
  const m = heightCm / 100;
  return {
    min: ROUND(18.5 * m * m),
    max: ROUND(24.9 * m * m),
    method: 'BMI 18.5–24.9 × height²',
  };
}

/** Devine formula (clinical dosing convention; not a body-composition verdict). */
export function devineIdealWeight(heightCm: number, sex: 'M' | 'F'): number {
  const totalIn = heightCm / INCH_CM;
  const over5ft = Math.max(0, totalIn - 60);
  const base = sex === 'M' ? 50 : 45.5;
  return ROUND(base + 2.3 * over5ft);
}
