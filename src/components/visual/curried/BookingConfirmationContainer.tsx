import { JSX } from 'solid-js';
import { CenteredContent } from '../base/CenteredContent';
import { H3 } from '../base/H3';

interface BookingConfirmationContainerProps {
  title: string;
  children: JSX.Element;
  class?: string;
}

export function BookingConfirmationContainer(props: BookingConfirmationContainerProps) {
  return (
    <div class={`space-y-6 ${props.class || ''}`}>
      <CenteredContent>
        <H3>{props.title}</H3>
      </CenteredContent>
      
      {props.children}
    </div>
  );
}

