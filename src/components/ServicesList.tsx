import { createSignal } from 'solid-js';
import { BookingForm } from './BookingForm';
import { ServicesCard, DurationList, H3, H4, CenteredContent } from './visual';
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
  const [selectedDuration, setSelectedDuration] = createSignal<number | null>(null);

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
    setSelectedDuration(null);
  };

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
  };

  const handleBackToServices = () => {
    setSelectedService(null);
    setSelectedDuration(null);
  };

  const handleBackToDurations = () => {
    setSelectedDuration(null);
  };

  // If both service and duration are selected, show the booking form
  if (selectedService() && selectedDuration()) {
    const filteredServices = props.services.filter(s => 
      s.name === selectedService() && s.duration === selectedDuration()
    );
    return (
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <button
            onClick={handleBackToDurations}
            class="text-primary hover:text-primary/80 text-sm font-medium"
          >
            ← Back to durations
          </button>
        </div>
        <BookingForm services={filteredServices} />
      </div>
    );
  }

  // If only service is selected, show duration options
  if (selectedService()) {
    const serviceDurations = props.services.filter(s => s.name === selectedService());
    
    return (
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <button
            onClick={handleBackToServices}
            class="text-primary hover:text-primary/80 text-sm font-medium"
          >
            ← Back to services
          </button>
        </div>
        
        <CenteredContent>
          <H3>Select Duration for {selectedService()}</H3>
          <H4>Choose your preferred session length</H4>
        </CenteredContent>
        
        <DurationList 
          title="Available Durations"
          durations={serviceDurations.map(service => ({
            duration: `${service.duration} minutes`,
            description: service.durationDescription || service.description || 'Professional wellness service',
            price: `$${service.price}`,
            icon: serviceData[service.name as keyof typeof serviceData]?.icon,
            onClick: () => handleDurationSelect(service.duration)
          }))}
        />
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
        title="Available Services"
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
