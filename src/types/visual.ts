import { JSX } from 'solid-js';

// ============================================================================
// BASE COMPONENT PROPS
// ============================================================================

export interface BaseProps {
  children?: JSX.Element;
  class?: string;
}

export interface PageFrameProps {
  children: JSX.Element;
  class?: string;
}

export interface CenteredContentProps {
  children: JSX.Element;
  class?: string;
}

export interface PaddingSpacerProps {
  children: JSX.Element;
  class?: string;
}

export interface DesignSystemContainerProps {
  children: JSX.Element;
  class?: string;
}

// ============================================================================
// CARD COMPONENT PROPS
// ============================================================================

export interface CardProps {
  children: JSX.Element;
  class?: string;
}

export interface HeaderCardProps {
  children: JSX.Element;
  class?: string;
}

export interface ContentProps {
  children?: JSX.Element;
  class?: string;
}

export interface ErrorCardProps {
  error: string;
  onRetry?: () => void;
  class?: string;
}

export interface LoadingCardProps {
  message?: string;
  class?: string;
}

// ============================================================================
// BUTTON COMPONENT PROPS
// ============================================================================

export interface ButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  icon?: JSX.Element;
  class?: string;
  disabled?: boolean;
}

export interface StandardButtonProps {
  children: JSX.Element;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  class?: string;
}

export interface LogoutButtonProps {
  onLogout: () => void;
  children?: JSX.Element;
  class?: string;
}

// ============================================================================
// TEXT COMPONENT PROPS
// ============================================================================

export interface H3Props {
  children: JSX.Element;
  class?: string;
}

export interface H4Props {
  children: JSX.Element;
  class?: string;
}

// ============================================================================
// LAYOUT COMPONENT PROPS
// ============================================================================

export interface SplitProps {
  left: JSX.Element;
  right: JSX.Element;
  class?: string;
}

export interface RatioProps {
  current: number;
  total: number;
  class?: string;
}

// ============================================================================
// ICON COMPONENT PROPS
// ============================================================================

export interface IconProps {
  class?: string;
}

export interface CalendarProps extends IconProps {}
export interface GlobeProps extends IconProps {}
export interface CurrencyProps extends IconProps {}
export interface ChevronRightProps extends IconProps {}
export interface FootReflexologyProps extends IconProps {}
export interface CraniosacralProps extends IconProps {}
export interface HeartProps extends IconProps {}

export interface WellAppointLogoProps {
  className?: string;
  size?: number;
}

// ============================================================================
// ITEM COMPONENT PROPS
// ============================================================================

export interface ServiceItemProps {
  name: string;
  description: string;
  icon?: JSX.Element;
  onClick?: () => void;
  class?: string;
}

export interface DurationItemProps {
  duration: string;
  description: string;
  price: string;
  icon?: JSX.Element;
  onClick?: () => void;
  class?: string;
}

export interface TimeItemProps {
  time: string;
  available: boolean;
  onClick?: () => void;
  class?: string;
}

export interface AppointmentItemProps {
  service: string;
  duration: string;
  date: string;
  time: string;
  icon?: JSX.Element;
  class?: string;
}

// ============================================================================
// COMPLEX COMPONENT PROPS
// ============================================================================

export interface IconWithTitleAndSubtitleProps {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  onClick?: () => void;
  class?: string;
}

export interface ServiceSummaryCardProps {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  class?: string;
}

export interface AvatarProps {
  username: () => string;
  class?: string;
}

export interface ProviderContentProps {
  name: string;
  email: string;
  title: string;
  profilePic?: string;
  class?: string;
}

// ============================================================================
// LIST COMPONENT PROPS
// ============================================================================

export interface ServicesCardProps {
  services: import('./global').UIService[];
  title?: string;
  class?: string;
}

export interface DurationListProps {
  durations: import('./global').UIDuration[];
  title?: string;
  class?: string;
}

export interface DurationCardProps {
  bookingStep: () => 'services' | 'durations' | 'availability' | 'confirmation';
  selectedService: () => string | null;
  services: () => import('./global').BookingService[];
  onDurationSelect: (duration: number) => void;
  onBack: () => void;
  class?: string;
}

export interface AvailabilityCardProps {
  bookingStep: () => 'services' | 'durations' | 'availability' | 'confirmation';
  selectedService: () => string | null;
  selectedDuration: () => number | null;
  provider: () => string | undefined;
  onSlotSelect: (slot: import('./global').AvailableSlot) => void;
  onBack: () => void;
  class?: string;
}

export interface AppointmentsCardProps {
  appointments: import('./global').Appointment[];
  appointmentRequestCap?: number;
  class?: string;
}

// ============================================================================
// DETAIL COMPONENT PROPS
// ============================================================================

export interface DetailItem {
  label: string;
  value: string | JSX.Element;
  icon: JSX.Element;
}

export interface AppointmentDetailsGridProps {
  details: DetailItem[];
  class?: string;
}

export interface ActionButton {
  text: string;
  onClick: () => void;
  variant: 'secondary' | 'primary';
  disabled?: boolean;
}

export interface ActionButtonsProps {
  buttons: ActionButton[];
  class?: string;
}

export interface SessionDescriptionProps {
  description: string;
  class?: string;
}

// ============================================================================
// DESIGN SYSTEM PROPS
// ============================================================================

export interface DesignSystemPageProps {
  children: JSX.Element;
  title?: string;
}

export interface DesignSystemSectionProps {
  title: string;
  children: JSX.Element;
}

export interface TestContentProps {
  header?: string;
  children?: JSX.Element;
  class?: string;
}
