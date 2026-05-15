import {
  parseWeddingDate,
  getDaysUntilWedding,
  formatWeddingDateShort,
  formatWeddingDateLong,
  calculateTaskProgress,
  toUSD,
  calculateDashboardStats,
  loadLocalStorageJson,
} from './weddingUtils';

describe('weddingUtils – functional', () => {
  describe('parseWeddingDate', () => {
    it('parses ISO date as local calendar day (not UTC shift)', () => {
      const date = parseWeddingDate('2026-08-16');
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(7);
      expect(date.getDate()).toBe(16);
    });

    it('defaults to August 16, 2026 when empty', () => {
      const date = parseWeddingDate();
      expect(date.getDate()).toBe(16);
    });
  });

  describe('getDaysUntilWedding', () => {
    it('returns correct day count from reference date', () => {
      const wedding = parseWeddingDate('2026-08-16');
      const reference = new Date(2026, 4, 15);
      expect(getDaysUntilWedding(wedding, reference)).toBe(93);
    });
  });

  describe('formatWeddingDateShort / Long', () => {
    it('formats short date consistently with stored value', () => {
      const date = parseWeddingDate('2026-08-16');
      expect(formatWeddingDateShort(date)).toBe('August 16, 2026');
    });

    it('formats long date with weekday', () => {
      const date = parseWeddingDate('2026-08-16');
      expect(formatWeddingDateLong(date)).toMatch(/Sunday, August 16th, 2026/);
    });
  });

  describe('calculateTaskProgress', () => {
    it('rounds task completion percentage', () => {
      expect(calculateTaskProgress(3, 39)).toBe(8);
    });

    it('returns 0 when no tasks', () => {
      expect(calculateTaskProgress(0, 0)).toBe(0);
    });
  });

  describe('toUSD', () => {
    it('converts INR to USD using exchange rate', () => {
      expect(toUSD(8350, 'INR', 83.5)).toBeCloseTo(100);
    });

    it('returns USD amounts unchanged', () => {
      expect(toUSD(500, 'USD', 83.5)).toBe(500);
    });
  });

  describe('calculateDashboardStats', () => {
    const sampleTasks = [
      { status: 'completed' },
      { status: 'completed' },
      { status: 'completed' },
      { status: 'not-started' },
    ];
    const sampleGuests = [
      { rsvpStatus: 'yes' },
      { rsvpStatus: 'yes' },
      { rsvpStatus: 'no' },
    ];

    it('aggregates tasks, guests, events, and budget', () => {
      const stats = calculateDashboardStats({
        tasks: sampleTasks,
        events: [{}, {}],
        budgetItems: [
          { estimatedCost: 1000, actualCost: 0, currency: 'USD' },
          { estimatedCost: 8350, actualCost: 0, currency: 'INR' },
        ],
        guests: sampleGuests,
        exchangeRate: 83.5,
      });

      expect(stats.completedTasks).toBe(3);
      expect(stats.totalTasks).toBe(4);
      expect(stats.progressPercentage).toBe(75);
      expect(stats.rsvpYes).toBe(2);
      expect(stats.totalGuests).toBe(3);
      expect(stats.upcomingEvents).toBe(2);
      expect(stats.totalBudget).toBeCloseTo(1100);
    });
  });

  describe('loadLocalStorageJson', () => {
    beforeEach(() => localStorage.clear());

    it('returns fallback for missing key', () => {
      expect(loadLocalStorageJson('tasks', [])).toEqual([]);
    });

    it('parses valid JSON from localStorage', () => {
      localStorage.setItem('tasks', JSON.stringify([{ id: 1 }]));
      expect(loadLocalStorageJson('tasks')).toEqual([{ id: 1 }]);
    });

    it('returns fallback on corrupt JSON', () => {
      localStorage.setItem('tasks', 'not-json');
      expect(loadLocalStorageJson('tasks', [])).toEqual([]);
    });
  });
});

describe('weddingUtils – date consistency (non-functional)', () => {
  it('sidebar short format matches hero long format calendar day', () => {
    const date = parseWeddingDate('2026-08-16');
    expect(formatWeddingDateShort(date)).toContain('16');
    expect(formatWeddingDateLong(date)).toContain('16th');
  });
});
