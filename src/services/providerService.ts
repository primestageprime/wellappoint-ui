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
