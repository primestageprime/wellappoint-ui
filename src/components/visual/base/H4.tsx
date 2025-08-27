import { JSX } from 'solid-js';

interface H4Props {
  children: JSX.Element;
  class?: string;
}

export function H4(props: H4Props) {
  return (
    <h4 class={`text-base font-medium ${props.class || ''}`}>
      {props.children}
    </h4>
  );
}
