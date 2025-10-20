import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, BookingConfirmationContainer, CenteredContent, AppointmentDetailsGrid, ServiceDetailItem, DescriptionDetailItem, TimeSlotDetailItem, DurationDetailItem, LocationDetailItem, PriceDetailItem, ActionButtons, PrimaryButton } from '../../components/visual';
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
        <BookingConfirmationContainer title="Appointment Confirmed">
          <AppointmentDetailsGrid>
            <ServiceDetailItem value="Massage" />
            <DescriptionDetailItem value="A comprehensive 60-minute full body massage with essential oils and healing crystals." />
            <TimeSlotDetailItem value="Monday, October 20, 2025 at 2:00 PM" />
            <DurationDetailItem value="60 minutes" />
            <LocationDetailItem value="123 Main Street, Suite 200, San Francisco, CA 94102" />
            <PriceDetailItem value="$140" />
          </AppointmentDetailsGrid>

          <CenteredContent>
            <div class="flex justify-center mb-4">
              <CheckCircle class="w-16 h-16 text-green-600" />
            </div>
            <p class="text-card-foreground font-semibold text-lg">Appointment Request Confirmed!</p>
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

          <ActionButtons>
            <PrimaryButton onClick={() => console.log('Book another clicked')}>
              Book Another Appointment
            </PrimaryButton>
          </ActionButtons>
        </BookingConfirmationContainer>
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

