import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, ServiceSummaryCard, DurationSummaryCard, LoadingState, PrimaryHeart } from '../../components/visual';
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
        <ServiceSummaryCard
          icon={<PrimaryHeart />}
          title="Massage"
          subtitle="Deep tissue & relaxation therapy"
        />
        
        <DurationSummaryCard
          duration={60}
          price={140}
        />
        
        <div class="p-4 bg-primary/5 rounded-lg">
          <p class="text-sm text-muted-foreground">
            <span class="font-semibold text-primary">Monday, October 20, 2025</span> at <span class="font-semibold text-primary">2:00 PM</span>
          </p>
        </div>
        
        <LoadingState message="Submitting your appointment request..." />
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

