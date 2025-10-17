import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, ServiceSummaryCard, PrimaryHeart } from '../../components/visual';
import { DurationsList } from '../../components/DurationsList';
import { AppointmentsCard } from '../../components/AppointmentsCard';
import { type BookingService } from '../../types/service';
import { DemoLayout } from './DemoLayout';

export function ChooseDurationStatePage() {
  const [username] = createSignal('toph');
  
  const [services] = createSignal<BookingService[]>([
    {
      name: 'Massage',
      description: 'Deep tissue & relaxation therapy',
      duration: 30,
      price: 85,
      durationDescription: 'A gentle 30-minute massage using organic oils'
    },
    {
      name: 'Massage',
      description: 'Deep tissue & relaxation therapy',
      duration: 60,
      price: 140,
      durationDescription: 'A comprehensive 60-minute full body massage'
    },
    {
      name: 'Massage',
      description: 'Deep tissue & relaxation therapy',
      duration: 90,
      price: 190,
      durationDescription: 'An extended 90-minute session for deep relaxation'
    }
  ]);

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
        
        <DurationsList 
          services={services()}
          selectedService="Massage"
          onDurationSelect={(duration) => console.log('Selected duration:', duration)}
          onBack={() => console.log('Back to services')}
        />
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

