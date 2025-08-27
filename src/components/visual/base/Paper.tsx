import { JSX } from 'solid-js';

interface PaperProps {
  children: JSX.Element;
  class?: string;
}

export function Paper(props: PaperProps) {
  return (
    <div class={`bg-white shadow-lg rounded-lg m-4 ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
