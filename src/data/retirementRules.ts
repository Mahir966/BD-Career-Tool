/**
 * Bangladesh government retirement rule database.
 *
 * Source-backed rule records consumed by src/lib/retirementCalculator.ts.
 * No legal logic is hard-coded in UI components: the UI passes a category +
 * subcategory key and the engine resolves the rule here.
 *
 * Confidence semantics (see types/index.ts):
 *  HIGH   verified against current official/primary text;
 *  MEDIUM multiple reliable sources, primary text not fully captured;
 *  LOW    secondary source only — UI must warn the user.
 *
 * Key legal anchor: Government Service Act 2018, s.43 — retirement at
 * completion of 59 years (60 for freedom-fighter government employees),
 * extended by s.1(4k) to autonomous bodies / state-owned enterprises / LGIs.
 * Defence services, judiciary and public universities sit outside the Act
 * (s.1(3)) and follow their own regulations — those rules are NOT to be
 * silently defaulted to 59/60.
 */
import type { RetirementRule } from '../types';

const V = '2026-09-11';

/** General GSA-2018 age-based rule shared by most civil-government categories. */
const gsaRule = (
  id: string,
  category: string,
  subcategory: string,
  nameEn: string,
  nameBn: string,
  instEn: string,
  instBn: string,
  notes?: RetirementRule['notes'],
): RetirementRule => ({
  id,
  category,
  subcategory,
  name: { en: nameEn, bn: nameBn },
  institution: { en: instEn, bn: instBn },
  calculationType: 'AGE_BASED',
  retirementAge: 59,
  freedomFighterRetirementAge: 60,
  freedomFighterApplies: true,
  requiresRank: false,
  requiresJoiningForCalc: false,
  manualVerification: false,
  sourceId: 'gsa-2018',
  legalReference: {
    en: 'Government Service Act 2018 (Act No. 57 of 2018), s.43(1)(a) & (b)',
    bn: 'সরকারি চাকরি আইন, ২০১৮ (৫৭ নং আইন), ধারা ৪৩(১)(ক) ও (খ)',
  },
  confidence: 'HIGH',
  verifiedDate: V,
  ...(notes ? { notes } : {}),
});

