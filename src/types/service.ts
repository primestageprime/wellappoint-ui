import { JSX } from 'solid-js';

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
