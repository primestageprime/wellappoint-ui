import { For } from 'solid-js';
import { 
  AppointmentsContainer,
  AppointmentItem,
} from '../visual';
import { type UserAppointmentsResponse } from '../../types/global';

export interface AppointmentsListProps {
  appointments: UserAppointmentsResponse;
}

/**
 * Displays the user's existing appointments
 */
export function AppointmentsList(props: AppointmentsListProps) {
  return (
    <AppointmentsContainer 
      appointmentRequestCap={props.appointments.appointmentRequestCap}
      appointmentCount={props.appointments.appointments.length}
    >
      <For each={props.appointments.appointments}>
        {(apt) => (
          <AppointmentItem
            service={apt.service}
            duration={apt.duration}
            date={apt.date}
            time={apt.time}
          />
        )}
      </For>
    </AppointmentsContainer>
  );
}

