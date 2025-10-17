import { Show } from 'solid-js';
import { Edit2, Clock } from 'lucide-solid';

interface DurationSummaryCardProps {
  duration: number;
  price: number;
  class?: string;
  onEdit?: () => void;
}

export function DurationSummaryCard(props: DurationSummaryCardProps) {
  return (
    <div class={`flex items-center gap-4 p-4 bg-primary/5 rounded-lg ${props.class || ''}`}>
      <div class="p-3 rounded-full bg-primary/10">
        <Clock class="w-6 h-6 text-primary" />
      </div>
      <div class="flex-1">
        <h4 class="text-lg font-semibold text-primary">{props.duration} minutes</h4>
        <p class="text-muted-foreground">${props.price}</p>
      </div>
      <Show when={props.onEdit}>
        <button
          onClick={props.onEdit}
          class="p-2 hover:bg-primary/10 rounded-md transition-colors"
          aria-label="Edit duration selection"
        >
          <Edit2 class="w-5 h-5 text-primary" />
        </button>
      </Show>
    </div>
  );
}

