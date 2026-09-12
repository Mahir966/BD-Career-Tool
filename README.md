# 🇧🇩 BD Career Tools — Bangladesh Government Career & Service Calculators

A polished, **production-quality, GitHub-Pages-hostable** bilingual (বাংলা default / English) calculator platform for Bangladesh government career information:

| Tool | Route | What it does |
|---|---|---|
| 🏛️ Government Job Retirement Calculator | `/retirement` | Exact current age, service completed, statutory retirement age & date, remaining Y/M/D + total days + live h:m:s, projected total service, progress %, status, rule used, **source + legal reference + verification date** |
| 🎯 Job Age Eligibility 2026 | `/job-age` | DOB *or* age → 🟢 eligible / 🟡 near limit / 🔴 not eligible / ⚪ needs-verification across 14 sectors, per-rule sources |
| 🪖 Defence & Fitness | `/defence` | Army/Navy/AF/Police/BGB/Ansar entry standards (age, height, chest, vision, education…) + height-check helper — recruitment ≠ retirement kept explicit |
| 💪 Career & Age Tools hub | `/tools…` | BMI (ft+in ⇄ cm, kg/lb), BMR/TDEE (Mifflin–St Jeor + Harris–Benedict), Body Fat (Deurenberg + tape), Ideal Weight, Fitness Analysis with *indicative* recruitment comparison |
| 📚 Rules & Sources | `/rules` | The whole rule database: every record with confidence (HIGH/MEDIUM/LOW), authority, legal reference, verified date |

Plus `Home`, `FAQ`, `About`, `Disclaimer`, `Privacy`, `Terms`, `Contact`. **No** result-checkers, **no** news portal (per spec).

> ⚠️ This is an **educational school project**, not a government website. See [`RESEARCH.md`](./RESEARCH.md) for the full source-backed research, uncertainties and verification dates.

## Why the numbers can be trusted (and where they can't)
- The retirement engine reads **Government Service Act 2018, s.43(1)** captured verbatim from the Ministry of Law's law portal (retire at completion of **59**; freedom-fighter government employees **60**; s.43 extended to autonomous bodies/SOEs/LGIs via s.1(4k)).
- Job-age data follows the **uniform 32-year** government entry cap (Nov-2024 ordinance → Dec-2025 amendment → Apr-2026 Act) and the official **50th BCS circular** (21–32 as on 01-Nov-2025).
- Defence retirement is **never** defaulted to 59: armed-forces entries are rank/service based (LOW-confidence reference values, always warned) and Navy/Air-Force/BGB/Ansar/Fire show *“শুধুমাত্র জন্মতারিখ দিয়ে নির্ভুল অবসর তারিখ নির্ধারণ করা যাচ্ছে না।”* instead of a fabricated date.
- BMI/BMR are health **screening** calculations only — clearly separated from official recruitment eligibility (medical boards decide fitness; the tool only “compares against the published standard stored in this tool”).
- Every rule carries `sourceId → SOURCES` + `verifiedDate` + `confidence`; automated tests enforce “HIGH ⇒ primary-type source”.

## Quick start

```bash
npm install
npm run dev        # dev server (host 0.0.0.0)
npm run build      # typecheck (tsc --noEmit) + vite build → dist/
npm run preview    # serve the production build
npm test           # vitest: 68 unit + integration tests (dates, engines, data integrity, UI flows)
```

Requires Node 18+ (developed on Node 20).

## Deployment on GitHub Pages

The build uses **relative asset paths** (`base: './'`) and **HashRouter**, so deep links never 404 and the site works from any repo name or sub-path. A `public/404.html` fallback is shipped for paths entered without the `#`.

