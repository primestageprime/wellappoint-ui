/**
 * API Configuration
 * 
 * In development, uses relative URLs which are proxied by Vite.
 * In production, uses the full backend API URL from environment variable.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Constructs a full API URL for the given endpoint.
 * 
 * @param endpoint - The API endpoint path (e.g., '/services', '/availability')
 * @returns The full URL to use for the fetch request
 */
export function getApiUrl(endpoint: string): string {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // In development, use relative URLs for Vite proxy
  // In production, prepend the API base URL
  if (API_BASE_URL) {
    return `${API_BASE_URL}${normalizedEndpoint}`;
  }
  
  return normalizedEndpoint;
}

/**
 * Wrapper around fetch that automatically uses the correct API base URL
 */
export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = getApiUrl(endpoint);
  return fetch(url, options);
}

