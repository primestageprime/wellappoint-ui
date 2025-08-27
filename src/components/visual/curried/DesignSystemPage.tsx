import { JSX } from 'solid-js';
import { CenteredContent } from '../base';

interface DesignSystemPageProps {
  children: JSX.Element;
  title?: string;
}

export function DesignSystemPage(props: DesignSystemPageProps) {
  return (
    <div class="min-h-screen bg-background p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-primary mb-8">{props.title || 'Design System'}</h1>
        {props.children}
      </div>
    </div>
  );
}
