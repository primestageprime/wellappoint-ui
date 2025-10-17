import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton } from '../../components/visual';
import { ServicesList } from '../../components/ServicesList';
import { AppointmentsCard } from '../../components/AppointmentsCard';
import { type BookingService } from '../../types/service';
import { DemoLayout } from './DemoLayout';

export function ChooseServiceStatePage() {
  const [username] = createSignal('aang');
  
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
    },
    {
      name: 'Cranial Sacral Massage',
      description: 'Gentle energy work & alignment',
      duration: 60,
      price: 150,
      durationDescription: 'Gentle craniosacral therapy session'
    },
    {
      name: 'Reflexology',
      description: 'Pressure point healing',
      duration: 45,
      price: 95,
      durationDescription: 'Focused reflexology treatment'
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
        
        <ServicesList 
          services={services()}
          onServiceSelect={(service) => console.log('Selected service:', service)}
        />
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

