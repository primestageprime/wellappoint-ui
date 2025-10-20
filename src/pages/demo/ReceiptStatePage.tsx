import { createSignal, For } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, AppointmentsContainer, AppointmentItem, CenteredContent, ActionButtons, PrimaryButton } from '../../components/visual';
import { CheckCircle } from 'lucide-solid';
import { DemoLayout } from './DemoLayout';

export function ReceiptStatePage() {
  const [username] = createSignal('mai');

  // Show existing appointment + newly confirmed appointment
  const appointments = [
    {
      service: 'Therapeutic Massage',
      duration: '60 minutes',
      date: '8/27/2025',
      time: '2:00 PM'
    },
    {
      service: 'Massage',
      duration: '60 minutes',
      date: '10/20/2025',
      time: '2:00 PM'
    }
  ];

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
        <AppointmentsContainer 
          appointmentRequestCap={3} 
          appointmentCount={appointments.length}
        >
          <For each={appointments}>
            {(appointment) => (
              <AppointmentItem
                service={appointment.service}
                duration={appointment.duration}
                date={appointment.date}
                time={appointment.time}
              />
            )}
          </For>
        </AppointmentsContainer>

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
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

