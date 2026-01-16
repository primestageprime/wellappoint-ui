import { Show, For, createMemo, createResource, type JSX } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { useParams } from '@solidjs/router';
import { CheckCircle } from 'lucide-solid';
import {
  PageFrame,
  HeaderCard,
  Content,
  Split,
  Avatar,
  LogoutButton,
  AppointmentsContainer,
  AppointmentItem,
  ServicesContainer,
  ServiceItem,
  ServiceSummaryCard,
  DurationListContainer,
  DurationItem,
  DurationSummaryCard,
  LoadingState,
  TimeSlotListContainer,
  DaySlotGroup,
  TimeItem,
  BookingConfirmationContainer,
  AppointmentDetailsGrid,
  ServiceDetailItem,
  DescriptionDetailItem,
  TimeSlotDetailItem,
  DurationDetailItem,
  LocationDetailItem,
  PriceDetailItem,
  ActionButtons,
  SecondaryButton,
  PrimaryButton,
  CenteredContent,
  PrimaryHeart,
  PrimaryCraniosacral,
  PrimaryFootReflexology,
} from '../components/visual';
import { TimezoneDisplay } from '../components/TimezoneDisplay';
import { useBooking } from '../stores/bookingStore';
import { useServices } from '../stores/servicesStore';
import { useAppointments } from '../hooks/useAppointments';
import { getAvailableSlots } from '../services/availabilityService';
import { createAppointment, createBookingRequest } from '../services/bookingService';
import { type BookingService } from '../types/service';
import { type AvailableSlot } from '../types/global';

// Service icons mapping
const serviceIcons: Record<string, JSX.Element> = {
  'Massage': <PrimaryHeart />,
  'Cranial Sacral Massage': <PrimaryCraniosacral />,
  'Reflexology': <PrimaryFootReflexology />,
};

