import { JSX } from 'solid-js';

// ============================================================================
// SERVICE TYPES
// ============================================================================

// Service interface for booking/availability (backend data)
export interface BookingService {
  name: string;
  duration: number;
  price: number;
  description?: string;
  durationDescription?: string;
}

// Service interface for UI components (frontend display)
export interface UIService {
  name: string;
  description: string;
  subtitle?: string;
  icon?: JSX.Element;
  onClick?: () => void;
}

// Duration interface for UI components
export interface UIDuration {
  minutes: number;
  description: string;
  price: number;
  icon?: JSX.Element;
  onClick?: () => void;
}

// ============================================================================
// APPOINTMENT TYPES
// ============================================================================

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
  displayName?: string; // Preferred Name > Name > email username
  client?: {
    email: string;
    name?: string;
    preferredName?: string;
    appointmentRequestCap: number;
  };
  success: boolean;
  appointments: UserAppointment[];
  count: number;
  appointmentRequestCap: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface Appointment {
  service: string;
  duration: string;
  date: string;
  time: string;
  icon?: JSX.Element;
}

// ============================================================================
// AVAILABILITY TYPES
// ============================================================================

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  durationMinutes: number;
  location: string;
  isOptimal: boolean;
}

export interface AvailabilityResponse {
  success: boolean;
  data?: AvailableSlot[];
  error?: string;
}

export interface AvailabilityRequest {
  duration: number;
  service: string;
  email: string;
  location: string;
  start: string; // "YYYY-MM-DD" format
  end: string; // "YYYY-MM-DD" format
}

// ============================================================================
// PROVIDER TYPES
// ============================================================================

export interface Provider {
  name: string;
  email: string;
  title: string;
  phone: string;
  bio: string;
  specialties: string[];
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface UserProfile {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  nickname: string;
  email: string;
  email_verified: boolean;
  picture: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  updated_at: string;
}

export type AuthContextType = {
  isAuthenticated: () => boolean;
  user: () => UserProfile | null;
  login: () => Promise<void>;
  logout: () => void;
  loading: () => boolean;
};
