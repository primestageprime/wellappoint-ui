import { JSX } from 'solid-js';

interface HeaderCardProps {
  children: JSX.Element;
  class?: string;
}

export function HeaderCard(props: HeaderCardProps) {
  return (
    <div class={`bg-background shadow-lg rounded-t-lg my-4 py-8 outline-t outline-primary/20 ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
