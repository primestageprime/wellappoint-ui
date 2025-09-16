import { For } from 'solid-js';
import { DurationItem } from './DurationItem';
import { Card } from './Card';
import { H3 } from '../base/H3';
import { type DurationListProps } from '../../../types/visual';

export function DurationList(props: DurationListProps) {
  return (
    <Card class={props.class}>
      <div class="p-6 space-y-4">
        {props.title && <H3>{props.title}</H3>}
        
        <div class="space-y-3">
          <For each={props.durations}>
            {(duration) => (
              <DurationItem
                duration={`${duration.minutes} minutes`}
                description={duration.description}
                price={`$${duration.price}`}
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
