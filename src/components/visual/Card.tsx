import { JSX } from 'solid-js';

interface CardProps {
  children: JSX.Element;
  class?: string;
}

export function Card(props: CardProps) {
  return (
    <div class={`bg-background shadow-lg rounded-lg mx-auto my-4 ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
