import { FormValues } from '../incentives/state-calculator-form';
import { safeLocalStorage } from '../safe-local-storage';

const LOCAL_STORAGE_KEY = 'RA-calc-email-submitted';

declare module '../safe-local-storage' {
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
  formValues: FormValues,
  emailRequired: boolean,
  emailToStaging: boolean,
): Promise<boolean> {
  safeLocalStorage.setItem(LOCAL_STORAGE_KEY, true);

  try {
    const url = new URL(apiHost);
    url.pathname = '/email-signup';

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        ...formValues,
        sourceUrl: window.location.href,
        emailRequired,
        // Only include this if it's true
        emailToStaging: emailToStaging ? true : undefined,
      }),
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
