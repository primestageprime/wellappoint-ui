import { For } from 'solid-js';
import { ServicesContainer, ServiceItem } from './visual';
import { Heart, Craniosacral, FootReflexology } from './visual/icons';
import { type BookingService } from '../types/service';
import { type ServicesListProps } from '../types/components';

const serviceData = {
  'Massage': {
    description: 'Deep tissue & relaxation therapy',
  },
  'Cranial Sacral Massage': {
    description: 'Gentle energy work & alignment',
  },
  'Reflexology': {
    description: 'Pressure point healing',
  }
};

export function ServicesList(props: ServicesListProps) {
  // Service icons helper function - must be inside component to avoid SolidJS warnings
  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'Massage':
        return <Heart class="w-5 h-5 text-primary" />;
      case 'Cranial Sacral Massage':
        return <Craniosacral class="w-5 h-5 text-primary" />;
      case 'Reflexology':
        return <FootReflexology class="w-5 h-5 text-primary" />;
      default:
        return null;
    }
  };
  
  // Get unique service names
  const uniqueServices = () => {
    const serviceMap = new Map<string, BookingService>();
    props.services.forEach(service => {
      if (!serviceMap.has(service.name)) {
        serviceMap.set(service.name, service);
      }
    });
    return Array.from(serviceMap.values());
  };

  return (
    <div class="space-y-4">
      <ServicesContainer title="Available Services">
        <For each={uniqueServices()}>
          {(service) => (
            <ServiceItem
              name={service.name}
              description={service.description || serviceData[service.name as keyof typeof serviceData]?.description || 'Professional wellness service'}
              icon={getServiceIcon(service.name)}
              onClick={() => props.onServiceSelect(service.name)}
            />
          )}
        </For>
      </ServicesContainer>
    </div>
  );
}
