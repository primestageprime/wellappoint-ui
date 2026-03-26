import { For, JSX } from "solid-js";
import { A } from "@solidjs/router";

interface ActionPill {
  label: string;
  href: string;
  primary?: boolean;
  icon?: JSX.Element;
}

interface ActionPillsProps {
  pills: ActionPill[];
}

export function ActionPills(props: ActionPillsProps) {
  return (
    <div class="flex flex-wrap gap-2">
      <For each={props.pills}>
        {(pill) => (
          <A
            href={pill.href}
            class={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium no-underline transition-colors ${
              pill.primary
                ? "bg-[#8B6914] text-white hover:bg-[#6d5410]"
                : "bg-white text-[#3d2e0a] border border-[#d4c5a0] hover:bg-[#f5f0e8]"
            }`}
          >
            {pill.icon}
            {pill.label}
          </A>
        )}
      </For>
    </div>
  );
}
