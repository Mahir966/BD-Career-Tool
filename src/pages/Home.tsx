import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, SectionTitle } from '../components/ui';
import { Hero } from '../components/Hero';
import { CalculatorCard } from '../components/CalculatorCard';
import { FAQ } from '../components/FAQ';
import { RelatedTools } from '../components/RelatedTools';
import { DisclaimerNote } from '../components/Disclaimer';

export default function Home() {
  const { t, lang } = useI18n();
  usePageMeta(
    lang === 'bn'
      ? 'বাংলাদেশ সরকারি চাকরি ও অবসর ক্যালকুলেটর | BD Career Tools'
      : 'Bangladesh Government Career & Retirement Calculators',
    'Free Bangladesh government job retirement calculator, job age eligibility for 2026, defence & fitness tools — every rule sourced and date-verified. Runs fully in your browser.',
  );

  return (
    <div>
      <Hero />

      <div className="mx-auto max-w-page px-4 py-12">
        <section aria-labelledby="pick-h" className="mb-12">
          <SectionTitle id="pick-h" title={`🧮 ${t('home.pick')}`} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li className="list-none">
              <CalculatorCard to="/retirement" emoji="🏛️" title={t('home.card.retirement')} desc={t('home.card.retirement.d')} badge="59 / 60" primary />
            </li>
            <li className="list-none">
              <CalculatorCard to="/job-age" emoji="🎯" title={t('home.card.jobage')} desc={t('home.card.jobage.d')} badge={lang === 'bn' ? '২০২৬' : '2026'} />
            </li>
            <li className="list-none">
              <CalculatorCard to="/defence" emoji="🪖" title={t('home.card.defence')} desc={t('home.card.defence.d')} />
            </li>
            <li className="list-none">
              <CalculatorCard to="/tools" emoji="💪" title={t('home.card.fitness')} desc={t('home.card.fitness.d')} />
            </li>
          </ul>
        </section>

        <section aria-labelledby="why-h" className="mb-12 grid gap-4 rounded-2xl border border-emerald-900/10 bg-gradient-to-b from-emerald-50/60 to-transparent p-5 sm:p-7 dark:border-emerald-400/15 dark:from-emerald-500/5">
          <div>
            <SectionTitle id="why-h" title={t('home.why.title')} sub={t('home.method.body')} />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[t('home.why.1'), t('home.why.2'), t('home.why.3'), t('home.why.4')].map((x, i) => (
              <li key={i} className="flex items-start gap-2.5 rounded-xl bg-white/80 p-3.5 text-sm font-medium leading-relaxed text-slate-700 shadow-sm dark:bg-slate-900/60 dark:text-slate-200">
                <span aria-hidden className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 font-mono text-xs font-bold text-white">
                  {i + 1}
                </span>
                {x}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <RelatedTools />
        </section>

        <section className="mb-12">
          <FAQ compact />
        </section>

        <section className="rounded-2xl bg-emerald-950 p-6 text-emerald-50 sm:p-8">
          <h2 className="text-lg font-extrabold sm:text-xl">{t('rules.title')}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-100/90">{t('rules.intro')}</p>
          <Link to="/rules" className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-emerald-900 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            {t('rules.tab.sources')} <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </section>

        <div className="mt-10">
          <DisclaimerNote />
        </div>
      </div>
    </div>
  );
}
