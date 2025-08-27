import { JSX } from 'solid-js';
import { IconWithTitleAndSubtitle } from '../base/IconWithTitleAndSubtitle';
import { Clock } from 'lucide-solid';

interface TimeItemProps {
  time: string;
  available: boolean;
  onClick?: () => void;
  class?: string;
}

export function TimeItem(props: TimeItemProps) {
  return (
    <button
      onClick={props.onClick}
      disabled={!props.available}
      class={`p-4 bg-card rounded-lg border border-primary/10 hover:border-primary/20 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
        props.available 
          ? 'hover:bg-primary/5' 
          : 'opacity-50 cursor-not-allowed'
      } ${props.class || ''}`}
    >
      <Clock class="w-4 h-4 text-primary flex-shrink-0" />
      <span class="text-sm font-medium">{props.time}</span>
    </button>
  );
}
