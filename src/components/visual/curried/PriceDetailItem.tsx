import { DetailItem } from '../base/DetailItem';
import { Currency } from '../icons';

interface PriceDetailItemProps {
  value: string;
  class?: string;
}

export function PriceDetailItem(props: PriceDetailItemProps) {
  return (
    <DetailItem
      icon={<Currency class="w-5 h-5 text-primary" />}
      label="Price"
      value={props.value}
      class={props.class}
    />
  );
}

