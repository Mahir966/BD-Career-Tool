/**
 * Shared domain types for the Bangladesh Career & Government Service Calculators.
 *
 * Design principle: legal logic lives in data (src/data/*) + engines (src/lib/*),
 * never in UI components. Every rule carries its source + verification date so the
 * UI can stay honest about what is law, what is estimate, and what needs checking.
 */

export type Lang = 'bn' | 'en';
export type ThemeMode = 'light' | 'dark' | 'system';

/** Bilingual text pair used across all datasets. */
export interface LText {
  bn: string;
  en: string;
}

/* ------------------------------------------------------------------ */
/* Confidence & sources                                                */
/* ------------------------------------------------------------------ */

/**
 * HIGH   — directly verified from a current official source (law text, official portal).
 * MEDIUM — multiple reliable sources, but official primary source incomplete/secondary.
 * LOW    — secondary source only; treat as indicative, must be verified.
 */
export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type SourceType =
  | 'LAW'
  | 'GAZETTE'
  | 'GOVERNMENT_CIRCULAR'
  | 'RECRUITMENT_CIRCULAR'
  | 'OFFICIAL_WEBSITE'
  | 'SECONDARY_SOURCE';

export interface SourceRecord {
  id: string;
  title: LText;
  authority: LText;
  url: string;
  type: SourceType;
  /** Publication/issue date of the underlying document (ISO or descriptive). */
  publicationDate: string;
  /** When this project last verified the source (ISO). */
  verifiedDate: string;
  notes?: LText;
}

/* ------------------------------------------------------------------ */
/* Retirement rules                                                    */
/* ------------------------------------------------------------------ */

export type RetirementCalculationType =
  | 'AGE_BASED'
  | 'RANK_BASED'
  | 'SERVICE_BASED'
  | 'AGE_AND_SERVICE'
  | 'INSTITUTION_SPECIFIC'
  | 'CONTRACT_SPECIFIC'
  | 'MANUAL_VERIFICATION';

export type RetirementStatus =
  | 'ACTIVE'
  | 'MID_CAREER'
  | 'NEARING_RETIREMENT'
  | 'RETIREMENT_THIS_YEAR'
  | 'RETIREMENT_DUE'
  | 'ALREADY_RETIRED'
  | 'RULE_REQUIRES_VERIFICATION';

export type RuleConfidence = Confidence;

/**
 * A retirement rule record. For AGE_BASED rules the retirement date is
 * `dateOfBirth + retirementAge` — the joining date NEVER moves it
 * (it is only used for service-duration maths). RANK_BASED / SERVICE_BASED
 * rules (armed forces) combine age caps and service-length caps and are
 * intentionally conservative.
 */
export interface RetirementRule {
  id: string;
  /** Top-level grouping key, e.g. 'general', 'bcs', 'education', 'defence', ... */
  category: string;
  subcategory?: string;
  name: LText;
  institution: LText;
  calculationType: RetirementCalculationType;
  /** Statutory retirement age for age-based rules (years completed). */
  retirementAge?: number;
  /** Freedom-fighter retirement age when the general FF provision covers this service. */
  freedomFighterRetirementAge?: number;
  /**
   * Whether the Freedom Fighter uplift (Government Service Act 2018 s.43(1)(b))
   * applies to this category. It must NOT blindly override special defence /
   * institutional rules.
   */
  freedomFighterApplies: boolean;
  /** Rank-level caps for AGE_AND_SERVICE / RANK_BASED rules. */
  rankCaps?: RankCap[];
  /** A plain service-length cap (years) for SERVICE_BASED rules, when known. */
  serviceLimitYears?: number;
  /** True when rank must be selected before anything can be computed. */
  requiresRank: boolean;
  /** True when a commission/joining date is needed in addition to DOB. */
  requiresJoiningForCalc: boolean;
  /**
   * When true the tool must refuse to invent a date and instead show the
   * "requires official verification" state.
   */
  manualVerification: boolean;
  /** Marks a generic fallback estimate (used for "Other"). */
  genericFallback?: boolean;
  /** sourceId referencing SourceRecord; plus display/legal info. */
  sourceId: string;
  legalReference?: LText;
  confidence: RuleConfidence;
  verifiedDate: string;
  notes?: LText;
}

/** Per-rank retirement cap for armed forces (earlier of age cap / service cap). */
export interface RankCap {
  rank: LText;
  /** Max age at which the rank must retire (if known). */
  ageCapYears?: number;
  /** Max qualifying service for the rank (if known). */
  serviceCapYears?: number;
  confidence: Confidence;
  note?: LText;
}

/* ------------------------------------------------------------------ */
/* Job-age (recruitment eligibility) rules                             */
/* ------------------------------------------------------------------ */

export type JobCategoryKey =
  | 'GOVERNMENT'
  | 'DEFENCE'
  | 'POLICE'
  | 'BANKING'
  | 'EDUCATION'
  | 'HEALTHCARE'
  | 'JUDICIARY'
  | 'IT_TECHNICAL'
  | 'PRIVATE'
  | 'NGO'
  | 'TRANSPORT'
  | 'FINANCE'
  | 'RESEARCH'
  | 'SKILLED';

/**
 * Important: recruitment age limit ≠ retirement age ≠ service length.
 * This record ONLY models recruitment entry age limits.
 */
