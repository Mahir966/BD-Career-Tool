/**
 * Dataset policy tests — these keep the platform honest without touching UI:
 * every rule must reference an existing source, HIGH confidence must rest on
 * a primary-type source, defence must never be generalized to 59/60, and
 * verification dates must be present.
 */
import { describe, expect, it } from 'vitest';
import { RETIREMENT_RULES } from '../retirementRules';
import { JOB_AGE_RULES } from '../jobAgeRules';
import { DEFENCE_RULES } from '../defenceRules';
import { SOURCES, sourceById } from '../sources';

const PRIMARY_TYPES = new Set(['LAW', 'GAZETTE', 'GOVERNMENT_CIRCULAR', 'RECRUITMENT_CIRCULAR', 'OFFICIAL_WEBSITE']);

describe('source registry', () => {
  it('has unique ids and valid types/urls', () => {
    const ids = new Set(SOURCES.map((s) => s.id));
    expect(ids.size).toBe(SOURCES.length);
    for (const s of SOURCES) {
      expect(s.url).toMatch(/^https?:\/\//);
      expect(s.verifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(s.title.bn.length + s.title.en.length).toBeGreaterThan(6);
      expect(s.authority.bn.length + s.authority.en.length).toBeGreaterThan(2);
    }
  });
});

describe('retirement rules', () => {
  it('all reference an existing source & carry verifiedDate', () => {
    for (const r of RETIREMENT_RULES) {
      expect(sourceById(r.sourceId), r.id).toBeDefined();
      expect(r.verifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.name.bn.length).toBeGreaterThan(2);
    }
  });

  it('GSA-anchored AGE_BASED rules are 59/60 with HIGH confidence from the law itself', () => {
    const gsaRules = RETIREMENT_RULES.filter((r) => r.calculationType === 'AGE_BASED' && r.sourceId === 'gsa-2018' && !r.genericFallback);
    expect(gsaRules.length).toBeGreaterThanOrEqual(20);
    for (const r of gsaRules) {
      expect(r.retirementAge).toBe(59);
      expect(r.freedomFighterRetirementAge).toBe(60);
      expect(r.confidence).toBe('HIGH');
    }
  });

  it('defence & manual rules NEVER carry a plain 59 age default', () => {
    const defence = RETIREMENT_RULES.filter((r) => r.category === 'DEFENCE');
    expect(defence.length).toBeGreaterThanOrEqual(5);
    for (const r of defence) {
      expect(r.calculationType).not.toBe('AGE_BASED');
      if (r.manualVerification) expect(r.retirementAge).toBeUndefined();
      expect(r.freedomFighterApplies).toBe(false);
    }
  });

  it('army rank caps exist and navy/air-force refuse to invent (manualVerification)', () => {
    const army = RETIREMENT_RULES.find((r) => r.id === 'army')!;
    expect((army.rankCaps ?? []).length).toBeGreaterThanOrEqual(7);
    for (const navy of ['navy', 'air-force']) {
      const rule = RETIREMENT_RULES.find((r) => r.id === navy)!;
      expect(rule.manualVerification).toBe(true);
    }
  });

  it('OTHER fallback is explicit about being an estimate', () => {
    const other = RETIREMENT_RULES.find((r) => r.id === 'other')!;
    expect(other.genericFallback).toBe(true);
    expect(other.retirementAge).toBe(59);
    expect(other.notes!.bn).toContain('যাচাই করুন');
  });

  it('freedom-fighter uplift flag only set where GSA covers the service', () => {
    for (const r of RETIREMENT_RULES) {
      if (r.freedomFighterApplies) {
        expect(r.freedomFighterRetirementAge ?? r.sourceId).toBeTruthy();
        const src = sourceById(r.sourceId);
        expect(['gsa-2018', 'bdservicerules-retirement']).toContain(r.sourceId);
        expect(src).toBeDefined();
      }
    }
  });
});

describe('job age rules', () => {
  it('sources exist; HIGH confidence needs a primary-type source', () => {
    for (const r of JOB_AGE_RULES) {
      const src = sourceById(r.sourceId);
      expect(src, r.id).toBeDefined();
      expect(r.verifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (r.confidence === 'HIGH') {
        expect(PRIMARY_TYPES.has(src!.type), `${r.id} HIGH but source type ${src!.type}`).toBe(true);
      }
    }
  });

  it('BCS rule carries 21–32 with as-on date (50th cycle)', () => {
    const bcs = JOB_AGE_RULES.find((x) => x.id === 'bcs-general')!;
    expect(bcs.minimumAge).toBe(21);
    expect(bcs.maximumAge).toBe(32);
    expect(bcs.asOfDate).toBe('2025-11-01');
  });

  it('private-sector entries are labelled market practice or verification, never legal limits', () => {
    const priv = JOB_AGE_RULES.filter((x) => x.category === 'PRIVATE' || x.category === 'NGO');
    expect(priv.length).toBeGreaterThan(0);
    for (const p of priv) expect(p.marketPractice || p.maximumAge === null).toBe(true);
  });

  it('recruitment age rules stay separate from retirement data (no leakage of 59/60)', () => {
    for (const r of JOB_AGE_RULES) {
      if (r.maximumAge != null) expect(r.maximumAge).toBeLessThan(50);
    }
  });
});

describe('defence recruitment rules', () => {
  it('all linked to existing sources; heights stored in cm; ages sane', () => {
    for (const r of DEFENCE_RULES) {
      expect(sourceById(r.sourceId), r.id).toBeDefined();
      if (r.minimumAge != null) expect(r.minimumAge).toBeGreaterThanOrEqual(15);
      if (r.maximumAge != null) expect(r.maximumAge).toBeLessThanOrEqual(35);
      if (r.physical.heightMaleCm) {
        expect(r.physical.heightMaleCm).toBeGreaterThan(140);
        expect(r.physical.heightMaleCm).toBeLessThan(200);
      }
      expect(r.verifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('HIGH-confidence defence rules come from force official portals', () => {
    for (const r of DEFENCE_RULES) {
      if (r.confidence === 'HIGH') {
        const s = sourceById(r.sourceId)!;
        expect(s.url).toMatch(/\.mil\.bd|\.gov\.bd/);
      }
    }
  });
});
