import { JSX, Show } from 'solid-js';
import { Card } from './Card';
import { H3 } from '../base/H3';

interface DurationListContainerProps {
  title?: string;
  children: JSX.Element;
  class?: string;
}

export function DurationListContainer(props: DurationListContainerProps) {
  return (
    <Card class={props.class}>
      <div class="p-6 space-y-4">
        <Show when={props.title}>
          <H3>{props.title}</H3>
        </Show>
        
        <div class="space-y-3">
          {props.children}
        </div>
      </div>
    </Card>
  );
}