export const RETIREMENT_RULES: RetirementRule[] = [
  /* ---------------- General government service ---------------- */
  gsaRule(
    'general',
    'GENERAL',
    'general',
    'General Government Service (BCS & non-cadre)',
    'সাধারণ সরকারি চাকরি (বিসিএস ও নন-ক্যাডার)',
    'All ministries/divisions under the Republic',
    'মন্ত্রণালয়/বিভাগ — প্রজাতন্ত্রের কর্ম',
    {
      en: 'Voluntary retirement possible after 25 years of service (s.44); Government may retire after 25 years in public interest (s.45). Per BSR Part-1 r.79 practice the retirement day is the birthday on which 59/60 is completed.',
      bn: '২৫ বছর চাকরি পূর্ণ হলে স্বেচ্ছায় অবসর (ধারা ৪৪); জনস্বার্থে সরকার ২৫ বছর পর অবসর দিতে পারে (ধারা ৪৫)। বিএসআর (পার্ট-১) বিধি ৭৯ অনুযায়ী ৫৯/৬০ পূর্ণ হওয়ার দিনই অবসরের দিন হিসেবে গণ্য।',
    },
  ),
  gsaRule('general-nongazetted', 'GENERAL', 'nongazetted', 'Government Non-Cadre / Class III–IV', 'সরকারি নন-ক্যাডার (তৃতীয়–চতুর্থ শ্রেণি)', 'Republic service', 'প্রজাতন্ত্রের কর্ম'),
  gsaRule('technical-govt', 'GENERAL', 'technical', 'Technical Government Service (non-cadre)', 'কারিগরি সরকারি চাকরি (নন-ক্যাডার)', 'Republic service', 'প্রজাতন্ত্রের কর্ম'),
  gsaRule('local-govt', 'GENERAL', 'local', 'Local Government Institution employees', 'স্থানীয় সরকার প্রতিষ্ঠানের কর্মচারী', 'City Corporations / Upazila Parishad etc.', 'সিটি কর্পোরেশন / উপজেলা পরিষদ ইত্যাদি', {
    en: 's.43 applies to LGIs via s.1(4k). Some LGIs claim their own service rules — verify for special bodies (e.g. Chittagong Hill Tracts district councils).',
    bn: 'ধারা ১(৪ক) অনুযায়ী স্থানীয় সরকার প্রতিষ্ঠানে ধারা ৪৩ প্রযোজ্য। বিশেষ কিছু প্রতিষ্ঠানের নিজস্ব বিধি থাকলে তা যাচাই করুন।',
  }),
  gsaRule('soe-autonomous', 'GENERAL', 'soe', 'State-owned enterprises & autonomous bodies', 'রাষ্ট্রায়ত্ত প্রতিষ্ঠান ও স্বায়ত্তশাসিত সংস্থা', 'e.g. City Corporations, Authorities, BRTC', 'যেমন: কর্তৃপক্ষ, বিআরটিসি ইত্যাদি', {
    en: 's.1(4k) extends s.43 (59/60) to autonomous bodies & state-owned enterprises; institution-specific service rules may prescribe otherwise — verify.',
    bn: 'ধারা ১(৪ক) অনুযায়ী স্বায়ত্তশাসিত সংস্থা ও রাষ্ট্রায়ত্ত প্রতিষ্ঠানে ধারা ৪৩ (৫৯/৬০) প্রযোজ্য; প্রতিষ্ঠানভিত্তিক সার্ভিস রুল থাকলে যাচাই করুন।',
  }),

  /* ---------------- BCS cadres (civil) — general rule applies ---------------- */
  gsaRule('bcs-admin', 'BCS', 'admin', 'BCS Administration', 'বিসিএস (প্রশাসন)', 'CAB / ministries', 'স্থানীয় সরকার বিভাগ, মন্ত্রণালয়'),
  gsaRule('bcs-foreign', 'BCS', 'foreign', 'BCS Foreign Affairs', 'বিসিএস (পররাষ্ট্র)', 'MoFA', 'পররাষ্ট্র মন্ত্রণালয়'),
  gsaRule('bcs-police', 'BCS', 'police', 'BCS Police (officers: ASP and above)', 'বিসিএস (পুলিশ) (এএসপি ও ঊর্ধ্বতন)', 'Bangladesh Police', 'বাংলাদেশ পুলিশ', {
    en: 'Bangladesh Police is part of the Republic’s civil service; GSA-2018 s.43 applies (retirement orders for senior police are issued under s.43/45). Enlisted ranks (Constable–Sergeant) have separate treatment — see police-enlisted.',
    bn: 'বাংলাদেশ পুলিশ প্রজাতন্ত্রের কর্মের অন্তর্ভুক্ত; ধারা ৪৩ প্রযোজ্য (উর্ধ্বতন কর্মকর্তাদের অবসরাদেশ ধারা ৪৩/৪৫ অনুযায়ী জারি হয়)। এনলিস্টেড পদ (কনস্টেবল–সার্জেন্ট) ভিন্ন আচরণের — পুলিশ এনলিস্টেড দেখুন।',
  }),
  gsaRule('bcs-health', 'BCS', 'health', 'BCS Health (doctors, specialists)', 'বিসিএস (স্বাস্থ্য)', 'MoHFW', 'স্বাস্থ্য অধিদপ্তর'),
  gsaRule('bcs-edu', 'BCS', 'education', 'BCS Education (school/college teachers)', 'বিসিএস (শিক্ষা)', 'MoPME / DoPE', 'মাধ্যমিক ও উচ্চশিক্ষা / প্রাথমিক শিক্ষা অধিদপ্তর'),
  gsaRule('bcs-agri', 'BCS', 'agriculture', 'BCS Agriculture', 'বিসিএস (কৃষি)', 'DAE', 'কৃষি সম্প্রসারণ অধিদপ্তর'),
  gsaRule('bcs-fish', 'BCS', 'fisheries', 'BCS Fisheries & Marine', 'বিসিএস (মৎস্য ও সমুদ্র)', 'DoF', 'মৎস্য অধিদপ্তর'),
  gsaRule('bcs-livestock', 'BCS', 'livestock', 'BCS Livestock', 'বিসিএস (প্রাণিসম্পদ)', 'DLS', 'প্রাণিসম্পদ অধিদপ্তর'),
  gsaRule('bcs-forest', 'BCS', 'forest', 'BCS Forest', 'বিসিএস (বন)', 'BFD', 'বন অধিদপ্তর'),
  gsaRule('bcs-eng', 'BCS', 'engineering', 'BCS Engineering (civil & related)', 'বিসিএস (প্রকৌশল)', 'LGED/RSD etc.', 'স্থানীয় সরকার প্রকৌশল অধিদপ্তর ইত্যাদি'),
  gsaRule('bcs-info', 'BCS', 'information', 'BCS Information', 'বিসিএস (তথ্য)', 'Press Info Dept', 'তথ্য অধিদপ্তর'),
  gsaRule('bcs-stat', 'BCS', 'statistics', 'BCS Statistics', 'বিসিএস (পরিসংখ্যান)', 'BBS', 'বাংলাদেশ পরিসংখ্যান ব্যুরো'),
  gsaRule('bcs-tax', 'BCS', 'tax', 'BCS Tax', 'বিসিএস (কর)', 'NBR', 'জাতীয় রাজস্ব বোর্ড'),
  gsaRule('bcs-customs', 'BCS', 'customs', 'BCS Customs & Valuation', 'বিসিএস (কাস্টমস ও মূল্যনির্ধারণ)', 'NBR', 'জাতীয় রাজস্ব বোর্ড'),
  gsaRule('audit-accounts', 'BCS', 'audit', 'Audit & Accounts (BAgA cadre)', 'মহা হিসাব নিরীক্ষক ও নিয়ন্ত্রণ (একাউন্টস)', 'BAgA / CAGD', 'মহা হিসাব নিরীক্ষক ও নিয়ন্ত্রকের দপ্তর'),
  gsaRule('bcs-gen-education', 'BCS', 'gen-edu', 'BCS General Education', 'বিসিএস (সাধারণ শিক্ষা)', 'MoPME', 'মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর'),

  /* ---------------- Education (non-university & university) ---------------- */
  gsaRule('govt-primary-teacher', 'EDUCATION', 'primary', 'Government Primary School Teacher', 'সরকারি প্রাথমিক বিদ্যালয়ের শিক্ষক', 'Directorate of Primary Education', 'প্রাথমিক শিক্ষা অধিদপ্তর', {
    en: 'Regular (cadre) teachers of government primary schools are government employees → 59/60. Contract/USTDA-trained out-sourced teachers are NOT government employees — no statutory retirement; contract terms apply.',
    bn: 'সরকারি প্রাথমিক বিদ্যালয়ের নিয়মিত (ক্যাডারভুক্ত) শিক্ষক সরকারি কর্মচারী → ৫৯/৬০। চুক্তিভিত্তিক/আউটসোর্সড শিক্ষক সরকারি কর্মচারী নন — আইনগত অবসর বয়স প্রযোজ্য নয়, চুক্তির শর্ত বহনযোগ্য।',
  }),
  gsaRule('govt-secondary-teacher', 'EDUCATION', 'secondary', 'Government Secondary / High School Teacher', 'সরকারি মাধ্যমিক/উচ্চ বিদ্যালয়ের শিক্ষক', 'MoPME / DSE', 'মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর'),
  {
    id: 'govt-college-teacher',
    category: 'EDUCATION',
    subcategory: 'college',
    name: { en: 'Government College Teacher / Lecturer', bn: 'সরকারি কলেজের শিক্ষক / প্রভাষক' },
    institution: { en: 'Directorate of Collegiate Education', bn: 'উচ্চ মাধ্যমিক শিক্ষা অধিদপ্তর (কলিজেটিয়েট)' },
    calculationType: 'INSTITUTION_SPECIFIC',
    retirementAge: 59,
    freedomFighterRetirementAge: 60,
    freedomFighterApplies: true,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: false,
    sourceId: 'gsa-2018',
    legalReference: { en: 'Government Service Act 2018 s.43 via Bangladesh Teachers Service Regulations lineage', bn: 'সরকারি চাকরি আইন ২০১৮ ধারা ৪৩; বাংলাদেশ শিক্ষক (মাধ্যমিক) কর্মবিধি ধারাবাহিকতা' },
    confidence: 'MEDIUM',
    verifiedDate: V,
    notes: {
      en: 'Historically governed by Bangladesh Teachers’ Service Regulations; the retirement-age provision tracks the government general rule (59). Verify current cadre SROs — some college-service provisions have been litigated.',
      bn: 'ঐতিহাসিকভাবে বাংলাদেশ শিক্ষক কর্মবিধির আওতাধীন; অবসরের বয়স সরকারি সাধারণ নিয়ম (৫৯) অনুসরণ করে। বর্তমান ক্যাডার প্রজ্ঞাপন/বিধি যাচাই করুন।',
    },
  },
  {
    id: 'public-university-teacher',
    category: 'EDUCATION',
    subcategory: 'university',
    name: { en: 'Public University Teacher (Lecturer → Professor)', bn: 'পাবলিক বিশ্ববিদ্যালয়ের শিক্ষক (প্রভাষক–অধ্যাপক)' },
    institution: { en: 'Public universities', bn: 'পাবলিক বিশ্ববিদ্যালয়সমূহ' },
    calculationType: 'INSTITUTION_SPECIFIC',
    retirementAge: 65,
    freedomFighterRetirementAge: undefined,
    freedomFighterApplies: false,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: false,
    sourceId: 'pub-university-retirement-act-2012',
    legalReference: { en: 'Public University Teachers (Retirement) (Special Provision) Act, 2012', bn: 'পাবলিক বিশ্ববিদ্যালয়ের শিক্ষক (অবসর) (বিশেষ বিধান) আইন, ২০১২' },
    confidence: 'MEDIUM',
    verifiedDate: V,
    notes: {
      en: 'Public universities are outside the Government Service Act (s.1(3)(ঘ)). The 2012 special Act fixed 65 for teachers of all public universities (previously BUET/other varsity practice was 60 in some cases — legacy discrepancies may remain for retired batches). FF +1y provision of GSA s.43 does NOT automatically extend here.',
      bn: 'পাবলিক বিশ্ববিদ্যালয় সরকারি চাকরি আইনের আওতার বাইরে (ধারা ১(৩)(ঘ))। ২০১২ সালের বিশেষ আইনে সব পাবলিক বিশ্ববিদ্যালয়ের শিক্ষকের অবসর ৬৫ বছর নির্ধারিত (পূর্বে BUETসহ কয়েকটিতে ৬০ প্রচলন ছিল — পুরোনো ব্যাচের ক্ষেত্রে পার্থক্য থাকতে পারে)। মুক্তিযোদ্ধা +১ বছর বিধান এখানে স্বয়ংক্রিয়ভাবে প্রযোজ্য নয়।',
    },
  },
  {
    id: 'mpo-teacher',
    category: 'EDUCATION',
    subcategory: 'mpo',
    name: { en: 'Non-Government (MPO) School/College Teacher', bn: 'বেসরকারি (এমপিওভুক্ত) স্কুল/কলেজের শিক্ষক' },
    institution: { en: 'NTRCA-registered teachers of MPO institutions', bn: 'এমপিওভুক্ত প্রতিষ্ঠানের NTRCA-নিবন্ধিত শিক্ষক' },
    calculationType: 'INSTITUTION_SPECIFIC',
    retirementAge: 59,
    freedomFighterRetirementAge: undefined,
    freedomFighterApplies: false,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: false,
    sourceId: 'ntrca-site',
    legalReference: { en: 'Non-Government Teachers’ MPO Policy Orders (latest)', bn: 'বেসরকারি শিক্ষকদের এমপিও নীতিমালা (সর্বশেষ)' },
    confidence: 'MEDIUM',
    verifiedDate: V,
    notes: {
      en: 'MPO teachers are employees of the governing body/management, not of the Republic. Retirement at 59 is per current MPO policy; the FF 60y rule of GSA does not apply. Verify the MPO policy order in force at the time of retirement.',
      bn: 'এমপিওভুক্ত শিক্ষক প্রজাতন্ত্রের কর্মচারী নন — তিনি প্রতিষ্ঠান কর্তৃপক্ষের কর্মচারী। বর্তমান এমপিও নীতিমালা অনুযায়ী অবসর ৫৯ বছর; সরকারি চাকরি আইনের মুক্তিযোদ্ধা ৬০-এর বিধান প্রযোজ্য নয়। অবসরের সময় প্রচলিত এমপিও নীতিমালা যাচাই করুন।',
    },
  },

  /* ---------------- Health (non-BCS) ---------------- */
  gsaRule('govt-doctor', 'HEALTH', 'doctor', 'Government Doctor / Medical Officer', 'সরকারি চিকিৎসক / মেডিকেল অফিসার', 'MoHFW / DGHS', 'স্বাস্থ্য অধিদপ্তর'),
  gsaRule('govt-nurse', 'HEALTH', 'nurse', 'Government Nurse (Nursing Officer)', 'সরকারি নার্স (নার্সিং অফিসার)', 'DGHS', 'স্বাস্থ্য অধিদপ্তর'),
  gsaRule('health-hospital-staff', 'HEALTH', 'hospital-staff', 'Government hospital employees (admin/technical)', 'সরকারি হাসপাতালের কর্মচারী (প্রশাসনিক/কারিগরি)', 'DGHS', 'স্বাস্থ্য অধিদপ্তর'),

  /* ---------------- Police (enlisted ranks) ---------------- */
  {
    id: 'police-enlisted',
    category: 'POLICE',
    subcategory: 'enlisted',
    name: { en: 'Police Constable / Sergeant / Leader (enlisted ranks)', bn: 'পুলিশ কনস্টেবল / সার্জেন্ট / লीडার (এনলিস্টেড)' },
    institution: { en: 'Bangladesh Police', bn: 'বাংলাদেশ পুলিশ' },
    calculationType: 'INSTITUTION_SPECIFIC',
    retirementAge: 59,
    freedomFighterRetirementAge: 60,
    freedomFighterApplies: true,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: false,
    sourceId: 'bdservicerules-retirement',
    legalReference: { en: 'Government Service Act 2018 s.43 (police personnel are Republic employees); Police Order 2003 & Police Regulations of Bengal (as amended) govern service conditions', bn: 'সরকারি চাকরি আইন ২০১৮ ধারা ৪৩ (পুলিশ সদস্য প্রজাতন্ত্রের কর্মচারী); পুলিশ আদেশ ২০০৩ ও পুলিশ রেগুলেশনস চাকরির শর্তাবলি নিয়ন্ত্রণ করে' },
    confidence: 'MEDIUM',
    verifiedDate: V,
    notes: {
      en: 'Historically enlisted police retirement age was lower (56/57y era practice under the old Public Servants Act); since the 59y uplift the general rule has been applied to police as well, but some sources still report force-specific caps. Treat as 59 estimate ONLY if your force orders do not state otherwise — verify against MHA establishment orders.',
      bn: 'অতীতে এনলিস্টেড পুলিশের অবসরের বয়স কম ছিল (৫৬/৫৭ যুগের প্রচলন); ৫৯ বছরে উন্নীত হওয়ার পর পুলিশেও সাধারণ নিয়ম প্রয়োগ হচ্ছে, তবে কিছু সূত্রে বাহিনীভিত্তিক পৃথক সীমার কথা বলা হয়। বাহিনীর প্রজ্ঞাপনে ভিন্ন উল্লেখ না থাকলে ৫৯-কে প্রাক্কলন ধরুন — স্বরাষ্ট্র মন্ত্রণালয়ের অনুমোদনপত্র/বিজ্ঞপ্তি থেকে যাচাই করুন।',
    },
  },
  gsaRule('asi-police', 'POLICE', 'asi-si', 'Police ASI / SI (non-cadre officers)', 'পুলিশ এএসআই / এসআই (নন-ক্যাডার কর্মকর্তা)', 'Bangladesh Police', 'বাংলাদেশ পুলিশ', {
    en: 'Cadet SIs (GSOs) and promoted officers: government-service general rule 59/60 per GSA 2018.',
    bn: 'ক্যাডেট এসআই (জিএসও) ও পদোন্নতিপ্রাপ্ত কর্মকর্তা: সরকারি চাকরি আইন ২০১৮ অনুযায়ী সাধারণ নিয়ম ৫৯/৬০।',
  }),

  /* ---------------- Armed forces (EXCLUDED from GSA — own regulations) ---------------- */
  {
    id: 'army',
    category: 'DEFENCE',
    subcategory: 'army',
    name: { en: 'Bangladesh Army — commissioned officers & other ranks', bn: 'বাংলাদেশ সেনাবাহিনী — কমিশন্ড কর্মকর্তা ও অন্যান্য পদ' },
    institution: { en: 'Bangladesh Army (MoD)', bn: 'বাংলাদেশ সেনাবাহিনী (প্রতিরক্ষা মন্ত্রণালয়)' },
    calculationType: 'RANK_BASED',
    freedomFighterApplies: false,
    requiresRank: true,
    requiresJoiningForCalc: true,
    manualVerification: false,
    serviceLimitYears: undefined,
    rankCaps: [
      {
        rank: { en: 'Lieutenant → Major (commissioned)', bn: 'লেফটেন্যান্ট–মেজর (কমিশন্ড)' },
        serviceCapYears: 23,
        ageCapYears: 48,
        confidence: 'LOW',
        note: { en: 'Reported from public references; verify with Army regulations/circular.', bn: 'প্রকাশ্য তথ্যসূত্র থেকে; আর্মি বিধি/বিজ্ঞপ্তিতে যাচাই বাধ্যতামূলক।' },
      },
      {
        rank: { en: 'Lieutenant Colonel', bn: 'লেফটেন্যান্ট কর্নেল' },
        serviceCapYears: 27,
        ageCapYears: 52,
        confidence: 'LOW',
        note: { en: 'Reported caps — verify.', bn: 'প্রকাশিত তথ্য — যাচাই বাধ্যতামূলক।' },
      },
      {
        rank: { en: 'Colonel', bn: 'কর্নেল' },
        serviceCapYears: 25,
        ageCapYears: 50,
        confidence: 'LOW',
        note: { en: 'Reported caps — verify.', bn: 'প্রকাশিত তথ্য — যাচাই বাধ্যতামূলক।' },
      },
      {
        rank: { en: 'Brigadier General', bn: 'ব্রিগেডিয়ার জেনারেল' },
        serviceCapYears: 28,
        ageCapYears: 53,
        confidence: 'LOW',
      },
      {
        rank: { en: 'Major General', bn: 'মেজর জেনারেল' },
        serviceCapYears: 30,
        ageCapYears: 55,
        confidence: 'LOW',
      },
      {
        rank: { en: 'Lieutenant General', bn: 'লেফটেন্যান্ট জেনারেল' },
        serviceCapYears: 32,
        ageCapYears: 57,
        confidence: 'LOW',
      },
      {
        rank: { en: 'Soldier / Sepoy', bn: 'সৈনিক / সিপাহী' },
        serviceCapYears: 21,
        confidence: 'LOW',
        note: { en: 'Soldier service cap reported as 21y (increases with rank: LC 22, Cpl 23, Sgt 24; WO 27, SWO 29, MWO 33).', bn: 'সৈনিকের চাকরিসীমা ২১ বছর (পদোন্নতিতে বাড়ে: এলসি ২২, কর্পোরাল ২৩, সার্জেন্ট ২৪; ডব্লিউও ২৭, এসডব্লিউও ২৯, এমডব্লিউও ৩৩)।' },
      },
      {
        rank: { en: 'General (COAS)', bn: 'জেনারেল (সেনাপ্রধান)' },
        ageCapYears: undefined,
        confidence: 'LOW',
        note: {
          en: 'Chief of Army Staff tenure is appointment-based; cannot be estimated from DOB — manual verification.',
          bn: 'সেনাপ্রধানের মেয়াদ নিয়োগভিত্তিক; জন্মতারিখ থেকে নির্ধারণযোগ্য নয় — অফিসিয়াল যাচাই প্রয়োজন।',
        },
      },
    ],
    sourceId: 'bdservicerules-retirement',
    legalReference: {
      en: 'Army Act 1980 and defence-service regulations (s.1(3)(গ) excludes defence services from the Government Service Act 2018)',
      bn: 'আর্মি অ্যাক্ট ১৯৮০ ও প্রতিরক্ষা বিধিমালা (ধারা ১(৩)(গ) অনুযায়ী প্রতিরক্ষা-কর্মবিভাগ সরকারি চাকরি আইন ২০১৮-এর আওতার বাইরে)',
    },
    confidence: 'LOW',
    verifiedDate: V,
    notes: {
      en: 'DO NEVER apply 59/60 to army personnel. Retirement/release is determined by rank-level service caps and age limits under force regulations; the numbers stored here are indicative from public references. The engine returns “earlier of (DOB + age cap) / (commission + service cap)” only when both rank and commission date are supplied, and always displays a verification warning.',
      bn: 'সেনাবাহিনীর সদস্যে কখনোই ৫৯/৬০ প্রয়োগ করবেন না। অবসর/মুক্তি পদভিত্তিক চাকরিসীমা ও বয়সসীমা অনুযায়ী বাহিনীর বিধিমালয় দ্বারা নির্ধারিত — এখানে সংরক্ষিত মান প্রকাশ্য তথ্যসূত্রভিত্তিক নির্দেশক। পদ ও কমিশন/যোগদানের তারিখ দুটি দিলে ইঞ্জিন “(জন্মতারিখ+বয়সসীমা) ও (যোগদান+চাকরিসীমা)-এর মধ্যে আগের তারিখ” দেখায় এবং সবসময় যাচাই-সতর্কতা প্রদর্শন করে।',
    },
  },
  {
    id: 'navy',
    category: 'DEFENCE',
    subcategory: 'navy',
    name: { en: 'Bangladesh Navy — officers & sailors', bn: 'বাংলাদেশ নৌবাহিনী — কর্মকর্তা ও নাবিক' },
    institution: { en: 'Bangladesh Navy (MoD)', bn: 'বাংলাদেশ নৌবাহিনী (প্রতিরক্ষা মন্ত্রণালয়)' },
    calculationType: 'MANUAL_VERIFICATION',
    freedomFighterApplies: false,
    requiresRank: true,
    requiresJoiningForCalc: true,
    manualVerification: true,
    sourceId: 'bdservicerules-retirement',
    legalReference: { en: 'Naval discipline regulations (defence services excluded from GSA 2018)', bn: 'নৌ বাহিনীর শৃঙ্খলা বিধিমালা (প্রতিরক্ষা-কর্মবিভাগ সরকারি চাকরি আইনের বাইরে)' },
    confidence: 'LOW',
    verifiedDate: V,
    notes: {
      en: 'No authoritative public rank-cap table located for BN; the calculator will NOT fabricate a retirement date for navy personnel.',
      bn: 'নৌবাহিনীর পদভিত্তিক চাকরিসীমার নির্ভরযোগ্য প্রকাশ্য তালিকা পাওয়া যায়নি; ক্যালকুলেটর নৌবাহিনীর সদস্যের অবসরের তারিখ অনুমান করে দেখাবে না।',
    },
  },
  {
    id: 'air-force',
    category: 'DEFENCE',
    subcategory: 'air-force',
    name: { en: 'Bangladesh Air Force — officers & airmen', bn: 'বাংলাদেশ বিমানবাহিনী — কর্মকর্তা ও এয়ারম্যান' },
    institution: { en: 'Bangladesh Air Force (MoD)', bn: 'বাংলাদেশ বিমানবাহিনী (প্রতিরক্ষা মন্ত্রণালয়)' },
    calculationType: 'MANUAL_VERIFICATION',
    freedomFighterApplies: false,
    requiresRank: true,
    requiresJoiningForCalc: true,
    manualVerification: true,
    sourceId: 'bdservicerules-retirement',
    legalReference: { en: 'Air Force Act/BAF regulations (defence services excluded from GSA 2018)', bn: 'বিমানবাহিনী আইন/বিধি (প্রতিরক্ষা-কর্মবিভাগ সরকারি চাকরি আইনের বাইরে)' },
    confidence: 'LOW',
    verifiedDate: V,
    notes: {
      en: 'No authoritative public rank-cap table located for BAF; no date will be fabricated.',
      bn: 'বিমানবাহিনীর জন্য নির্ভরযোগ্য পদভিত্তিক তালিকা পাওয়া যায়নি; কোনো তারিখ অনুমান করে দেখানো হবে না।',
    },
  },
  {
    id: 'bgb',
    category: 'DEFENCE',
    subcategory: 'bgb',
    name: { en: 'Border Guard Bangladesh (BGB)', bn: 'বর্ডার গার্ড বাংলাদেশ (বিজিবি)' },
    institution: { en: 'BGB (MoHA)', bn: 'বিজিবি (স্বরাষ্ট্র মন্ত্রণালয়)' },
    calculationType: 'MANUAL_VERIFICATION',
    freedomFighterApplies: false,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: true,
    serviceLimitYears: undefined,
    sourceId: 'bdservicerules-retirement',
    legalReference: { en: 'BGB Act 2010 & BGB service regulations', bn: 'বিজিবি আইন ২০১০ ও বিজিবি সার্ভিস বিধিমালা' },
    confidence: 'LOW',
    verifiedDate: V,
    notes: {
      en: 'BGB members follow force-specific retirement rules (soldiers commonly reported to retire earlier than 59, variously cited as 56–57; army-deputed officers follow army rules). No reliable current gazette located → the calculator refuses to estimate and directs to the force HQ.',
      bn: 'বিজিবির সদস্যদের বাহিনীভিত্তিক অবসর বিধি প্রযোজ্য (সৈনিকদের অবসর ৫৯-এর আগে — বিভিন্ন সূত্রে ৫৬–৫৭ বলা হয়; আর্মি-দায়িত্বে কর্মকর্তারা আর্মি বিধি মেনে চলেন)। নির্ভরযোগ্য বর্তমান গেজেট পাওয়া যায়নি → ক্যালকুলেটর প্রাক্কলন দেয় না, বাহিনী সদর দপ্তরে যাচাইয়ের নির্দেশনা দেখায়।',
    },
  },
  {
    id: 'ansar',
    category: 'DEFENCE',
    subcategory: 'ansar',
    name: { en: 'Bangladesh Ansar & VDP (embodied/general members)', bn: 'বাংলাদেশ আনসার ও ভিডিপি (সংগঠিত/সাধারণ সদস্য)' },
    institution: { en: 'DP Ansar & VDP (MoHA)', bn: 'আনসার ও ভিডিপি ডিরেক্টরেট (স্বরাষ্ট্র মন্ত্রণালয়)' },
    calculationType: 'MANUAL_VERIFICATION',
    freedomFighterApplies: false,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: true,
    sourceId: 'ansar-portal',
    legalReference: { en: 'Bangladesh Ansar and Village Defence Party Ordinance, 1971 & rules', bn: 'বাংলাদেশ আনসার ও গ্রাম প্রতিরক্ষা দল অধ্যাদেশ, ১৯৭১ ও বিধিমালা' },
    confidence: 'LOW',
    verifiedDate: V,
    notes: {
      en: 'Embodied Ansar officer/other-rank retirement ages differ by cadre; general VDP membership is voluntary (no retirement). Verify Directorate orders — no estimate produced.',
      bn: 'সংগঠিত আনসারের কর্মকর্তা/অন্যান্য পদের অবসরের বয়স ক্যাডারভেদে ভিন্ন; সাধারণ ভিডিপি স্বেচ্ছাসেবক সদস্যতায় অবসর নেই। ডিরেক্টরেটের প্রজ্ঞাপন যাচাই করুন — প্রাক্কলন দেওয়া হয় না।',
    },
  },
  {
    id: 'fire-service',
    category: 'DEFENCE',
    subcategory: 'fire-service',
    name: { en: 'Fire Service & Civil Defence members', bn: 'ফায়ার সার্ভিস ও সিভিল ডিফেন্স সদস্য' },
    institution: { en: 'DFCD (MoHA)', bn: 'দফাদ (স্বরাষ্ট্র মন্ত্রণালয়)' },
    calculationType: 'MANUAL_VERIFICATION',
    freedomFighterApplies: false,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: true,
    sourceId: 'bdservicerules-retirement',
    legalReference: { en: 'Fire Service and Civil Defence Act, 1995 & DFCD rules', bn: 'ফায়ার সার্ভিস ও সিভিল ডিফেন্স অধ্যাদেশ, ১৯৯৫ ও দফাদ বিধি' },
    confidence: 'LOW',
    verifiedDate: V,
    notes: {
      en: 'DFCD members have force-level rules reported as distinct from 59 (56y practice in some ranks); current authoritative order not located → verification required.',
      bn: 'দফাদের সদস্যদের বাহিনীস্তরের বিধি ৫৯ থেকে পৃথক বলে প্রচলন রয়েছে (কিছু পদে ৫৬ বছর); বর্তমান অফিসিয়াল আদেশ পাওয়া যায়নি → অফিসিয়াল যাচাই প্রয়োজন।',
    },
  },

  /* ---------------- Judiciary ---------------- */
  {
    id: 'judge-sc',
    category: 'JUDICIARY',
    subcategory: 'supreme',
    name: { en: 'Judge, Supreme Court (AD/HCD)', bn: 'বিচারপতি, সুপ্রিম কোর্ট (আপিল/হাইকোর্ট বিভাগ)' },
    institution: { en: 'Supreme Court of Bangladesh', bn: 'সুপ্রিম কোর্ট অফ বাংলাদেশ' },
    calculationType: 'INSTITUTION_SPECIFIC',
    retirementAge: 67,
    freedomFighterRetirementAge: undefined,
    freedomFighterApplies: false,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: false,
    sourceId: 'constitution-bd',
    legalReference: { en: 'Constitution art. 95(1)', bn: 'সংবিধান অনুচ্ছেদ ৯৫(১)' },
    confidence: 'HIGH',
    verifiedDate: V,
    notes: { en: 'Constitutional age; GSA does not apply; no FF uplift.', bn: 'সাংবিধানিকভাবে নির্ধারিত বয়স; সরকারি চাকরি আইন প্রযোজ্য নয়; মুক্তিযোদ্ধা বাড়তি নেই।' },
  },
  {
    id: 'judge-district',
    category: 'JUDICIARY',
    subcategory: 'district',
    name: { en: 'District Judge', bn: 'জেলা ও দায়রা জজ' },
    institution: { en: 'Judicial Division / BJS', bn: 'বিচার বিভাগ / বিচার প্রশাসন প্রশিক্ষণ ইনস্টিটিউট' },
    calculationType: 'INSTITUTION_SPECIFIC',
    retirementAge: 65,
    freedomFighterRetirementAge: undefined,
    freedomFighterApplies: false,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: false,
    sourceId: 'constitution-bd',
    legalReference: { en: 'Constitution art. 116A', bn: 'সংবিধান অনুচ্ছেদ ১১৬ক' },
    confidence: 'HIGH',
    verifiedDate: V,
  },
  {
    id: 'judicial-officer',
    category: 'JUDICIARY',
    subcategory: 'jsa',
    name: { en: 'Judicial Service Cadet Officer / Additional Judge (probation & appointment periods differ)', bn: 'বিচারিক সেবা ক্যাডেট কর্মকর্তা / অতিরিক্ত জজ (মেয়াদভিত্তিক)' },
    institution: { en: 'Bangladesh Judicial Service Commission', bn: 'বাংলাদেশ বিচারিক সেবা কমিশন' },
    calculationType: 'INSTITUTION_SPECIFIC',
    retirementAge: 65,
    freedomFighterRetirementAge: undefined,
    freedomFighterApplies: false,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: false,
    sourceId: 'bdservicerules-retirement',
    legalReference: { en: 'Bangladesh Judicial Service Act, 1985 & BJS Commission rules', bn: 'বাংলাদেশ বিচারিক সেবা আদেশ, ১৯৮৫ ও বিজিসি বিধিমালা' },
    confidence: 'LOW',
    verifiedDate: V,
    notes: {
      en: 'Judicial officers below district-judge level: retirement age practice has varied (60y era orders and 65y later practice); current rule must be verified with BJS. Treated as estimate.',
      bn: 'জেলা জজ স্তরের নিচের বিচারিক কর্মকর্তাদের অবসরের বয়সে প্রচলন ভিন্ন ভিন্ন হয়েছে (৬০ বছরের পুরোনো আদেশ, পরবর্তীতে ৬৫ প্রচলন); বর্তমান নিয়ম বিজেএস থেকে যাচাই করুন — এটি প্রাক্কলন মাত্র।',
    },
  },

  /* ---------------- Railway & NBR & others following GSA ---------------- */
  gsaRule('railway', 'OTHER_DEPT', 'railway', 'Bangladesh Railway employees', 'বাংলাদেশ রেলওয়ে কর্মচারী', 'Bangladesh Railway', 'বাংলাদেশ রেলওয়ে'),
  gsaRule('nbr', 'OTHER_DEPT', 'nbr', 'NBR (Customs/VAT) government employees', 'এনবিআর (কাস্টমস/ভ্যাট) সরকারি কর্মচারী', 'NBR', 'জাতীয় রাজস্ব বোর্ড'),
  gsaRule('education-officer', 'EDUCATION', 'officer', 'Government educational officers (Upazila/DEO etc.)', 'সরকারি শিক্ষা কর্মকর্তা (উপজেলা/জেলা শিক্ষা অফিসার)', 'DoPE/DSHE', 'প্রাথমিক/মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর'),

  /* ---------------- Contract / project ---------------- */
  {
    id: 'contract',
    category: 'OTHER_DEPT',
    subcategory: 'contract',
    name: { en: 'Contract / project-based appointment', bn: 'চুক্তিভিত্তিক / প্রকল্পভিত্তিক নিয়োগ' },
    institution: { en: 'Government projects, contract appointments', bn: 'সরকারি প্রকল্প, চুক্তিভিত্তিক নিয়োগ' },
    calculationType: 'CONTRACT_SPECIFIC',
    freedomFighterApplies: false,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: true,
    sourceId: 'gsa-2018',
    legalReference: { en: 'Government Service Act 2018 s.1(3)(ঞ), (ট) — project/contract employment excluded', bn: 'সরকারি চাকরি আইন ২০১৮ ধারা ১(৩)(ঞ), (ট) — প্রকল্প/চুক্তিভিত্তিক চাকরি আওতার বাইরে' },
    confidence: 'HIGH',
    verifiedDate: V,
    notes: {
      en: 'No statutory age-based retirement: the contract’s own term defines end of service. Extension/re-employment of superannuated staff is discretionary government order — verify.',
      bn: 'আইনগত বয়সভিত্তিক অবসর নেই — চুক্তির মেয়াদেই চাকরি শেষ। অবসরোত্তর পুনর্নিয়োগ/বর্ধন স্বীকৃত এখতিয়ারভিত্তিক সরকারি আদেশ — যাচাই করুন।',
    },
  },

  /* ---------------- Other (generic fallback) ---------------- */
  {
    id: 'other',
    category: 'GENERAL',
    subcategory: 'other',
    name: { en: 'Other / unspecified government service', bn: 'অন্যান্য / অনির্দিষ্ট সরকারি চাকরি' },
    institution: { en: '—', bn: '—' },
    calculationType: 'AGE_BASED',
    retirementAge: 59,
    freedomFighterRetirementAge: 60,
    freedomFighterApplies: true,
    requiresRank: false,
    requiresJoiningForCalc: false,
    manualVerification: false,
    genericFallback: true,
    sourceId: 'gsa-2018',
    legalReference: { en: 'Government Service Act 2018 s.43 (as a generic estimate)', bn: 'সরকারি চাকরি আইন ২০১৮ ধারা ৪৩ (সাধারণ প্রাক্কলন হিসেবে)' },
    confidence: 'MEDIUM',
    verifiedDate: V,
    notes: {
      en: 'GENERIC FALLBACK ESTIMATE — 59 (60 if freedom fighter). এটি কোনো নির্দিষ্ট প্রতিষ্ঠানের আইনগত অবসর সিদ্ধান্ত নয়। প্রযোজ্য service rule যাচাই করুন। If your service is defence/paramilitary/university/judiciary, the special rules apply instead.',
      bn: 'সাধারণ প্রাক্কলন — ৫৯ (মুক্তিযোদ্ধা হলে ৬০)। এটি কোনো নির্দিষ্ট প্রতিষ্ঠানের আইনগত অবসর সিদ্ধান্ত নয়। প্রযোজ্য service rule যাচাই করুন। প্রতিরক্ষা/অর্ধসামরিক/বিশ্ববিদ্যালয়/বিচারখাত হলে সংশ্লিষ্ট বিশেষ নিয়ম প্রযোজ্য।',
    },
  },
];

