import { safeLocalStorage } from './safe-local-storage';

const LOCAL_STORAGE_KEY = 'RA-calc-email-submitted';

declare module './safe-local-storage' {
  interface SafeLocalStorageMap {
    [LOCAL_STORAGE_KEY]: boolean;
  }
}

export function wasEmailSubmitted(): boolean {
  return safeLocalStorage.getItem(LOCAL_STORAGE_KEY) !== null;
}

export async function submitEmailSignup(
  apiHost: string,
  apiKey: string,
  email: string,
  zip: string,
  emailRequired: boolean,
): Promise<boolean> {
  safeLocalStorage.setItem(LOCAL_STORAGE_KEY, true);

  try {
    const url = new URL(apiHost);
    url.pathname = '/email-signup';

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email, zip, emailRequired }),
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
