import { Show } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { useParams } from '@solidjs/router';
import { ConfirmationPanel } from '../components/ConfirmationPanel';
import { 
  AppointmentsCard, 
  ServicesCard, 
  LogoutButton, 
  CenteredContent,
  PageFrame,
  HeaderCard,
  Content,
  Split,
  Avatar,
  DurationCard,
  AvailabilityCard
} from '../components/visual';
import { type UserAppointment } from '../services/appointmentService';
import { type UIService } from '../types/service';
import { useServices } from '../hooks/useServices';
import { useBookingFlow } from '../hooks/useBookingFlow';
import { useAppointments } from '../hooks/useAppointments';


export function ProviderBookingPage() {
  const auth = useAuth();
  const params = useParams();
  const username = () => params.username;
  
  console.log('🔍 ProviderBookingPage - username:', username());
  console.log('🔍 ProviderBookingPage - user:', auth.user());
  
  // Custom primitives
  const services = useServices(username);
  const booking = useBookingFlow();
  const appointments = useAppointments(() => auth.user()?.email, username);

  // Enhanced booking complete handler
  const handleBookingComplete = () => {
    booking.handleBookingComplete();
    appointments.refetchAppointments();
  };

  return (
    <PageFrame>
      <HeaderCard>
        <Split 
          left={
            <CenteredContent>
              <Avatar username={username} />
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
              Debug: loading={services.loading()}, error={services.error()}, services={services.services().length}
            </div>
            
            <ServicesCard services={services.services() as UIService[]} />
            <AppointmentsCard appointments={appointments.appointments() as UserAppointment[]} />
            </div>
          }
          right={
            <div class="space-y-6">
            <DurationCard 
              bookingStep={booking.bookingStep}
              selectedService={booking.selectedService}
              services={services.services}
              onDurationSelect={booking.handleDurationSelect}
              onBack={booking.handleBackToServices}
            />

            <AvailabilityCard 
              bookingStep={booking.bookingStep}
              selectedService={booking.selectedService}
              selectedDuration={booking.selectedDuration}
              provider={username}
              onSlotSelect={booking.handleSlotSelect}
              onBack={booking.handleBackToDurations}
            />

            <Show when={booking.bookingStep() === 'confirmation'}>
              <ConfirmationPanel 
                service={booking.selectedServiceData(services.services)!}
                selectedSlot={booking.selectedSlot()}
                isSubmitting={booking.isSubmitting()}
                error={booking.bookingError()}
                onConfirm={handleBookingComplete}
                onBack={booking.handleBackToAvailability}
              />
            </Show>
            </div>
          }
        />
      </Content>
    </PageFrame>
  );
}
