/**
 * API Configuration
 * 
 * In development, uses relative URLs which are proxied by Vite.
 * In production, uses the full backend API URL from environment variable.
 */

// Vite replaces import.meta.env.VITE_* at build time
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

/**
 * Constructs a full API URL for the given endpoint.
 * 
 * @param endpoint - The API endpoint path (e.g., '/services', '/availability')
 * @returns The full URL to use for the fetch request
 */
export function getApiUrl(endpoint: string): string {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // In production (when VITE_API_BASE_URL is set), use full URL
  // In development (no VITE_API_BASE_URL), use relative URL for Vite proxy
  if (API_BASE_URL && API_BASE_URL.length > 0) {
    return `${API_BASE_URL}${normalizedEndpoint}`;
  }
  
  return normalizedEndpoint;
}

/**
 * Wrapper around fetch that automatically uses the correct API base URL
 */
export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = getApiUrl(endpoint);
  console.log('[API] Fetching:', url); // Debug log
  return fetch(url, options);
}

