import { JSX } from 'solid-js';
import { Card } from './Card';

interface ErrorCardProps {
  error: string;
  onRetry?: () => void;
  class?: string;
}

export function ErrorCard(props: ErrorCardProps) {
  return (
    <Card class={props.class}>
      <div class="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-4">
        <div class="text-destructive">
          Error: {props.error}
        </div>
        {props.onRetry && (
          <button
            onClick={props.onRetry}
            class="mt-2 text-destructive hover:text-destructive/80 underline"
          >
            Try again
          </button>
        )}
      </div>
    </Card>
  );
}
