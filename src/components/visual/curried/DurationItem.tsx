import { JSX } from 'solid-js';
import { IconWithTitleAndSubtitle } from '../base/IconWithTitleAndSubtitle';
import { Clock } from 'lucide-solid';

interface DurationItemProps {
  duration: string;
  description: string;
  price: string;
  icon?: JSX.Element;
  onClick?: () => void;
  class?: string;
}

export function DurationItem(props: DurationItemProps) {
  return (
    <button
      onClick={props.onClick}
      class={`w-full p-4 bg-card rounded-lg border border-primary/10 hover:border-primary/20 transition-colors cursor-pointer flex items-center justify-between ${props.class || ''}`}
  
    >
      <IconWithTitleAndSubtitle
        icon={<Clock class="w-5 h-5 text-primary" />}
        title={props.duration}
        subtitle={props.description}
      />
      <div class="text-lg font-semibold text-primary">
        {props.price}
      </div>
    </button>
  );
}
