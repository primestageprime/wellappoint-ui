import { JSX } from 'solid-js';

interface PaperProps {
  children: JSX.Element;
  class?: string;
}

export function Paper(props: PaperProps) {
  return (
    <div class={`bg-white shadow-md rounded-lg mx-auto my-4 ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
