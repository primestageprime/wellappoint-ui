import { JSX } from 'solid-js';

interface RatioProps {
  current: number;
  total: number;
  class?: string;
}

export function Ratio(props: RatioProps) {
  return (
    <span class={`text-xs bg-amber-50 px-2 py-1 rounded text-amber-800 ${props.class || ''}`}>
      {props.current}/{props.total}
    </span>
  );
}
