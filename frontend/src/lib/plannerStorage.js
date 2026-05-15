/** Planner list keys synced via MongoDB API (no localStorage). */
export const PLANNER_STORAGE_KEYS = {
  tasks: 'tasks',
  budgetItems: 'budgetItems',
  events: 'events',
  guests: 'guests',
  favoriteDecor: 'favoriteDecor',
};

export const PLANNER_STORAGE_CHANGE = 'planner-storage-change';

/** Notify other planner views after an API save. */
export function notifyPlannerDataChanged(key) {
  window.dispatchEvent(
    new CustomEvent(PLANNER_STORAGE_CHANGE, { detail: { key } })
  );
}
