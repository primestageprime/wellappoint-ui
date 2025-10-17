import { createSignal, type Accessor } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton } from './visual';
import { ServicesList } from './ServicesList';
import { DurationsList } from './DurationsList';
import { AppointmentsCard } from './AppointmentsCard';
import { type BookingService } from '../types/service';

interface LayoutProps {
  // Reactive signals - can be passed from parent or created locally
  username: Accessor<string>;
  services: Accessor<BookingService[]>;
  selectedService: Accessor<string | null>;
  onLogout: () => void;
  onServiceSelect: (serviceName: string) => void;
  onDurationSelect: (duration: number) => void;
  onBackToServices: () => void;
}

export function Layout(props: LayoutProps) {

  return (
    <PageFrame>
      <HeaderCard>
        <Split 
          left={<Avatar username={props.username} />}
          right={<LogoutButton onLogout={props.onLogout}>Logout</LogoutButton>}
        />
      </HeaderCard>
      
      <Content>
        {/* Show ServicesList when no service is selected */}
        {!props.selectedService() && (
          <ServicesList 
            services={props.services()}
            onServiceSelect={props.onServiceSelect}
          />
        )}

        {/* Show DurationsList when a service is selected */}
        {props.selectedService() && (
          <DurationsList 
            services={props.services()}
            selectedService={props.selectedService()!}
            onDurationSelect={props.onDurationSelect}
            onBack={props.onBackToServices}
          />
        )}

        {/* Always show AppointmentsCard */}
        <div class="mt-8">
          <AppointmentsCard />
        </div>
      </Content>
    </PageFrame>
  );
}

// Demo version with static data wrapped in signals
export function LayoutDemo() {
  // Create signals with static data
  const [username] = createSignal('sokka');
  const [selectedService, setSelectedService] = createSignal<string | null>(null);
  
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

  const handleLogout = () => {
    console.log('Logout clicked from demo');
  };

  const handleServiceSelect = (serviceName: string) => {
    console.log('Service selected:', serviceName);
    setSelectedService(serviceName);
  };

  const handleDurationSelect = (duration: number) => {
    console.log('Duration selected:', duration);
  };

  const handleBackToServices = () => {
    console.log('Back to services');
    setSelectedService(null);
  };

  return (
    <Layout
      username={username}
      services={services}
      selectedService={selectedService}
      onLogout={handleLogout}
      onServiceSelect={handleServiceSelect}
      onDurationSelect={handleDurationSelect}
      onBackToServices={handleBackToServices}
    />
  );
}

