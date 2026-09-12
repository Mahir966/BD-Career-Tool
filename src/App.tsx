import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DisclaimerBanner } from './components/Disclaimer';
import { ContactPage, DisclaimerPage, PrivacyPage, TermsPage } from './pages/LegalPages';

const Home = lazy(() => import('./pages/Home'));
const RetirementPage = lazy(() => import('./pages/RetirementPage'));
const JobAgePage = lazy(() => import('./pages/JobAgePage'));
const DefencePage = lazy(() => import('./pages/DefencePage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const BmiPage = lazy(() => import('./pages/BmiPage'));
const BmrPage = lazy(() => import('./pages/BmrPage'));
const BodyFatPage = lazy(() => import('./pages/BodyFatPage'));
const IdealWeightPage = lazy(() => import('./pages/IdealWeightPage'));
const FitnessAnalysisPage = lazy(() => import('./pages/FitnessAnalysisPage'));
const RulesPage = lazy(() => import('./pages/RulesPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageFallback() {
  return (
    <div className="mx-auto flex max-w-page items-center gap-2 px-4 py-24 text-sm font-semibold text-slate-500 dark:text-slate-400" role="status" aria-live="polite">
      <Loader2 aria-hidden className="h-4 w-4 animate-spin motion-reduce:animate-none" /> …
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7faf8] text-slate-900 antialiased selection:bg-emerald-700/20 dark:bg-slate-950 dark:text-slate-100">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-emerald-700 focus:px-3 focus:py-2 focus:text-sm focus:font-bold focus:text-white">
        <span lang="bn">মূল কনটেন্টে যান</span> / Skip to main content
      </a>
      <DisclaimerBanner />
      <Header />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/retirement" element={<RetirementPage />} />
            <Route path="/job-age" element={<JobAgePage />} />
            <Route path="/defence" element={<DefencePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/bmi" element={<BmiPage />} />
            <Route path="/tools/bmr" element={<BmrPage />} />
            <Route path="/tools/body-fat" element={<BodyFatPage />} />
            <Route path="/tools/ideal-weight" element={<IdealWeightPage />} />
            <Route path="/tools/fitness-analysis" element={<FitnessAnalysisPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
