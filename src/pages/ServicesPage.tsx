import { createSignal, createEffect, createResource } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { ServicesList } from '../components/ServicesList';
import { BookingForm } from '../components/BookingForm';
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
}

// Helper function to convert UserAppointment to the format expected by AppointmentsCard
const convertToAppointmentCardFormat = (appointment: UserAppointment) => ({
  service: appointment.service,
  duration: appointment.duration,
  date: appointment.date,
  time: appointment.time
});

export function ServicesPage() {
  const auth = useAuth();
  const [services, setServices] = createSignal<Service[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [provider] = createResource(getProviderDetails);
  
  // Get user appointments
  const userEmail = () => auth.user()?.email || '';
  const [appointments] = createResource(userEmail, getUserAppointments);

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

  const handleLogout = () => {
    auth.logout();
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
          <ServicesList services={services()} />
        )}
      </Content>
    </PageFrame>
  );
}
