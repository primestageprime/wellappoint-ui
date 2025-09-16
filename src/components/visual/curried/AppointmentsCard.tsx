import { For, Show } from 'solid-js';
import { IconWithText } from '../base/IconWithText';
import { Ratio } from '../base/Ratio';
import { AppointmentItem } from '../base/AppointmentItem';
import { H3 } from '../base/H3';
import { Card } from './Card';
import { Calendar } from 'lucide-solid';
import { type AppointmentsCardProps } from '../../../types/visual';

export function AppointmentsCard(props: AppointmentsCardProps) {
  return (
    <Show when={props.appointments && props.appointments.length > 0}>
    <Card class={props.class}>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <IconWithText icon={<Calendar class="w-5 h-5 text-primary" />}>
            <H3>Your Appointments</H3>
          </IconWithText>
          <Ratio current={props.appointments.length} total={props.appointmentRequestCap || 1} />
        </div>
        
        <div class="space-y-2">
          <For each={props.appointments}>
            {(appointment) => (
              <AppointmentItem
                service={appointment.service}
                duration={appointment.duration}
                date={appointment.date}
                time={appointment.time}
                icon={appointment.icon}
              />
            )}
          </For>
        </div>
      </div>
    </Card>
    </Show>
  );
}
