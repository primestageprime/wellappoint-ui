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
          description="A comprehensive 60-minute full body massage"
        />
        
        <div class="p-4 bg-card rounded-lg border-2 border-primary/30">
          <p class="text-sm text-muted-foreground mb-1">Selected Time</p>
          <p class="text-lg font-semibold text-primary">
            Monday, October 20, 2025 at 2:00 PM
          </p>
        </div>
        
        <LoadingState message="Submitting your appointment request..." />
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

