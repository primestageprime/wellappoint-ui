import { Provider } from '../types/provider';
import { apiFetch } from '../config/api';
import { taskMetrics } from '../utils/taskMetrics';

export class ProviderNotFoundError extends Error {
  constructor(username: string) {
    super(`Provider '${username}' not found`);
    this.name = 'ProviderNotFoundError';
  }
}

export async function getProviderDetails(username: string): Promise<Provider | null> {
  const startTime = Date.now();
  try {
    const response = await apiFetch(`/api/provider?username=${encodeURIComponent(username)}`);

    // Record task completion time
    const elapsedMs = Date.now() - startTime;
    taskMetrics.recordTask('loading-provider-details', elapsedMs);

    if (!response.ok) {
      const data = await response.json();

      // Check if this is a provider not found error
      if (data.error === 'PROVIDER_NOT_FOUND') {
        throw new ProviderNotFoundError(username);
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as Provider;
  } catch (error) {
    console.error('Failed to fetch provider details:', error);

    // Still record the time even on error
    const elapsedMs = Date.now() - startTime;
    taskMetrics.recordTask('loading-provider-details', elapsedMs);

    // Re-throw ProviderNotFoundError so component can handle it
    if (error instanceof ProviderNotFoundError) {
      throw error;
    }

    return null;
  }
}

/**
 * Revoke provider's OAuth access to Google Calendar and email
 */
export async function revokeProviderAccess(username: string): Promise<void> {
  const response = await apiFetch('/api/provider/revoke-access', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to revoke access');
  }
}

/**
 * Export all provider data (profile, services, appointments)
 */
export async function exportProviderData(username: string): Promise<any> {
  const response = await apiFetch(`/api/provider/export-data?username=${encodeURIComponent(username)}`);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to export data');
  }

  return response.json();
}

/**
 * Permanently delete provider account and all associated data
 */
export async function deleteProviderAccount(username: string): Promise<void> {
  const response = await apiFetch(`/api/provider/delete-account?username=${encodeURIComponent(username)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete account');
  }
}

/**
 * Get the provider's Google profile picture URL
 */
export async function getGoogleProfilePicture(username: string): Promise<string | null> {
  const response = await apiFetch(`/api/provider/profile-picture?username=${encodeURIComponent(username)}`);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.success ? data.pictureUrl ?? null : null;
}

/**
 * Upload a custom headshot image
 */
export async function uploadHeadshot(username: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('file', file);

  const response = await apiFetch('/api/provider/headshot/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to upload headshot');
  }

  const data = await response.json();
  return data.url;
}

/**
 * Check if a provider's Google OAuth token is still valid
 */
export async function checkTokenStatus(username: string): Promise<{ isValid: boolean; error?: string }> {
  const response = await apiFetch(`/api/provider/token/status?username=${encodeURIComponent(username)}`);

  if (!response.ok) {
    return { isValid: false, error: 'Failed to check token status' };
  }

  const data = await response.json();
  if (!data.success) {
    return { isValid: false, error: data.error };
  }
  // handleActionResult spreads data.data into the top level,
  // so isValid lives at data.isValid, not data.data.isValid
  return { isValid: data.isValid ?? data.data?.isValid ?? false, error: data.error ?? data.data?.error };
}

/**
 * Set headshot from provider's Google profile picture
 */
export async function setHeadshotFromGoogle(username: string): Promise<string> {
  const response = await apiFetch('/api/provider/headshot/from-google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMsg = 'Failed to set headshot from Google';
    try { errorMsg = JSON.parse(text).error || errorMsg; } catch {}
    throw new Error(errorMsg);
  }

  const text = await response.text();
  if (!text) {
    throw new Error('Server returned empty response');
  }
  const data = JSON.parse(text);
  return data.url;
}
