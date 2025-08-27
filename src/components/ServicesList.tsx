import { ServicesCard, H3, H4, CenteredContent } from './visual';
import { Heart, Craniosacral, FootReflexology } from './visual/icons';

interface Service {
  name: string;
  duration: number;
  price: number;
  description?: string;
  durationDescription?: string;
}

interface ServicesListProps {
  services: Service[];
  onServiceSelect: (serviceName: string) => void;
}

const serviceData = {
  'Massage': {
    description: 'Deep tissue & relaxation therapy',
    icon: <Heart class="w-5 h-5 text-primary" />
  },
  'Cranial Sacral Massage': {
    description: 'Gentle energy work & alignment',
    icon: <Craniosacral class="w-5 h-5 text-primary" />
  },
  'Reflexology': {
    description: 'Pressure point healing',
    icon: <FootReflexology class="w-5 h-5 text-primary" />
  }
};

export function ServicesList(props: ServicesListProps) {
  // Get unique service names
  const uniqueServices = () => {
    const serviceMap = new Map<string, Service>();
    props.services.forEach(service => {
      if (!serviceMap.has(service.name)) {
        serviceMap.set(service.name, service);
      }
    });
    return Array.from(serviceMap.values());
  };

  return (
    <div class="space-y-4">
      <CenteredContent>
        <H3>Choose Your Healing Journey</H3>
        <H4>Select a service to continue</H4>
      </CenteredContent>
      
      <ServicesCard 
        title="Available Services"
        services={uniqueServices().map(service => ({
          name: service.name,
          description: service.description || serviceData[service.name as keyof typeof serviceData]?.description || 'Professional wellness service',
          icon: serviceData[service.name as keyof typeof serviceData]?.icon,
          onClick: () => props.onServiceSelect(service.name)
        }))}
      />
    </div>
  );
}
