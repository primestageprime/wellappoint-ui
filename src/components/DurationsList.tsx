import { DurationList } from './visual';
import { Heart, Craniosacral, FootReflexology } from './visual/icons';
import { type UIDuration } from '../types/service';
import { type DurationsListProps } from '../types/components';

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
      <DurationList 
        title="Available Durations"
        durations={serviceDurations()}
      />
    </div>
  );
}
