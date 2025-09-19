import { JSX } from 'solid-js';

export interface LabelProps {
  for?: string;
  class?: string;
  children: JSX.Element;
}

export function Label(props: LabelProps): JSX.Element {
  return (
    <label
      for={props.for}
      class={`block text-sm font-medium text-gray-700 mb-1 ${props.class || ''}`}
    >
      {props.children}
    </label>
  );
}
