import { describe, expect, it } from 'vitest';
import { computeRetirement } from '../retirementCalculator';
import { findRuleById } from '../../data/retirementRules';
import { diffYMD } from '../dateUtils';
import { RETIREMENT_MESSAGES } from '../retirementCalculator';

const d = (y: number, m: number, day: number) => ({ year: y, month: m, day });
const NOW = d(2026, 9, 11);

const general = findRuleById('general')!;
const army = findRuleById('army')!;
const navy = findRuleById('navy')!;
const uni = findRuleById('public-university-teacher')!;
const judge = findRuleById('judge-sc')!;
const other = findRuleById('other')!;
const contract = findRuleById('contract')!;

describe('retirement engine — general rule (GSA 2018 s.43)', () => {
  it('computes exact 59th-birthday retirement date from DOB', () => {
    const res = computeRetirement({ dob: d(1979, 5, 10), joiningDate: d(2000, 1, 1), rule: general, freedomFighter: false, currentDate: NOW });
    expect(res.ok).toBe(true);
    expect(res.currentAge).toEqual(expect.objectContaining({ years: 47, months: 4, days: 1 }));
    expect(res.serviceCompleted?.years).toBe(26);
    expect(res.retirementAge).toBe(59);
    expect(res.retirementDate).toEqual(d(2038, 5, 10));
    expect(res.remaining?.years).toBe(11);
    expect(res.remaining?.months).toBe(7);
    expect(res.remaining?.days).toBe(29);
    expect(res.remaining?.totalDays).toBe(diffYMD(NOW, d(2038, 5, 10)).totalDays);
    expect(res.projectedService?.years).toBe(38);
    expect(res.status).toBe('MID_CAREER');
    expect(res.completionPercent).toBeCloseTo(69.6, 0.5);
    expect(res.freedomFighterApplied).toBe(false);
  });

  it('joining date NEVER shifts an age-based retirement date', () => {
    const a = computeRetirement({ dob: d(1979, 5, 10), joiningDate: d(1995, 3, 15), rule: general, freedomFighter: false, currentDate: NOW });
    const b = computeRetirement({ dob: d(1979, 5, 10), joiningDate: d(2015, 9, 1), rule: general, freedomFighter: false, currentDate: NOW });
    expect(a.retirementDate).toEqual(b.retirementDate);
  });

  it('freedom fighter gets 60 under GSA coverage', () => {
    const res = computeRetirement({ dob: d(1979, 5, 10), joiningDate: d(2000, 1, 1), rule: general, freedomFighter: true, currentDate: NOW });
    expect(res.retirementAge).toBe(60);
    expect(res.retirementDate).toEqual(d(2039, 5, 10));
    expect(res.freedomFighterApplied).toBe(true);
  });

  it('freedom-fighter status does NOT override defence rules', () => {
    const res = computeRetirement({
      dob: d(1985, 1, 1),
      joiningDate: d(2005, 1, 1),
      rule: army,
      rankKey: '0',
      freedomFighter: true,
      currentDate: NOW,
    });
    expect(res.ruleUsed.id).toBe('army');
    expect(res.warnings.some((w) => w.bn.includes('স্বয়ংক্রিয়ভাবে প্রযোজ্য নয়'))).toBe(true);
  });

  it('university teacher follows the 65 special Act, not 59', () => {
    const res = computeRetirement({ dob: d(1975, 7, 1), joiningDate: d(2005, 1, 1), rule: uni, freedomFighter: false, currentDate: NOW });
    expect(res.retirementAge).toBe(65);
    expect(res.retirementDate).toEqual(d(2040, 7, 1));
  });

  it('Supreme Court judge retires at 67 (constitutional)', () => {
    const res = computeRetirement({ dob: d(1965, 3, 31), joiningDate: d(2001, 1, 1), rule: judge, freedomFighter: false, currentDate: NOW });
    expect(res.retirementDate).toEqual(d(2032, 3, 31));
    expect(res.retirementAge).toBe(67);
  });

  it('OTHER maps to the generic fallback with an explicit warning', () => {
    const res = computeRetirement({ dob: d(1990, 1, 1), joiningDate: d(2012, 6, 1), rule: other, freedomFighter: false, currentDate: NOW });
    expect(res.retirementAge).toBe(59);
    expect(res.warnings.some((w) => w.bn.includes('সাধারণ প্রাক্কলন'))).toBe(true);
    expect(res.ruleUsed.genericFallback).toBe(true);
  });
});

