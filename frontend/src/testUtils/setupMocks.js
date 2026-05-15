/** Shared mocks for component tests (CRA / Jest). */
export function mockMatchMedia() {
  const mql = {
    matches: false,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    ...mql,
    media: query,
  }));
}

export function mockResizeObserver() {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
}
