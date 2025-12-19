import { Accessor, Setter } from 'solid-js';

interface InputWithButtonProps {
  label: string;
  placeholder: string;
  value: Accessor<string>;
  onInput: Setter<string>;
  buttonText: string;
  buttonLoadingText?: string;
  onButtonClick: () => void;
  isLoading?: boolean;
  helpText?: string;
}

export function InputWithButton(props: InputWithButtonProps) {
  return (
    <div>
      <label class="block text-sm font-medium text-[#5a4510] mb-2">
        {props.label}
      </label>
      <div class="flex gap-2">
        <input
          type="text"
          value={props.value()}
          onInput={(e) => props.onInput(e.currentTarget.value)}
          placeholder={props.placeholder}
          class="flex-1 h-10 px-4 border border-[#8B6914]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B6914] focus:border-transparent bg-white text-[#3d2e0a] placeholder:text-[#8B6914]/50"
        />
        <button
          onClick={props.onButtonClick}
          disabled={props.isLoading || !props.value()}
          class="h-10 px-4 border border-[#8B6914]/30 text-[#5a4510] rounded-md hover:bg-[#f5f0e6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {props.isLoading ? (props.buttonLoadingText || 'Loading...') : props.buttonText}
        </button>
      </div>
      {props.helpText && (
        <p class="text-xs text-[#8B6914]/70 mt-2">{props.helpText}</p>
      )}
    </div>
  );
}

