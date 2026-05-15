import { parseISO, differenceInDays, format } from 'date-fns';

const DEFAULT_WEDDING_DATE = '2026-08-16';

/** Parse YYYY-MM-DD as local calendar date (avoids UTC off-by-one). */
export function parseWeddingDate(dateString) {
  return parseISO(dateString || DEFAULT_WEDDING_DATE);
}

export function getDaysUntilWedding(weddingDate, referenceDate = new Date()) {
  return differenceInDays(weddingDate, referenceDate);
}

export function formatWeddingDateShort(date) {
  return format(date, 'MMMM d, yyyy');
}

export function formatWeddingDateLong(date) {
  return format(date, 'EEEE, MMMM do, yyyy');
}

export function calculateTaskProgress(completed, total) {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

export function toUSD(amount, currency, exchangeRate = 83.5) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return 0;
  if (currency === 'INR') return value / exchangeRate;
  return value;
}

/** Same totals as Dashboard — keeps Budget page and home stats aligned. */
export function summarizeBudget(budgetItems = [], exchangeRate = 83.5) {
  const totalBudget = budgetItems.reduce(
    (sum, item) => sum + toUSD(item.estimatedCost, item.currency, exchangeRate),
    0
  );
  const spent = budgetItems.reduce(
    (sum, item) => sum + toUSD(item.actualCost, item.currency, exchangeRate),
    0
  );
  return {
    totalBudget,
    spent,
    remaining: totalBudget - spent,
    budgetPercentage:
      totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0,
  };
}

export function calculateDashboardStats({
  tasks = [],
  events = [],
  budgetItems = [],
  guests = [],
  exchangeRate = 83.5,
}) {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const { totalBudget, spent, budgetPercentage } = summarizeBudget(
    budgetItems,
    exchangeRate
  );
  const rsvpYes = guests.filter((g) => g.rsvpStatus === 'yes').length;

  return {
    totalTasks: tasks.length,
    completedTasks,
    upcomingEvents: events.length,
    totalBudget,
    spent,
    totalGuests: guests.length,
    rsvpYes,
    progressPercentage: calculateTaskProgress(completedTasks, tasks.length),
    budgetPercentage,
    guestProgress:
      guests.length > 0 ? (rsvpYes / guests.length) * 100 : 0,
  };
}

export function loadLocalStorageJson(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
