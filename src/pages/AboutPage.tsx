import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, Card, SectionTitle, Button } from '../components/ui';

export default function AboutPage() {
  const { t, lang } = useI18n();
  usePageMeta(
    lang === 'bn' ? 'পরিচিতি | BD Career Tools' : 'About | BD Career Tools',
    'About this educational Bangladesh career calculator project: research methodology, data governance, tech stack and limitations.',
  );
  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">ℹ️ {t('about.title')}</h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">{t('about.school')}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section" className="p-5">
          <SectionTitle title={t('about.method.title')} sub={t('about.method')} />
        </Card>
        <Card as="section" className="p-5">
          <SectionTitle title={lang === 'bn' ? 'যা এই টুল করবে না' : 'What this tool will NOT do'} />
          <ul className="grid gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            <li>🚫 {lang === 'bn' ? 'নিশ্চিত নিয়ম না পেয়ে কখনো অবসরের তারিখ বানাবে না।' : 'Never fabricate a retirement date when no firm rule exists.'}</li>
            <li>🚫 {lang === 'bn' ? 'বাহিনীর নিয়োগ-মানদণ্ডকে BMI/BMR দিয়ে বদল করবে না।' : 'Never substitute BMI/BMR for force physical standards.'}</li>
            <li>🚫 {lang === 'bn' ? 'বেসরকারি খাতে “আইনি বয়সসীমা” দাবি করবে না (কারণ তা নেই)।' : 'Never claim a universal legal age limit in the private sector (there is none).'}</li>
            <li>🚫 {lang === 'bn' ? 'ব্যক্তিগত কোনো তথ্য সংরক্ষণ/প্রেরণ করবে না।' : 'Never store or transmit personal data.'}</li>
          </ul>
        </Card>
        <Card as="section" className="p-5">
          <SectionTitle title={lang === 'bn' ? 'প্রযুক্তি' : 'Technology'} sub={t('about.tech')} />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {lang === 'bn'
              ? 'রিপোতে বিস্তারিত সেটআপ ও ডিপ্লয়মেন্ট নির্দেশনা আছে (README.md) এবং পুরো গবেষণা-বিবরণী আছে RESEARCH.md-এ।'
              : 'The repository ships setup & deployment notes (README.md) and the full research methodology (RESEARCH.md).'}
          </p>
        </Card>
        <Card as="section" className="p-5">
          <SectionTitle title={lang === 'bn' ? 'ডেটা আপডেট' : 'Keeping data fresh'} sub={t('footer.made')} />
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {lang === 'bn'
              ? 'নিয়ম-ভিত্তিক সব তথ্য src/data/ ফাইলে (retirementRules, jobAgeRules, defenceRules, sources)। সূত্র বদলালে শুধু ওই ফাইল আপডেট হবে — প্রতিটি রেকর্ডের verifiedDate ফিল্ড কত পুরোনো তা দেখায়।'
              : 'All rule data lives in src/data (retirementRules, jobAgeRules, defenceRules, sources). When a rule changes, only those files need updating — every record’s verifiedDate shows how fresh it is.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/rules"><Button variant="outline">{t('nav.rules')} →</Button></Link>
            <Link to="/disclaimer"><Button variant="ghost">{t('footer.disclaimer')}</Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
