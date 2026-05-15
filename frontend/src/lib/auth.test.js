import { getPlannerPasscode, loginWithPasscode, isPlannerAuthenticated, logoutPlanner } from './auth';

describe('auth', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(
      'weddingPlannerData',
      JSON.stringify({ settings: { plannerPasscode: 'test1234' } })
    );
  });

  it('reads passcode from weddingPlannerData', () => {
    expect(getPlannerPasscode()).toBe('test1234');
  });

  it('authenticates with correct passcode', () => {
    expect(loginWithPasscode('test1234')).toBe(true);
    expect(isPlannerAuthenticated()).toBe(true);
  });

  it('rejects incorrect passcode', () => {
    expect(loginWithPasscode('wrong')).toBe(false);
    expect(isPlannerAuthenticated()).toBe(false);
  });

  it('logout clears session', () => {
    loginWithPasscode('test1234');
    logoutPlanner();
    expect(isPlannerAuthenticated()).toBe(false);
  });
});
