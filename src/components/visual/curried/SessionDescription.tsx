interface SessionDescriptionProps {
  description: string;
  class?: string;
}

export function SessionDescription(props: SessionDescriptionProps) {
  return (
    <div class={`space-y-2 ${props.class || ''}`}>
      <label class="text-sm font-medium text-muted-foreground">Session Description</label>
      <p class="text-primary">{props.description}</p>
    </div>
  );
}
