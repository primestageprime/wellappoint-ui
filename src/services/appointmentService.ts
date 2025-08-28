import { formatTime, formatDateTime } from '../utils/dateUtils';

export interface UserAppointment {
  id: string;
  service: string;
  duration: string;
  date: string;
  time: string;
  startTime: string;
  endTime: string;
  description: string;
  attendees: readonly string[];
}

export interface UserAppointmentsResponse {
  success: boolean;
  appointments: UserAppointment[];
  count: number;
  appointmentRequestCap: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export async function getUserAppointments(userEmail: string): Promise<UserAppointmentsResponse> {
  try {
    const response = await fetch(`/api/appointments/user?email=${encodeURIComponent(userEmail)}`);
    
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
