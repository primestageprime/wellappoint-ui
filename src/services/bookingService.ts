import type { AvailableSlot } from '../types/global';

export interface BookingRequest {
  service: string;
  duration: number;
  location: string;
  email: string;
  start: string; // ISO string
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
    const response = await fetch('/appointment_request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
  location: string = 'OFFICE'
): BookingRequest {
  return {
    service,
    duration,
    location,
    email: userEmail,
    start: slot.startTime,
    userProfile: {
      name: userEmail.split('@')[0], // Use email prefix as name for now
    },
  };
}
