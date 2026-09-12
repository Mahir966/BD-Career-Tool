import { useSearchParams } from 'react-router-dom';
import { Library } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { usePageMeta, Card, ConfidencePill, SectionTitle } from '../components/ui';
import { RETIREMENT_RULES } from '../data/retirementRules';
import { JOB_AGE_RULES } from '../data/jobAgeRules';
import { DEFENCE_RULES, FORCE_LABELS } from '../data/defenceRules';
import { SOURCES } from '../data/sources';
import { sourceById } from '../data/sources';
import { DisclaimerNote } from '../components/Disclaimer';

type Tab = 'retirement' | 'job' | 'defence' | 'sources';

export default function RulesPage() {
  const { t, tl, lang } = useI18n();
  usePageMeta(
    lang === 'bn' ? 'নিয়ম ও উৎস ডেটাবেস | Rules & Sources' : 'Rules & Sources Database',
    'The complete rule database behind the calculators: retirement rules, recruitment age limits, defence standards and the source registry with authority, legal references and verification dates.',
  );
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as Tab) || 'retirement';

  const tabs: { key: Tab; label: string }[] = [
    { key: 'retirement', label: t('rules.tab.retirement') },
    { key: 'job', label: t('rules.tab.job') },
    { key: 'defence', label: t('rules.tab.defence') },
    { key: 'sources', label: t('rules.tab.sources') },
  ];

  const th = 'px-2 py-1.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400';
  const td = 'px-2 py-2 align-top text-[13px] text-slate-700 dark:text-slate-200';
  const srcLink = (id: string) => {
    const s = sourceById(id);
    if (!s) return id;
    return (
      <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-300">
        {lang === 'bn' ? 'উৎস' : 'Source'}
      </a>
    );
  };

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:py-10">
      <header className="mb-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/25 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Library aria-hidden className="h-3.5 w-3.5" /> 📚 {t('nav.rules')}
        </p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{t('rules.title')}</h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">{t('rules.intro')}</p>
        <p className="mt-2 rounded-lg bg-slate-900/5 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">{t('rules.hierarchy')}</p>
      </header>

      <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label={t('nav.rules')}>
        {tabs.map((x) => (
          <button
            key={x.key}
            role="tab"
            aria-selected={tab === x.key}
            onClick={() => setParams({ tab: x.key })}
            className={`min-h-[40px] rounded-full px-4 text-sm font-bold ${
              tab === x.key ? 'bg-emerald-700 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto p-3 sm:p-4">
        {tab === 'retirement' ? (
          <table className="w-full border-collapse">
            <caption className="sr-only">{t('rules.tab.retirement')}</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>{lang === 'bn' ? 'বিষয়' : 'Rule'}</th>
                <th scope="col" className={th}>{lang === 'bn' ? 'গণনা ধরন' : 'Type'}</th>
                <th scope="col" className={th}>{lang === 'bn' ? 'বয়স' : 'Age'}</th>
                <th scope="col" className={th}>{t('common.source')}</th>
                <th scope="col" className={th}>{t('common.confidence')}</th>
                <th scope="col" className={th}>{t('ret.lastVerified')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {RETIREMENT_RULES.map((r) => (
                <tr key={r.id}>
                  <td className={td}>
                    <span className="font-bold">{tl(r.name)}</span>
                    <span className="block text-xs text-slate-500">{tl(r.institution)}</span>
                  </td>
                  <td className={`${td} font-mono text-[11px]`}>{r.calculationType}</td>
                  <td className={td}>
                    {r.retirementAge ?? '—'}
                    {r.freedomFighterRetirementAge ? <span className="text-emerald-700 dark:text-emerald-300"> / FF {r.freedomFighterRetirementAge}</span> : null}
                  </td>
                  <td className={td}>{srcLink(r.sourceId)}</td>
                  <td className={td}><ConfidencePill confidence={r.confidence} /></td>
                  <td className={`${td} font-mono tabular-nums`}>{r.verifiedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {tab === 'job' ? (
          <table className="w-full border-collapse">
            <caption className="sr-only">{t('rules.tab.job')}</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>{lang === 'bn' ? 'পদ' : 'Post'}</th>
                <th scope="col" className={th}>{lang === 'bn' ? 'বয়সসীমা' : 'Age'}</th>
                <th scope="col" className={th}>{lang === 'bn' ? 'রেফারেন্স' : 'As-on'}</th>
                <th scope="col" className={th}>{t('common.source')}</th>
                <th scope="col" className={th}>{t('common.confidence')}</th>
                <th scope="col" className={th}>{t('ret.lastVerified')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {JOB_AGE_RULES.map((r) => (
                <tr key={r.id}>
                  <td className={td}>
                    <span className="font-bold">{tl(r.jobTitle)}</span>
                    {r.marketPractice ? <span className="ml-1 rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-slate-700 dark:text-slate-300">{lang === 'bn' ? 'প্রচলন' : 'practice'}</span> : null}
                  </td>
                  <td className={`${td} font-mono`}>{r.minimumAge ?? '?'}–{r.maximumAge ?? '?'}{r.specialAgeRules?.freedomFighter ? ` (+FF ${r.specialAgeRules.freedomFighter})` : ''}</td>
                  <td className={`${td} font-mono text-[11px]`}>{r.asOfDate ?? '—'}</td>
                  <td className={td}>{srcLink(r.sourceId)}</td>
                  <td className={td}><ConfidencePill confidence={r.confidence} /></td>
                  <td className={`${td} font-mono tabular-nums`}>{r.verifiedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {tab === 'defence' ? (
          <table className="w-full border-collapse">
            <caption className="sr-only">{t('rules.tab.defence')}</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>{lang === 'bn' ? 'বাহিনী — এন্ট্রি' : 'Force — entry'}</th>
                <th scope="col" className={th}>{lang === 'bn' ? 'বয়স' : 'Age'}</th>
                <th scope="col" className={th}>{lang === 'bn' ? 'উচ্চতা (সেমি)' : 'Height (cm)'}</th>
                <th scope="col" className={th}>{lang === 'bn' ? 'বিজ্ঞপ্তি' : 'Circular'}</th>
                <th scope="col" className={th}>{t('common.confidence')}</th>
                <th scope="col" className={th}>{t('ret.lastVerified')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DEFENCE_RULES.map((r) => (
                <tr key={r.id}>
                  <td className={td}>
                    <span className="font-bold">{tl(r.entryType)}</span>
                    <span className="block text-xs text-slate-500">{tl(FORCE_LABELS[r.force])}</span>
                  </td>
                  <td className={`${td} font-mono`}>{r.minimumAge ?? '?'}–{r.maximumAge ?? '?'}</td>
                  <td className={`${td} font-mono text-[11px]`}>
                    {r.physical.heightMaleCm ? `♂ ${r.physical.heightMaleCm}` : ''}
                    {r.physical.heightFemaleCm ? ` · ♀ ${r.physical.heightFemaleCm}` : ''}
                  </td>
                  <td className={`${td} font-mono text-[11px]`}>{r.circularDate ?? '—'}</td>
                  <td className={td}><ConfidencePill confidence={r.confidence} /></td>
                  <td className={`${td} font-mono tabular-nums`}>{r.verifiedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {tab === 'sources' ? (
          <ol className="grid gap-2.5 p-1">
            {SOURCES.map((s, i) => (
              <li key={s.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {i + 1}. {tl(s.title)}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">{s.type.replace(/_/g, ' ')}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {tl(s.authority)} · {s.publicationDate} · {t('common.verified')}: <span className="font-mono">{s.verifiedDate}</span> ·{' '}
                  <a className="font-bold text-emerald-700 hover:underline dark:text-emerald-300" href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.url}
                  </a>
                </p>
                {s.notes ? <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{tl(s.notes)}</p> : null}
              </li>
            ))}
          </ol>
        ) : null}
      </Card>

      <SectionTitle title={lang === 'bn' ? 'আস্থার ব্যাখ্যা' : 'Confidence explained'} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4 text-sm"><ConfidencePill confidence="HIGH" /><p className="mt-2 text-slate-600 dark:text-slate-300">{lang === 'bn' ? 'বর্তমান অফিসিয়াল প্রাইমারি সূত্র থেকে সরাসরি যাচাইকৃত। বি: — সরকারি চাকরি আইন ২০১৮-এর মূল পাঠ।' : 'Directly verified from a current official primary source (e.g. the Gazette text of the Government Service Act 2018).'}</p></Card>
        <Card className="p-4 text-sm"><ConfidencePill confidence="MEDIUM" /><p className="mt-2 text-slate-600 dark:text-slate-300">{lang === 'bn' ? 'একাধিক নির্ভরযোগ্য সূত্র, কিন্তু পূর্ণাঙ্গ প্রাইমারি নথি পাওয়া যায়নি (যেমন পত্রিকায় প্রকাশিত বিজ্ঞপ্তি সারাংশ)।' : 'Multiple reliable sources but the official primary document was not fully captured (e.g. press-reported circulars).'}</p></Card>
        <Card className="p-4 text-sm"><ConfidencePill confidence="LOW" /><p className="mt-2 text-slate-600 dark:text-slate-300">{lang === 'bn' ? 'শুধু মাধ্যমিক সূত্র — ফলাফলে সতর্কতা দেখানো হয়; সিদ্ধান্তে ব্যবহারের আগে যাচাই বাধ্যতামূলক।' : 'Secondary source only — results carry a warning; verification before any decision is mandatory.'}</p></Card>
      </div>

      <div className="mt-8">
        <DisclaimerNote />
      </div>
    </div>
  );
}
