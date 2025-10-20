import { DetailItem } from '../base/DetailItem';
import { Info } from 'lucide-solid';

interface DescriptionDetailItemProps {
  value: string;
  class?: string;
}

export function DescriptionDetailItem(props: DescriptionDetailItemProps) {
  return (
    <DetailItem
      icon={<Info class="w-5 h-5 text-primary" />}
      label="Description"
      value={props.value}
      class={props.class}
    />
  );
}

