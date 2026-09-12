import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, Card, SectionTitle } from '../components/ui';

function LegalShell({ titleKey, bodyKey, meta }: { titleKey: string; bodyKey: string; meta: string }) {
  const { t } = useI18n();
  usePageMeta(t(titleKey), meta);
  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{t(titleKey)}</h1>
      <Card as="article" className="mt-5 max-w-3xl p-5">
        <SectionTitle title={t(titleKey)} />
        <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">{t(bodyKey)}</p>
      </Card>
    </div>
  );
}

export function DisclaimerPage() {
  return <LegalShell titleKey="footer.disclaimer" bodyKey="disc.full" meta="Legal and information disclaimer for BD Career Tools — an unofficial, educational Bangladesh career calculator." />;
}
export function PrivacyPage() {
  return <LegalShell titleKey="footer.privacy" bodyKey="legal.privacy.body" meta="Privacy: all calculations run locally in your browser; no personal data is collected, stored or transmitted." />;
}
export function TermsPage() {
  return <LegalShell titleKey="footer.terms" bodyKey="legal.terms.body" meta="Terms of use for BD Career Tools." />;
}
export function ContactPage() {
  return <LegalShell titleKey="footer.contact" bodyKey="legal.contact.body" meta="Contact and correction process for BD Career Tools." />;
}
