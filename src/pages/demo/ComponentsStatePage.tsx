import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton } from '../../components/visual';
import { ServicesList } from '../../components/ServicesList';
import { DurationsList } from '../../components/DurationsList';
import { AppointmentsCard } from '../../components/AppointmentsCard';
import { type BookingService } from '../../types/service';
import { DemoLayout } from './DemoLayout';

export function ComponentsStatePage() {
  const [username] = createSignal('katara');
  
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
      name: 'Cranial Sacral Massage',
      description: 'Gentle energy work & alignment',
      duration: 60,
      price: 150,
      durationDescription: 'Gentle craniosacral therapy session'
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
        <div class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-primary mb-4">Individual Components Demo</h2>
            <p class="text-muted-foreground mb-8">Each component shown in isolation</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-primary mb-3">AppointmentsCard</h3>
            <AppointmentsCard />
          </div>

          <div>
            <h3 class="text-xl font-semibold text-primary mb-3">ServicesList</h3>
            <ServicesList 
              services={services()}
              onServiceSelect={(service) => console.log('Selected:', service)}
            />
          </div>

          <div>
            <h3 class="text-xl font-semibold text-primary mb-3">DurationsList</h3>
            <DurationsList 
              services={services()}
              selectedService="Massage"
              onDurationSelect={(duration) => console.log('Selected:', duration)}
              onBack={() => console.log('Back')}
            />
          </div>
        </div>
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

