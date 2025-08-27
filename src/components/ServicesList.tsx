import { createSignal } from 'solid-js';
import { BookingForm } from './BookingForm';
import { ServicesCard, H3, H4, CenteredContent } from './visual';
import { Heart, Craniosacral, FootReflexology } from './visual/icons';

interface Service {
  name: string;
  duration: number;
  price: number;
  description?: string;
}

interface ServicesListProps {
  services: Service[];
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
  const [selectedService, setSelectedService] = createSignal<string | null>(null);

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
  };

  const handleBack = () => {
    setSelectedService(null);
  };

  // If a service is selected, show the booking form
  if (selectedService()) {
    const filteredServices = props.services.filter(s => s.name === selectedService());
    return (
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <button
            onClick={handleBack}
            class="text-primary hover:text-primary/80 text-sm font-medium"
          >
            ← Back to services
          </button>
        </div>
        <BookingForm services={filteredServices} />
      </div>
    );
  }

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
        services={uniqueServices().map(service => ({
          name: service.name,
          description: service.description || serviceData[service.name as keyof typeof serviceData]?.description || 'Professional wellness service',
          icon: serviceData[service.name as keyof typeof serviceData]?.icon,
          onClick: () => handleServiceSelect(service.name)
        }))}
      />
    </div>
  );
}