export function ProviderBookingPage() {
  const auth = useAuth();
  const params = useParams();
  const booking = useBooking();
  const servicesStore = useServices();
  
  const username = () => params.username as string;
  const userEmail = () => auth.user()?.email;
  
  // Appointments (existing hook)
  const appointments = useAppointments(() => userEmail(), username);
  
  // Current step from state machine
  const step = () => booking.currentStep();
  
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
      const provider = username();
      
      return service && duration && email ? 
        { service, duration, email, provider } : null;
    },
    async (params) => {
      console.log('🔍 Fetching slots for:', params);
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
    if (!slots || slots.length === 0) return [];
    
    const grouped = new Map<string, AvailableSlot[]>();
    
    slots.forEach(slot => {
      const date = new Date(slot.startTime);
      const dateKey = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(slot);
    });
    
    return Array.from(grouped.entries()).map(([date, times]) => ({
      date,
      times: times.map(slot => ({
        time: new Date(slot.startTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        }),
        available: true,
        slot // Store the original slot for booking
      }))
    }));
  });
  
  // Format slot time for display
  const formatSlotTime = (slot: AvailableSlot) => {
    const date = new Date(slot.startTime);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Handle booking confirmation
  const handleConfirm = async () => {
    const service = booking.state.selectedService;
    const duration = booking.state.selectedDuration;
    const slot = booking.state.selectedSlot;
    const email = userEmail();
    
    if (!service || !duration || !slot || !email) {
      console.error('❌ Missing booking information');
      return;
    }
    
    booking.actions.setSubmitting(true);
    
    try {
      const bookingRequest = createBookingRequest(
        service,
        duration,
        slot,
        email,
        username()
      );
      
      console.log('🔍 Creating appointment:', bookingRequest);
      const result = await createAppointment(bookingRequest);
      
      if (result.success) {
        console.log('✅ Appointment created successfully');
        booking.actions.setConfirmed(true);
        // Refetch appointments to show the new one
        appointments.refetchAppointments();
      } else {
        console.error('❌ Appointment creation failed:', result.error);
        alert(result.error || 'Failed to create appointment');
        booking.actions.setSubmitting(false);
      }
    } catch (error) {
      console.error('❌ Booking error:', error);
      alert('Failed to create appointment');
      booking.actions.setSubmitting(false);
    }
  };

  return (
    <PageFrame>
      <HeaderCard>
        <Split 
          left={<Avatar username={username} />}
          right={<LogoutButton onLogout={() => auth.logout()}>Logout</LogoutButton>}
        />
      </HeaderCard>
      
      <Content>
        {/* Show appointments if they exist */}
        <Show when={appointments.appointments() && typeof appointments.appointments() === 'object' && 'appointments' in appointments.appointments()!}>
          <AppointmentsContainer 
            appointmentRequestCap={(appointments.appointments() as any).appointmentRequestCap}
            appointmentCount={(appointments.appointments() as any).appointments.length}
          >
            <For each={(appointments.appointments() as any).appointments}>
              {(apt) => (
                <AppointmentItem
                  service={apt.service}
                  duration={apt.duration}
                  date={apt.date}
                  time={apt.time}
                />
              )}
            </For>
          </AppointmentsContainer>
        </Show>
        
        {/* STEP 1: Choose Service */}
        <Show when={step().showServices}>
          <ServicesContainer title="Available Services">
            <For each={uniqueServices()}>
              {(service) => {
                const desc = service.description || '';
                return (
                  <ServiceItem
                    name={service.name}
                    description={desc}
                    icon={serviceIcons[service.name] || <PrimaryHeart />}
                    onClick={() => booking.actions.selectService(service.name)}
                  />
                );
              }}
            </For>
          </ServicesContainer>
        </Show>
        
        {/* STEP 2: Choose Duration */}
        <Show when={step().showDurations}>
          <ServiceSummaryCard
            icon={serviceIcons[booking.state.selectedService!] || <PrimaryHeart />}
            title={booking.state.selectedService!}
            subtitle={uniqueServices().find(s => s.name === booking.state.selectedService)?.description ?? ''}
            onEdit={() => booking.actions.unselectService()}
          />
          
          <DurationListContainer title="Available Durations">
            <For each={serviceDurations()}>
              {(service) => (
                <DurationItem
                  duration={`${service.duration} minutes`}
                  description={service.durationDescription ?? service.description ?? ''}
                  price={`$${service.price}`}
                  onClick={() => booking.actions.selectDuration(service.duration)}
                />
              )}
            </For>
          </DurationListContainer>
        </Show>
        
        {/* STEP 3: Loading Slots */}
        <Show when={step().showLoadingSlots}>
          <ServiceSummaryCard
            icon={serviceIcons[booking.state.selectedService!] || <PrimaryHeart />}
            title={booking.state.selectedService!}
            subtitle={selectedServiceData()?.description ?? ''}
          />
          
          <DurationSummaryCard
            duration={booking.state.selectedDuration!}
            price={selectedServiceData()?.price || 0}
            description={selectedServiceData()?.durationDescription || ''}
          />
          
          <LoadingState message="Finding available times..." />
        </Show>
        
        {/* STEP 4: Choose Slot */}
        <Show when={step().showSlotSelection}>
          <ServiceSummaryCard
            icon={serviceIcons[booking.state.selectedService!] || <PrimaryHeart />}
            title={booking.state.selectedService!}
            subtitle={selectedServiceData()?.description || ''}
            onEdit={() => booking.actions.unselectService()}
          />
          
          <DurationSummaryCard
            duration={booking.state.selectedDuration!}
            price={selectedServiceData()?.price || 0}
            description={selectedServiceData()?.durationDescription || ''}
            onEdit={() => booking.actions.unselectDuration()}
          />
          
          <Show when={groupedSlots().length > 0} fallback={
            <div class="text-center py-8 text-muted-foreground">
              No available time slots found. Please try a different service or duration.
            </div>
          }>
            <TimezoneDisplay class="mb-4 px-4" />
            <TimeSlotListContainer>
              <For each={groupedSlots()}>
                {(daySlots) => (
                  <DaySlotGroup date={daySlots.date}>
                    <For each={daySlots.times}>
                      {(timeSlot) => (
                        <TimeItem
                          time={timeSlot.time}
                          available={timeSlot.available}
                          onClick={() => booking.actions.selectSlot((timeSlot as any).slot)}
                        />
                      )}
                    </For>
                  </DaySlotGroup>
                )}
              </For>
            </TimeSlotListContainer>
          </Show>
        </Show>
        
        {/* STEP 5: Confirmation */}
        <Show when={step().showConfirmation}>
          <BookingConfirmationContainer title="Confirm Your Appointment">
            <AppointmentDetailsGrid>
              <ServiceDetailItem value={booking.state.selectedService!} />
              <DescriptionDetailItem value={selectedServiceData()?.description || ''} />
              <TimeSlotDetailItem value={formatSlotTime(booking.state.selectedSlot!)} />
              <DurationDetailItem value={`${booking.state.selectedDuration} minutes`} />
              <LocationDetailItem value={booking.state.selectedSlot?.location || 'Location TBD'} />
              <PriceDetailItem value={`$${selectedServiceData()?.price || 0}`} />
            </AppointmentDetailsGrid>
            
            <ActionButtons>
              <SecondaryButton onClick={() => booking.actions.goBackToSlots()}>Back</SecondaryButton>
              <PrimaryButton onClick={handleConfirm}>Confirm Your Session</PrimaryButton>
            </ActionButtons>
          </BookingConfirmationContainer>
        </Show>
        
        {/* STEP 6: Processing */}
        <Show when={step().showCreatingAppointment}>
          <BookingConfirmationContainer title="Processing Your Appointment">
            <AppointmentDetailsGrid>
              <ServiceDetailItem value={booking.state.selectedService!} />
              <DescriptionDetailItem value={selectedServiceData()?.description || ''} />
              <TimeSlotDetailItem value={formatSlotTime(booking.state.selectedSlot!)} />
              <DurationDetailItem value={`${booking.state.selectedDuration} minutes`} />
              <LocationDetailItem value={booking.state.selectedSlot?.location || 'Location TBD'} />
              <PriceDetailItem value={`$${selectedServiceData()?.price || 0}`} />
            </AppointmentDetailsGrid>
            
            <LoadingState message="Submitting your appointment request..." />
          </BookingConfirmationContainer>
        </Show>
        
        {/* STEP 7: Success */}
        <Show when={step().showAppointmentConfirmed}>
          {/* Show updated appointments list */}
          <Show when={appointments.appointments() && typeof appointments.appointments() === 'object' && 'appointments' in appointments.appointments()!}>
            <AppointmentsContainer 
              appointmentRequestCap={(appointments.appointments() as any).appointmentRequestCap}
              appointmentCount={(appointments.appointments() as any).appointments.length}
            >
              <For each={(appointments.appointments() as any).appointments}>
                {(apt) => (
                  <AppointmentItem
                    service={apt.service}
                    duration={apt.duration}
                    date={apt.date}
                    time={apt.time}
                  />
                )}
              </For>
            </AppointmentsContainer>
          </Show>
          
          <CenteredContent>
            <div class="flex justify-center mb-4">
              <CheckCircle class="w-16 h-16 text-green-600" />
            </div>
            <p class="text-card-foreground font-semibold text-lg">Appointment Request Confirmed!</p>
            <p class="text-muted-foreground text-center max-w-md">
              Your appointment request has been submitted successfully. You'll receive a confirmation email shortly.
            </p>
          </CenteredContent>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 class="font-semibold text-green-900 mb-2">What happens next?</h4>
            <ul class="text-sm text-green-800 space-y-1">
              <li>• Check your email for confirmation details</li>
              <li>• Your provider will review and confirm your appointment</li>
              <li>• You'll receive a calendar invitation once confirmed</li>
            </ul>
          </div>
          
          <ActionButtons>
            <PrimaryButton onClick={() => booking.actions.reset()}>
              Book Another Appointment
            </PrimaryButton>
          </ActionButtons>
        </Show>
      </Content>
    </PageFrame>
  );
}

