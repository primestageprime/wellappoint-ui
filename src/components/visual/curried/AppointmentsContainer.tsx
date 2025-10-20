import { JSX, Show } from 'solid-js';
import { IconWithText } from '../base/IconWithText';
import { Ratio } from '../base/Ratio';
import { H3 } from '../base/H3';
import { Card } from './Card';
import { Calendar } from 'lucide-solid';

interface AppointmentsContainerProps {
  appointmentRequestCap?: number;
  appointmentCount?: number;
  children?: JSX.Element;
  class?: string;
}

export function AppointmentsContainer(props: AppointmentsContainerProps) {
  return (
    <Show when={props.children}>
      <Card class={props.class}>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <IconWithText icon={<Calendar class="w-5 h-5 text-primary" />}>
              <H3>Your Appointments</H3>
            </IconWithText>
            <Show when={props.appointmentRequestCap}>
              <Ratio 
                current={props.appointmentCount || 0} 
                total={props.appointmentRequestCap || 1} 
              />
            </Show>
          </div>
          
          <div class="space-y-2">
            {props.children}
          </div>
        </div>
      </Card>
    </Show>
  );
}

