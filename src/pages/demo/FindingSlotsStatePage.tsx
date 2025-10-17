import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, CenteredContent, H3, H4 } from '../../components/visual';
import { AppointmentsCard } from '../../components/AppointmentsCard';
import { DemoLayout } from './DemoLayout';

export function FindingSlotsStatePage() {
  const [username] = createSignal('zuko');

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
        <AppointmentsCard />
        
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <button
              onClick={() => console.log('Back')}
              class="text-primary hover:text-primary/80 text-sm font-medium"
            >
              ← Back to durations
            </button>
          </div>

          <CenteredContent>
            <H3>Finding Available Times</H3>
            <H4>Please wait while we check availability...</H4>
          </CenteredContent>

          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p class="text-primary mt-4">Loading available times...</p>
          </div>
        </div>
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

