import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';

const mockWeddingData = {
  couple: { weddingDate: '2026-08-16', bride: 'JC', groom: 'JD' },
  settings: { exchangeRate: 83.5 },
};

const mockTasks = [
  { status: 'completed' },
  { status: 'completed' },
  { status: 'completed' },
  ...Array(36).fill({ status: 'not-started' }),
];

const mockBudget = [{ estimatedCost: 7000, actualCost: 0, currency: 'USD' }];

function mockJsonResponse(body) {
  return {
    ok: true,
    status: 200,
    text: () => Promise.resolve(JSON.stringify(body)),
  };
}

const mockEvents = Array(11).fill({ date: '2026-08-16' });

const mockGuests = [
  ...Array(7).fill({ rsvpStatus: 'yes' }),
  ...Array(81).fill({ rsvpStatus: 'pending' }),
];

function setupApiMocks(overrides = {}) {
  const tasks = overrides.tasks ?? mockTasks;
  const budgetItems = overrides.budgetItems ?? mockBudget;
  const events = overrides.events ?? mockEvents;
  const guests = overrides.guests ?? mockGuests;

  sessionStorage.setItem('weddingPlannerAuth', 'true');
  sessionStorage.setItem('weddingPlannerToken', 'test-jwt');

  global.fetch = jest.fn((url) => {
    const path = String(url);
    if (path.includes('/api/tasks')) {
      return Promise.resolve(mockJsonResponse({ items: tasks }));
    }
    if (path.includes('/api/budget')) {
      return Promise.resolve(mockJsonResponse({ items: budgetItems }));
    }
    if (path.includes('/api/events')) {
      return Promise.resolve(mockJsonResponse({ items: events }));
    }
    if (path.includes('/api/guests')) {
      return Promise.resolve(mockJsonResponse({ items: guests }));
    }
    return Promise.reject(new Error(`Unexpected fetch: ${url}`));
  });
}

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
    setupApiMocks();
  });

  it('renders hero with countdown and wedding date', () => {
    renderDashboard();
    expect(screen.getByText(/Days Until Your Big Day/i)).toBeInTheDocument();
    expect(screen.getByText(/August 16th, 2026/i)).toBeInTheDocument();
  });

  it('shows task completion stats from API', async () => {
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
    setupApiMocks({
      tasks: [
        {
          id: '1',
          title: 'Finalize wedding venue',
          category: 'Venue',
          dueDate: '2026-04-12',
          priority: 'high',
          status: 'not-started',
        },
      ],
    });
    renderDashboard();
    expect(screen.getByText('Priority Tasks')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Finalize wedding venue')).toBeInTheDocument();
    });
  });
});

describe('Dashboard – non-functional', () => {
  beforeEach(() => {
    localStorage.clear();
    setupApiMocks({ tasks: [], budgetItems: [], events: [], guests: [] });
  });

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

  it('handles empty API data without crashing', async () => {
    expect(() => renderDashboard()).not.toThrow();
    await waitFor(() => {
      const label = screen.getByText('Tasks Completed');
      expect(label.previousElementSibling).toHaveTextContent('0/0');
    });
  });
});