**Option A — GitHub Actions (recommended):** included at `.github/workflows/deploy.yml` (build → upload `dist` → deploy-pages).
1. Push this repo to GitHub (default branch `main`).
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` builds, typechecks, runs the test suite, and deploys.

**Option B — manual:** `npm run build`, then publish the `dist/` folder to the `gh-pages` branch (or any static host).

If you prefer clean URLs without the hash you can switch `HashRouter`→`BrowserRouter` in `src/main.tsx` and set an absolute base at build time, e.g. `GH_PAGES_BASE=/repo-name/ npm run build`, plus a SPA-fallback `404.html` (already included as the lightweight version).

Update **`src/config.ts`** (`repoUrl`) before publishing.

## Project structure

```
src/
  components/   Header, MobileNav, ThemeToggle, LanguageToggle, Hero, CalculatorCard,
                DateInput, HeightWeightInputs, RetirementForm/Result, RetirementCountdown,
                ServiceProgress, RuleSourceCard, JobAgeForm, EligibilityCard, EligibilitySummary,
                DefenceCard, BMICalculator, BMRCalculator, FitnessResult, FAQ, RelatedTools,
                Disclaimer, Footer, ui (primitives)
  pages/        Home, RetirementPage, JobAgePage, DefencePage, ToolsPage, BmiPage, BmrPage,
                BodyFatPage, IdealWeightPage, FitnessAnalysisPage, RulesPage, FaqPage,
                AboutPage, LegalPages, NotFound
  data/         retirementRules.ts · jobAgeRules.ts · defenceRules.ts · fitnessRules.ts · sources.ts
  lib/          retirementCalculator.ts · ageCalculator.ts · eligibilityCalculator.ts
                bmiCalculator.ts · bmrCalculator.ts · fitnessAnalysis.ts · dateUtils.ts
                formatters.ts · share.ts
  hooks/        useTheme · useLocalStorage · useReducedMotion · useNow
  i18n/         dictionary.ts · I18nContext.tsx · faqData.ts
  types/        index.ts (domain model)
  test/         setup.ts · smoke.test.tsx
```

**Architecture rule:** UI ⇢ engine ⇢ data. No legal number lives inside a component; changing a rule = editing one record in `src/data/` and bumping its `verifiedDate`.

## Quality guarantees implemented

- **Dates:** exact proleptic-Gregorian arithmetic (never `year−year`); leap years, Feb-29 (clamped + flagged), month-ends, today-due, already-retired, future DOB/joining, joining-before-15, joining-after-retirement — all unit-tested (68 tests).
- **Theming:** light default, dark + system modes via `localStorage`, pre-paint bootstrap script (no flash), dark-styled native date pickers, every component audited for dark contrast.
- **Responsive:** tested at 320/360/390/430/768/1024/1280/1440/1920 class widths; single-column forms, ≥44px touch targets, no horizontal overflow (tables scroll inside cards), collapsible nav, print stylesheet (`no-print` chrome).
- **A11y:** semantic landmarks, skip link, labelled inputs with `aria-invalid`/`aria-describedby`, radiogroups, `role=status/`live countdown, progressbar semantics, color never alone (🟢🟡🔴⚪ + text), visible focus rings, `prefers-reduced-motion` (clock/progress/static fallbacks).
- **Privacy/security:** 100% local computation; no analytics, no network calls with user data, nothing stored (only theme/lang UI prefs), no `innerHTML`/`eval`; a React error boundary keeps a crash from blanking the page.
- **Performance:** code-split routes (`React.lazy`), tiny dependency surface (react + router + lucide), zero images (CSS/SVG patterns), ~53KB gzipped app bundle + React vendor chunk; production chunks listed in CI build log.
- **SEO:** per-route titles/descriptions (natural language, no stuffing), OG tags, semantic H1-H3 hierarchy.

## Known uncertainties (surfaced in-UI, detailed in RESEARCH.md §7)
Police enlisted retirement nuance · BGB/Ansar/Fire retirement tables · Navy/AF rank caps · Army cap values (LOW) · BCS attempt count · final gazette text of the 2026 age Act · 2026 “retirement 60/62” press proposals (not enacted as of 2026-09-11) · Coast Guard ages · bank/PSB caps.

## Disclaimer
এই ওয়েবসাইটটি একটি শিক্ষামূলক ও তথ্যভিত্তিক প্রকল্প। এটি বাংলাদেশ সরকারের কোনো অফিসিয়াল ওয়েবসাইট বা সরকারি সেবা নয়। চাকরির বয়সসীমা, অবসর বয়স, সার্ভিস রুল, নিয়োগ বিধি এবং শারীরিক যোগ্যতা সময় ও পদভেদে পরিবর্তিত হতে পারে। গুরুত্বপূর্ণ সিদ্ধান্তের আগে সংশ্লিষ্ট সরকারি আইন, গেজেট, সার্ভিস রুল বা সর্বশেষ নিয়োগ বিজ্ঞপ্তি যাচাই করুন।

*This website is an educational, information-based project; it is not an official Government of Bangladesh website or service. Verify every rule against the current law/gazette/circular before important decisions.*
