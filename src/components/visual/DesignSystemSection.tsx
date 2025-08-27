import { JSX } from 'solid-js';

interface DesignSystemSectionProps {
  title: string;
  children: JSX.Element;
}

export function DesignSystemSection(props: DesignSystemSectionProps) {
  return (
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-primary mb-4">{props.title}</h2>
      <div class="space-y-4">
        {props.children}
      </div>
    </section>
  );
}
