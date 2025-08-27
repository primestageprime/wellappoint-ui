import { JSX } from 'solid-js';
import { IconWithText } from './IconWithText';
import { Clock } from 'lucide-solid';

interface AppointmentItemProps {
  service: string;
  duration: string;
  date: string;
  time: string;
  icon?: JSX.Element;
  class?: string;
}

export function AppointmentItem(props: AppointmentItemProps) {
  const details = `${props.duration} • ${props.date} at ${props.time}`;
  
  return (
    <div class={`p-4 bg-card rounded-lg border ${props.class || ''}`}>
      <IconWithText icon={props.icon || <Clock class="w-4 h-4" />}>
        <div class="flex flex-col">
          <span class="font-medium">{props.service}</span>
          <span class="text-sm text-muted-foreground">{details}</span>
        </div>
      </IconWithText>
    </div>
  );
}
