import { describe, expect, it } from 'vitest';
import { feetInchesToCm, cmToFtIn, kgToLb, lbToKg, computeBmi, estimateBodyFatDeurenberg, estimateBodyFatTape, idealWeightRange, devineIdealWeight } from '../bmiCalculator';
import { computeBmr } from '../bmrCalculator';
import { evaluateJobAge, ELIGIBILITY_META, asOfDateOf } from '../eligibilityCalculator';
import { ageAtDate, currentAge } from '../ageCalculator';
import { heroDuration } from '../formatters';
import { diffYMD } from '../dateUtils';
import { JOB_AGE_RULES } from '../../data/jobAgeRules';

const d = (y: number, m: number, day: number) => ({ year: y, month: m, day: day });

describe('unit conversions', () => {
  it('feet+inches → cm uses 5×30.48 + 6×2.54', () => {
    expect(feetInchesToCm(5, 7)).toBeCloseTo(5 * 30.48 + 7 * 2.54, 6);
    expect(feetInchesToCm(5, 6)).toBeCloseTo(167.64, 6);
    expect(feetInchesToCm(5, 0)).toBeCloseTo(152.4, 6);
  });
  it('cm → ft/in round-trips', () => {
    expect(cmToFtIn(167.64)).toEqual({ feet: 5, inches: 6 });
    const rt = cmToFtIn(feetInchesToCm(5, 10));
    expect(rt.feet).toBe(5);
    expect(Math.abs(rt.inches - 10)).toBeLessThanOrEqual(0.2);
  });
  it('kg ↔ lb', () => {
    expect(lbToKg(154.32387)).toBeCloseTo(70, 3);
    expect(kgToLb(70)).toBeCloseTo(154.324, 3);
  });
});

describe('BMI', () => {
  it('BMI = kg / m² with WHO band and healthy range', () => {
    const r = computeBmi({ heightCm: 170.18, weightKg: 70 });
    expect(r.ok).toBe(true);
    expect(r.bmi).toBeCloseTo(24.14, 1);
    expect(r.band?.key).toBe('NORMAL');
    expect(r.healthyWeightRangeKg!.min).toBeLessThan(70);
    expect(r.healthyWeightRangeKg!.max).toBeGreaterThan(70);
  });
  it('rejects implausible inputs instead of crashing', () => {
    expect(computeBmi({ heightCm: 300, weightKg: 70 }).error).toBe('HEIGHT_RANGE');
    expect(computeBmi({ heightCm: 170, weightKg: 500 }).error).toBe('WEIGHT_RANGE');
    expect(computeBmi({ heightCm: 0, weightKg: -1 }).error).toBe('NON_POSITIVE');
    expect(computeBmi({ heightCm: NaN, weightKg: 70 }).error).toBe('NON_POSITIVE');
  });
  it('marks the Asia-Pacific screening note at BMI 23–24.9', () => {
    const r = computeBmi({ heightCm: 172, weightKg: 71.6 }); // ≈24.2
    expect(r.ok).toBe(true);
    expect(r.asiaPacificNote).toBeDefined();
  });
});

describe('body-fat & ideal weight', () => {
  it('Deurenberg estimate formula', () => {
    const male = estimateBodyFatDeurenberg(24.14, 30, 'M');
    expect(male.percent).toBeCloseTo(1.2 * 24.14 + 0.23 * 30 - 10.8 - 5.4, 2);
    const female = estimateBodyFatDeurenberg(24.14, 30, 'F');
    expect(female.percent).toBeGreaterThan(male.percent);
  });
  it('tape method needs sex-specific measurements and stays finite', () => {
    const male = estimateBodyFatTape({ sex: 'M', heightCm: 180, neckCm: 38, abdomenCm: 90 });
    expect(male).not.toBeNull();
    expect(male! > 2 && male! < 70).toBe(true);
    expect(estimateBodyFatTape({ sex: 'F', heightCm: 165, neckCm: 32 })).toBeNull(); // missing waist/hip
    const female = estimateBodyFatTape({ sex: 'F', heightCm: 165, neckCm: 32, waistCm: 80, hipCm: 100 });
    expect(female).not.toBeNull();
  });
  it('ideal weight = healthy BMI band × height²', () => {
    const r = idealWeightRange(170);
    expect(r.min).toBeCloseTo(18.5 * 1.7 * 1.7, 1);
    expect(r.max).toBeCloseTo(24.9 * 1.7 * 1.7, 1);
    expect(devineIdealWeight(170.18, 'M')).toBeCloseTo(50 + 2.3 * (170.18 / 2.54 - 60), 1);
  });
});

