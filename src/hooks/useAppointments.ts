import { createResource } from 'solid-js';
import { getUserAppointments } from '../services/appointmentService';
import { taskMetrics } from '../utils/taskMetrics';

export function useAppointments(userEmail: () => string | undefined, provider: () => string) {
  const [appointments, { refetch: refetchAppointments }] = createResource(
    () => ({ userEmail: userEmail(), provider: provider() }),
    async ({ userEmail, provider }) => {
      if (!userEmail) return null;
      const startTime = Date.now();
      try {
        const result = await getUserAppointments(userEmail, provider);

        // Record task completion time
        const elapsedMs = Date.now() - startTime;
        taskMetrics.recordTask('loading-appointments', elapsedMs);

        return result;
      } catch (error) {
        console.error('Failed to fetch appointments:', error);

        // Still record the time even on error
        const elapsedMs = Date.now() - startTime;
        taskMetrics.recordTask('loading-appointments', elapsedMs);

        // Return null on error so the UI can handle it gracefully
        return null;
      }
    }
  );

  return {
    appointments,
    refetchAppointments,
  };
}
