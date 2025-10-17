import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, CenteredContent, H3, ServiceSummaryCard, AppointmentDetailsGrid, SessionDescription, ActionButtons, PrimaryHeart } from '../../components/visual';
import { Calendar, Globe, Currency } from '../../components/visual/icons';
import { Clock } from 'lucide-solid';
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

          <SessionDescription 
            description="A comprehensive 60-minute full body massage with essential oils and healing crystals."
          />

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

