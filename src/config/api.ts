/**
 * API Configuration
 *
 * - In production (VITE_API_BASE_URL set): uses full backend URL from env
 * - On localhost: uses relative URLs proxied by Vite
 * - On other hosts (e.g., mobile via IP): uses same hostname with backend port
 */

// Vite replaces import.meta.env.VITE_* at build time
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const BACKEND_PORT = 8000;

/**
 * Determines the API base URL based on the current environment
 */
function getApiBaseUrl(): string | null {
  // If explicitly set via env, use that
  if (API_BASE_URL && API_BASE_URL.length > 0) {
    return API_BASE_URL;
  }

  // Check if we're on localhost - Vite proxy handles this
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null; // Use relative URLs for Vite proxy
  }

  // On other hosts (e.g., phone accessing via IP), construct backend URL
  // Use the same hostname but with the backend port
  const protocol = window.location.protocol;
  return `${protocol}//${hostname}:${BACKEND_PORT}`;
}

/**
 * Constructs a full API URL for the given endpoint.
 *
 * @param endpoint - The API endpoint path (e.g., '/services', '/availability')
 * @returns The full URL to use for the fetch request
 */
export function getApiUrl(endpoint: string): string {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const baseUrl = getApiBaseUrl();
  if (baseUrl) {
    return `${baseUrl}${normalizedEndpoint}`;
  }

  return normalizedEndpoint;
}

/**
 * Wrapper around fetch that automatically uses the correct API base URL
 */
export async function apiFetch(
  endpoint: string,
  options?: RequestInit,
): Promise<Response> {
  const url = getApiUrl(endpoint);
  console.log("[API] Fetching:", url); // Debug log
  return fetch(url, options);
}
