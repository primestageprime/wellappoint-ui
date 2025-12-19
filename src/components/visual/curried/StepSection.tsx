import { JSX } from 'solid-js';

interface StepSectionProps {
  step: number;
  title: string;
  description?: string;
  children: JSX.Element;
  hasBorder?: boolean;
}

export function StepSection(props: StepSectionProps) {
  return (
    <div class={props.hasBorder ? "pt-6 border-t border-[#8B6914]/20" : "mb-6"}>
      <h3 class="text-base font-semibold text-[#3d2e0a] mb-3">
        {props.step}. {props.title}
      </h3>
      {props.description && (
        <p class="text-sm text-[#5a4510] mb-4">{props.description}</p>
      )}
      {props.children}
    </div>
  );
}

