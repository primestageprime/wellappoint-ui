import { JSX, For } from 'solid-js';
import { DurationItem } from './DurationItem';
import { Card } from './Card';
import { H3 } from '../base/H3';

interface Duration {
  duration: string;
  description: string;
  price: string;
  icon?: JSX.Element;
  onClick?: () => void;
}

interface DurationListProps {
  durations: Duration[];
  title?: string;
  class?: string;
}

export function DurationList(props: DurationListProps) {
  return (
    <Card class={props.class}>
      <div class="p-6 space-y-4">
        {props.title && <H3>{props.title}</H3>}
        
        <div class="space-y-3">
          <For each={props.durations}>
            {(duration) => (
              <DurationItem
                duration={duration.duration}
                description={duration.description}
                price={duration.price}
                icon={duration.icon}
                onClick={duration.onClick}
              />
            )}
          </For>
        </div>
      </div>
    </Card>
  );
}
