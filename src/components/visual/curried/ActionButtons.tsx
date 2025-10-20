import { JSX } from 'solid-js';

interface ActionButtonsProps {
  children: JSX.Element;
  class?: string;
}

export function ActionButtons(props: ActionButtonsProps) {
  return (
    <div class={`flex gap-4 ${props.class || ''}`}>
      {props.children}
    </div>
  );
}
