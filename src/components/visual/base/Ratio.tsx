import { JSX } from 'solid-js';

interface RatioProps {
  current: number;
  total: number;
  class?: string;
}

export function Ratio(props: RatioProps) {
  return (
    <span class={`text-xs bg-primary/10 p-2 py-1.5 rounded-full text-primary font-medium ${props.class || ''}`}>
      {props.current}/{props.total}
    </span>
  );
}
