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
