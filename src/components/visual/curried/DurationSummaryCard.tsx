import { IconWithTitleAndSubtitle } from '../base/IconWithTitleAndSubtitle';
import { Clock, X } from 'lucide-solid';

interface DurationSummaryCardProps {
  duration: number;
  price: number;
  description?: string;
  class?: string;
  onEdit?: () => void;
}

export function DurationSummaryCard(props: DurationSummaryCardProps) {
  return (
    <button
      onClick={props.onEdit}
      disabled={!props.onEdit}
      class={`w-full p-4 bg-card rounded-lg border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-between ${props.class || ''} ${!props.onEdit ? 'cursor-default' : ''}`}
    >
      <IconWithTitleAndSubtitle
        icon={<Clock class="w-5 h-5 text-primary" />}
        title={`${props.duration} minutes`}
        subtitle={props.description || `$${props.price}`}
      />
      <div class="flex items-center gap-3">
        <div class="text-lg font-semibold text-primary">
          ${props.price}
        </div>
        {props.onEdit && (
          <X class="w-5 h-5 text-primary" />
        )}
      </div>
    </button>
  );
}

