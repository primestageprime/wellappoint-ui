import { formatTime, formatDateTime } from '../utils/dateUtils';
import type { UserAppointment, UserAppointmentsResponse } from '../types/global';

// Re-export types from global
export type { UserAppointment, UserAppointmentsResponse };

export async function getUserAppointments(userEmail: string, provider?: string): Promise<UserAppointmentsResponse> {
  try {
    const url = new URL('/api/appointments/user', window.location.origin);
    url.searchParams.set('email', userEmail);
    if (provider) {
      url.searchParams.set('provider', provider);
    }
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();

    
    const data = rawData.appointments.map((appointment: UserAppointment) => ({
      ...appointment,
      startTime: formatDateTime(appointment.startTime),
      endTime: formatDateTime(appointment.endTime),
      time: formatTime(appointment.startTime)
    }));
    rawData.appointments = data;
    return rawData as UserAppointmentsResponse;
  } catch (error) {
    console.error('Failed to fetch user appointments:', error);
    throw new Error('Failed to fetch user appointments');
  }
}
