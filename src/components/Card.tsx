import { JSX } from 'solid-js';

interface CardProps {
  children: JSX.Element;
  className?: string;
}

export function Card(props: CardProps) {
  return (
    <div class={`bg-card border border-border/20 rounded-lg shadow-sm ${props.className || ''}`}>
      {props.children}
    </div>
  );
}
