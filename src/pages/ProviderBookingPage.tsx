import { createSignal, createEffect, createResource, Show } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { useParams } from '@solidjs/router';
import { ServicesList } from '../components/ServicesList';
import { DurationsList } from '../components/DurationsList';
import { AvailabilityList } from '../components/AvailabilityList';
import { ConfirmationPanel } from '../components/ConfirmationPanel';
import { 
  AppointmentsCard, 
  ServicesCard, 
  LogoutButton, 
  H4, 
  CenteredContent,
  PageFrame,
  HeaderCard,
  Content,
  Card,
  Split,
  Avatar,
  LoadingCard,
  ErrorCard
} from '../components/visual';
import { getProviderDetails } from '../services/providerService';
import { getUserAppointments, type UserAppointment } from '../services/appointmentService';
import { type BookingService, type UIService } from '../types/service';
import { annotateOnClick } from '../utils/serviceUtils';


export function ProviderBookingPage() {
  const auth = useAuth();
  const params = useParams();
  const username = () => params.username;
  
  console.log('🔍 ProviderBookingPage - username:', username());
  console.log('🔍 ProviderBookingPage - user:', auth.user());
  
  const [services, setServices] = createSignal<BookingService[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [selectedService, setSelectedService] = createSignal<string | null>(null);
  const [selectedDuration, setSelectedDuration] = createSignal<number | null>(null);
  const [selectedSlot, setSelectedSlot] = createSignal<any | null>(null);
  const [bookingStep, setBookingStep] = createSignal<'services' | 'durations' | 'availability' | 'confirmation'>('services');
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [bookingError, setBookingError] = createSignal<string | null>(null);

  // Fetch provider details
  const [providerDetails] = createResource(() => getProviderDetails());

  // Fetch user appointments
  const [appointments, { refetch: refetchAppointments }] = createResource(
    () => ({ userEmail: auth.user()?.email, provider: username() }),
    async ({ userEmail, provider }) => {
      if (!userEmail) return [];
      return await getUserAppointments(userEmail, provider);
    }
  );

  const fetchServices = async () => {
    try {
      console.log('🔍 fetchServices called for username:', username());
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/services?username=${username()}`);
      console.log('🔍 Services response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const services = annotateOnClick(setSelectedService, data);
      console.log('🔍 Services data:', data);
      setServices(data);
      console.log('🔍 Services set, setting loading to false');
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
      console.log('🔍 Loading set to false');
    }
  };

  createEffect(() => {
    const currentUsername = username();
    console.log('🔍 createEffect - username:', currentUsername);
    if (currentUsername) {
      fetchServices();
    }
  });

  // Reset loadingAppointments when appointments are refreshed
  createEffect(() => {
    if (appointments.loading) {
      // You can add loading state for appointments here if needed
    }
  });

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
    
    // Refresh appointments
    refetchAppointments();
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

  const selectedServiceData = () => {
    const serviceName = selectedService();
    return services().find(s => s.name === serviceName);
  };

  const filteredDurations = () => {
    const serviceName = selectedService();
    return services()
      .filter(s => s.name === serviceName)
      .map(s => ({ duration: s.duration, price: s.price, description: s.durationDescription }));
  };

  return (
    <PageFrame>
      <HeaderCard>
        <Split 
          left={
            <CenteredContent>
              <Show when={username()}>
              <Avatar name={username()!} />
              </Show>
            </CenteredContent>
          }
          right={
            <Show when={username()}>
              <LogoutButton onLogout={() => auth.logout()} />
            </Show>
          }
        />
      </HeaderCard>

      <Content>
        <Split 
          left={
            <div class="space-y-6">
            {/* Debug info */}
            <div class="bg-yellow-100 p-2 text-xs">
              Debug: loading={loading()}, error={error()}, services={services().length}
            </div>
            
            <ServicesCard services={services() as UIService[]} />
            <AppointmentsCard appointments={appointments() as UserAppointment[]} />
            </div>
          }
          right={
            <div class="space-y-6">
            <Show when={bookingStep() === 'services'}>
              <Card>
                <H4>Select a Service</H4>
                <p class="text-muted-foreground text-sm mb-4">
                  Choose from the available services to get started.
                </p>
              </Card>
            </Show>

            <Show when={bookingStep() === 'durations'}>
              <Card>
                <H4>Select Duration</H4>
                <p class="text-muted-foreground text-sm mb-4">
                  Choose your preferred duration for {selectedService()}.
                </p>
                <DurationsList 
                  services={services()}
                  selectedService={selectedService()!}
                  onDurationSelect={handleDurationSelect}
                  onBack={handleBackToServices}
                />
              </Card>
            </Show>

            <Show when={bookingStep() === 'availability'}>
              <Card>
                <H4>Select Time Slot</H4>
                <p class="text-muted-foreground text-sm mb-4">
                  Choose an available time slot for your appointment.
                </p>
                <AvailabilityList 
                  service={selectedService()!}
                  duration={selectedDuration()!}
                  onSlotSelect={handleSlotSelect}
                  provider={username()}
                />
                <button 
                  onClick={handleBackToDurations}
                  class="mt-4 text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to Duration
                </button>
              </Card>
            </Show>

            <Show when={bookingStep() === 'confirmation'}>
              <ConfirmationPanel 
                service={selectedServiceData()!}
                selectedSlot={selectedSlot()}
                isSubmitting={isSubmitting()}
                error={bookingError()}
                onConfirm={handleBookingComplete}
                onBack={handleBackToAvailability}
              />
            </Show>
            </div>
          }
        />
      </Content>
    </PageFrame>
  );
}
