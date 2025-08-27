import { JSX, For } from 'solid-js';
import { IconWithText } from '../base/IconWithText';
import { Ratio } from '../base/Ratio';
import { AppointmentItem } from '../base/AppointmentItem';
import { Card } from './Card';
import { Calendar } from 'lucide-solid';

interface Appointment {
  service: string;
  duration: string;
  date: string;
  time: string;
  icon?: JSX.Element;
}

interface AppointmentsCardProps {
  appointments: Appointment[];
  class?: string;
}

export function AppointmentsCard(props: AppointmentsCardProps) {
  return (
    <Card class={props.class}>
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between">
          <IconWithText icon={<Calendar class="w-5 h-5" />}>
            <span class="text-lg font-semibold">Your Appointments</span>
          </IconWithText>
          <Ratio current={1} total={props.appointments.length} />
        </div>
        
        <div class="space-y-3">
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
  );
}
