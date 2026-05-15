import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navigation } from './Navigation';

const mockWeddingData = {
  couple: { weddingDate: '2026-08-16', bride: 'JC', groom: 'JD' },
};

const PREFIX = '/planner';

function renderNav(path = PREFIX, weddingData = mockWeddingData) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navigation weddingData={weddingData} plannerPrefix={PREFIX} />
    </MemoryRouter>
  );
}

describe('Navigation – functional', () => {
  it('displays wedding date from weddingData', () => {
    renderNav();
    expect(screen.getAllByText('August 16, 2026').length).toBeGreaterThan(0);
  });

  it('renders planner nav links with prefix', () => {
    renderNav();
    expect(screen.getAllByRole('link', { name: /dashboard/i }).length).toBeGreaterThan(0);
    const tasksLink = screen.getAllByRole('link', { name: /^tasks$/i })[0];
    expect(tasksLink).toHaveAttribute('href', '/planner/tasks');
  });

  it('highlights active route under /planner', () => {
    renderNav(`${PREFIX}/tasks`);
    const tasksLinks = screen.getAllByRole('link', { name: /^tasks$/i });
    const activeLink = tasksLinks.find((el) => el.className.includes('bg-primary'));
    expect(activeLink).toBeTruthy();
  });

  it('shows South Indian Wedding branding', () => {
    renderNav();
    expect(screen.getAllByText('South Indian Wedding').length).toBeGreaterThan(0);
  });
});
