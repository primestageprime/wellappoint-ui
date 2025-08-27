import { DurationList, H3, H4, CenteredContent } from './visual';
import { Heart, Craniosacral, FootReflexology } from './visual/icons';

interface Service {
  name: string;
  duration: number;
  price: number;
  description?: string;
  durationDescription?: string;
}

interface DurationsListProps {
  services: Service[];
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
  const serviceDurations = props.services.filter(s => s.name === props.selectedService);

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
        durations={serviceDurations.map(service => ({
          duration: `${service.duration} minutes`,
          description: service.durationDescription || service.description || 'Professional wellness service',
          price: `$${service.price}`,
          icon: serviceData[service.name as keyof typeof serviceData]?.icon,
          onClick: () => props.onDurationSelect(service.duration)
        }))}
      />
    </div>
  );
}
