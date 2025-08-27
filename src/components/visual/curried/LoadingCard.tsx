import { JSX } from 'solid-js';
import { Card } from './Card';
import { CenteredContent } from '../base/CenteredContent';

interface LoadingCardProps {
  message?: string;
  class?: string;
}

export function LoadingCard(props: LoadingCardProps) {
  return (
    <Card class={props.class}>
      <CenteredContent>
        <div class="text-muted-foreground">{props.message || 'Loading...'}</div>
      </CenteredContent>
    </Card>
  );
}
