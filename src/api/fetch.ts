import { MsgFn } from '../i18n/msg';

export const DEFAULT_CALCULATOR_API_HOST = 'https://api.rewiringamerica.org';

/**
 * Fetches a response from the Incentives API. Handles turning an error response
 * into an exception with a useful message.
 */
export async function fetchApi<R>(
  apiKey: string,
  apiHost: string,
  path: string,
  query: URLSearchParams,
  msg: MsgFn,
): Promise<R> {
  const url = new URL(apiHost);
  url.pathname = path;
  url.search = query.toString();
  const response: Response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (response.status === 401) {
    throw new Error(
      msg('The API key is invalid, or does not have enough permissions.'),
    );
  } else if (response.status >= 400) {
    console.error(response);
    // statusText isn't always set, but it's a reasonable proxy for a human readable error if it is:
    let message = response.statusText;
    try {
      const error = await response.json();
      console.error(error);
      if (error.title && error.detail) {
        // Zuplo's API key errors have this form:
        message = `${error.title}: ${error.detail}`;
      } else if (error.message && error.error) {
        // Rewiring America's incentives API errors have this form:
        message = `${error.error}: ${error.message}`;
      } else if (error.detail) {
        // Rewiring America's REM API errors have this form
        message = error.detail;
      }
    } catch (e) {
      // if we couldn't get anything off the response, just go with something generic:
      message = msg('Error loading incentives.');
    }
    throw new Error(message);
  }
  return response.json();
}
