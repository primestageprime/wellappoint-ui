import { createSignal, createEffect, createResource, Show } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { ServicesList } from '../components/ServicesList';
import { DurationsList } from '../components/DurationsList';
import { AvailabilityList } from '../components/AvailabilityList';
import { ConfirmationPanel } from '../components/ConfirmationPanel';
import { LoadingPanel } from '../components/LoadingPanel';
import { SuccessPanel } from '../components/SuccessPanel';
import { apiFetch } from '../config/api';
import { 
  ProviderContent, 
  AppointmentsCard, 
  LogoutButton, 
  H3, 
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
import { getBookingState, type BookingState } from '../utils/bookingStateMachine';
import { runTests } from '../utils/testStateMachine';
import { debugBookingFlow } from '../utils/debugStateMachine';

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
  const [appointmentConfirmed, setAppointmentConfirmed] = createSignal<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [confirmationError, setConfirmationError] = createSignal<string | null>(null);
  const [, setLoadingAppointments] = createSignal(false);
  const [provider] = createResource(getProviderDetails);
  
  // Get user appointments
  const userEmail = () => auth.user()?.email || '';
  const [appointments, { refetch: refetchAppointments }] = createResource(userEmail, (email) => getUserAppointments(email));

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFetch('/services');
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
    setAppointmentConfirmed(null); // Reset to show confirmation screen
  };

  const handleBackToTimeSelection = () => {
    setSelectedSlot(null);
  };

  const handleBookAnotherSession = () => {
    setSelectedService(null);
    setSelectedDuration(null);
    setSelectedSlot(null);
    setAppointmentConfirmed(null);
    setConfirmationError(null);
  };

  const handleConfirmAppointment = async () => {
    console.log('🔍 Starting appointment creation...');
    setIsSubmitting(true);
    setConfirmationError(null);
    setAppointmentConfirmed(null); // Reset any previous state

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

      const response = await apiFetch('/appointment_request', {
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
      console.log('🔍 Setting appointmentConfirmed to true');
      setAppointmentConfirmed(true);
      setLoadingAppointments(true);
      
      // Refresh appointments immediately
      refetchAppointments();
      
      // Keep loading state for a moment to show the loading animation
      setTimeout(() => {
        console.log('🔍 Setting isSubmitting to false');
        setIsSubmitting(false);
      }, 1000);

    } catch (err) {
      console.error('❌ Failed to create appointment:', err);
      setConfirmationError(err instanceof Error ? err.message : 'Failed to create appointment');
      setAppointmentConfirmed(false); // Explicitly set to false on error
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

  // State machine for booking flow
  const bookingState = (): BookingState => ({
    selectedService: selectedService(),
    selectedDuration: selectedDuration(),
    selectedSlot: selectedSlot(),
    isLoadingSlots: false, // TODO: Add loading slots state when needed
    isSubmitting: isSubmitting(),
    appointmentConfirmed: appointmentConfirmed(),
  });

  const bookingFlow = () => getBookingState(bookingState());

  // Make test functions available globally for debugging
  (window as any).runBookingTests = runTests;
  (window as any).debugBookingFlow = debugBookingFlow;

  return (
    <PageFrame>
      <HeaderCard>
        <Split 
          left={<Avatar username={userName} />}
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
        
        {appointments() && typeof appointments() === 'object' && (
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
            when={!appointments() || typeof appointments() !== 'object' || appointments()!.appointments.length < appointments()!.appointmentRequestCap}
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
                 {bookingFlow().showServices && (
                   <ServicesList
                     services={services()}
                     onServiceSelect={handleServiceSelect}
                   />
                 )}
              
              {bookingFlow().showDurations && (
                <DurationsList 
                  services={services()}
                  selectedService={selectedService()!}
                  onDurationSelect={handleDurationSelect}
                  onBack={handleBackToServices}
                />
              )}
              
              {bookingFlow().showSlotSelection && (
                <AvailabilityList 
                  service={selectedService()!}
                  duration={selectedDuration()!}
                  onBack={handleBackToDurations}
                  onSlotSelect={handleTimeSelect}
                />
              )}
              
              {bookingFlow().showConfirmation && (
                <ConfirmationPanel
                  service={services().find(s => s.name === selectedService() && s.duration === selectedDuration())!}
                  selectedSlot={selectedSlot()}
                  onBack={handleBackToTimeSelection}
                  onConfirm={handleConfirmAppointment}
                />
              )}

              {bookingFlow().showCreatingAppointment && (
                <LoadingPanel
                  service={services().find(s => s.name === selectedService() && s.duration === selectedDuration())!}
                  selectedSlot={selectedSlot()}
                />
              )}

              {bookingFlow().showAppointmentConfirmed && (
                <SuccessPanel
                  service={services().find(s => s.name === selectedService() && s.duration === selectedDuration())!}
                  selectedSlot={selectedSlot()}
                  onBookAnother={handleBookAnotherSession}
                />
              )}
              
              {/* Debug info */}
              <div class="text-xs text-gray-500 mt-2 p-2 bg-gray-100 rounded">
                State Machine Debug: step={bookingFlow().step}, appointmentConfirmed={String(appointmentConfirmed())}, isSubmitting={String(isSubmitting())}, error={confirmationError() || 'none'}
              </div>
              
            </>
          </Show>
        )}
      </Content>
    </PageFrame>
  );
}
