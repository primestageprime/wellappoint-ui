import { JSX } from 'solid-js';
import { Card } from '../base/Card';
import { IconWithTitleAndSubtitle } from '../base/IconWithTitleAndSubtitle';

interface ServiceSummaryCardProps {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  class?: string;
}

export function ServiceSummaryCard(props: ServiceSummaryCardProps) {
  return (
    <div class={`flex items-center gap-4 p-4 bg-primary/5 rounded-lg ${props.class || ''}`}>
      {props.icon}
      <div>
        <h4 class="text-lg font-semibold text-primary">{props.title}</h4>
        <p class="text-muted-foreground">{props.subtitle}</p>
      </div>
    </div>
  );
}
