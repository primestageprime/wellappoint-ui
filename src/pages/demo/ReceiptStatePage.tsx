import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, CenteredContent, H3, AppointmentDetailsGrid, ServiceDetailItem, DescriptionDetailItem, TimeSlotDetailItem, DurationDetailItem, LocationDetailItem, PriceDetailItem, ActionButtons } from '../../components/visual';
import { CheckCircle } from 'lucide-solid';
import { DemoLayout } from './DemoLayout';

export function ReceiptStatePage() {
  const [username] = createSignal('mai');

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
            <div class="flex justify-center mb-4">
              <CheckCircle class="w-16 h-16 text-green-600" />
            </div>
            <H3>Appointment Request Confirmed!</H3>
            <p class="text-muted-foreground text-center max-w-md">
              Your appointment request has been submitted successfully. You'll receive a confirmation email shortly.
            </p>
          </CenteredContent>

          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 class="font-semibold text-green-900 mb-2">What happens next?</h4>
            <ul class="text-sm text-green-800 space-y-1">
              <li>• Check your email for confirmation details</li>
              <li>• Your provider will review and confirm your appointment</li>
              <li>• You'll receive a calendar invitation once confirmed</li>
            </ul>
          </div>

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
                text: 'Book Another Appointment',
                onClick: () => console.log('Book another clicked'),
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