export const RETIREMENT_CATEGORIES: { key: string; label: { bn: string; en: string } }[] = [
  { key: 'GENERAL', label: { bn: 'সাধারণ সরকারি চাকরি', en: 'General Government Service' } },
  { key: 'BCS', label: { bn: 'বিসিএস (BCS)', en: 'BCS Cadres' } },
  { key: 'EDUCATION', label: { bn: 'শিক্ষা খাত', en: 'Education' } },
  { key: 'HEALTH', label: { bn: 'স্বাস্থ্য খাত', en: 'Health' } },
  { key: 'POLICE', label: { bn: 'পুলিশ', en: 'Police' } },
  { key: 'DEFENCE', label: { bn: 'প্রতিরক্ষা / সমরিক বাহিনী', en: 'Defence / Uniformed Services' } },
  { key: 'JUDICIARY', label: { bn: 'বিচার বিভাগ', en: 'Judiciary' } },
  { key: 'OTHER_DEPT', label: { bn: 'অন্যান্য দপ্তর / সংস্থা', en: 'Other Departments / Bodies' } },
  { key: 'OTHER', label: { bn: 'অন্যান্য (Generic fallback)', en: 'Other (Generic fallback)' } },
];

export function rulesByCategory(category: string): RetirementRule[] {
  return RETIREMENT_RULES.filter((r) => r.category === category);
}

export function findRuleById(id: string): RetirementRule | undefined {
  return RETIREMENT_RULES.find((r) => r.id === id);
}

/**
 * Resolve from the two-level selection used by the form.
 * The "other" special category maps to the generic fallback rule.
 */
export function resolveRetirementRule(category: string, subcategory: string): RetirementRule | undefined {
  if (category === 'OTHER') return findRuleById('other');
  return RETIREMENT_RULES.find((r) => r.category === category && (subcategory ? r.subcategory === subcategory : true));
}
