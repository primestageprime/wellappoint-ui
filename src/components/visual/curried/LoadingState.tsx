import { Spinner } from '../base/Spinner';
import { taskMetrics } from '../../../utils/taskMetrics';

interface LoadingStateProps {
  message: string;
  class?: string;
  /** Optional task ID for progress tracking */
  taskId?: string;
}

export function LoadingState(props: LoadingStateProps) {
  // Get estimated duration if taskId is provided
  const estimatedDuration = props.taskId ? taskMetrics.getAverageTime(props.taskId) : null;

  return (
    <div class={`text-center py-12 ${props.class || ''}`}>
      <Spinner
        estimatedDuration={estimatedDuration || undefined}
        text={props.message}
        size="large"
      />
    </div>
  );
}

