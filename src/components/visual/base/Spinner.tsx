import { createSignal, onCleanup, Show } from 'solid-js';

interface SpinnerProps {
  /** Estimated duration in milliseconds (if known from historical data) */
  estimatedDuration?: number;
  /** Text to show below the spinner */
  text?: string;
  /** Size of the spinner */
  size?: 'small' | 'medium' | 'large';
}

export function Spinner(props: SpinnerProps) {
  const [progress, setProgress] = createSignal(0);
  const [elapsed, setElapsed] = createSignal(0);

  const sizeMap = {
    small: 24,
    medium: 40,
    large: 64,
  };

  const spinnerSize = sizeMap[props.size || 'medium'];

  // Default to 10 seconds if no estimate
  const DEFAULT_DURATION = 10000;
  const duration = props.estimatedDuration || DEFAULT_DURATION;

  // Update progress based on estimated duration
  if (duration) {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      setElapsed(elapsedMs);

      // Calculate progress (0-100), capped at 95% to indicate uncertainty
      const rawProgress = (elapsedMs / duration) * 100;
      setProgress(Math.min(rawProgress, 95));
    }, 100);

    onCleanup(() => clearInterval(interval));
  }

  return (
    <div class="flex flex-col items-center justify-center p-4">
      {/* Circular progress spinner */}
      <div
        class="relative"
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
        }}
      >
        {/* Background circle */}
        <svg
          class="transform -rotate-90"
          width={spinnerSize}
          height={spinnerSize}
        >
          <circle
            cx={spinnerSize / 2}
            cy={spinnerSize / 2}
            r={(spinnerSize - 4) / 2}
            stroke="#e5e7eb"
            stroke-width="3"
            fill="none"
          />

          {/* Progress circle */}
          <circle
            cx={spinnerSize / 2}
            cy={spinnerSize / 2}
            r={(spinnerSize - 4) / 2}
            stroke="#8B6914"
            stroke-width="3"
            fill="none"
            stroke-dasharray={`${2 * Math.PI * ((spinnerSize - 4) / 2)}`}
            stroke-dashoffset={`${
              2 * Math.PI * ((spinnerSize - 4) / 2) * (1 - progress() / 100)
            }`}
            style={{
              transition: 'stroke-dashoffset 0.1s linear',
            }}
          />
        </svg>
      </div>

      {/* Loading text */}
      <Show when={props.text}>
        <p class="mt-2 text-sm text-muted-foreground">{props.text}</p>
      </Show>

      {/* Progress percentage */}
      <Show when={progress() > 0}>
        <div class="mt-1 text-center">
          <p class="text-xs text-muted-foreground">
            {Math.round(progress())}%
          </p>
        </div>
      </Show>
    </div>
  );
}
