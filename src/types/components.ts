import { JSX } from 'solid-js';
import type { BookingService, AvailableSlot } from './global';

// ============================================================================
// PAGE COMPONENT PROPS
// ============================================================================

export interface LoginPageProps {
  intendedUrl?: string;
}

// ============================================================================
// BOOKING COMPONENT PROPS
// ============================================================================

export interface ServicesListProps {
  services: BookingService[];
  onServiceSelect: (serviceName: string) => void;
}

export interface DurationsListProps {
  services: BookingService[];
  selectedService: string;
  onDurationSelect: (duration: number) => void;
  onBack: () => void;
}

export interface AvailabilityListProps {
  service: string;
  duration: number;
  onSlotSelect: (slot: AvailableSlot) => void;
  onBack: () => void;
  provider?: string;
}

export interface BookingFormProps {
  services: BookingService[];
}

export interface ConfirmationPanelProps {
  service: BookingService;
  selectedSlot: AvailableSlot;
  isSubmitting: boolean;
  error: string | null;
  onBack: () => void;
  onConfirm: () => void;
}

// ============================================================================
// AUTH COMPONENT PROPS
// ============================================================================

export interface AuthProviderProps {
  children: JSX.Element;
}
