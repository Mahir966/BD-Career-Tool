import { useI18n } from '../i18n/I18nContext';
import { usePageMeta } from '../components/ui';
import { FAQ } from '../components/FAQ';
import { RelatedTools } from '../components/RelatedTools';
import { DisclaimerNote } from '../components/Disclaimer';

export default function FaqPage() {
  const { t, lang } = useI18n();
  usePageMeta(
    lang === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ) | BD Career Tools' : 'FAQ | BD Career Tools',
    'Frequently asked questions about Bangladesh government retirement rules, job age limits, defence standards and how this calculator sources its data.',
  );
  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">❓ {t('nav.faq')}</h1>
      <div className="mt-6">
        <FAQ />
      </div>
      <div className="mt-10">
        <RelatedTools title={lang === 'bn' ? 'সম্পর্কিত টুল' : 'Related tools'} />
      </div>
      <div className="mt-8">
        <DisclaimerNote />
      </div>
    </div>
  );
}
