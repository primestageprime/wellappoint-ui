import { JSX, Show } from 'solid-js';
import { Edit2 } from 'lucide-solid';

interface ServiceSummaryCardProps {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  class?: string;
  onEdit?: () => void;
}

export function ServiceSummaryCard(props: ServiceSummaryCardProps) {
  return (
    <div class={`flex items-center gap-4 p-4 bg-primary/5 rounded-lg ${props.class || ''}`}>
      {props.icon}
      <div class="flex-1">
        <h4 class="text-lg font-semibold text-primary">{props.title}</h4>
        <p class="text-muted-foreground">{props.subtitle}</p>
      </div>
      <Show when={props.onEdit}>
        <button
          onClick={props.onEdit}
          class="p-2 hover:bg-primary/10 rounded-md transition-colors"
          aria-label="Edit service selection"
        >
          <Edit2 class="w-5 h-5 text-primary" />
        </button>
      </Show>
    </div>
  );
}
