/**
 * Fitness result analysis + recruitment-standard comparison.
 *
 * Policy: NEVER present BMI/BMR as official Army/Police eligibility.
 * “Recruitment Standard Comparison” may only compare against published values
 * that exist in the dataset (e.g. minimum height). For weight the notices say
 * “proportionate to age & height per service chart” — the comparison is
 * therefore indicative and must carry that wording.
 */
import type { LText } from '../types';
import type { BmiResult } from './bmiCalculator';
import type { DefenceRecruitmentRule } from '../types';
import { RECRUITMENT_WEIGHT_STANDARD_NOTE } from '../data/fitnessRules';

export interface AnalysisSection {
  key: string;
  title: LText;
  body: LText;
}

export interface FitnessAnalysis {
  summary: AnalysisSection[];
  recruitmentComparison: AnalysisSection | null;
  disclaimer: LText;
}

export function buildFitnessAnalysis(args: {
  heightCm: number;
  weightKg: number;
  bmi: BmiResult;
  rule?: DefenceRecruitmentRule;
  lang?: 'bn' | 'en';
}): FitnessAnalysis {
  const { heightCm, weightKg, bmi, rule } = args;
  const summary: AnalysisSection[] = [
    {
      key: 'inputs',
      title: { en: 'Input summary', bn: 'ইনপুট সারসংক্ষেপ' },
      body: {
        en: `Height ${heightCm.toFixed(1)} cm · Weight ${weightKg.toFixed(1)} kg${bmi.heightM ? ` · ${bmi.heightM.toFixed(2)} m` : ''}`,
        bn: `উচ্চতা ${heightCm.toFixed(1)} সেমি · ওজন ${weightKg.toFixed(1)} কেজি${bmi.heightM ? ` · ${bmi.heightM.toFixed(2)} মিটার` : ''}`,
      },
    },
    {
      key: 'calc',
      title: { en: 'Calculation', bn: 'হিসাব' },
      body: {
        en: bmi.ok && bmi.heightM ? `BMI = ${weightKg.toFixed(1)} ÷ (${bmi.heightM.toFixed(2)})² = ${(weightKg / (bmi.heightM * bmi.heightM)).toFixed(2)}` : '—',
        bn: bmi.ok && bmi.heightM ? `BMI = ${weightKg.toFixed(1)} ÷ (${bmi.heightM.toFixed(2)})² = ${(weightKg / (bmi.heightM * bmi.heightM)).toFixed(2)}` : '—',
      },
    },
    {
      key: 'result',
      title: { en: 'Result', bn: 'ফলাফল' },
      body: {
        en: bmi.ok && bmi.bmi != null ? `BMI ${bmi.bmi} — ${bmi.band?.label.en ?? ''}` : 'Incomplete inputs',
        bn: bmi.ok && bmi.bmi != null ? `BMI ${bmi.bmi} — ${bmi.band?.label.bn ?? ''}` : 'অসম্পূর্ণ তথ্য',
      },
    },
    {
      key: 'meaning',
      title: { en: 'What this means', bn: 'এর অর্থ' },
      body: bmi.interpretation,
    },
    {
      key: 'healthyRange',
      title: { en: 'Healthy-range reference', bn: 'সুস্থ পরিসরের রেফারেন্স' },
      body:
        bmi.ok && bmi.healthyWeightRangeKg
          ? {
              en: `For your height, the WHO “normal” band maps to about ${bmi.healthyWeightRangeKg.min}–${bmi.healthyWeightRangeKg.max} kg.`,
              bn: `আপনার উচ্চতায় WHO “স্বাভাবিক” পরিসর আনুমানিক ${bmi.healthyWeightRangeKg.min}–${bmi.healthyWeightRangeKg.max} কেজি।`,
            }
          : { en: '—', bn: '—' },
    },
  ];

  let recruitmentComparison: AnalysisSection | null = null;
  if (rule) {
    const bodies: string[] = [];
    const bodiesBn: string[] = [];
    if (rule.physical.heightMaleCm != null) {
      const meets = heightCm >= rule.physical.heightMaleCm;
      bodies.push(`Published reference minimum height (male): ${rule.physical.heightMaleCm} cm → you are ${meets ? 'at or above' : 'below'} it (height ${heightCm.toFixed(1)} cm).`);
      bodiesBn.push(`প্রকাশিত ন্যূনতম উচ্চতা (পুরুষ): ${rule.physical.heightMaleCm} সেমি → আপনি ${meets ? 'এর সমান বা বেশি' : 'এর কম'} (উচ্চতা ${heightCm.toFixed(1)} সেমি)।`);
    }
    if (rule.physical.heightFemaleCm != null) {
      bodies.push(`Published reference minimum height (female): ${rule.physical.heightFemaleCm} cm.`);
      bodiesBn.push(`প্রকাশিত ন্যূনতম উচ্চতা (নারী): ${rule.physical.heightFemaleCm} সেমি।`);
    }
    if (bmi.ok) {
      bodies.push(
        `${RECRUITMENT_WEIGHT_STANDARD_NOTE.en} Based on the published standard stored in this tool (circular ${rule.circularDate ?? 'n/a'}, verified ${rule.verifiedDate}), your value falls ${bmi.band?.key === 'NORMAL' ? 'within' : 'outside'} the referenced screening range — this is NOT a selection guarantee.`,
      );
      bodiesBn.push(
        `${RECRUITMENT_WEIGHT_STANDARD_NOTE.bn} এই টুলে সংরক্ষিত প্রকাশিত মানদণ্ড (বিজ্ঞপ্তি ${rule.circularDate ?? '—'}, যাচাই ${rule.verifiedDate}) অনুযায়ী আপনার মান নির্দেশক পরিসরের ${bmi.band?.key === 'NORMAL' ? 'মধ্যে' : 'বাইরে'} পড়েছে — এটি নির্বাচনের নিশ্চয়তা নয়।`,
      );
    }
    recruitmentComparison = {
      key: 'recruit',
      title: { en: 'Recruitment Standard Comparison', bn: 'নিয়োগ মানদণ্ড তুলনা' },
      body: { en: bodies.join(' '), bn: bodiesBn.join(' ') },
    };
  }

  return {
    summary,
    recruitmentComparison,
    disclaimer: {
      en: 'This is a general health screening calculation, not medical advice, and not an official recruitment eligibility determination. Physical standards for uniformed services are decided by their own medical boards per current circulars.',
      bn: 'এটি সাধারণ স্বাস্থ্য স্ক্রিনিং হিসাব, চিকিৎসা পরামর্শ নয় এবং অফিসিয়াল নিয়োগ-যোগ্যতার চূড়ান্ত নির্ধারণও নয়। সামরিক/আধা-সামরিক বাহিনীর শারীরিক মানদণ্ড তাদের চলমান বিজ্ঞপ্তি অনুযায়ী মেডিকেল বোর্ড নির্ধারণ করে।',
    },
  };
}

