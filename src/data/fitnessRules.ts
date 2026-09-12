/**
 * Fitness standards dataset — internationally accepted references.
 * BMI is a SCREENING measure, never a medical diagnosis; recruitment
 * eligibility is a SEPARATE official process (see defenceRules.ts).
 */
import type { BmiBand } from '../types';

const V = '2026-09-11';

/** WHO adult classification (underweight grades + obesity classes). */
export const WHO_BMI_BANDS: BmiBand[] = [
  { key: 'SEVERE_THINNESS', minInclusive: 0, maxExclusive: 16, label: { en: 'Severe thinness', bn: 'অতিমাত্রায় দুর্বল' } },
  { key: 'MODERATE_THINNESS', minInclusive: 16, maxExclusive: 17, label: { en: 'Moderate thinness', bn: 'মাঝারি দুর্বলতা' } },
  { key: 'MILD_THINNESS', minInclusive: 17, maxExclusive: 18.5, label: { en: 'Mild thinness', bn: 'হালকা দুর্বলতা' } },
  { key: 'NORMAL', minInclusive: 18.5, maxExclusive: 25, label: { en: 'Normal (healthy) range', bn: 'স্বাভাবিক (সুস্থ) পরিসর' } },
  { key: 'PRE_OBESITY', minInclusive: 25, maxExclusive: 30, label: { en: 'Pre-obesity (overweight)', bn: 'অতিরিক্ত ওজন (পূর্ব-স্থূলতা)' } },
  { key: 'OBESITY_I', minInclusive: 30, maxExclusive: 35, label: { en: 'Obesity class I', bn: 'স্থূলতা — শ্রেণি I' } },
  { key: 'OBESITY_II', minInclusive: 35, maxExclusive: 40, label: { en: 'Obesity class II', bn: 'স্থূলতা — শ্রেণি II' } },
  { key: 'OBESITY_III', minInclusive: 40, maxExclusive: null, label: { en: 'Obesity class III (extreme)', bn: 'স্থূলতা — শ্রেণি III (চরম)' } },
];

/** Asia-Pacific public-health screening cut-offs (risk rises earlier in South-Asian populations). */
export const ASIA_PACIFIC_RISK_NOTE = {
  en: 'For South-Asian populations, public-health guidance flags increased metabolic risk from BMI ≥ 23 (“overweight” at 23–27.4, high risk ≥ 27.5). This is a screening note, not a diagnosis.',
  bn: 'দক্ষিণ এশীয় জনগোষ্ঠীর জন্য পাবলিক-হেলথ নির্দেশনায় BMI ≥ ২৩ থেকে বিপাকীয় ঝুঁকি বাড়ার সতর্কতা (২৩–২৭.৪ “অতিরিক্ত”, ≥২৭.৫ উচ্চঝুঁকি)। এটি স্ক্রিনিং নোট, রোগ নির্ণয় নয়।',
};

export const BMI_FORMULA = {
  en: 'BMI = weight (kg) ÷ height (m)²',
  bn: 'BMI = ওজন (কেজি) ÷ উচ্চতা (মিটার)²',
};

export const ACTIVITY_LEVELS = [
  { key: 'SEDENTARY', mult: 1.2, label: { en: 'Sedentary (little or no exercise)', bn: 'কম ক্রিয়াকলাপ (প্রায় ব্যায়াম নেই)' } },
  { key: 'LIGHT', mult: 1.375, label: { en: 'Lightly active (1–3 days/week)', bn: 'হালকা সক্রিয় (সপ্তাহে ১–৩ দিন)' } },
  { key: 'MODERATE', mult: 1.55, label: { en: 'Moderately active (3–5 days/week)', bn: 'মাঝারি সক্রিয় (সপ্তাহে ৩–৫ দিন)' } },
  { key: 'VERY', mult: 1.725, label: { en: 'Very active (6–7 days/week)', bn: 'অনেক সক্রিয় (সপ্তাহে ৬–৭ দিন)' } },
  { key: 'EXTRA', mult: 1.9, label: { en: 'Extra active (physical job + training)', bn: 'অতি সক্রিয় (শারীরিক কাজ + প্রশিক্ষণ)' } },
] as const;

export type ActivityKey = (typeof ACTIVITY_LEVELS)[number]['key'];

/** Reference notes for the “Recruitment Standard Comparison” block. */
export const RECRUITMENT_WEIGHT_STANDARD_NOTE = {
  en: 'Most Bangladesh uniformed-service notices do not publish a BMI cut-off; they state that weight must be “proportionate to age and height”, decided by a medical board per service charts. A BMI within the WHO normal range is therefore only an indicative, non-binding comparison.',
  bn: 'বাংলাদেশের সামরিক/আধা-সামরিক বাহিনীর বিজ্ঞপ্তিগুলোতে সাধারণত কোনো BMI কর্তন-সীমা প্রকাশ পায় না; “ওজন বয়স ও উচ্চতার সাথে সামঞ্জস্যপূর্ণ হতে হবে” — এটি নির্ধারিত চার্ট অনুযায়ী মেডিকেল বোর্ড যাচাই করেন। তাই WHO স্বাভাবিক পরিসরে BMI থাকা কেবল নির্দেশক তুলনা, বাধ্যতামূলক যোগ্যতা নয়।',
};

export const FITNESS_VERIFIED = V;
