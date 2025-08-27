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
    
    const data = await response.json();
    return data as UserAppointmentsResponse;
  } catch (error) {
    console.error('Failed to fetch user appointments:', error);
    throw new Error('Failed to fetch user appointments');
  }
}
