import { Show } from 'solid-js';
import { useAuth } from '../auth/AuthProvider';
import { useParams } from '@solidjs/router';
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
  DurationCard
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

            <Show when={booking.bookingStep() === 'availability'}>
              <Card>
                <H4>Select Time Slot</H4>
                <p class="text-muted-foreground text-sm mb-4">
                  Choose an available time slot for your appointment.
                </p>
                <AvailabilityList 
                  service={booking.selectedService()!}
                  duration={booking.selectedDuration()!}
                  onSlotSelect={booking.handleSlotSelect}
                  provider={username()}
                />
                <button 
                  onClick={booking.handleBackToDurations}
                  class="mt-4 text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to Duration
                </button>
              </Card>
            </Show>

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
