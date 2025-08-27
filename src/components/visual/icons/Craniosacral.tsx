import { JSX } from 'solid-js';

interface CraniosacralProps {
  class?: string;
}

export function Craniosacral(props: CraniosacralProps) {
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
      <circle cx="8" cy="8" r="3"/>
      <circle cx="16" cy="16" r="3"/>
      <line x1="11" y1="11" x2="13" y2="13"/>
    </svg>
  );
}
