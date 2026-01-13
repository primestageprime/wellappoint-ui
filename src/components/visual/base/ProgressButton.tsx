import { createSignal, onCleanup, Show, createEffect } from 'solid-js';
import { taskMetrics } from '../../../utils/taskMetrics';

interface ProgressButtonProps {
  /** Text to show on the button */
  text: string;
  /** Text to show while loading */
  loadingText?: string;
  /** Text to show on success */
  successText?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in loading state */
  isLoading: boolean;
  /** Whether the operation completed successfully */
  isSuccess?: boolean;
  /** Task ID for tracking execution time */
  taskId: string;
  /** Form type for styling */
  type?: 'submit' | 'button';
  /** Click handler */
  onClick?: () => void;
  /** Optional fixed progress value (0-100) - overrides automatic progress */
  fixedProgress?: number;
}

export function ProgressButton(props: ProgressButtonProps) {
  const [progress, setProgress] = createSignal(0);
  const [startTime, setStartTime] = createSignal<number | null>(null);

  const DEFAULT_DURATION = 10000; // 10 seconds default

  // Get estimated duration from historical data
  const getEstimatedDuration = () => {
    const avgTime = taskMetrics.getAverageTime(props.taskId);
    return avgTime || DEFAULT_DURATION;
  };

  // Use fixed progress if provided, otherwise calculate
  const currentProgress = () => {
    return props.fixedProgress !== undefined ? props.fixedProgress : progress();
  };

  // Start progress when loading begins
  createEffect(() => {
    // Don't run automatic progress if fixedProgress is provided
    if (props.fixedProgress !== undefined) return;

    if (props.isLoading && !startTime()) {
      setStartTime(Date.now());
      setProgress(0);

      const duration = getEstimatedDuration();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime()!;
        const rawProgress = (elapsed / duration) * 100;
        // Animate smoothly to 100%
        setProgress(Math.min(rawProgress, 100));

        // Stop if we reach 100% or if loading completes
        if (rawProgress >= 100 || !props.isLoading) {
          clearInterval(interval);
        }
      }, 50);

      onCleanup(() => clearInterval(interval));
    }

    // When loading completes, jump to 100%
    if (!props.isLoading && startTime()) {
      setProgress(100);
      // Reset after animation completes
      setTimeout(() => {
        setStartTime(null);
      }, 500);
    }
  });

  // Determine background color based on state
  const backgroundColor = () => {
    if (props.isSuccess) return '#16a34a'; // Green
    // When at 100% progress (even while loading), show light brown (will transition to green)
    if (currentProgress() >= 100) return '#e8dcc0'; // Light brown
    return '#8B6914'; // Dark brown
  };

  // Text is always white
  const textColor = () => '#ffffff';

  return (
    <button
      type={props.type || 'submit'}
      disabled={props.disabled || props.isLoading || props.isSuccess}
      onClick={props.onClick}
      class="progress-btn"
      classList={{ active: props.isLoading }}
      style={{
        position: 'relative',
        width: '100%',
        height: '50px',
        display: 'inline-block',
        background: backgroundColor(),
        border: 'none',
        cursor: props.disabled || props.isLoading || props.isSuccess ? 'not-allowed' : 'pointer',
        'font-weight': '500',
        'font-size': '20px',
        color: textColor(),
        transition: 'background 0.6s ease',
        'border-radius': '0.375rem',
        overflow: 'hidden',
      }}
    >
      {/* Text layer - z-index: 10 */}
      <div
        class="btn"
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
          right: '0',
          bottom: '0',
          'line-height': '50px',
          'text-align': 'center',
          'z-index': '10',
          opacity: '1',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          color: textColor(),
        }}
      >
        <Show when={props.isSuccess}>
          <span style={{ display: 'flex', 'align-items': 'center', gap: '0.5rem' }}>
            <span>✓</span>
            {props.successText || 'Success!'}
          </span>
        </Show>
        <Show when={!props.isSuccess}>
          <Show when={props.isLoading} fallback={props.text}>
            <span style={{ display: 'flex', 'align-items': 'center', gap: '0.5rem' }}>
              {/* Loading spinner */}
              <svg
                style={{ animation: 'spin 1s linear infinite', width: '1rem', height: '1rem' }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  style={{ opacity: '0.25' }}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  style={{ opacity: '0.75' }}
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {props.loadingText || props.text}
            </span>
          </Show>
        </Show>
      </div>

      {/* Progress layer - z-index: 5, fills from left */}
      <div
        class="progress"
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
          right: '0',
          bottom: '0',
          width: props.isLoading ? `${currentProgress()}%` : '0%',
          'z-index': '5',
          background: '#e8dcc0', // Light brown progress bar
          opacity: props.isLoading ? '1' : '0',
          transition: 'width 0.1s linear, opacity 0.2s ease',
        }}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
