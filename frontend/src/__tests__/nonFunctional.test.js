/**
 * Non-functional test catalog for Wedding Planner.
 * Executable checks run here; qualitative NFRs are documented as skipped specs.
 */
import {
  parseWeddingDate,
  formatWeddingDateShort,
  formatWeddingDateLong,
  calculateDashboardStats,
} from '../lib/weddingUtils';

describe('Non-functional – performance', () => {
  it('dashboard stats calculation completes under 50ms for large datasets', () => {
    const tasks = Array.from({ length: 500 }, (_, i) => ({
      status: i % 3 === 0 ? 'completed' : 'not-started',
    }));
    const guests = Array.from({ length: 200 }, (_, i) => ({
      rsvpStatus: i % 2 === 0 ? 'yes' : 'pending',
    }));

    const start = performance.now();
    calculateDashboardStats({ tasks, guests, events: [], budgetItems: [] });
    expect(performance.now() - start).toBeLessThan(50);
  });
});

describe('Non-functional – reliability', () => {
  it('date formatting is stable across repeated calls', () => {
    const date = parseWeddingDate('2026-08-16');
    const short1 = formatWeddingDateShort(date);
    const short2 = formatWeddingDateShort(date);
    expect(short1).toBe(short2);
    expect(formatWeddingDateLong(date)).toMatch(/2026/);
  });
});

describe('Non-functional – consistency (UI contract)', () => {
  it('short and long formats reference the same calendar day', () => {
    const date = parseWeddingDate('2026-08-16');
    expect(formatWeddingDateShort(date)).toBe('August 16, 2026');
    expect(formatWeddingDateLong(date)).toContain('August 16');
  });
});

describe('Non-functional – security & privacy (documented)', () => {
  it.todo('no sensitive PII is sent to backend without user consent');
  it.todo('localStorage data is not exposed in URL params');
});

describe('Non-functional – usability (documented)', () => {
  it.todo('all interactive elements meet 44px touch target on mobile');
  it.todo('color contrast meets WCAG AA for primary text');
});
