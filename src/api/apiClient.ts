import type { ApiResult } from './types';

const TOKEN_KEY = 'usjr_token';

// ---------------------------------------------------------------------------
// Token helpers — stored in sessionStorage so it clears on tab/browser close
// ---------------------------------------------------------------------------

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

// ---------------------------------------------------------------------------
// Core request wrapper
// ---------------------------------------------------------------------------

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  // Token has expired or is invalid — clear it and reload to login
  if (response.status === 401) {
    clearToken();
    window.location.href = '/';
    throw new Error('Session expired. Please log in again.');
  }

  // Guard: if the response is not JSON (e.g. ASP.NET error page), throw a clean message
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(
      `Server error (${response.status}). ${
        text.length < 200 ? text : 'Check the backend console for details.'
      }`
    );
  }

  const body: ApiResult<T> = await response.json();

  if (!response.ok || body.status === 'Error') {
    throw new Error(body.message ?? `Request failed (${response.status})`);
  }

  return body;
}

// ---------------------------------------------------------------------------
// Exported API client
// ---------------------------------------------------------------------------

export const apiClient = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
