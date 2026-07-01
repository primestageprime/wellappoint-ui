import { formatTime, formatDateTime } from '../utils/dateUtils';
import type { UserAppointment, UserAppointmentsResponse } from '../types/global';
import { apiFetch } from '../config/api';

// Re-export types from global
export type { UserAppointment, UserAppointmentsResponse };

export async function getUserAppointments(userEmail: string, provider?: string): Promise<UserAppointmentsResponse> {
  try {
    const params = new URLSearchParams({ email: userEmail });
    if (provider) {
      params.set('provider', provider);
    }
    
    const response = await apiFetch(`/api/appointments/user?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();

    // Log the full response including displayName for debugging
    // console.log('📋 Raw appointments response:', JSON.stringify(rawData, null, 2));

    // Preserve displayName and other metadata from the response
    const data = rawData.appointments.map((appointment: UserAppointment) => ({
      ...appointment,
      startTime: formatDateTime(appointment.startTime),
      endTime: formatDateTime(appointment.endTime),
      time: formatTime(appointment.startTime)
    }));
    
    // Return the full response with displayName preserved
    return {
      ...rawData,
      appointments: data
    } as UserAppointmentsResponse;
  } catch (error) {
    console.error('Failed to fetch user appointments:', error);
    throw new Error('Failed to fetch user appointments');
  }
}

// --- Provider-facing appointment management (cancel / reschedule) ---

export interface ProviderAppointment {
  appointmentId: string;
  service: string;
  clientEmail: string;
  startTime: string;
  endTime: string;
  date: string;
  time: string;
  duration: number;
}

export async function listProviderAppointments(username: string): Promise<ProviderAppointment[]> {
  const res = await apiFetch(`/api/appointments?username=${encodeURIComponent(username)}`);
  if (!res.ok) {
    throw new Error(`Failed to load appointments (${res.status})`);
  }
  const data = await res.json();
  return (data.appointments ?? []) as ProviderAppointment[];
}

export async function cancelAppointment(
  username: string,
  appointmentId: string,
  reason?: string,
): Promise<void> {
  const res = await apiFetch('/api/appointments/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, appointmentId, reason }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Failed to cancel (${res.status})`);
  }
}

export async function rescheduleAppointment(
  username: string,
  appointmentId: string,
  newStart: string,
): Promise<void> {
  const res = await apiFetch('/api/appointments/reschedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, appointmentId, newStart }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Failed to reschedule (${res.status})`);
  }
}
