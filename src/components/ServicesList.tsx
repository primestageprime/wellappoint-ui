import { createSignal } from 'solid-js';
import { ServiceCard } from './ServiceCard';
import { BookingForm } from './BookingForm';

interface Service {
  name: string;
  duration: number;
  price: number;
}

interface ServicesListProps {
  services: Service[];
}

const serviceDescriptions = {
  'Massage': 'Deep tissue & relaxation therapy',
  'Cranial Sacral Massage': 'Gentle energy work & alignment',
  'Reflexology': 'Pressure point healing'
};

const serviceIcons = {
  'Massage': 'heart' as const,
  'Cranial Sacral Massage': 'infinity' as const,
  'Reflexology': 'foot' as const
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
      <div class="text-center space-y-2">
        <h3 class="text-primary">Choose Your Healing Journey</h3>
        <p class="text-sm text-muted-foreground italic">Select a service to continue</p>
      </div>
      
      <div class="space-y-3">
        {uniqueServices().map(service => (
          <ServiceCard
            name={service.name}
            description={serviceDescriptions[service.name] || 'Professional wellness service'}
            icon={serviceIcons[service.name] || 'heart'}
            onClick={() => handleServiceSelect(service.name)}
          />
        ))}
      </div>
      
      <div class="text-center pt-2">
        <p class="text-xs text-muted-foreground italic">
          Click any service above to see available durations and pricing
        </p>
      </div>
    </div>
  );
}
