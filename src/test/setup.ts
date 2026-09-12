import '@testing-library/jest-dom/vitest';

// jsdom lacks matchMedia — theme hook & reduced-motion hook need it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

if (!('scrollIntoView' in Element.prototype)) {
  (Element.prototype as unknown as { scrollIntoView?: () => void }).scrollIntoView = () => {};
} else {
  Element.prototype.scrollIntoView = () => {};
}
