import type { AvailableSlot } from '../types/global';
import { apiFetch } from '../config/api';
import { formatStartForBackend } from '../utils/pacificTime';
import { formatBackendError } from '../utils/bookingErrors';

export interface BookingRequest {
  service: string;
  duration: number;
  location: string;
  email: string;
  start: string; // ISO string
  username?: string;
  userProfile?: {
    name?: string;
    phone?: string;
  };
}

export interface BookingResponse {
  success: boolean;
  appointmentId?: string;
  error?: string;
}

export async function createAppointment(bookingData: BookingRequest): Promise<BookingResponse> {
  try {
    const response = await apiFetch('/appointment_request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(formatBackendError(errorData, response.status));
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create appointment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create appointment';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export function createBookingRequest(
  service: string,
  duration: number,
  slot: AvailableSlot,
  userEmail: string,
  username?: string,
  location: string = 'OFFICE'
): BookingRequest {
  // Convert ISO instant to the "YYYY-MM-DD HH:mm" string the backend expects.
  // The backend parses this strictly as America/Los_Angeles, so we must emit the
  // slot's Pacific wall-clock time regardless of the client's local timezone.
  const formattedStart = formatStartForBackend(slot.startTime);

  return {
    service,
    duration,
    location,
    email: userEmail,
    start: formattedStart,
    username,
    userProfile: {
      name: userEmail.split('@')[0], // Use email prefix as name for now
    },
  };
}