export function heightRequirementCheck(heightCm: number, rule: DefenceRecruitmentRule, sex: 'M' | 'F'): { meets: boolean | null; requiredCm?: number; text: LText } {
  const required = sex === 'M' ? rule.physical.heightMaleCm : rule.physical.heightFemaleCm;
  if (required == null) {
    return { meets: null, text: { en: 'This record does not publish a height minimum — check the circular.', bn: 'এই রেকর্ডে উচ্চতার ন্যূনতম মান প্রকাশিত নেই — বিজ্ঞপ্তি দেখুন।' } };
  }
  const meets = heightCm >= required;
  return {
    meets,
    requiredCm: required,
    text: meets
      ? {
          en: `At ${heightCm.toFixed(1)} cm you meet the referenced ${required} cm minimum (relaxations for ethnic minorities may exist per notice).`,
          bn: `${heightCm.toFixed(1)} সেমি — প্রকাশিত ন্যূনতম ${required} সেমি পূরণ হচ্ছে (ক্ষুদ্র নৃ-গোষ্ঠীর জন্য শিথিলতা বিজ্ঞপ্তিতে থাকতে পারে)।`,
        }
      : {
          en: `Your height is below the referenced ${required} cm minimum. Only the force medical board decides final fitness — this comparison does not disqualify you officially.`,
          bn: `আপনার উচ্চতা প্রকাশিত ন্যূনতম ${required} সেমির কম। চূড়ান্ত মেডিকেল মূল্যায়ন কেবল বাহিনীর বোর্ড করবে — এই তুলনা অফিসিয়ালভাবে অযোগ্য ঘোষণা করে না।`,
        },
  };
}
