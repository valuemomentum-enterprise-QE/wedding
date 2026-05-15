import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';

const mockWeddingData = {
  couple: { weddingDate: '2026-08-16', bride: 'JC', groom: 'JD' },
  settings: { exchangeRate: 83.5 },
};

function renderDashboard(weddingData = mockWeddingData) {
  return render(
    <MemoryRouter initialEntries={['/planner']}>
      <Dashboard weddingData={weddingData} plannerPrefix="/planner" />
    </MemoryRouter>
  );
}

describe('Dashboard – functional', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      'tasks',
      JSON.stringify([
        { status: 'completed' },
        { status: 'completed' },
        { status: 'completed' },
        ...Array(36).fill({ status: 'not-started' }),
      ])
    );
    localStorage.setItem('events', JSON.stringify(Array(11).fill({})));
    localStorage.setItem('guests', JSON.stringify([
      ...Array(7).fill({ rsvpStatus: 'yes' }),
      ...Array(81).fill({ rsvpStatus: 'pending' }),
    ]));
    localStorage.setItem(
      'budgetItems',
      JSON.stringify([{ estimatedCost: 7000, actualCost: 0, currency: 'USD' }])
    );
  });

  it('renders hero with countdown and wedding date', () => {
    renderDashboard();
    expect(screen.getByText(/Days Until Your Big Day/i)).toBeInTheDocument();
    expect(screen.getByText(/August 16th, 2026/i)).toBeInTheDocument();
  });

  it('shows task completion stats from localStorage', async () => {
    renderDashboard();
    await waitFor(() => {
      const label = screen.getByText('Tasks Completed');
      expect(label.previousElementSibling).toHaveTextContent('3/39');
    });
    expect(screen.getByText('8%')).toBeInTheDocument();
  });

  it('shows guest RSVP stats', async () => {
    renderDashboard();
    await waitFor(() => {
      const label = screen.getByText('Guests Confirmed');
      expect(label.previousElementSibling).toHaveTextContent('7/88');
    });
  });

  it('shows events count', async () => {
    renderDashboard();
    await waitFor(() => {
      const label = screen.getByText('Events Planned');
      expect(label.previousElementSibling).toHaveTextContent('11');
    });
  });

  it('links View Tasks to /tasks', () => {
    renderDashboard();
    const link = screen.getByRole('link', { name: /view tasks/i });
    expect(link).toHaveAttribute('href', '/planner/tasks');
  });

  it('links Browse Decor Ideas to /decorations', () => {
    renderDashboard();
    const link = screen.getByRole('link', { name: /browse decor ideas/i });
    expect(link).toHaveAttribute('href', '/planner/decorations');
  });

  it('renders priority tasks section', async () => {
    localStorage.setItem(
      'tasks',
      JSON.stringify([
        {
          id: '1',
          title: 'Finalize wedding venue',
          category: 'Venue',
          dueDate: '2026-04-12',
          priority: 'high',
          status: 'not-started',
        },
      ])
    );
    renderDashboard();
    expect(screen.getByText('Priority Tasks')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Finalize wedding venue')).toBeInTheDocument();
    });
  });
});

describe('Dashboard – non-functional', () => {
  beforeEach(() => localStorage.clear());

  it('renders primary heading once', () => {
    renderDashboard();
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
  });

  it('mounts within acceptable time', () => {
    const start = performance.now();
    renderDashboard();
    expect(performance.now() - start).toBeLessThan(3000);
  });

  it('handles empty localStorage without crashing', async () => {
    expect(() => renderDashboard()).not.toThrow();
    await waitFor(() => {
      const label = screen.getByText('Tasks Completed');
      expect(label.previousElementSibling).toHaveTextContent('0/0');
    });
  });
});
