import { JSX } from 'solid-js';

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
        <button
          onClick={button.onClick}
          disabled={button.disabled}
          class={`flex-1 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 ${
            button.variant === 'primary'
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'border border-primary/20 text-primary hover:bg-primary/5'
          }`}
        >
          {button.text}
        </button>
      ))}
    </div>
  );
}
