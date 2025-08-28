import { JSX } from 'solid-js';

interface CurrencyProps {
  class?: string;
}

export function Currency(props: CurrencyProps) {
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
      <circle cx="12" cy="12" r="8"/>
      <line x1="12" x2="12" y1="6" y2="18"/>
      <line x1="9" x2="15" y1="12" y2="12"/>
    </svg>
  );
}
