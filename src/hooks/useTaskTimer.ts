import { createSignal, onCleanup } from 'solid-js';
import { taskMetrics } from '../utils/taskMetrics';

export interface TaskTimerState {
  /** Whether the spinner should be shown (after 500ms delay) */
  showSpinner: boolean;
  /** Estimated duration based on historical data (in ms) */
  estimatedDuration: number | null;
  /** Function to call when task completes */
  complete: () => void;
}

/**
 * Hook to track async task performance and show spinner with estimated progress
 *
 * @param taskId - Unique identifier for this type of task
 * @returns TaskTimerState with showSpinner flag, estimatedDuration, and complete function
 *
 * @example
 * const timer = useTaskTimer('loading-time-slots');
 *
 * const [slots] = createResource(async () => {
 *   const data = await fetchSlots();
 *   timer.complete();
 *   return data;
 * });
 *
 * <Show when={timer.showSpinner}>
 *   <Spinner estimatedDuration={timer.estimatedDuration} text="Loading time slots..." />
 * </Show>
 */
export function useTaskTimer(taskId: string): TaskTimerState {
  const [showSpinner, setShowSpinner] = createSignal(false);
  const [estimatedDuration] = createSignal(taskMetrics.getAverageTime(taskId));

  let startTime = Date.now();
  let spinnerTimeout: ReturnType<typeof setTimeout> | null = null;
  let completed = false;

  // Show spinner after 500ms delay
  spinnerTimeout = setTimeout(() => {
    if (!completed) {
      setShowSpinner(true);
    }
  }, 500);

  const complete = () => {
    if (completed) return;

    completed = true;

    // Clear the spinner timeout if it hasn't fired yet
    if (spinnerTimeout) {
      clearTimeout(spinnerTimeout);
      spinnerTimeout = null;
    }

    // Hide spinner
    setShowSpinner(false);

    // Record the task execution time
    const duration = Date.now() - startTime;
    taskMetrics.recordTask(taskId, duration);

    console.debug(`Task "${taskId}" completed in ${duration}ms`);
  };

  // Cleanup on unmount
  onCleanup(() => {
    if (spinnerTimeout) {
      clearTimeout(spinnerTimeout);
    }
  });

  return {
    get showSpinner() {
      return showSpinner();
    },
    get estimatedDuration() {
      return estimatedDuration();
    },
    complete,
  };
}
