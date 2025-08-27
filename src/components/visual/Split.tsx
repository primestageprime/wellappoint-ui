import { JSX } from 'solid-js';

interface SplitProps {
  left: JSX.Element;
  right: JSX.Element;
  class?: string;
}

export function Split(props: SplitProps) {
  return (
    <div class={`flex justify-between items-center ${props.class || ''}`}>
      <div>{props.left}</div>
      <div>{props.right}</div>
    </div>
  );
}
