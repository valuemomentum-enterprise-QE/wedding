import { apiRequest, getPlannerToken } from './apiClient';
import { PLANNER_STORAGE_KEYS } from './plannerStorage';

const ENDPOINTS = {
  [PLANNER_STORAGE_KEYS.tasks]: '/api/tasks',
  [PLANNER_STORAGE_KEYS.budgetItems]: '/api/budget',
  [PLANNER_STORAGE_KEYS.guests]: '/api/guests',
  [PLANNER_STORAGE_KEYS.events]: '/api/events',
};

export function hasPlannerApiSession() {
  return Boolean(getPlannerToken());
}

export async function fetchPlannerList(storageKey) {
  const path = ENDPOINTS[storageKey];
  if (!path) {
    throw new Error(`No API endpoint for ${storageKey}`);
  }
  const data = await apiRequest(path, { method: 'GET' });
  return Array.isArray(data?.items) ? data.items : [];
}

export async function savePlannerList(storageKey, items) {
  const path = ENDPOINTS[storageKey];
  if (!path) {
    throw new Error(`No API endpoint for ${storageKey}`);
  }
  const data = await apiRequest(path, {
    method: 'PUT',
    body: JSON.stringify({ items }),
  });
  return Array.isArray(data?.items) ? data.items : items;
}

export async function loginPlannerApi(passcode) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ passcode }),
  });
  if (!data?.token) {
    throw new Error('Login did not return a token');
  }
  return data.token;
}
