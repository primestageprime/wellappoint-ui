import { createSignal, createEffect, createResource } from 'solid-js';
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

interface Service {
  name: string;
  duration: number;
  price: number;
  description?: string;
  durationDescription?: string;
}

// Helper function to convert UserAppointment to the format expected by AppointmentsCard
const convertToAppointmentCardFormat = (appointment: UserAppointment) => ({
  service: appointment.service,
  duration: appointment.duration,
  date: appointment.date,
  time: appointment.time
});

export function BookingPage() {
  const auth = useAuth();
  const [services, setServices] = createSignal<Service[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [selectedService, setSelectedService] = createSignal<string | null>(null);
  const [selectedDuration, setSelectedDuration] = createSignal<number | null>(null);
  const [selectedSlot, setSelectedSlot] = createSignal<any | null>(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = createSignal<boolean | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [confirmationError, setConfirmationError] = createSignal<string | null>(null);
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

  // Temporary testing effect - remove in production
  createEffect(() => {
    // Auto-set test values for confirmation panel testing
    if (services().length > 0 && !selectedService()) {
      console.log('Setting test data for confirmation panel');
      
      // Set test service (first service)
      const testService = services()[0];
      setSelectedService(testService.name);
      
      // Set test duration (first duration for that service)
      const testDuration = services().find(s => s.name === testService.name)?.duration || 30;
      setSelectedDuration(testDuration);
      
      // Set test time slot
      const testSlot = {
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + testDuration * 60 * 1000).toISOString(),
        location: 'OFFICE'
      };
      setSelectedSlot(testSlot);
      
      console.log('Test data set:', {
        service: testService.name,
        duration: testDuration,
        slot: testSlot
      });
    }
  });

  const handleLogout = () => {
    auth.logout();
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

  const handleConfirmAppointment = async () => {
    setIsSubmitting(true);
    setConfirmationError(null);

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

      console.log('Creating appointment:', requestBody);

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
      console.log('Appointment created successfully:', result);
      
      // Set appointment as confirmed
      setAppointmentConfirmed(true);
      
      // Reset all selections and refresh appointments after a delay
      setTimeout(() => {
        setSelectedService(null);
        setSelectedDuration(null);
        setSelectedSlot(null);
        setAppointmentConfirmed(undefined);
        // Refresh appointments by refetching
        refetchAppointments();
      }, 2000);

    } catch (err) {
      console.error('Failed to create appointment:', err);
      setConfirmationError(err instanceof Error ? err.message : 'Failed to create appointment');
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
          />
        )}

        {loading() && (
          <LoadingCard message="Loading services..." />
        )}

        {error() && (
          <ErrorCard error={error()!} onRetry={fetchServices} />
        )}

        {!loading() && !error() && (
          <>
            {!selectedService() && (
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
            
            {selectedService() && selectedDuration() && selectedSlot() && appointmentConfirmed() === undefined && (
              <ConfirmationPanel
                service={services().find(s => s.name === selectedService() && s.duration === selectedDuration())!}
                selectedSlot={selectedSlot()}
                isSubmitting={isSubmitting()}
                error={confirmationError()}
                onBack={handleBackToTimeSelection}
                onConfirm={handleConfirmAppointment}
              />
            )}
            
            {selectedService() && selectedDuration() && selectedSlot() && appointmentConfirmed() === true && (
              <div class="text-center space-y-4">
                <div class="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-yellow-50 border border-primary/20 rounded-xl">
                  <div class="text-6xl">✨</div>
                  <H3>Your healing session is confirmed!</H3>
                  <p class="text-muted-foreground">Your appointment has been scheduled. You'll receive a confirmation with details shortly.</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedService(null);
                    setSelectedDuration(null);
                    setSelectedSlot(null);
                    setAppointmentConfirmed(undefined);
                  }}
                  class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Book Another Session
                </button>
              </div>
            )}
          </>
        )}
      </Content>
    </PageFrame>
  );
}
