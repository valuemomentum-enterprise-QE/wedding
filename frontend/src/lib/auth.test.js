import { loginWithPasscode, isPlannerAuthenticated, logoutPlanner } from './auth';

function mockJsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  };
}

describe('auth', () => {
  beforeEach(() => {
    sessionStorage.clear();
    global.fetch = jest.fn((url) => {
      if (String(url).includes('/api/auth/login')) {
        return Promise.resolve(mockJsonResponse({ token: 'test-jwt-token' }));
      }
      return Promise.reject(new Error(`Unexpected fetch: ${url}`));
    });
  });

  it('authenticates via API and stores token', async () => {
    await expect(loginWithPasscode('16102026')).resolves.toBe(true);
    expect(isPlannerAuthenticated()).toBe(true);
    expect(sessionStorage.getItem('weddingPlannerToken')).toBe('test-jwt-token');
  });

  it('rejects incorrect passcode from API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve(mockJsonResponse({ error: 'Incorrect passcode' }, false, 401))
    );
    await expect(loginWithPasscode('wrong')).resolves.toBe(false);
    expect(isPlannerAuthenticated()).toBe(false);
  });

  it('logout clears session', async () => {
    await loginWithPasscode('16102026');
    logoutPlanner();
    expect(isPlannerAuthenticated()).toBe(false);
    expect(sessionStorage.getItem('weddingPlannerToken')).toBeNull();
  });
});
