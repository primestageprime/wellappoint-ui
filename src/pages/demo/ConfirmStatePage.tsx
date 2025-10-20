import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, CenteredContent, H3, AppointmentDetailsGrid, ServiceDetailItem, DescriptionDetailItem, TimeSlotDetailItem, DurationDetailItem, LocationDetailItem, PriceDetailItem, ActionButtons } from '../../components/visual';
import { DemoLayout } from './DemoLayout';

export function ConfirmStatePage() {
  const [username] = createSignal('iroh');

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
        <div class="space-y-6">
          <CenteredContent>
            <H3>Confirm Your Appointment</H3>
          </CenteredContent>

          <AppointmentDetailsGrid>
            <ServiceDetailItem value="Massage" />
            <DescriptionDetailItem value="A comprehensive 60-minute full body massage with essential oils and healing crystals." />
            <TimeSlotDetailItem value="Monday, October 20, 2025 at 2:00 PM" />
            <DurationDetailItem value="60 minutes" />
            <LocationDetailItem value="123 Main Street, Suite 200, San Francisco, CA 94102" />
            <PriceDetailItem value="$140" />
          </AppointmentDetailsGrid>

          <ActionButtons
            buttons={[
              {
                text: 'Back',
                onClick: () => console.log('Back clicked'),
                variant: 'secondary'
              },
              {
                text: 'Confirm Your Session',
                onClick: () => console.log('Confirm clicked'),
                variant: 'primary'
              }
            ]}
          />
        </div>
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}
