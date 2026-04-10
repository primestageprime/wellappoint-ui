import { createMemo, createResource, createSignal, type Accessor } from 'solid-js';
import { useParams } from '@solidjs/router';
import { taskMetrics } from '../utils/taskMetrics';
import { animateProgress } from '../utils/progressAnimation';
import { useBooking } from '../stores/bookingStore';
import { useServices } from '../stores/servicesStore';
import { getAvailableSlots } from '../services/availabilityService';
import { createAppointment, createBookingRequest } from '../services/bookingService';
import { getProviderDetails, ProviderNotFoundError } from '../services/providerService';
import { type BookingService } from '../types/service';
import { groupSlotsByDate } from '../utils/slotFormatting';

export interface BookingFlowConfig {
  email: Accessor<string | undefined>;
  buildRequest?: (baseRequest: ReturnType<typeof createBookingRequest>) => Record<string, unknown>;
  onSuccess?: () => void;
}

export function useBookingFlow(config: BookingFlowConfig) {
  const params = useParams();
  const booking = useBooking();
  const servicesStore = useServices();

  const providerUsername = () => params.username as string;

  const [provider] = createResource(providerUsername, getProviderDetails);
  const providerNotFound = createMemo(() =>
    provider.error instanceof ProviderNotFoundError
  );

  const [isBookingSuccess, setIsBookingSuccess] = createSignal(false);
  const [bookingProgress, setBookingProgress] = createSignal(0);
  const [bookingError, setBookingError] = createSignal<string | null>(null);

  const uniqueServices = createMemo(() => {
    const services = servicesStore.services();
    if (!services) return [];
    const serviceMap = new Map<string, BookingService>();
    services.forEach(service => {
      if (!serviceMap.has(service.name)) {
        serviceMap.set(service.name, service);
      }
    });
    return Array.from(serviceMap.values());
  });

  const serviceDurations = createMemo(() => {
    const services = servicesStore.services();
    const selected = booking.state.selectedService;
    if (!services || !selected) return [];
    return services.filter(s => s.name === selected);
  });

  const selectedServiceData = createMemo(() => {
    const services = servicesStore.services();
    const selected = booking.state.selectedService;
    const duration = booking.state.selectedDuration;
    if (!services || !selected || !duration) return null;
    return services.find(s => s.name === selected && s.duration === duration);
  });

  const [availableSlots] = createResource(
    () => {
      const service = booking.state.selectedService;
      const duration = booking.state.selectedDuration;
      const email = config.email();
      const prov = providerUsername();
      const windowDays = provider()?.bookingWindowDays ?? 14;
      if (provider.loading) return null;
      return service && duration && email
        ? { service, duration, email, provider: prov, bookingWindowDays: windowDays }
        : null;
    },
    async (params) => {
      const startTime = Date.now();
      try {
        return await getAvailableSlots(
          params.service,
          params.duration,
          params.email,
          params.provider,
          params.bookingWindowDays,
        );
      } finally {
        taskMetrics.recordTask('loading-time-slots', Date.now() - startTime);
      }
    }
  );

  const groupedSlots = createMemo(() => groupSlotsByDate(availableSlots() || []));

  const handleConfirm = async () => {
    const service = booking.state.selectedService;
    const duration = booking.state.selectedDuration;
    const slot = booking.state.selectedSlot;
    const email = config.email();

    if (!service || !duration || !slot || !email) return;

    booking.actions.setSubmitting(true);
    setBookingProgress(0);
    setBookingError(null);

    const stopProgress = animateProgress(
      10000,
      (progress) => setBookingProgress(progress),
      () => {}
    );

    const startTime = Date.now();

    try {
      const baseRequest = createBookingRequest(service, duration, slot, email, providerUsername());
      const request = config.buildRequest ? config.buildRequest(baseRequest) : baseRequest;
      const result = await createAppointment(request);

      if (result.success) {
        stopProgress();
        setBookingProgress(100);
        booking.actions.setSubmitting(false);
        setIsBookingSuccess(true);
        setTimeout(() => {
          booking.actions.setConfirmed(true);
          config.onSuccess?.();
          setIsBookingSuccess(false);
          setBookingProgress(0);
        }, 800);
      } else {
        stopProgress();
        console.error('Appointment creation failed:', result.error);
        setBookingError(result.error || 'Failed to create appointment');
        booking.actions.setSubmitting(false);
      }
    } catch (error) {
      console.error('Booking error:', error);
      stopProgress();
      setBookingError(error instanceof Error ? error.message : 'Failed to create appointment');
      booking.actions.setSubmitting(false);
    } finally {
      taskMetrics.recordTask('booking-appointment', Date.now() - startTime);
    }
  };

  return {
    providerUsername,
    provider,
    providerNotFound,
    booking,
    step: () => booking.currentStep(),
    uniqueServices,
    serviceDurations,
    selectedServiceData,
    availableSlots,
    groupedSlots,
    isBookingSuccess,
    bookingProgress,
    bookingError,
    handleConfirm,
  };
}
