import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { I18nProvider } from './i18n/I18nContext';
import './styles/index.css';

// Error boundary: never let a broken calculation blank the whole page.
class Boundary extends React.Component<{ children: React.ReactNode }, { error?: Error }> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    // keep it local: console only — nothing is transmitted
    console.error('UI error:', error);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui', lineHeight: 1.6 }}>
          <h1 style={{ fontSize: 18 }}>কিছু একটা ভুল হয়েছে / Something went wrong</h1>
          <p style={{ fontSize: 14, opacity: 0.8 }}>
            পেজটি রিফ্রেশ করুন। ফলাফল সংরক্ষিত হয় না — কোনো তথ্য হারায় না। Refresh the page — no data is lost.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 12, padding: '10px 16px', borderRadius: 10, border: 'none', background: '#006a4e', color: 'white', fontWeight: 700, cursor: 'pointer' }}
          >
            রিফ্রেশ / Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Boundary>
      <I18nProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </I18nProvider>
    </Boundary>
  </React.StrictMode>,
);
