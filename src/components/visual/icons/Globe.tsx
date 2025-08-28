import { JSX } from 'solid-js';

interface GlobeProps {
  class?: string;
}

export function Globe(props: GlobeProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={props.class}
    >
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" x2="22" y1="12" y2="12"/>
      <path d="m9 12 6 0"/>
      <path d="m12 2a15.3 15.3 0 0 1 0 20"/>
      <path d="m12 2a15.3 15.3 0 0 0 0 20"/>
    </svg>
  );
}
