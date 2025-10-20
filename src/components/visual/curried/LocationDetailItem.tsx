import { DetailItem } from '../base/DetailItem';
import { Globe } from '../icons';

interface LocationDetailItemProps {
  value: string;
  class?: string;
}

export function LocationDetailItem(props: LocationDetailItemProps) {
  return (
    <DetailItem
      icon={<Globe class="w-5 h-5 text-primary" />}
      label="Location"
      value={props.value}
      class={props.class}
    />
  );
}

