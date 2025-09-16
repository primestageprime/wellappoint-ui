import { DurationList, H3, H4, CenteredContent } from './visual';
import { Heart, Craniosacral, FootReflexology } from './visual/icons';
import { type BookingService, type UIDuration } from '../types/service';

interface DurationsListProps {
  services: BookingService[];
  selectedService: string;
  onDurationSelect: (duration: number) => void;
  onBack: () => void;
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

export function DurationsList(props: DurationsListProps) {
  // Filter services for the selected service and build duration list
  const serviceDurations = () => {
    return props.services
      .filter(service => service.name === props.selectedService)
      .map(service => {
        console.log('🔍 Mapping duration for service:', service.name, 'duration:', service.duration, 'price:', service.price);
        return {
          minutes: service.duration,
          description: service.durationDescription || service.description || 'Professional wellness service',
          price: service.price,
          icon: serviceData[service.name as keyof typeof serviceData]?.icon,
          onClick: () => {
            console.log('🔍 Duration clicked:', service.duration, 'minutes for', service.name);
            props.onDurationSelect(service.duration);
          }
        } as UIDuration;
      });
  };

  return (
    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <button
          onClick={props.onBack}
          class="text-primary hover:text-primary/80 text-sm font-medium"
        >
          ← Back to services
        </button>
      </div>
      
      <CenteredContent>
        <H3>Select Duration for {props.selectedService}</H3>
        <H4>Choose your preferred session length</H4>
      </CenteredContent>
      
      <DurationList 
        title="Available Durations"
        durations={serviceDurations()}
      />
    </div>
  );
}
