import { JSX, Show } from 'solid-js';
import { A } from '@solidjs/router';
import { IconWithTitleAndSubtitle } from './IconWithTitleAndSubtitle';
import { ChevronRight, Clock } from 'lucide-solid';
import { manageHref } from '../../../utils/manageHref';

interface AppointmentItemProps {
  service: string;
  duration: string;
  date: string;
  time: string;
  manageToken?: string;
  icon?: JSX.Element;
  class?: string;
}

export function AppointmentItem(props: AppointmentItemProps) {
  const details = () => `${props.duration} • ${props.date} at ${props.time}`;
  const href = () => manageHref(props.manageToken);

  const content = () => (
    <IconWithTitleAndSubtitle
      icon={props.icon || <Clock class="w-4 h-4 text-primary" />}
      title={props.service}
      subtitle={details()}
    />
  );

  return (
    <Show
      when={href()}
      fallback={
        <div class={`p-3 bg-white rounded-lg border border-primary/10 ${props.class || ''}`}>
          {content()}
        </div>
      }
    >
      {(link) => (
        <A
          href={link()}
          class={`flex items-center justify-between gap-2 p-3 bg-white rounded-lg border border-primary/10 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer ${props.class || ''}`}
        >
          {content()}
          <ChevronRight class="w-4 h-4 text-primary shrink-0" />
        </A>
      )}
    </Show>
  );
}
