import { JSX } from 'solid-js';
import { StandardButton } from '../base/StandardButton';

interface SecondaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: JSX.Element;
  class?: string;
}

export function SecondaryButton(props: SecondaryButtonProps) {
  return (
    <StandardButton
      onClick={props.onClick}
      disabled={props.disabled}
      variant="secondary"
      class={props.class}
    >
      {props.children}
    </StandardButton>
  );
}

