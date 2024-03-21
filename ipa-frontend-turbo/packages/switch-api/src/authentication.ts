const AUTH_URL = 'http://localhost:9000/auth';

const TIMEOUT = 10000; // Timeout after 10 seconds
const CONTROLLER = new AbortController();
const REASON = new DOMException('signal timed out', 'TimeoutError');

export const login = async (username: string, password: string) => {
  const timeoutId = setTimeout(() => CONTROLLER.abort(REASON), TIMEOUT);
  try {
    return await fetch(`${AUTH_URL}/`, {
      method: 'post',
      credentials: 'include',
      signal: CONTROLLER.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Error fetching data for login:', error);
  }
};

export const logout = () => {
  try {
    fetch(`${AUTH_URL}/logout/`, {
      method: 'get',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error while logout: ', error);
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const timeoutId = setTimeout(() => CONTROLLER.abort(REASON), TIMEOUT);

  try {
    const response = await fetch(`${AUTH_URL}/`, {
      method: 'get',
      credentials: 'include',
      signal: CONTROLLER.signal,
    });
    if (response.ok) {
      const data = await response.json();

      clearTimeout(timeoutId);

      return data.isAuthenticated;
    }
    return false;
  } catch (error) {
    clearTimeout(timeoutId);
    console.log('An error occurred while accepting registration: ', error);
    return false;
  }
};
