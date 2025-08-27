import { JSX } from 'solid-js';

interface HeaderCardProps {
  children: JSX.Element;
  class?: string;
}

export function HeaderCard(props: HeaderCardProps) {
  return (
    <div class={`bg-background shadow-lg rounded-t-lg my-4 ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
