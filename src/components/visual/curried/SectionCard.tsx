import { JSX } from 'solid-js';

interface SectionCardProps {
  title: string;
  description?: string;
  children: JSX.Element;
}

export function SectionCard(props: SectionCardProps) {
  return (
    <div class="max-w-3xl mx-auto bg-white rounded-lg border border-[#8B6914]/20 shadow-sm mb-6">
      <div class="p-6 border-b border-[#8B6914]/20">
        <h2 class="text-lg font-semibold text-[#3d2e0a]">{props.title}</h2>
        {props.description && (
          <p class="text-sm text-[#5a4510] mt-1">{props.description}</p>
        )}
      </div>
      <div class="p-6">
        {props.children}
      </div>
    </div>
  );
}

