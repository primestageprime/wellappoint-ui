import { Show, createMemo, createResource } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { useParams } from '@solidjs/router';
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
      return await getAvailableSlots(
        params.service,
        params.duration,
        params.email,
        params.provider
      );
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
    
    try {
      const bookingRequest = createBookingRequest(
        service,
        duration,
        slot,
        email,
        providerUsername()
      );
      
      const result = await createAppointment(bookingRequest);
      
      if (result.success) {
        booking.actions.setSubmitting(false);
        booking.actions.setConfirmed(true);
        // Refetch appointments to show the new one
        appointments.refetchAppointments();
      } else {
        console.error('Appointment creation failed:', result.error);
        alert(result.error || 'Failed to create appointment');
        booking.actions.setSubmitting(false);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create appointment');
      booking.actions.setSubmitting(false);
    }
  };

  return (
    <PageFrame>
      <HeaderCard>
        <Split 
          left={<Avatar username={loggedInUsername} />}
          right={<LogoutButton onLogout={() => auth.logout()}>Logout</LogoutButton>}
        />
      </HeaderCard>
      
      <Content>
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

