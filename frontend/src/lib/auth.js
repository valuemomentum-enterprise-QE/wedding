const AUTH_KEY = 'weddingPlannerAuth';
const DEFAULT_PASSCODE = '16102026';

export function getPlannerPasscode() {
  try {
    const data = JSON.parse(localStorage.getItem('weddingPlannerData') || '{}');
    return data?.settings?.plannerPasscode || DEFAULT_PASSCODE;
  } catch {
    return DEFAULT_PASSCODE;
  }
}

export function isPlannerAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function loginWithPasscode(passcode) {
  if (passcode === getPlannerPasscode()) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function logoutPlanner() {
  sessionStorage.removeItem(AUTH_KEY);
}
