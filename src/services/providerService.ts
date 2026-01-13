import { Provider } from '../types/provider';
import { apiFetch } from '../config/api';
import { taskMetrics } from '../utils/taskMetrics';

export async function getProviderDetails(username: string): Promise<Provider | null> {
  const startTime = Date.now();
  try {
    const response = await apiFetch(`/api/provider?username=${encodeURIComponent(username)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Record task completion time
    const elapsedMs = Date.now() - startTime;
    taskMetrics.recordTask('loading-provider-details', elapsedMs);

    return data as Provider;
  } catch (error) {
    console.error('Failed to fetch provider details:', error);

    // Still record the time even on error
    const elapsedMs = Date.now() - startTime;
    taskMetrics.recordTask('loading-provider-details', elapsedMs);

    return null;
  }
}
