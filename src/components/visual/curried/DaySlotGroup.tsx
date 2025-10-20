import { JSX } from 'solid-js';
import { H4 } from '../base/H4';

interface DaySlotGroupProps {
  date: string;
  children: JSX.Element;
  class?: string;
}

export function DaySlotGroup(props: DaySlotGroupProps) {
  return (
    <div class={`space-y-4 w-full ${props.class || ''}`}>
      <div class="border-b border-primary/20 pb-2">
        <H4 class="text-xl font-bold text-primary">{props.date}</H4>
      </div>
      <div class="flex flex-wrap gap-2 w-full">
        {props.children}
      </div>
    </div>
  );
}

