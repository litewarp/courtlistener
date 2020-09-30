import Cookies from 'js-cookie';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'OPTIONS';
  headers?: { [key: string]: any };
  body?: { [key: string]: any } | string;
}

const mergeOptions = (options: FetchOptions) => {
  // pre-fetch, grab the csrf token and insert it into the header
  const csrfTokenHeader = {
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken'),
  };
  return {
    // default to GET if no method provided
    method: options?.method || 'GET',
    // append passed in headers to our defaults
    headers: { ...csrfTokenHeader, ...options?.headers },
    // stringify the body if present (typically on POST)
    ...(options?.body && { body: JSON.stringify(options?.body) }),
  };
};

export async function appFetch<T>(url: string, options?: FetchOptions): Promise<T | boolean> {
  const mergedOptions = mergeOptions(options);

  return fetch(url, mergedOptions as RequestInit).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (options?.method === 'DELETE') return new Promise((resolve) => resolve(true));
    return response.json() as Promise<T>;
  });
}
