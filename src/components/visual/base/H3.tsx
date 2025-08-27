import { JSX } from 'solid-js';

interface H3Props {
  children: JSX.Element;
  class?: string;
}

export function H3(props: H3Props) {
  return (
    <h3 class={`text-lg font-semibold text-primary ${props.class || ''}`}>
      {props.children}
    </h3>
  );
}
