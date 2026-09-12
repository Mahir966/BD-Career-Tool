import { Wrench } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, SectionTitle } from '../components/ui';
import { CalculatorCard } from '../components/CalculatorCard';
import { DisclaimerNote } from '../components/Disclaimer';

export default function ToolsPage() {
  const { t, lang } = useI18n();
  usePageMeta(
    lang === 'bn' ? 'ক্যারিয়ার ও এজ টুলস | BD Career Tools' : 'Career & Age Tools | BD Career Tools',
    'Modular Bangladesh career & age tools: retirement, job-age, BCS, defence, police, BMI, BMR, body fat, ideal weight — all locally computed with sourced rules.',
  );

  const career = [
    { to: '/retirement', emoji: '🏛️', titleKey: 'home.card.retirement', descKey: 'home.card.retirement.d', primary: true },
    { to: '/job-age', emoji: '🎯', titleKey: 'home.card.jobage', descKey: 'home.card.jobage.d' },
    { to: '/job-age?category=GOVERNMENT', emoji: '📋', titleKey: 'footer.bcsAge', descKey: 'job.note32' },
    { to: '/defence?force=ARMY', emoji: '🪖', titleKey: 'footer.defenceCareer', descKey: 'home.card.defence.d' },
    { to: '/defence?force=POLICE', emoji: '👮', titleKey: 'footer.policeCareer', descKey: 'def.retirementNote' },
    { to: '/rules?tab=retirement', emoji: '📚', titleKey: 'footer.retRules', descKey: 'rules.intro' },
  ];
  const fitness = [
    { to: '/tools/bmi', emoji: '📏', titleKey: 'fit.bmi', descKey: 'fit.bmi.d' },
    { to: '/tools/bmr', emoji: '🔥', titleKey: 'fit.bmr', descKey: 'fit.bmr.d' },
    { to: '/tools/body-fat', emoji: '⚖️', titleKey: 'fit.bf', descKey: 'fit.bf.d' },
    { to: '/tools/ideal-weight', emoji: '🎯', titleKey: 'fit.iw', descKey: 'fit.iw.d' },
    { to: '/tools/fitness-analysis', emoji: '💪', titleKey: 'fit.analysis', descKey: 'fit.analysis.d' },
    { to: '/defence', emoji: '🛡️', titleKey: 'nav.defence', descKey: 'def.checker.d' },
  ];

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <header className="mb-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/25 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Wrench aria-hidden className="h-3.5 w-3.5" /> 🧮 {t('nav.tools')}
        </p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{t('tools.title')}</h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">{t('tools.intro')}</p>
      </header>

      <section aria-label={t('tools.group.career')} className="mb-8">
        <SectionTitle title={`🧭 ${t('tools.group.career')}`} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {career.map((c) => (
            <li key={c.to} className="list-none">
              <CalculatorCard to={c.to} emoji={c.emoji} title={t(c.titleKey)} desc={t(c.descKey)} primary={c.primary} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-label={t('tools.group.fitness')} className="mb-8">
        <SectionTitle title={`💪 ${t('tools.group.fitness')} · ${t('tools.group.defence')}`} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fitness.map((c) => (
            <li key={c.to} className="list-none">
              <CalculatorCard to={c.to} emoji={c.emoji} title={t(c.titleKey)} desc={t(c.descKey)} />
            </li>
          ))}
        </ul>
      </section>

      <DisclaimerNote />
    </div>
  );
}
