import { JSX } from 'solid-js';

interface TimeSlotListContainerProps {
  children: JSX.Element;
  class?: string;
}

export function TimeSlotListContainer(props: TimeSlotListContainerProps) {
  return (
    <div class={`space-y-8 max-h-96 overflow-y-auto w-full ${props.class || ''}`}>
      {props.children}
    </div>
  );
}

