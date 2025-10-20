import { JSX } from 'solid-js';
import { VerticallySpacedContent } from '../base/VerticallySpacedContent';

interface AppointmentDetailsGridProps {
  children: JSX.Element;
  class?: string;
}

export function AppointmentDetailsGrid(props: AppointmentDetailsGridProps) {
  return (
    <VerticallySpacedContent class={props.class}>
      {props.children}
    </VerticallySpacedContent>
  );
}
