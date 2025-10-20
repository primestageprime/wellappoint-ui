import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, ServiceSummaryCard, DurationSummaryCard, LoadingState, PrimaryHeart } from '../../components/visual';
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
        
        <ServiceSummaryCard
          icon={<PrimaryHeart />}
          title="Massage"
          subtitle="Deep tissue & relaxation therapy"
          onEdit={() => console.log('Edit service - unset selection')}
        />
        
        <DurationSummaryCard
          duration={60}
          price={140}
          description="A comprehensive 60-minute full body massage"
          onEdit={() => console.log('Edit duration - back to durations')}
        />
        
        <LoadingState message="Finding available times..." />
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

