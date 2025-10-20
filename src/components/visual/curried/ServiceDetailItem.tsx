import { DetailItem } from '../base/DetailItem';
import { PrimaryHeart } from './PrimaryHeart';

interface ServiceDetailItemProps {
  value: string;
  class?: string;
}

export function ServiceDetailItem(props: ServiceDetailItemProps) {
  return (
    <DetailItem
      icon={<PrimaryHeart />}
      label="Service"
      value={props.value}
      class={props.class}
    />
  );
}

