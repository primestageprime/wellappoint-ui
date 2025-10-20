import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, BookingConfirmationContainer, AppointmentDetailsGrid, ServiceDetailItem, DescriptionDetailItem, TimeSlotDetailItem, DurationDetailItem, LocationDetailItem, PriceDetailItem, LoadingState } from '../../components/visual';
import { DemoLayout } from './DemoLayout';

export function ProcessingStatePage() {
  const [username] = createSignal('azula');

  return (
    <DemoLayout>
    <PageFrame>
      <HeaderCard>
        <Split 
          left={<Avatar username={username} />}
          right={<LogoutButton onLogout={() => console.log('Logout')}>Logout</LogoutButton>}
        />
      </HeaderCard>
      
      <Content>
        <BookingConfirmationContainer title="Processing Your Appointment">
          <AppointmentDetailsGrid>
            <ServiceDetailItem value="Massage" />
            <DescriptionDetailItem value="A comprehensive 60-minute full body massage with essential oils and healing crystals." />
            <TimeSlotDetailItem value="Monday, October 20, 2025 at 2:00 PM" />
            <DurationDetailItem value="60 minutes" />
            <LocationDetailItem value="123 Main Street, Suite 200, San Francisco, CA 94102" />
            <PriceDetailItem value="$140" />
          </AppointmentDetailsGrid>
          
          <LoadingState message="Submitting your appointment request..." />
        </BookingConfirmationContainer>
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

