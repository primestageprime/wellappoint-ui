import { createSignal, createEffect, createResource, Show } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { ServicesList } from '../components/ServicesList';
import { DurationsList } from '../components/DurationsList';
import { AvailabilityList } from '../components/AvailabilityList';
import { ConfirmationPanel } from '../components/ConfirmationPanel';
import { 
  ProviderContent, 
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

// Helper function to convert UserAppointment to the format expected by AppointmentsCard
const convertToAppointmentCardFormat = (appointment: UserAppointment) => ({
  service: appointment.service,
  duration: appointment.duration,
  date: appointment.date,
  time: appointment.time
});

export function BookingPage() {
  const auth = useAuth();
  const [services, setServices] = createSignal<BookingService[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [selectedService, setSelectedService] = createSignal<string | null>(null);
  const [selectedDuration, setSelectedDuration] = createSignal<number | null>(null);
  const [selectedSlot, setSelectedSlot] = createSignal<any | null>(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = createSignal<boolean | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [confirmationError, setConfirmationError] = createSignal<string | null>(null);
  const [loadingAppointments, setLoadingAppointments] = createSignal(false);
  const [provider] = createResource(getProviderDetails);
  
  // Get user appointments
  const userEmail = () => auth.user()?.email || '';
  const [appointments, { refetch: refetchAppointments }] = createResource(userEmail, getUserAppointments);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/services');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchServices();
  });

  // Reset loadingAppointments when appointments are refreshed
  createEffect(() => {
    if (appointments()) {
      setLoadingAppointments(false);
    }
  });



  const handleLogout = async () => {
    await auth.logout();
  };

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
    setSelectedDuration(null);
  };

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
  };

  const handleBackToServices = () => {
    setSelectedService(null);
    setSelectedDuration(null);
  };

  const handleBackToDurations = () => {
    setSelectedDuration(null);
    setSelectedSlot(null);
  };

  const handleTimeSelect = (slot: any) => {
    setSelectedSlot(slot);
    setAppointmentConfirmed(undefined); // Reset to show confirmation screen
  };

  const handleBackToTimeSelection = () => {
    setSelectedSlot(null);
  };

  const handleBookAnotherSession = () => {
    setSelectedService(null);
    setSelectedDuration(null);
    setSelectedSlot(null);
    setAppointmentConfirmed(undefined);
    setConfirmationError(null);
  };

  const handleConfirmAppointment = async () => {
    console.log('🔍 Starting appointment creation...');
    setIsSubmitting(true);
    setConfirmationError(null);
    setAppointmentConfirmed(undefined); // Reset any previous state

    try {
      const userEmail = auth.user()?.email;
      if (!userEmail) {
        throw new Error('No user email available');
      }

      // Convert ISO timestamp to YYYY-MM-DD HH:mm format
      const startDate = new Date(selectedSlot()!.startTime);
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      const hours = String(startDate.getHours()).padStart(2, '0');
      const minutes = String(startDate.getMinutes()).padStart(2, '0');
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

      const selectedServiceData = services().find(s => s.name === selectedService() && s.duration === selectedDuration())!;

      const requestBody = {
        service: selectedServiceData.name,
        duration: selectedServiceData.duration,
        start: formattedDateTime,
        email: userEmail,
        location: selectedSlot()!.location,
        userProfile: {
          name: auth.user()?.name,
          given_name: auth.user()?.given_name,
          family_name: auth.user()?.family_name,
          nickname: auth.user()?.nickname
        }
      };

      console.log('🔍 Creating appointment with request:', requestBody);

      const response = await fetch('/appointment_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Appointment created successfully:', result);
      
      // Set appointment as confirmed and start loading appointments
      setAppointmentConfirmed(true);
      setLoadingAppointments(true);
      
      // Refresh appointments immediately
      refetchAppointments();

    } catch (err) {
      console.error('❌ Failed to create appointment:', err);
      setConfirmationError(err instanceof Error ? err.message : 'Failed to create appointment');
      setAppointmentConfirmed(false); // Explicitly set to false on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const userName = () => {
    return auth.user()?.nickname || 
           auth.user()?.given_name || 
           auth.user()?.name || 
           auth.user()?.email || 
           'User';
  };

  return (
    <PageFrame>
      <HeaderCard>
        <Split 
          left={<Avatar name={userName()} />}
          right={<LogoutButton onLogout={handleLogout}>Logout</LogoutButton>}
        />
      </HeaderCard>
      
      <Content>
        {provider() && (
          <Card class="border border-primary/10 mb-4">
            <ProviderContent 
              name={provider()!.name}
              email={provider()!.email}
              title={provider()!.title}
            />
          </Card>
        )}
        
        {appointments() && (
          <AppointmentsCard 
            appointments={appointments()!.appointments.map(convertToAppointmentCardFormat)}
            appointmentRequestCap={appointments()!.appointmentRequestCap}
          />
        )}

        {loading() && (
          <LoadingCard message="Loading services..." />
        )}

        {error() && (
          <ErrorCard error={error()!} onRetry={fetchServices} />
        )}

        {!loading() && !error() && (
          <Show 
            when={!appointments() || appointments()!.appointments.length < appointments()!.appointmentRequestCap}
            fallback={
              <Card class="p-6 text-center space-y-4">
                <div class="text-4xl">📋</div>
                <H3>Appointment Limit Reached</H3>
                <p class="text-muted-foreground">
                  You have reached the maximum number of booked appointments. If you would like to increase this limit, please contact the provider.
                </p>
              </Card>
            }
          >
                           <>
                 {!selectedService() && !loadingAppointments() && (
                   <ServicesList
                     services={services()}
                     onServiceSelect={handleServiceSelect}
                   />
                 )}
              
              {selectedService() && !selectedDuration() && (
                <DurationsList 
                  services={services()}
                  selectedService={selectedService()!}
                  onDurationSelect={handleDurationSelect}
                  onBack={handleBackToServices}
                />
              )}
              
              {selectedService() && selectedDuration() && !selectedSlot() && (
                <AvailabilityList 
                  services={services()}
                  selectedService={selectedService()!}
                  selectedDuration={selectedDuration()!}
                  onBack={handleBackToDurations}
                  onTimeSelect={handleTimeSelect}
                />
              )}
              
              {selectedService() && selectedDuration() && selectedSlot() && (
                <ConfirmationPanel
                  service={services().find(s => s.name === selectedService() && s.duration === selectedDuration())!}
                  selectedSlot={selectedSlot()}
                  isSubmitting={isSubmitting()}
                  error={confirmationError()}
                  success={appointmentConfirmed() === true ? 'Appointment created successfully!' : undefined}
                  onBack={handleBackToTimeSelection}
                  onConfirm={handleConfirmAppointment}
                  onBookAnother={handleBookAnotherSession}
                />
              )}
              
            </>
          </Show>
        )}
      </Content>
    </PageFrame>
  );
}
