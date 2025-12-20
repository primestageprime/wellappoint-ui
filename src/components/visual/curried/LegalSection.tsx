import { JSX } from 'solid-js';

interface LegalSectionProps {
  title: string;
  children: JSX.Element;
}

export function LegalSection(props: LegalSectionProps) {
  return (
    <section>
      <h2 class="text-xl font-semibold text-[#8B6914] mb-3">{props.title}</h2>
      <div class="space-y-3">
        {props.children}
      </div>
    </section>
  );
}

