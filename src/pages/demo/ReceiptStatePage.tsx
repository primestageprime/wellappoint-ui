import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, CenteredContent, H3, ServiceSummaryCard, AppointmentDetailsGrid, ActionButtons, PrimaryHeart } from '../../components/visual';
import { Calendar, Globe, Currency } from '../../components/visual/icons';
import { Clock, CheckCircle } from 'lucide-solid';
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

          <ServiceSummaryCard
            icon={<PrimaryHeart />}
            title="Therapeutic Massage"
            subtitle="Deep tissue & relaxation therapy"
          />

          <AppointmentDetailsGrid
            details={[
              {
                label: 'Date & Time',
                value: 'Monday, October 20, 2025 at 2:00 PM',
                icon: <Calendar class="w-5 h-5 text-primary" />
              },
              {
                label: 'Duration',
                value: '60 minutes',
                icon: <Clock class="w-5 h-5 text-primary" />
              },
              {
                label: 'Location',
                value: 'OFFICE',
                icon: <Globe class="w-5 h-5 text-primary" />
              },
              {
                label: 'Price',
                value: '$140',
                icon: <Currency class="w-5 h-5 text-primary" />
              }
            ]}
          />

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

