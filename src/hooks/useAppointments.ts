import { createResource } from 'solid-js';
import { getUserAppointments } from '../services/appointmentService';

export function useAppointments(userEmail: () => string | undefined, provider: () => string) {
  const [appointments, { refetch: refetchAppointments }] = createResource(
    () => ({ userEmail: userEmail(), provider: provider() }),
    async ({ userEmail, provider }) => {
      if (!userEmail) return [];
      return await getUserAppointments(userEmail, provider);
    }
  );

  return {
    appointments,
    refetchAppointments,
  };
}
