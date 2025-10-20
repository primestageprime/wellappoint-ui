import { JSX } from 'solid-js';
import { StandardButton } from '../base/StandardButton';

interface PrimaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: JSX.Element;
  class?: string;
}

export function PrimaryButton(props: PrimaryButtonProps) {
  return (
    <StandardButton
      onClick={props.onClick}
      disabled={props.disabled}
      variant="primary"
      class={props.class}
    >
      {props.children}
    </StandardButton>
  );
}

