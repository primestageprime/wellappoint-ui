import { JSX } from 'solid-js';
import { PaddingSpacer } from './base';

interface CardProps {
  children: JSX.Element;
  class?: string;
}

export function Card(props: CardProps) {
  return (
    <div class={`bg-background shadow-lg rounded-lg m-4 ${props.class || ''}`}>
      <PaddingSpacer>
        {props.children}
      </PaddingSpacer>
    </div>
  );
}
