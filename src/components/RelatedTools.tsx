import { useI18n } from '../i18n/I18nContext';
import { CalculatorCard } from './CalculatorCard';
import { SectionTitle } from './ui';

interface Related {
  to: string;
  emoji: string;
  titleKey: string;
  descKey: string;
  badge?: string;
}

export function RelatedTools({ items, title }: { items?: Related[]; title?: string }) {
  const { t } = useI18n();
  const fallback: Related[] = [
    { to: '/retirement', emoji: '🏛️', titleKey: 'footer.retirement', descKey: 'home.card.retirement.d' },
    { to: '/job-age', emoji: '🎯', titleKey: 'footer.jobAge', descKey: 'home.card.jobage.d' },
    { to: '/defence', emoji: '🪖', titleKey: 'footer.defenceCareer', descKey: 'home.card.defence.d' },
    { to: '/tools/bmi', emoji: '💪', titleKey: 'footer.bmi', descKey: 'home.card.fitness.d' },
  ];
  const list = items ?? fallback;
  return (
    <section aria-labelledby="related-h" className="grid gap-4">
      <SectionTitle id="related-h" title={title ?? t('home.tools.title')} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((r) => (
          <CalculatorCard key={r.to} to={r.to} emoji={r.emoji} title={t(r.titleKey)} desc={t(r.descKey)} badge={r.badge} />
        ))}
      </ul>
    </section>
  );
}
