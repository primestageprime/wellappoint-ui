interface LoadingStateProps {
  message: string;
  class?: string;
}

export function LoadingState(props: LoadingStateProps) {
  return (
    <div class={`text-center py-12 ${props.class || ''}`}>
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="text-primary mt-4">{props.message}</p>
    </div>
  );
}

