import { DetailItem } from '../base/DetailItem';
import { Clock } from 'lucide-solid';

interface DurationDetailItemProps {
  value: string;
  class?: string;
}

export function DurationDetailItem(props: DurationDetailItemProps) {
  return (
    <DetailItem
      icon={<Clock class="w-5 h-5 text-primary" />}
      label="Duration"
      value={props.value}
      class={props.class}
    />
  );
}

