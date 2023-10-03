const LOCAL_STORAGE_KEY = 'calc-email-submitted';

export function wasEmailSubmitted(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
  } catch (_) {
    return false;
  }
}

export async function submitEmailSignup(
  apiHost: string,
  apiKey: string,
  email: string,
  zip: string,
): Promise<boolean> {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  } catch (_) {}

  try {
    const url = new URL(apiHost);
    url.pathname = '/email-signup';

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email, zip }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (e) {
    console.warn('Email signup failed', e);
    return false;
  }
}