describe('BMR / TDEE (Mifflin–St Jeor)', () => {
  it('male 30y, 170.18cm, 70kg', () => {
    const r = computeBmr({ sex: 'M', ageYears: 30, heightCm: 170.18, weightKg: 70, activity: 'SEDENTARY' });
    expect(r.ok).toBe(true);
    expect(r.bmrMifflin).toBe(1619);
    expect(r.tdee).toBe(1942);
    expect(r.bmrHarrisBenedict).toBe(1673);
  });
  it('female offsets by −161', () => {
    const r = computeBmr({ sex: 'F', ageYears: 30, heightCm: 170.18, weightKg: 70, activity: 'MODERATE' });
    expect(r.bmrMifflin).toBe(1453);
    expect(r.tdee).toBe(Math.round(1452.625 * 1.55));
  });
  it('implausible values are rejected with a friendly note', () => {
    expect(computeBmr({ sex: 'M', ageYears: 5, heightCm: 170, weightKg: 70 }).error).toBe('RANGE');
    expect(computeBmr({ sex: 'M', ageYears: NaN, heightCm: 170, weightKg: 70 }).error).toBe('INVALID');
  });
});

describe('job-age eligibility engine', () => {
  const status = { freedomFighter: false, ffDescendant: false, pwd: false, servingMember: false, women: false };
  const bcs = JOB_AGE_RULES.find((x) => x.id === 'bcs-general')!;

  it('21–32 window: 25 → eligible', () => {
    const o = evaluateJobAge(bcs, { age: { years: 25, months: 6, days: 3 }, status });
    expect(o.level).toBe('ELIGIBLE');
    expect(ELIGIBILITY_META[o.level].symbol).toBe('🟢');
  });
  it('within one year of cap → near limit', () => {
    const o = evaluateJobAge(bcs, { age: { years: 31, months: 8, days: 0 }, status });
    expect(o.level).toBe('NEAR_LIMIT');
    expect(o.monthsUntilCap).toBe(4);
  });
  it('above cap → not eligible with explanation', () => {
    const o = evaluateJobAge(bcs, { age: { years: 33, months: 0, days: 0 }, status });
    expect(o.level).toBe('NOT_ELIGIBLE');
    expect(o.reason.en).toContain('exceeds');
  });
  it('below minimum → not eligible (young) reason', () => {
    const o = evaluateJobAge(bcs, { age: { years: 20, months: 0, days: 0 }, status });
    expect(o.level).toBe('NOT_ELIGIBLE');
    expect(o.reason.en).toContain('below the minimum');
  });
  it('verification-needed rules never pretend', () => {
    const cg = JOB_AGE_RULES.find((x) => x.id === 'coast-guard')!;
    const o = evaluateJobAge(cg, { age: { years: 20, months: 0, days: 0 }, status });
    expect(o.level).toBe('REQUIRES_VERIFICATION');
    expect(ELIGIBILITY_META[o.level].symbol).toBe('⚪');
  });
  it('police SI ff-descendant adjustment extends cap by 5 (19–27 → 32)', () => {
    const si = JOB_AGE_RULES.find((x) => x.id === 'police-si')!;
    const o = evaluateJobAge(si, { age: { years: 29, months: 0, days: 0 }, status: { ...status, ffDescendant: true } });
    expect(o.level).toBe('ELIGIBLE');
    expect(o.effectiveMax).toBe(32);
    const o2 = evaluateJobAge(si, { age: { years: 29, months: 0, days: 0 }, status });
    expect(o2.level).toBe('NOT_ELIGIBLE');
  });
  it('asOfDate parsed for “as on” rules', () => {
    expect(asOfDateOf(bcs)).toEqual({ year: 2025, month: 11, day: 1 });
    expect(asOfDateOf(JOB_AGE_RULES.find((x) => x.id === 'govt-direct-32')!)).toBeNull();
  });
});

describe('age helpers', () => {
  it('exact age at reference date', () => {
    const dob = d(1999, 3, 1);
    expect(ageAtDate(dob, d(2026, 9, 11)).years).toBe(27);
    expect(ageAtDate(dob, d(2026, 2, 28)).years).toBe(26);
    expect(currentAge(d(1979, 5, 10), d(2038, 5, 10)).years).toBe(59);
    expect(diffYMD(d(2001, 3, 1), d(2002, 2, 28)).years).toBe(0);
  });
});

describe('formatters', () => {
  it('hero duration is zero-padded', () => {
    const dur = diffYMD(d(2018, 5, 24), d(2026, 9, 11));
    const text = heroDuration({ ...dur, years: 8, months: 4, days: 17 }, 'bn');
    expect(text).toBe('08 বছর 04 মাস 17 দিন');
  });
});
