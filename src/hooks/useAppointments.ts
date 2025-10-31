import { createResource } from 'solid-js';
import { getUserAppointments } from '../services/appointmentService';

export function useAppointments(userEmail: () => string | undefined, provider: () => string) {
  const [appointments, { refetch: refetchAppointments }] = createResource(
    () => ({ userEmail: userEmail(), provider: provider() }),
    async ({ userEmail, provider }) => {
      if (!userEmail) return null;
      try {
        return await getUserAppointments(userEmail, provider);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
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
