import { BookingForm } from './BookingForm';

interface Service {
  name: string;
  duration: number;
  price: number;
  description?: string;
  durationDescription?: string;
}

interface AvailabilityListProps {
  services: Service[];
  selectedService: string;
  selectedDuration: number;
  onBack: () => void;
}

export function AvailabilityList(props: AvailabilityListProps) {
  const filteredServices = props.services.filter(s => 
    s.name === props.selectedService && s.duration === props.selectedDuration
  );

  return (
    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <button
          onClick={props.onBack}
          class="text-primary hover:text-primary/80 text-sm font-medium"
        >
          ← Back to durations
        </button>
      </div>
      <BookingForm services={filteredServices} />
    </div>
  );
}
