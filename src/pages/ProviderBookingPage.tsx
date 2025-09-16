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
  H3, 
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
import { type BookingService } from '../types/service';


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
    setSelectedService(serviceName);
    setBookingStep('durations');
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
            
            <ServicesCard services={services()}>
              <H4>Services</H4>
              <Show when={loading()}>
                <LoadingCard>Loading services...</LoadingCard>
              </Show>
              <Show when={error()}>
                <ErrorCard>{error()}</ErrorCard>
              </Show>
              <Show when={!loading() && !error() && services().length > 0}>
                <ServicesList 
                  services={services()} 
                  onServiceSelect={handleServiceSelect}
                />
              </Show>
              <Show when={!loading() && !error() && services().length === 0}>
                <ErrorCard>No services available</ErrorCard>
              </Show>
            </ServicesCard>

            <AppointmentsCard>
              <H4>Your Appointments</H4>
              <Show when={appointments.loading}>
                <LoadingCard>Loading appointments...</LoadingCard>
              </Show>
              <Show when={appointments.error}>
                <ErrorCard>Failed to load appointments</ErrorCard>
              </Show>
              <Show when={appointments() && appointments()!.length > 0}>
                <div class="space-y-2">
                  {appointments()!.map(appointment => (
                    <Card key={`${appointment.date}-${appointment.time}`}>
                      <div class="flex justify-between items-center">
                        <div>
                          <div class="font-medium">{appointment.service}</div>
                          <div class="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </div>
                        </div>
                        <div class="text-sm text-muted-foreground">
                          {appointment.duration} min
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Show>
              <Show when={appointments() && appointments()!.length === 0}>
                <p class="text-muted-foreground text-sm">No appointments scheduled</p>
              </Show>
            </AppointmentsCard>
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
                  durations={filteredDurations()} 
                  onDurationSelect={handleDurationSelect}
                />
                <button 
                  onClick={handleBackToServices}
                  class="mt-4 text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to Services
                </button>
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
                duration={selectedDuration()!}
                slot={selectedSlot()}
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
