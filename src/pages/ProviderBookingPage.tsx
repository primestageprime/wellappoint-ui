import { Show, createMemo, createResource, createSignal } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { useParams, A } from '@solidjs/router';
import { useTaskTimer } from '../hooks/useTaskTimer';
import { taskMetrics } from '../utils/taskMetrics';
import { animateProgress } from '../utils/progressAnimation';
import {
  PageFrame,
  HeaderCard,
  Content,
  Split,
  Avatar,
  LogoutButton,
} from '../components/visual';
import {
  AppointmentsList,
  ServiceSelectionStep,
  DurationSelectionStep,
  LoadingSlotsStep,
  TimeSlotSelectionStep,
  BookingConfirmationStep,
  BookingSuccessStep,
} from '../components/booking';
import { ProviderCard } from '../components/ProviderCard';
import { useBooking } from '../stores/bookingStore';
import { useServices } from '../stores/servicesStore';
import { useAppointments } from '../hooks/useAppointments';
import { getAvailableSlots } from '../services/availabilityService';
import { createAppointment, createBookingRequest } from '../services/bookingService';
import { type BookingService } from '../types/service';
import { type UserAppointmentsResponse } from '../types/global';
import { groupSlotsByDate } from '../utils/slotFormatting';

export function ProviderBookingPage() {
  const auth = useAuth();
  const params = useParams();
  const booking = useBooking();
  const servicesStore = useServices();

  const providerUsername = () => params.username as string;
  const userEmail = () => auth.user()?.email;

  // Track booking success for progress button animation
  const [isBookingSuccess, setIsBookingSuccess] = createSignal(false);
  const [bookingProgress, setBookingProgress] = createSignal(0);
  
  // Appointments (existing hook)
  const appointments = useAppointments(() => userEmail(), providerUsername);
  
  // Use display name from appointments (Preferred Name > Name > email username), fallback to email username
  const loggedInUsername = createMemo(() => {
    const apts = appointments.appointments();

    // Check if we have valid appointments data (not an array, but the UserAppointmentsResponse object)
    if (apts && typeof apts === 'object' && !Array.isArray(apts) && 'displayName' in apts) {
      const response = apts as UserAppointmentsResponse;
      if (response.displayName) {
        return response.displayName;
      }
    }
    // Fallback to email username while loading or if displayName not available
    return auth.user()?.nickname || auth.user()?.email?.split('@')[0] || '';
  });

  // Check if the logged-in user is the admin for this provider
  const isProviderAdmin = createMemo(() => {
    const user = auth.user();
    if (!user) return false;

    const provider = providerUsername();
    const userUsername = user.nickname || user.email?.split('@')[0];

    return userUsername === provider;
  });
  
  // Current step from state machine
  const step = () => {
    return booking.currentStep();
  };
  
  // Get unique services (for services list)
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
  
  // Get durations for selected service
  const serviceDurations = createMemo(() => {
    const services = servicesStore.services();
    const selected = booking.state.selectedService;
    if (!services || !selected) return [];
    
    return services.filter(s => s.name === selected);
  });
  
  // Get selected service data
  const selectedServiceData = createMemo(() => {
    const services = servicesStore.services();
    const selected = booking.state.selectedService;
    const duration = booking.state.selectedDuration;
    if (!services || !selected || !duration) return null;
    
    return services.find(s => s.name === selected && s.duration === duration);
  });
  
  // Fetch available slots when duration is selected
  const [availableSlots] = createResource(
    () => {
      const service = booking.state.selectedService;
      const duration = booking.state.selectedDuration;
      const email = userEmail();
      const provider = providerUsername();

      return service && duration && email ?
        { service, duration, email, provider } : null;
    },
    async (params) => {
      const startTime = Date.now();
      try {
        const result = await getAvailableSlots(
          params.service,
          params.duration,
          params.email,
          params.provider
        );

        // Record task completion time
        const elapsedMs = Date.now() - startTime;
        taskMetrics.recordTask('loading-time-slots', elapsedMs);

        return result;
      } catch (error) {
        // Still record the time even on error
        const elapsedMs = Date.now() - startTime;
        taskMetrics.recordTask('loading-time-slots', elapsedMs);
        throw error;
      }
    }
  );
  
  // Group slots by date
  const groupedSlots = createMemo(() => {
    const slots = availableSlots();
    return groupSlotsByDate(slots || []);
  });
  
  // Handle booking confirmation
  const handleConfirm = async () => {
    const service = booking.state.selectedService;
    const duration = booking.state.selectedDuration;
    const slot = booking.state.selectedSlot;
    const email = userEmail();

    if (!service || !duration || !slot || !email) {
      console.error('Missing booking information');
      return;
    }

    booking.actions.setSubmitting(true);
    setBookingProgress(0);

    // Start progress animation
    const stopProgress = animateProgress(
      10000, // 10 second estimate
      (progress) => setBookingProgress(progress),
      () => {} // onComplete handled by API response
    );

    const startTime = Date.now();

    try {
      const bookingRequest = createBookingRequest(
        service,
        duration,
        slot,
        email,
        providerUsername()
      );

      const result = await createAppointment(bookingRequest);

      // Record task completion time
      const elapsedMs = Date.now() - startTime;
      taskMetrics.recordTask('booking-appointment', elapsedMs);

      if (result.success) {
        stopProgress(); // Stop the animation
        setBookingProgress(100); // Jump to 100%
        booking.actions.setSubmitting(false);
        setIsBookingSuccess(true);
        // Brief delay to show success animation before transitioning to success step
        setTimeout(() => {
          booking.actions.setConfirmed(true);
          // Refetch appointments to show the new one
          appointments.refetchAppointments();
          // Reset success state for next booking
          setIsBookingSuccess(false);
          setBookingProgress(0);
        }, 800);
      } else {
        stopProgress(); // Stop the animation on error
        console.error('Appointment creation failed:', result.error);
        alert(result.error || 'Failed to create appointment');
        booking.actions.setSubmitting(false);
        setIsBookingSuccess(false);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create appointment');

      // Still record the time even on error
      const elapsedMs = Date.now() - startTime;
      taskMetrics.recordTask('booking-appointment', elapsedMs);

      stopProgress(); // Stop the animation on error
      booking.actions.setSubmitting(false);
      setIsBookingSuccess(false);
    }
  };

  return (
    <PageFrame>
      <HeaderCard>
        <Split
          left={<Avatar username={loggedInUsername} />}
          right={
            <div class="flex items-center gap-2">
              <Show when={isProviderAdmin()}>
                <A
                  href={`/admin/${providerUsername()}`}
                  class="text-primary hover:text-primary/80 px-2"
                >
                  Admin
                </A>
              </Show>
              <LogoutButton onLogout={() => auth.logout()}>Logout</LogoutButton>
            </div>
          }
        />
      </HeaderCard>
      
      <Content>
        {/* Provider Profile Card */}
        <ProviderCard username={providerUsername()} />
        
        {/* Show appointments if they exist - but not on receipt page (receipt has its own) */}
        <Show when={!step().showAppointmentConfirmed && appointments.appointments() && typeof appointments.appointments() === 'object' && 'appointments' in appointments.appointments()!}>
          <AppointmentsList appointments={appointments.appointments() as UserAppointmentsResponse} />
        </Show>
        
        {/* STEP 1: Choose Service */}
        <Show when={step().showServices}>
          <ServiceSelectionStep
            services={uniqueServices()}
            appointmentCount={
              appointments.appointments() && typeof appointments.appointments() === 'object' && 'appointments' in appointments.appointments()!
                ? (appointments.appointments() as UserAppointmentsResponse).appointments.length
                : 0
            }
            appointmentRequestCap={
              appointments.appointments() && typeof appointments.appointments() === 'object' && 'appointmentRequestCap' in appointments.appointments()!
                ? (appointments.appointments() as UserAppointmentsResponse).appointmentRequestCap
                : 1
            }
            onSelectService={booking.actions.selectService}
          />
        </Show>
        
        {/* STEP 2: Choose Duration */}
        <Show when={step().showDurations}>
          <DurationSelectionStep
            selectedServiceName={booking.state.selectedService!}
            serviceDescription={uniqueServices().find(s => s.name === booking.state.selectedService)?.description ?? ''}
            durations={serviceDurations()}
            onSelectDuration={booking.actions.selectDuration}
            onEditService={booking.actions.unselectService}
          />
        </Show>
        
        {/* STEP 3: Loading Slots - Show when state machine says loading OR when resource is still loading */}
        <Show when={step().showLoadingSlots || (booking.state.selectedDuration !== null && availableSlots.loading)}>
          <LoadingSlotsStep
            selectedServiceName={booking.state.selectedService!}
            serviceDescription={selectedServiceData()?.description ?? ''}
            selectedDuration={booking.state.selectedDuration!}
            durationDescription={selectedServiceData()?.durationDescription || ''}
            price={selectedServiceData()?.price || 0}
          />
        </Show>
        
        {/* STEP 4: Choose Slot - Only show when NOT loading and we have a duration selected */}
        <Show when={step().showSlotSelection && !availableSlots.loading && booking.state.selectedDuration !== null}>
          <TimeSlotSelectionStep
            selectedServiceName={booking.state.selectedService!}
            serviceDescription={selectedServiceData()?.description || ''}
            selectedDuration={booking.state.selectedDuration!}
            durationDescription={selectedServiceData()?.durationDescription || ''}
            price={selectedServiceData()?.price || 0}
            groupedSlots={groupedSlots()}
            onSelectSlot={booking.actions.selectSlot}
            onEditService={booking.actions.unselectService}
            onEditDuration={booking.actions.unselectDuration}
          />
        </Show>
        
        {/* STEP 5: Confirmation & STEP 6: Processing */}
        <Show when={step().showConfirmation || step().showCreatingAppointment}>
          <BookingConfirmationStep
            serviceName={booking.state.selectedService!}
            serviceDescription={selectedServiceData()?.description || ''}
            duration={booking.state.selectedDuration!}
            slot={booking.state.selectedSlot!}
            price={selectedServiceData()?.price || 0}
            isSubmitting={step().showCreatingAppointment}
            isSuccess={isBookingSuccess()}
            progress={bookingProgress()}
            onConfirm={handleConfirm}
            onBack={booking.actions.goBackToSlots}
          />
        </Show>
        
        {/* STEP 7: Success */}
        <Show when={step().showAppointmentConfirmed}>
          <BookingSuccessStep
            appointments={(appointments.appointments() || undefined) as UserAppointmentsResponse | undefined}
            onBookAnother={booking.actions.reset}
          />
        </Show>
      </Content>
    </PageFrame>
  );
}

