import { JSX } from 'solid-js';
import { Phone as PhoneIcon } from 'lucide-solid';

interface PhoneProps {
  class?: string;
}

export function Phone(props: PhoneProps) {
  return (
    <PhoneIcon class={`w-4 h-4 text-muted-foreground ${props.class || ''}`} />
  );
}
