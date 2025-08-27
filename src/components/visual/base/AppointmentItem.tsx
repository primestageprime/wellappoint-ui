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
    <div class={`p-3 bg-background rounded-lg border border-amber-200 ${props.class || ''}`}>
      <IconWithText icon={props.icon || <Clock class="w-4 h-4 text-primary" />}>
        <div class="flex flex-col">
          <span class="font-medium text-primary">{props.service}</span>
          <span class="text-sm">{details}</span>
        </div>
      </IconWithText>
    </div>
  );
}
