import { setPlannerToken, getPlannerToken } from './apiClient';
import { loginPlannerApi } from './plannerApi';

const AUTH_KEY = 'weddingPlannerAuth';

export function isPlannerAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true' && Boolean(getPlannerToken());
}

export async function loginWithPasscode(passcode) {
  const trimmed = passcode.trim();
  if (!trimmed) {
    return false;
  }

  try {
    const token = await loginPlannerApi(trimmed);
    setPlannerToken(token);
    sessionStorage.setItem(AUTH_KEY, 'true');
    return true;
  } catch (error) {
    if (error.status === 401) {
      return false;
    }
    throw error;
  }
}

export function logoutPlanner() {
  sessionStorage.removeItem(AUTH_KEY);
  setPlannerToken(null);
}