export interface JobAgeRule {
  id: string;
  jobTitle: LText;
  category: JobCategoryKey;
  /** Minimum age in completed years, or null when the circular leaves it open ("18+"). */
  minimumAge: number | null;
  /** Maximum age in completed years, or null when institution-specific / unknown. */
  maximumAge: number | null;
  /**
   * Optional reference date used by circulars ("as on …"). When present the
   * engine computes candidate age at this date instead of today.
   */
  asOfDate?: string;
  /** Extra allowance in years for special categories, ONLY where a current rule provides it. */
  specialAgeRules?: Partial<Record<'freedomFighter' | 'pwd' | 'women' | 'servingMember', number>>;
  gender?: 'ALL' | 'MALE' | 'OTHER';
  /**
   * When true, results show the “rule requires verification” treatment
   * (⚪) rather than a confident eligibility verdict.
   */
  requiresVerification?: boolean;
  education?: LText;
  /** True for “typical market practice”, NOT a legal limit. */
  marketPractice?: boolean;
  sourceId: string;
  authority?: LText;
  legalReference?: LText;
  verifiedDate: string;
  confidence: Confidence;
  notes?: LText;
}

export type EligibilityLevel = 'ELIGIBLE' | 'NEAR_LIMIT' | 'NOT_ELIGIBLE' | 'REQUIRES_VERIFICATION';

/* ------------------------------------------------------------------ */
/* Defence recruitment standards                                       */
/* ------------------------------------------------------------------ */

export interface DefencePhysicalStandards {
  heightMaleCm?: number;
  heightFemaleCm?: number;
  /** Relaxed height for ethnic-minority / quota candidates where published. */
  heightRelaxationNote?: LText;
  chestMinCm?: number;
  chestExpansionCm?: number;
  weightNote?: LText;
  visionNote?: LText;
  eyesight6over6?: boolean;
}

export interface DefenceRecruitmentRule {
  id: string;
  force: 'ARMY' | 'NAVY' | 'AIR_FORCE' | 'POLICE' | 'BGB' | 'COAST_GUARD' | 'ANSAR_VDP' | 'FIRE_SERVICE';
  entryType: LText;
  /** Which "retirement" rule record (if any) governs this entry's end of service. */
  retirementRuleId?: string;
  minimumAge: number | null;
  maximumAge: number | null;
  asOfNote?: LText;
  education?: LText;
  gender: 'ALL' | 'MALE' | 'FEMALE' | 'OTHER';
  maritalNote?: LText;
  nationalityNote?: LText;
  recruitmentType?: LText;
  serviceType?: LText;
  physical: DefencePhysicalStandards;
  otherConditions?: LText;
  sourceId: string;
  /** Date of the circular the numbers come from. */
  circularDate?: string;
  verifiedDate: string;
  confidence: Confidence;
  notes?: LText;
}

/* ------------------------------------------------------------------ */
/* Fitness                                                             */
/* ------------------------------------------------------------------ */

export interface BmiBand {
  key: 'SEVERE_THINNESS' | 'MODERATE_THINNESS' | 'MILD_THINNESS' | 'NORMAL' | 'PRE_OBESITY' | 'OBESITY_I' | 'OBESITY_II' | 'OBESITY_III';
  minInclusive: number;
  maxExclusive: number | null;
  label: LText;
}

/* ------------------------------------------------------------------ */
/* Engine I/O                                                          */
/* ------------------------------------------------------------------ */

export interface YMD {
  year: number;
  month: number; // 1-12
  day: number;
}

export interface CalendarDuration {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  /** decimal years (duration/365.2425) — display only */
  approxYears: number;
}

export type DateErrorCode =
  | 'EMPTY'
  | 'INVALID'
  | 'FUTURE'
  | 'OUT_OF_RANGE'
  | 'JOINING_FUTURE'
  | 'JOINING_TOO_YOUNG'
  | 'JOINING_AFTER_RETIREMENT';

export interface RetirementInput {
  dob: YMD | null;
  joiningDate: YMD | null;
  rule: RetirementRule;
  rankKey?: string;
  freedomFighter: boolean;
  /** "Now" — injectable for tests. */
  currentDate: YMD;
  currentSecondsOfDay?: number;
}

export interface RetirementResult {
  ok: boolean;
  errors: { dob?: DateErrorCode; joining?: DateErrorCode };
  currentAge?: CalendarDuration;
  serviceCompleted?: CalendarDuration;
  /** Effective retirement age used (after FF override etc.) */
  retirementAge?: number;
  /** True when the 60y freedom-fighter provision produced the retirementAge. */
  freedomFighterApplied?: boolean;
  retirementDate?: YMD;
  remaining?: CalendarDuration;
  /** remaining as of a seconds-granularity snapshot */
  remainingClock?: { days: number; hours: number; minutes: number; seconds: number; totalSeconds: number };
  projectedService?: CalendarDuration;
  completionPercent?: number;
  remainingPercent?: number;
  status?: RetirementStatus;
  ruleUsed: RetirementRule;
  /** Human-readable label of the specific rank cap used, if any. */
  rankUsed?: LText;
  /** Which cap bound the date for age-and-service rules. */
  bindingCap?: 'AGE' | 'SERVICE' | null;
  /** Age-based rules ignore joining date for the retirement date; UI can surface this. */
  note?: LText;
  warnings: LText[];
  /** Set for MANUAL_VERIFICATION / missing-rank outcomes. */
  requiresVerification?: { message: LText };
}

export interface EligibilityInput {
  /** Exact age in completed years at reference moment. */
  ageYears: number;
  /** months beyond completed years — used for precise near-limit logic */
  ageMonths: number;
  /** days beyond completed years+months */
  ageDays: number;
  status: {
    freedomFighter: boolean; // self, a freedom fighter (retirement context) — for job-age: FF-descendant note only
    ffDescendant: boolean;
    pwd: boolean;
    servingMember: boolean;
    women: boolean;
  };
}

export interface EligibilityOutcome {
  rule: JobAgeRule;
  level: EligibilityLevel;
  reason: LText;
  ageAtReference: number; // completed years used for the verdict
  effectiveMax: number | null;
  monthsUntilCap: number | null;
}
