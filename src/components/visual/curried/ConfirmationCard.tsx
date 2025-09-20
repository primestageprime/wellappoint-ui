import { Show } from 'solid-js';
import { ConfirmationPanel } from '../../ConfirmationPanel';
import { type ConfirmationCardProps } from '../../../types/visual';

export function ConfirmationCard(props: ConfirmationCardProps) {
  return (
    <Show when={props.bookingStep() === 'confirmation' || props.bookingStep() === 'success'}>
      <ConfirmationPanel 
        service={props.selectedServiceData()!}
        selectedSlot={props.selectedSlot()!}
        isSubmitting={props.isSubmitting()}
        error={props.bookingError()}
        success={props.bookingSuccess()}
        onConfirm={props.onConfirm}
        onBack={props.onBack}
      />
    </Show>
  );
}
