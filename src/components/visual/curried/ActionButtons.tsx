import { JSX } from 'solid-js';
import { StandardButton } from '../base/StandardButton';

interface ActionButton {
  text: string;
  onClick: () => void;
  variant: 'secondary' | 'primary';
  disabled?: boolean;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
  class?: string;
}

export function ActionButtons(props: ActionButtonsProps) {
  return (
    <div class={`flex gap-4 ${props.class || ''}`}>
      {props.buttons.map((button) => (
        <StandardButton
          onClick={button.onClick}
          disabled={button.disabled}
          variant={button.variant}
          class="flex-1"
        >
          {button.text}
        </StandardButton>
      ))}
    </div>
  );
}
