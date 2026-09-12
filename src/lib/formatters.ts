/**
 * Display formatters. Bengali text uses Latin digits (standard practice on
 * Bangla info portals); everything is still fully readable.
 */
import type { CalendarDuration, Lang } from '../types';

const pad = (n: number) => String(n).padStart(2, '0');

export function unitWords(lang: Lang): { y: string; m: string; d: string } {
  return lang === 'bn' ? { y: 'বছর', m: 'মাস', d: 'দিন' } : { y: 'years', m: 'months', d: 'days' };
}

export function durationText(d: CalendarDuration, lang: Lang, opts: { pad?: boolean; hideZeroes?: boolean } = {}): string {
  const u = unitWords(lang);
  const p = (n: number) => (opts.pad ? pad(Math.abs(n)) : String(Math.abs(n)));
  const parts: string[] = [];
  if (!opts.hideZeroes || d.years !== 0) parts.push(`${p(d.years)} ${u.y}`);
  if (!opts.hideZeroes || d.months !== 0 || parts.length) parts.push(`${p(d.months)} ${u.m}`);
  parts.push(`${p(d.days)} ${u.d}`);
  return parts.join(' ');
}

/** “08 বছর 04 মাস 17 দিন” — hero style with zero-padded years/months. */
export function heroDuration(d: CalendarDuration, lang: Lang): string {
  return durationText(d, lang, { pad: true });
}

export function signed(n: number, digits = 1): string {
  const v = Number(n.toFixed(digits));
  return `${v > 0 ? '+' : ''}${v}`;
}

export function percent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function num(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function clockText(h: number, m: number, s: number): string {
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
