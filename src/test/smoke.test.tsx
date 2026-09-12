/**
 * Smoke tests through the real component tree (jsdom): render the retirement
 * flow, type inputs, calculate, assert result rendering; language default;
 * job-age page renders sourced cards; header has no result-checker/news.
 */
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '../i18n/I18nContext';
import RetirementPage from '../pages/RetirementPage';
import JobAgePage from '../pages/JobAgePage';
import App from '../App';

const dateInput = (label: RegExp) => screen.getByLabelText(label, { selector: 'input[type="date"]' });

function renderWithProviders(ui: React.ReactNode, route = '/retirement') {
  return render(
    <I18nProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </I18nProvider>,
  );
}

describe('retirement flow (integration)', () => {
  it('computes and renders a sourced result for a general employee', async () => {
    renderWithProviders(<RetirementPage />);
    fireEvent.change(dateInput(/জন্মতারিখ/), { target: { value: '1979-05-10' } });
    fireEvent.change(dateInput(/যোগদানের তারিখ/), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/চাকরির খাত/), { target: { value: 'GENERAL' } });
    fireEvent.change(screen.getByLabelText(/উপ-শ্রেণি/), { target: { value: 'general' } });
    fireEvent.click(screen.getByRole('button', { name: /হিসাব করুন/ }));

    const result = await screen.findByTestId('retirement-result');
    expect(result).toBeInTheDocument();
    expect(within(result).getByText(/10 মে 2038/)).toBeInTheDocument();
    expect(within(result).getAllByText(/৫৯|59/).length).toBeGreaterThan(0);
    // the law is cited at least once (rule source card)
    expect(within(result).getAllByText(/সরকারি চাকরি আইন, ২০১৮/).length).toBeGreaterThan(0);
    expect(result.textContent).toMatch(/2026/); // verification date shown (localized)
    expect(result.textContent).toContain('11 বছর 07 মাস 29 দিন');
  });

  it('freedom fighter applies 60 and shows the badge', async () => {
    renderWithProviders(<RetirementPage />);
    fireEvent.change(dateInput(/জন্মতারিখ/), { target: { value: '1979-05-10' } });
    fireEvent.change(screen.getByLabelText(/চাকরির খাত/), { target: { value: 'GENERAL' } });
    fireEvent.click(screen.getByLabelText(/হ্যাঁ — স্ব-পরিচিতে মুক্তিযোদ্ধা/));
    fireEvent.click(screen.getByRole('button', { name: /হিসাব করুন/ }));
    const result = await screen.findByTestId('retirement-result');
    expect(within(result).getByText(/10 মে 2039/)).toBeInTheDocument();
    expect(within(result).getByText(/মুক্তিযোদ্ধা \(৬০ বছর\) বিধান প্রয়োগ হয়েছে/)).toBeInTheDocument();
  });

  it('defence selection refuses to invent a date and shows the mandated message', async () => {
    renderWithProviders(<RetirementPage />);
    fireEvent.change(dateInput(/জন্মতারিখ/), { target: { value: '1985-01-01' } });
    fireEvent.change(screen.getByLabelText(/চাকরির খাত/), { target: { value: 'DEFENCE' } });
    fireEvent.change(screen.getByLabelText(/উপ-শ্রেণি/), { target: { value: 'army' } });
    fireEvent.click(screen.getByRole('button', { name: /হিসাব করুন/ }));
    const result = await screen.findByTestId('retirement-result');
    // army needs a rank — the tool must ask for it instead of guessing
    expect(within(result).getByText(/পদ নির্বাচন করুন/)).toBeInTheDocument();
    expect(result.textContent).not.toMatch(/20\d\d-0?1-0?1/);

    // go back, choose navy (fully manual rule) → the exact mandated sentence
    fireEvent.click(within(result).getByRole('button', { name: 'সম্পাদনা' }));
    fireEvent.change(screen.getByLabelText(/উপ-শ্রেণি/), { target: { value: 'navy' } });
    fireEvent.click(screen.getByRole('button', { name: /হিসাব করুন/ }));
    const navy = await screen.findByTestId('retirement-result');
    expect(within(navy).getByText(/শুধুমাত্র জন্মতারিখ দিয়ে নির্ভুল অবসর তারিখ নির্ধারণ করা যাচ্ছে না।/)).toBeInTheDocument();
    expect(navy.textContent).not.toContain('08 বছর');
  });

  it('shows a friendly error for an impossible/empty date instead of crashing', async () => {
    renderWithProviders(<RetirementPage />);
    fireEvent.change(dateInput(/জন্মতারিখ/), { target: { value: '2025-02-29' } });
    fireEvent.change(screen.getByLabelText(/চাকরির খাত/), { target: { value: 'GENERAL' } });
    fireEvent.click(screen.getByRole('button', { name: /হিসাব করুন/ }));
    // jsdom may sanitize the impossible date to empty — either way a friendly Bangla error appears
    expect(await screen.findByText(/জন্মতারিখ দিন|অবৈধ|৩০ ফেব্রুয়ারি/)).toBeInTheDocument();
    expect(screen.queryByTestId('retirement-result')).toBeNull();
  });
});

describe('job-age flow (integration)', () => {
  it('renders eligibility cards from a DOB', async () => {
    renderWithProviders(<JobAgePage />, '/job-age');
    fireEvent.change(dateInput(/জন্মতারিখ/), { target: { value: '2001-06-15' } });
    fireEvent.click(screen.getByRole('button', { name: /হিসাব করুন/ }));
    await waitFor(() => expect(screen.getAllByRole('listitem').length).toBeGreaterThan(5));
    expect(screen.getAllByText(/২১–৩২|21–32/).length).toBeGreaterThan(0);
    // status symbols present
    const body = document.body.textContent ?? '';
    expect(body).toContain('🟢');
  });
});

describe('app shell', () => {
  it('renders header nav and no result-checker or news links', async () => {
    render(
      <I18nProvider>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </I18nProvider>,
    );
    const header = await screen.findByRole('banner');
    expect(within(header).getByText('বিডি ক্যারিয়ার টুলস')).toBeInTheDocument();
    expect(header.textContent).not.toMatch(/result checker|news/i);
    expect(document.body.textContent).not.toMatch(/ফলাফল চেক|নিউজ পোর্টাল/);
  });
});
