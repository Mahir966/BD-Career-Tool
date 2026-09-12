/**
 * Research source registry (Requirement: source transparency).
 *
 * Every rule in retirementRules / jobAgeRules / defenceRules / fitnessRules
 * references a `sourceId` from this file. Primary sources (laws, official
 * portals) are always preferred; where only press/secondary coverage of a
 * circular exists, the source is typed SECONDARY_SOURCE and dependent rules
 * carry reduced confidence.
 *
 * verifiedDate = last date a project maintainer checked the URL/content.
 */
import type { SourceRecord } from '../types';

export const VERIFIED_TODAY = '2026-09-11';

export const SOURCES: SourceRecord[] = [
  {
    id: 'gsa-2018',
    title: {
      bn: 'সরকারি চাকরি আইন, ২০১৮ (২০১৮ সনের ৫৭ নং আইন) — ধারা ৪৩',
      en: 'Government Service Act, 2018 (Act No. 57 of 2018) — Section 43',
    },
    authority: { bn: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার (Ministry of Law)', en: 'Government of the People’s Republic of Bangladesh' },
    url: 'https://bdlaws.minlaw.gov.bd/act-print-1271.html',
    type: 'LAW',
    publicationDate: '2018-11-14',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: '১ অক্টোবর ২০১৯ থেকে কার্যকর (এসআরও ৩০৫-আইন/২০১৯)। ধারা ৪৩(১)(ক): সরকারি কর্মচারী ৫৯ বৎসর পূর্তিতে; ৪৩(১)(খ): মুক্তিযোদ্ধা সরকারি কর্মচারী ৬০ বৎসর পূর্তিতে অবসর গ্রহণ করিবেন। ধারা ১(৩)(৪ক) অনুযায়ী স্বায়ত্তশাসিত সংস্থা, রাষ্ট্রায়ত্ত প্রতিষ্ঠান ও স্থানীয় সরকার প্রতিষ্ঠানেও ধারা ৪৩ প্রযোজ্য। বিচার, প্রতিরক্ষা, পাবলিক বিশ্ববিদ্যালয় ইত্যাদি আইনটির সাধারণ আওতার বাইরে (ধারা ১(৩))। স্বেচ্ছায় অবসর: ধারা ৪৪ (২৫ বছর চাকরি)।',
      en: 'Effective 01 Oct 2019 (SRO 305-Law/2019). s.43(1)(a): general government employee retires on completing 59 years; s.43(1)(b): freedom-fighter government employee retires at 60. Per s.1(4k), s.43 also extends to autonomous bodies, state-owned enterprises and local government institutions. Judiciary, defence services, public universities, etc. are outside the Act’s general scope (s.1(3)). Voluntary retirement after 25 years of service: s.44.',
    },
  },
  {
    id: 'constitution-bd',
    title: {
      bn: 'গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান — অনুচ্ছেদ ৯৫ ও ১১৬ক',
      en: 'Constitution of the People’s Republic of Bangladesh — Articles 95 & 116A',
    },
    authority: { bn: 'গণপ্রজাতন্ত্রী বাংলাদেশ', en: 'Government of Bangladesh' },
    url: 'https://bdlaws.minlaw.gov.bd/act-957.html',
    type: 'LAW',
    publicationDate: '1972-11-04',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'সুপ্রিম কোর্টের বিচারকগণ ৬৭ বছর বয়সে অবসরগ্রহণ করিবেন (অনুচ্ছেদ ৯৫(১))। জেলা বিচারকগণের অবসরের বয়স ৬৫ বছর (অনুচ্ছেদ ১১৬ক)।',
      en: 'Supreme Court judges retire at 67 (Art. 95(1)); district judges at 65 (Art. 116A).',
    },
  },
  {
    id: 'entry-age-ordinance-2024',
    title: {
      bn: 'সরকারি, স্বায়ত্তশাসিত, সংবিধিবদ্ধ সরকারি কর্তৃপক্ষ, পাবলিক নন-ফাইন্যানশিয়াল করপোরেশনসহ স্ব-শাসিত সংস্থাগুলোতে সরাসরি নিয়োগের ক্ষেত্রে সর্বোচ্চ বয়সসীমা নির্ধারণ অধ্যাদেশ, ২০২৪',
      en: 'Government, Autonomous, Statutory Public Authorities & Public Non-Financial Corporations Direct Recruitment Maximum Age Limit Determination Ordinance, 2024',
    },
    authority: { bn: 'রাষ্ট্রপতি / অন্তর্বর্তীকালীন সরকার', en: 'The President (Interim Government)' },
    url: 'https://www.dhakapost.com/national/323619',
    type: 'GAZETTE',
    publicationDate: '2024-11-18',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'বিসিএস-এর সব ক্যাডার ও বিসিএস বহির্ভূত সব সরকারি চাকরিতে প্রবেশের সর্বোচ্চ বয়সসীমা সার্বিকভাবে ৩২ বছর। ৩০ বা কম/সমান সীমা যেখানেই আছে সেখানে ৩২ প্রতিস্থাপিত। প্রতিরক্ষা ও আইনশৃঙ্খলা বাহিনী নিজেদের বিধিমালা বহাল। সেকেন্ডারি সূত্রে প্রকাশিত অধ্যাদেশের পাঠ; মূল গেজেট যাচাই প্রয়োজ্য।',
      en: 'Sets a uniform maximum entry age of 32 years for ALL BCS cadres and all non-BCS government posts (and for autonomous/statutory bodies & public non-financial corporations where the limit was ≤32). Defence and law-enforcement services keep their own rules. Text as reported from the ordinance; consult the official gazette for the binding version.',
    },
  },
  {
    id: 'entry-age-ordinance-amend-2025',
    title: {
      bn: 'সর্বোচ্চ বয়সসীমা নির্ধারণ (সংশোধন) অধ্যাদেশ, ২০২৫ (২২ ডিসেম্বর ২০২৫)',
      en: 'Maximum Age Limit Determination (Amendment) Ordinance, 2025 (22 Dec 2025)',
    },
    authority: { bn: 'রাষ্ট্রপতি', en: 'The President' },
    url: 'https://www.risingbd.com/national/news/633156',
    type: 'GAZETTE',
    publicationDate: '2025-12-22',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'যেসব পদের বিধিমালায় আগে থেকেই ৩২-এর বেশি বয়সসীমা (যেমন প্রোগ্রামার ৩৫, কম্পিউটার সুপারভাইজার ৩৫) সেসব সীমা অপরিবর্তিত বহাল।',
      en: 'Preserves higher-than-32 age limits already fixed in specific service rules (e.g. Programmer 35, Computer Supervisor 35).',
    },
  },
  {
    id: 'entry-age-act-2026',
    title: {
      bn: 'সরকারি চাকরিতে প্রবেশের সর্বোচ্চ বয়সসীমা ৩২ বছর — সংসদে পাস হওয়া বিল (এপ্রিল ২০২৬)',
      en: 'Parliament passes Bill fixing maximum age of 32 for government job entry (April 2026)',
    },
    authority: { bn: 'জাতীয় সংসদ', en: 'Jatiya Sangsad (Parliament)' },
    url: 'https://www.bd-pratidin.com/first-page/2026-04-06/1235266',
    type: 'LAW',
    publicationDate: '2026-04-05',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: '২০২৪ ও ২০২৫ সালের অধ্যাদেশ দুটি বাতিল করে স্থায়ী আইনরূপ; চূড়ান্ত গেজেট সংস্করণ বানানভেদে শিরোনাম ভিন্ন হতে পারে — প্রকাশিত আইনের অফিসিয়াল পাঠ যাচাই করুন।',
      en: 'Permanently enacts the 2024/2025 ordinances after repeal. Verify the final gazetted title/text at bdlaws.minlaw.gov.bd when published.',
    },
  },
  {
    id: 'bpsc-site',
    title: { bn: 'বাংলাদেশ সরকারি কর্ম কমিশন (BPSC) — অফিসিয়াল ওয়েবসাইট ও বিজ্ঞপ্তি', en: 'Bangladesh Public Service Commission (BPSC) — official portal & circulars' },
    authority: { bn: 'BPSC', en: 'Bangladesh Public Service Commission' },
    url: 'https://www.bpsc.gov.bd',
    type: 'OFFICIAL_WEBSITE',
    publicationDate: '2025-11-26',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: '৫০তম বিসিএস বিজ্ঞপ্তি: আবেদনকারীর বয়স ০১ নভেম্বর ২০২৫ তারিখে ২১–৩২ বছর (সব ক্যাডার/কোটায় একই)। বিজ্ঞপ্তির মূল PDF সর্বদা प्राथম্য।',
      en: '50th BCS circular (26 Nov 2025): age 21–32 as on 01 Nov 2025 for all cadres/quotas (confirmed via Prothom Alo English reporting of the circular). Always prefer the circular PDF itself.',
    },
  },
  {
    id: 'pa-eng-50-bcs',
    title: { bn: 'Prothom Alo English — 50th BCS আবেদন নির্দেশিকা (বয়স ২১–৩২, ১ নভেম্বর ২০২৫)', en: 'Prothom Alo English — 50th BCS application guide (age 21–32 as on 1 Nov 2025)' },
    authority: { bn: 'প্রথম আলো', en: 'Prothom Alo' },
    url: 'https://en.prothomalo.com/youth/employment/xjgiumie3g',
    type: 'SECONDARY_SOURCE',
    publicationDate: '2025-12-05',
    verifiedDate: VERIFIED_TODAY,
  },
  {
    id: 'police-portal',
    title: { bn: 'বাংলাদেশ পুলিশ — নিয়োগ (সারদা/সদর দফতর)', en: 'Bangladesh Police — Recruitment (Sardah / Police HQ)' },
    authority: { bn: 'বাংলাদেশ পুলিশ, স্বরাষ্ট্র মন্ত্রণালয়', en: 'Bangladesh Police, Ministry of Home Affairs' },
    url: 'https://www.police.gov.bd',
    type: 'OFFICIAL_WEBSITE',
    publicationDate: '2026-01-01',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'কনস্টেবল: ১৮–২০ বছর (২০২৪/২০২৬ বিজ্ঞপ্তি, বিজ্ঞপ্তিতে উল্লিখিত তারিখে); এসআই (ক্যাডেট, নিরস্ত্র): ১৯–২৭ (বীর উত্তম/শহীদ মুক্তিযোদ্ধা সন্তান ৩২)। প্রতিটি বিজ্ঞপ্তিতে বদলাতে পারে — সংশ্লিষ্ট বিজ্ঞপ্তির PDF দেখুন।',
      en: 'Constable: 18–20 (2024/2026 circulars, as on the date stated); Cadet SI (unarmed): 19–27, FF children of shaheed/ Bir Uttam up to 32. Standards change per circular — always check the current notification PDF.',
    },
  },
  {
    id: 'police-si-circular-2024',
    title: { bn: 'বাংলাদেশ পুলিশ — ক্যাডেট এসআই (নিরস্ত্র) নিয়োগ বিজ্ঞপ্তি ২০২৪/২৫ (পত্রিকায় প্রকাশিত বিজ্ঞপ্তির সারাংশ)', en: 'Bangladesh Police — Cadet SI (Unarmed) recruitment circular 2024/25 (press-reported circular)' },
    authority: { bn: 'বাংলাদেশ পুলিশ', en: 'Bangladesh Police' },
    url: 'https://thedailycampus.com/career/155276/',
    type: 'RECRUITMENT_CIRCULAR',
    publicationDate: '2024-10-03',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'উচ্চতা: পুরুষ ৫′৬″ (১৬৭.৬৪ সেমি), নারী ৫′৪″ (১৬২.৫৬ সেমি); বুক ৩২–৩৪"; দৃষ্টি ৬/৬; অবিবাহিত; স্নাতক; গ্রেড ১০।',
      en: 'Height male 5ft6in (167.64cm), female 5ft4in (162.56cm); chest 32–34in; vision 6/6; unmarried; graduate; Grade 10.',
    },
  },
  {
    id: 'police-constable-2024',
    title: { bn: 'বাংলাদেশ পুলিশ কনস্টেবল নিয়োগ বিজ্ঞপ্তি ২০২৪ (পত্রিকায় প্রকাশিত বিজ্ঞপ্তির সারাংশ)', en: 'Bangladesh Police Constable recruitment circular 2024 (press-reported)' },
    authority: { bn: 'বাংলাদেশ পুলিশ', en: 'Bangladesh Police' },
    url: 'https://pathoshalabd.com/%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B6-%E0%A6%AA%E0%A7%81%E0%A6%B2%E0%A6%BF%E0%A6%B6-%E0%A6%95%E0%A6%A8%E0%A6%B8%E0%A7%8D%E0%A6%9F%E0%A7%87%E0%A6%AC%E0%A6%B2/',
    type: 'RECRUITMENT_CIRCULAR',
    publicationDate: '2024-01-19',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'বয়স ১৮–২০ (০৭ ফেব্রুয়ারি ২০২৪ অনুযায়ী); উচ্চতা সাধারণ ৫′৬″, মুক্তিযোদ্ধা/ক্ষুদ্র নৃ-গোষ্ঠী ৫′৪″; দৃষ্টি ৬/৬; বুক ৩০–৩১"।',
      en: 'Age 18–20 (as on 07 Feb 2024); height 5ft6in general, 5ft4in FF/ethnic-minority; vision 6/6; chest 30–31in.',
    },
  },
  {
    id: 'army-recruit-portal',
    title: { bn: 'বাংলাদেশ সেনাবাহিনী — অফিসিয়াল ভর্তি পোর্টাল (Join Bangladesh Army)', en: 'Bangladesh Army — official recruitment portal (Join Bangladesh Army)' },
    authority: { bn: 'বাংলাদেশ সেনাবাহিনী, MODA', en: 'Bangladesh Army, Ministry of Defence' },
    url: 'https://join.army.mil.bd',
    type: 'OFFICIAL_WEBSITE',
    publicationDate: '2026-07-28',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: '৯৭তম বিএমএ (লং কোর্স): ০১ জুলাই ২০২৭ তারিখে বয়স ১৬.৫–২১ (অবিবাহিত); সৈনিক (২০২৬ ব্যাচ): ১৭–২২, এসএসসি জিপিএ ২.৫; পুরুষ উচ্চতা ১.৬৫ মি (ক্ষুদ্র নৃ-গোষ্ঠী ১.৬৩), নারী ১.৫৫ মি; বুক ৩০–৩২"; দৃষ্টি ৬/৬ — বিজ্ঞপ্তির নির্দিষ্ট সংস্করণ থেকে যাচাই করুন।',
      en: '97th BMA Long Course: 16½–21 as on 01 Jul 2027 (unmarried); Soldier (2026 batch): 17–22, SSC GPA 2.5; male height 1.65m (1.63m ethnic-minority), female 1.55m; chest 30–32in; vision 6/6 — verify against the specific circular PDF (army standards vary by trade & batch).',
    },
  },
  {
    id: 'navy-recruit-portal',
    title: { bn: 'বাংলাদেশ নৌবাহিনী — অফিসিয়াল ভর্তি পোর্টাল (Join Navy)', en: 'Bangladesh Navy — official recruitment portal (Join Navy)' },
    authority: { bn: 'বাংলাদেশ নৌবাহিনী, MODA', en: 'Bangladesh Navy, Ministry of Defence' },
    url: 'https://joinnavy.navy.mil.bd',
    type: 'OFFICIAL_WEBSITE',
    publicationDate: '2026-01-01',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'নাবিক (A/B-২০২৬ ব্যাচ): ১৭–২০ বছর (নির্ধারিত তারিখে); এমওডিসি (নৌ): ১৭–২২; উচ্চতা সিম্যান পুরুষ ৫′৬″/রেগুলেটিং ৫′৮″; দৃষ্টি ৬/৬; সাঁতার বাধ্যতামূলক; অবিবাহিত। বয়স গণনার তারিখ ব্যাচভেদে আলাদা।',
      en: 'Sailor (A/B-2026 batches): 17–20 as on the stated date; MODC (Navy): 17–22; height: seamen male 5ft6in, regulating 5ft8in; vision 6/6; swimming compulsory; unmarried. Age-reference date varies per batch.',
    },
  },
  {
    id: 'baf-officer-afo',
    title: { bn: 'বাংলাদেশ বিমানবাহিনী — RECRUITMENT OF BAF OFFICER CADETS (Air Force Order)', en: 'Bangladesh Air Force — Recruitment of BAF Officer Cadets (Air Force Order)' },
    authority: { bn: 'বাংলাদেশ বিমানবাহিনী', en: 'Bangladesh Air Force' },
    url: 'https://baf.mil.bd/website/apply_for_officer.php',
    type: 'OFFICIAL_WEBSITE',
    publicationDate: '2026-01-01',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'Regular Course ও GD(P) Short Course: ১৬.৫–২২; Direct Entry: ২০–৩০। পুরুষ উচ্চতা ১৬২.৫৬ সেমি (৬৪"), বুক ৮১.২৮ সেমি (৩২"), সম্প্রসারণ ৫.০৮ সেমি (২"); নারী GD(P) ৬৪"/অন্যান্য ৬২", বুক ৭১ সেমি (২৮"); দৃষ্টি উভয় চোখে ৬/৬, স্বাভাবিক রঙ-দৃষ্টি; জন্মসূত্রে বাংলাদেশি নাগরিক। ওজন BAF-এর বয়স-উচ্চতা চার্ট অনুযায়ী।',
      en: 'Regular/GD(P) Short Course: 16½–22; Direct Entry: 20–30. Male height min 64in (162.56cm), chest 32in with 2in expansion; female 64in GD(P)/62in others, chest 28in; vision 6/6 both eyes, normal colour vision; Bangladeshi by birth; weight per BAF age-height chart.',
    },
  },
  {
    id: 'baf-airmen-portal',
    title: { bn: 'বাংলাদেশ বিমানবাহিনী — Airmen Eligibility (Join BAF)', en: 'Bangladesh Air Force — Airmen eligibility (Join BAF)' },
    authority: { bn: 'বাংলাদেশ বিমানবাহিনী', en: 'Bangladesh Air Force' },
    url: 'https://joinairforce.baf.mil.bd',
    type: 'OFFICIAL_WEBSITE',
    publicationDate: '2026-01-01',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'Airmen (২০২৫-২৬ বিজ্ঞপ্তি): বিজ্ঞপ্তিভেদে সাধারণত ১৬–২১ (Musical ২৬ পর্যন্ত); ট্রেডভেদে উচ্চতা ৬২–৬৮", ৬/৬ দৃষ্টি। প্রত্যেক ট্রেডের নিজস্ব ন্যূনতম মান বিজ্ঞপ্তিতে — পৃথকভাবে যাচাই করুন।',
      en: 'Airmen (2025-26 circulars): typically 16–21 (Musical up to 26); trade-specific height 62–68in and 6/6 vision; each trade publishes its own minimums — verify per trade.',
    },
  },
  {
    id: 'bgb-portal',
    title: { bn: 'বর্ডার গার্ড বাংলাদেশ (BGB) — অফিসিয়াল সাইট ও নিয়োগ বিজ্ঞপ্তি', en: 'Border Guard Bangladesh (BGB) — official portal & recruitment circular' },
    authority: { bn: 'বিজিবি, স্বরাষ্ট্র মন্ত্রণালয়', en: 'BGB, Ministry of Home Affairs' },
    url: 'https://bgb.gov.bd',
    type: 'OFFICIAL_WEBSITE',
    publicationDate: '2026-03-17',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'বিজিবি সিপাহী (১০৫তম ব্যাচ, ২০২৬): ১৮–২৩ বছর (১৯ জুলাই ২০২৬ তারিখে), পুরুষ ৫′৬″/নারী ৫′২″ (২০২৫ বিজ্ঞপ্তি অনুযায়ী); SSC ন্যূনতম জিপিএ ৩.০০ / HSC ২.৫০ — পত্রিকায় প্রকাশিত বিজ্ঞপ্তির সারাংশ থেকে; অফিসিয়াল PDF যাচাই করুন।',
      en: 'BGB Sipahi (105th batch, 2026): 18–23 as on 19 Jul 2026; height 5ft6in male / 5ft2in female (per 2025 circular); SSC min GPA 3.00 / HSC 2.50 — from press-reported circular summary; verify the official PDF.',
    },
  },
  {
    id: 'ansar-portal',
    title: { bn: 'বাংলাদেশ আনসার ও গ্রাম প্রতিরক্ষা বাহিনী (DP Ansar & VDP)', en: 'Bangladesh Ansar & Village Defence Party (Directorate)' },
    authority: { bn: 'আনসার ও ভিডিপি ডিরেক্টরেট, স্বরাষ্ট্র মন্ত্রণালয়', en: 'Ansar & VDP Directorate, MoHA' },
    url: 'https://ansar.gov.bd',
    type: 'OFFICIAL_WEBSITE',
    publicationDate: '2026-06-27',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'বিশেষাইত আনসার/ভিডিপি (২০২৬): সাধারণত ১৮–২২ বছর (বিজ্ঞপ্তিতে উল্লিখিত তারিখে); সাধারণ ভিডিপি স্বেচ্ছাসেবক ভিন্ন নিয়ম। যাচাই: সংশ্লিষ্ট বিজ্ঞপ্তি।',
      en: 'Ansar/VDP (2026): typically 18–22 as on the date in the notice; general (voluntary) VDP membership follows different rules. Verify per circular.',
    },
  },
  {
    id: 'bdservicerules-retirement',
    title: { bn: 'BD Service Rules — সরকারি অবসর বিধি ও সশস্ত্র বাহিনীর পদভিত্তিক চাকরিসীমা (তথ্যসংগ্রহ সংকলন)', en: 'BD Service Rules — retirement notes and armed-forces rank service caps (aggregator)' },
    authority: { bn: 'অ-সরকারি তথ্য সংকলন (non-government reference)', en: 'Non-government reference' },
    url: 'https://bdservicerules.info/govt-retirement-rules/',
    type: 'SECONDARY_SOURCE',
    publicationDate: '2026-04-29',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'সেনাবাহিনীর পদভিত্তিক চাকরিসীমা/বয়সসীমা (যেমন: কর্নেল ২৫বছর/৫০; লে. জে. ৩২বছর/৫৭; সৈনিক ২১বছর ইত্যাদি) এখানেই প্রকাশ — সরকারি বিধির সরাসরি উদ্ধৃতি নয়; নিয়োগ বিজ্ঞপ্তি/বিধির মাধ্যমে যাচাই বাধ্যতামূলক। BSR Part-1 Rule 79 অনুযায়ী ৫৯/৬০ বছর পূর্ণ হওয়ার দিনটি অবসরের দিন।',
      en: 'Publishes army rank service caps (e.g. Colonel 25y/50; Lt Gen 32y/57; Soldier 21y) — aggregator content, NOT a direct citation of military regulations; verification against official rules is mandatory. BSR Part-1 Rule 79: the day of completing 59/60 counts as the retirement day.',
    },
  },
  {
    id: 'pub-university-retirement-act-2012',
    title: {
      bn: 'পাবলিক বিশ্ববিদ্যালয় শিক্ষক (অবসর) (বিশেষ বিধান) আইন, ২০১২ — পাবলিক বিশ্ববিদ্যালয়ের শিক্ষকদের অবসরের বয়স ৬৫',
      en: 'Public University Teachers (Retirement) (Special Provision) Act, 2012 — public university teachers retire at 65',
    },
    authority: { bn: 'জাতীয় সংসদ', en: 'Jatiya Sangsad' },
    url: 'https://bdnews24.com/bangladesh/public-varsity-teachers-to-retire-at-65',
    type: 'LAW',
    publicationDate: '2012-07-08',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'আইনটির বানান/প্রকাশিত পাঠ bdlaws থেকে নিশ্চিত করুন; মাধ্যমিক সূত্রে সংসদে পাসের নথি।',
      en: 'Passage reported via press; retrieve the gazetted text from bdlaws.minlaw.gov.bd for binding citation.',
    },
  },
  {
    id: 'ntrca-site',
    title: { bn: 'বিএনটিআরসিএ (NTRCA) — বেসরকারি শিক্ষক নিবন্ধন ও প্রত্যয়ন কর্তৃপক্ষ', en: 'NTRCA — Non-Government Teachers’ Registration & Certification Authority' },
    authority: { bn: 'NTRCA, শিক্ষা মন্ত্রণালয়', en: 'NTRCA, Ministry of Education' },
    url: 'https://ntrca.gov.bd',
    type: 'OFFICIAL_WEBSITE',
    publicationDate: '2026-01-10',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'MPO নীতিমালা অনুযায়ী নিবন্ধন/গণবিজ্ঞপ্তিতে সাধারণ নিয়োগের বয়সসীমা সাধারণত সর্বোচ্চ ৩৫ বছর (বিজ্ঞপ্তির তারিখ অনুযায়ী)।',
      en: 'Under MPO policy, general recruitment for non-govt teachers is normally capped at age 35 (as on the circular date).',
    },
  },
  {
    id: 'who-bmi',
    title: { bn: 'WHO — Body mass index BMI (classification & healthy range)', en: 'WHO — Body mass index (classification and healthy range)' },
    authority: { bn: 'World Health Organization', en: 'World Health Organization' },
    url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight',
    type: 'OFFICIAL_WEBSITE',
    publicationDate: '2024-01-01',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'আন্তর্জাতিক শ্রেণিবিভাগ: <১৮.৫ কম ওজন; ১৮.৫–২৪.৯ স্বাভাবিক; ২৫–২৯.৯ অতিরিক্ত; ≥৩০ স্থূলতা (৩০–৩৪.৯ I; ৩৫–৩৯.৯ II; ≥৪০ III)। এশিয়া-প্রশান্ত মহাসাগরীয় জনগোষ্ঠীর জন্য ২৩+ over-weight ঝুঁকি সূচক হিসেবে বিবেচিত হয়।',
      en: 'International classification: <18.5 underweight; 18.5–24.9 normal; 25–29.9 overweight; ≥30 obesity (I 30–34.9, II 35–39.9, III ≥40). Asia-Pacific public-health practice flags risk from BMI 23+.',
    },
  },
  {
    id: 'mifflin-st-jeor',
    title: { bn: 'Mifflin–St Jeor সমীকরণ (Am J Clin Nutr. 1990;52:353-63)', en: 'Mifflin–St Jeor equation (Am J Clin Nutr. 1990;52:353-63)' },
    authority: { bn: 'Mifflin MD, St Jeor ST, et al.', en: 'Mifflin MD, St Jeor ST, et al.' },
    url: 'https://pubmed.ncbi.nlm.nih.gov/2377215/',
    type: 'SECONDARY_SOURCE',
    publicationDate: '1990-09-01',
    verifiedDate: VERIFIED_TODAY,
    notes: {
      bn: 'পুরুষ: ১০×ওজন(kg)+৬.২৫×উচ্চতা(cm)−৫×বয়স+৫; নারী: একই −১৬১। TDEE-তে প্রচলিত activity গুণক ১.২–১.৯।',
      en: 'Male: 10W + 6.25H − 5A + 5; Female: 10W + 6.25H − 5A − 161. Standard activity multipliers 1.2–1.9 for TDEE.',
    },
  },
  {
    id: 'bdr-entry-age-news',
    title: { bn: 'দৈনিক প্রথম আলো/Bangla — চাকরিতে প্রবেশের বয়স ৩০ → ৩২: প্রেক্ষাপট', en: 'Bangladeshi press — background of the 30→32 entry age change' },
    authority: { bn: 'বিভিন্ন দৈনিক', en: 'Various dailies' },
    url: 'https://www.prothomalo.com/bangladesh/%E0%A6%95%E0%A7%8D%E0%A6%B7%E0%A6%A3%E0%A6%BF%E0%A6%A4-%E0%A6%B8%E0%A7%80%E0%A6%AE%E0%A6%BE',
    type: 'SECONDARY_SOURCE',
    publicationDate: '2024-11-18',
    verifiedDate: VERIFIED_TODAY,
  },
];

export function sourceById(id: string): SourceRecord | undefined {
  return SOURCES.find((s) => s.id === id);
}
