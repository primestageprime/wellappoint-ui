import { DetailItem } from '../base/DetailItem';
import { Calendar } from '../icons';

interface TimeSlotDetailItemProps {
  value: string;
  class?: string;
}

export function TimeSlotDetailItem(props: TimeSlotDetailItemProps) {
  return (
    <DetailItem
      icon={<Calendar class="w-5 h-5 text-primary" />}
      label="Date & Time"
      value={props.value}
      class={props.class}
    />
  );
}

