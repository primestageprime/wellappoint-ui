import { JSX } from 'solid-js';
import { Mail as MailIcon } from 'lucide-solid';

interface MailProps {
  class?: string;
}

export function Mail(props: MailProps) {
  return (
    <MailIcon class={`w-4 h-4 text-muted-foreground ${props.class || ''}`} />
  );
}
