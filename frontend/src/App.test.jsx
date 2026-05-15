import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('./components/ui/sonner', () => ({
  Toaster: () => null,
}));

import App from './App';

describe('App – public landing', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('shows landing page at root', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/RSVP Here/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/A WHIRLWIND ROMANCE/i)).toBeInTheDocument();
    expect(screen.queryByText(/Couple login/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Open menu/i)).toBeInTheDocument();
  });

  it('initializes wedding data in localStorage', async () => {
    render(<App />);
    await waitFor(() => {
      expect(localStorage.getItem('weddingPlannerData')).toBeTruthy();
    });
    const saved = JSON.parse(localStorage.getItem('weddingPlannerData'));
    expect(saved.couple.weddingDate).toBe('2026-08-16');
  });
});

describe('App – protected planner', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('redirects unauthenticated users from planner to login', async () => {
    window.history.pushState({}, '', '/planner');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/COUPLE LOGIN/i)).toBeInTheDocument();
    });
  });
});
