import { JSX } from 'solid-js';

interface RatioProps {
  current: number;
  total: number;
  class?: string;
}

export function Ratio(props: RatioProps) {
  return (
    <span class={`text-sm text-muted-foreground ${props.class || ''}`}>
      {props.current}/{props.total}
    </span>
  );
}
