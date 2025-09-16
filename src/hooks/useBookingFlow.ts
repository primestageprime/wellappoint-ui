import { createSignal } from 'solid-js';
import { type BookingService } from '../types/service';

export function useBookingFlow() {
  const [selectedService, setSelectedService] = createSignal<string | null>(null);
  const [selectedDuration, setSelectedDuration] = createSignal<number | null>(null);
  const [selectedSlot, setSelectedSlot] = createSignal<any | null>(null);
  const [bookingStep, setBookingStep] = createSignal<'services' | 'durations' | 'availability' | 'confirmation'>('services');
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [bookingError, setBookingError] = createSignal<string | null>(null);

  const handleServiceSelect = (serviceName: string) => {
    console.log('🔍 handleServiceSelect called with:', serviceName);
    setSelectedService(serviceName);
    setBookingStep('durations');
    console.log('🔍 Booking step set to durations, selected service:', serviceName);
  };

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    setBookingStep('availability');
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    setBookingStep('confirmation');
  };

  const handleBookingComplete = () => {
    // Reset the booking flow
    setSelectedService(null);
    setSelectedDuration(null);
    setSelectedSlot(null);
    setBookingStep('services');
  };

  const handleBackToServices = () => {
    setSelectedService(null);
    setSelectedDuration(null);
    setSelectedSlot(null);
    setBookingStep('services');
  };

  const handleBackToDurations = () => {
    setSelectedDuration(null);
    setSelectedSlot(null);
    setBookingStep('durations');
  };

  const handleBackToAvailability = () => {
    setSelectedSlot(null);
    setBookingStep('availability');
  };

  const selectedServiceData = (services: () => BookingService[]) => {
    const serviceName = selectedService();
    return services().find(s => s.name === serviceName);
  };

  return {
    // State
    selectedService,
    selectedDuration,
    selectedSlot,
    bookingStep,
    isSubmitting,
    bookingError,
    
    // Actions
    handleServiceSelect,
    handleDurationSelect,
    handleSlotSelect,
    handleBookingComplete,
    handleBackToServices,
    handleBackToDurations,
    handleBackToAvailability,
    
    // Computed
    selectedServiceData,
  };
}
