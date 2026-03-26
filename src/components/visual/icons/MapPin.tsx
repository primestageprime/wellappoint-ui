import { JSX } from 'solid-js';
import { MapPin as MapPinIcon } from 'lucide-solid';

interface MapPinProps {
  class?: string;
}

export function MapPin(props: MapPinProps) {
  return (
    <MapPinIcon class={`w-4 h-4 text-muted-foreground ${props.class || ''}`} />
  );
}
