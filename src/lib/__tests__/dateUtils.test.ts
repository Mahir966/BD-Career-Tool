import { describe, expect, it } from 'vitest';
import {
  addYears,
  diffYMD,
  fromEpochDays,
  isLeapYear,
  daysInMonth,
  parseISODate,
  toEpochDays,
} from '../dateUtils';

const d = (y: number, m: number, day: number) => ({ year: y, month: m, day });

describe('calendar core', () => {
  it('leap years', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2025, 2)).toBe(28);
  });

  it('strict ISO parsing rejects impossible dates', () => {
    expect(parseISODate('2025-02-29')).toBeNull(); // 2025 not a leap year
    expect(parseISODate('2024-02-29')).toEqual({ year: 2024, month: 2, day: 29 });
    expect(parseISODate('2024-13-01')).toBeNull();
    expect(parseISODate('2024-04-31')).toBeNull();
    expect(parseISODate('24-01-01')).toBeNull();
    expect(parseISODate('')).toBeNull();
    expect(parseISODate(null)).toBeNull();
  });

  it('epoch-day math matches UTC Date for a spread of dates', () => {
    const probes = ['1900-01-01', '1969-12-31', '2000-02-29', '2024-02-29', '2026-09-11', '2100-03-01'];
    for (const p of probes) {
      const [y, m, dd] = p.split('-').map(Number);
      const expected = Math.round(Date.UTC(y, m - 1, dd) / 86400000);
      expect(toEpochDays(d(y, m, dd))).toBe(expected);
      expect(fromEpochDays(expected)).toEqual({ year: y, month: m, day: dd });
    }
  });

  it('addYears handles Feb-29 with Feb-28 clamp in non-leap targets', () => {
    expect(addYears(d(2000, 2, 29), 24)).toEqual(d(2024, 2, 29)); // leap target keeps 29
    expect(addYears(d(1960, 2, 29), 59)).toEqual(d(2019, 2, 28)); // non-leap target clamps
    expect(addYears(d(1979, 5, 10), 59)).toEqual(d(2038, 5, 10));
    expect(addYears(d(2000, 3, 1), 59)).toEqual(d(2059, 3, 1));
  });

  it('diffYMD exact years/months/days', () => {
    expect(diffYMD(d(1979, 5, 10), d(2026, 9, 11))).toEqual(
      expect.objectContaining({ years: 47, months: 4, days: 1, totalDays: toEpochDays(d(2026, 9, 11)) - toEpochDays(d(1979, 5, 10)) }),
    );
    // month-end + month borrow: Aug 31 → Sep 30 = 0y0m30d
    expect(diffYMD(d(2024, 8, 31), d(2024, 9, 30))).toEqual(expect.objectContaining({ years: 0, months: 0, days: 30 }));
    // Jan 31 → Feb 28 non-leap
    expect(diffYMD(d(2025, 1, 31), d(2025, 2, 28))).toEqual(expect.objectContaining({ years: 0, months: 0, days: 28 }));
    // Feb 29 2000 → Feb 28 2001: one day short of the anniversary
    expect(diffYMD(d(2000, 2, 29), d(2001, 2, 28))).toEqual(expect.objectContaining({ years: 0, months: 11, days: 30 }));
    // exact anniversary
    expect(diffYMD(d(1979, 5, 10), d(2038, 5, 10))).toEqual(expect.objectContaining({ years: 59, months: 0, days: 0 }));
  });

  it('diffYMD supports negative spans via signed totals', () => {
    const r = diffYMD(d(2026, 9, 11), d(2020, 1, 1));
    expect(r.totalDays).toBeLessThan(0);
    expect(r.years).toBe(6); // components stay the positive absolute breakdown
    expect(r.months).toBeGreaterThanOrEqual(0);
  });

  it('never uses year subtraction — different birth/current months give different ages', () => {
    // A naive currentYear-birthYear would say 59 for both:
    const before = diffYMD(d(1967, 12, 31), d(2026, 12, 30)).years; // 58
    const after = diffYMD(d(1967, 12, 31), d(2026, 12, 31)).years; // 59
    expect(before).toBe(58);
    expect(after).toBe(59);
  });
});
