import { JSX } from 'solid-js';
import { IconWithTitleAndSubtitle } from './IconWithTitleAndSubtitle';
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
    <div class={`p-3 bg-white rounded-lg border border-primary/10 ${props.class || ''}`}>
      <IconWithTitleAndSubtitle
        icon={props.icon || <Clock class="w-4 h-4 text-primary" />}
        title={props.service}
        subtitle={details}
      />
    </div>
  );
}
