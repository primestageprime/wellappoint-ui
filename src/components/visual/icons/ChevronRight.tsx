import { JSX } from 'solid-js';

interface ChevronRightProps {
  class?: string;
}

export function ChevronRight(props: ChevronRightProps) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class={props.class}
    >
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}