describe('retirement engine — defence & special rules', () => {
  it('army rank: earlier of age cap and service cap wins', () => {
    // Lt→Major: age 48, service 23y. dob 1980-06-15, commissioned 2005-01-01
    const res = computeRetirement({
      dob: d(1980, 6, 15),
      joiningDate: d(2005, 1, 1),
      rule: army,
      rankKey: '0',
      freedomFighter: false,
      currentDate: NOW,
    });
    expect(res.retirementDate).toEqual(d(2028, 1, 1)); // service cap (2005+23) precedes age cap 2028-06-15
    expect(res.bindingCap).toBe('SERVICE');
    expect(res.warnings.length).toBeGreaterThan(0);
  });

  it('army soldier: service-cap retirement, age informational', () => {
    const res = computeRetirement({
      dob: d(2004, 2, 29),
      joiningDate: d(2024, 3, 1),
      rule: army,
      rankKey: '6', // Soldier / Sepoy — 21 years
      freedomFighter: false,
      currentDate: NOW,
    });
    expect(res.retirementDate).toEqual(d(2045, 3, 1));
    expect(res.retirementAge).toBe(41); // age at that date (Feb-29 → Mar-1 2045)
    expect(res.note).toBeDefined();
  });

  it('army without a rank refuses to guess', () => {
    const res = computeRetirement({ dob: d(1985, 1, 1), joiningDate: d(2005, 1, 1), rule: army, freedomFighter: false, currentDate: NOW });
    expect(res.ok).toBe(true);
    expect(res.status).toBe('RULE_REQUIRES_VERIFICATION');
    expect(res.requiresVerification?.message).toEqual(RETIREMENT_MESSAGES.rankRequired);
    expect(res.retirementDate).toBeUndefined();
    expect(res.currentAge?.years).toBe(41);
  });

  it('navy (manual verification rule) shows the mandated message, never a date', () => {
    const res = computeRetirement({ dob: d(1983, 9, 9), joiningDate: d(2004, 1, 1), rule: navy, freedomFighter: false, currentDate: NOW });
    expect(res.retirementDate).toBeUndefined();
    expect(res.status).toBe('RULE_REQUIRES_VERIFICATION');
    expect(res.requiresVerification?.message.bn).toContain('শুধুমাত্র জন্মতারিখ দিয়ে নির্ভুল অবসর তারিখ নির্ধারণ করা যাচ্ছে না');
  });

  it('contract staff: no statutory age-based retirement', () => {
    const res = computeRetirement({ dob: d(1983, 9, 9), joiningDate: d(2004, 1, 1), rule: contract, freedomFighter: false, currentDate: NOW });
    expect(res.status).toBe('RULE_REQUIRES_VERIFICATION');
    expect(res.retirementDate).toBeUndefined();
  });
});

describe('retirement engine — edge cases', () => {
  it('Feb-29 birthday gets the 28-Feb clamp plus a warning in non-leap year', () => {
    const res = computeRetirement({ dob: d(1960, 2, 29), joiningDate: d(1982, 1, 1), rule: general, freedomFighter: false, currentDate: NOW });
    expect(res.retirementDate).toEqual(d(2019, 2, 28));
    expect(res.status).toBe('ALREADY_RETIRED');
    expect(res.warnings.some((w) => w.bn.includes('২৯ ফেব্রুয়ারি'))).toBe(true);
  });

  it('retirement date exactly today → RETIREMENT_DUE', () => {
    const res = computeRetirement({ dob: d(1967, 9, 11), joiningDate: d(1990, 1, 1), rule: general, freedomFighter: false, currentDate: NOW });
    expect(res.retirementDate).toEqual(d(2026, 9, 11));
    expect(res.status).toBe('RETIREMENT_DUE');
    expect(res.remaining?.totalDays).toBe(0);
    expect(res.completionPercent).toBe(100);
  });

  it('retirement later this year → RETIREMENT_THIS_YEAR', () => {
    const res = computeRetirement({ dob: d(1967, 12, 1), joiningDate: d(1990, 1, 1), rule: general, freedomFighter: false, currentDate: NOW });
    expect(res.retirementDate).toEqual(d(2026, 12, 1));
    expect(res.status).toBe('RETIREMENT_THIS_YEAR');
  });

  it('already retired is flagged and completion is 100%', () => {
    const res = computeRetirement({ dob: d(1950, 1, 1), joiningDate: d(1975, 1, 1), rule: general, freedomFighter: false, currentDate: NOW });
    expect(res.status).toBe('ALREADY_RETIRED');
    expect(res.remaining!.totalDays).toBeLessThan(0);
    expect(res.completionPercent).toBe(100);
  });

  it('future DOB rejected', () => {
    const res = computeRetirement({ dob: d(2030, 1, 1), joiningDate: null, rule: general, freedomFighter: false, currentDate: NOW });
    expect(res.ok).toBe(false);
    expect(res.errors.dob).toBe('FUTURE');
  });

  const leapInvalid = computeRetirement({ dob: null, joiningDate: null, rule: general, freedomFighter: false, currentDate: NOW });
  it('empty DOB rejected', () => {
    expect(leapInvalid.errors.dob).toBe('EMPTY');
    expect(leapInvalid.ok).toBe(false);
  });

  it('joining in the future keeps service at zero with a warning', () => {
    const res = computeRetirement({ dob: d(2002, 1, 1), joiningDate: d(2027, 1, 1), rule: general, freedomFighter: false, currentDate: NOW });
    expect(res.serviceCompleted?.totalDays).toBe(0);
    expect(res.warnings.some((w) => w.bn.includes('ভবিষ্যতে'))).toBe(true);
  });

  it('implausibly young joining age warns', () => {
    const res = computeRetirement({ dob: d(2000, 1, 1), joiningDate: d(2012, 1, 1), rule: general, freedomFighter: false, currentDate: NOW });
    expect(res.warnings.some((w) => w.bn.includes('১৫ বছরের কম'))).toBe(true);
  });

  it('joining after retirement is an error', () => {
    const res = computeRetirement({ dob: d(1960, 1, 1), joiningDate: d(2026, 5, 1), rule: general, freedomFighter: false, currentDate: NOW });
    expect(res.errors.joining).toBe('JOINING_AFTER_RETIREMENT');
  });
});
