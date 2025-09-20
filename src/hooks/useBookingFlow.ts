import { createSignal } from 'solid-js';
import { type BookingService } from '../types/service';
import { createAppointment, createBookingRequest } from '../services/bookingService';

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

  const handleBookingComplete = async (userEmail: string, username?: string) => {
    const service = selectedService();
    const duration = selectedDuration();
    const slot = selectedSlot();

    if (!service || !duration || !slot) {
      setBookingError('Missing booking information. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const bookingRequest = createBookingRequest(service, duration, slot, userEmail, username);
      console.log('🔍 Creating appointment with request:', bookingRequest);
      
      const result = await createAppointment(bookingRequest);
      
      if (result.success) {
        console.log('✅ Appointment created successfully:', result.appointmentId);
        // Only reset state after successful booking
        setSelectedService(null);
        setSelectedDuration(null);
        setSelectedSlot(null);
        setBookingStep('services');
      } else {
        console.error('❌ Appointment creation failed:', result.error);
        setBookingError(result.error || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('❌ Booking error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create appointment';
      setBookingError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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

  const selectedServiceData = (services: BookingService[]) => {
    const serviceName = selectedService();
    
    // Safety check for undefined services
    if (!services || !Array.isArray(services)) {
      return undefined;
    }
    
    const found = services.find(s => s.name === serviceName);
    return found;
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
