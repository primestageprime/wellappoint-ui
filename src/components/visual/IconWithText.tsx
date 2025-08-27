import { JSX } from 'solid-js';
import { Briefcase } from 'lucide-solid';

interface IconWithTextProps {
  icon: JSX.Element;
  children: JSX.Element;
  class?: string;
}

interface TextOnlyProps {
  children: JSX.Element;
  class?: string;
}

export function IconWithText(props: IconWithTextProps) {
  return (
    <div class={`flex items-center gap-4 ${props.class || ''}`}>
      {props.icon}
      {props.children}
    </div>
  );
}

export function TightIconWithText(props: IconWithTextProps) {
  return (
    <div class={`flex items-center gap-2 ${props.class || ''}`}>
      {props.icon}
      {props.children}
    </div>
  );
}

export function LooseIconWithText(props: IconWithTextProps) {
  return (
    <div class={`flex items-center gap-8 ${props.class || ''}`}>
      {props.icon}
      {props.children}
    </div>
  );
}

export function BriefcaseWithText(props: TextOnlyProps) {
  return (
    <div class={`flex items-center gap-4 ${props.class || ''}`}>
      <Briefcase class="w-4 h-4 text-muted-foreground" />
      {props.children}
    </div>
  );
}

export function TightBriefcaseWithText(props: TextOnlyProps) {
  return (
    <div class={`flex items-center gap-2 ${props.class || ''}`}>
      <Briefcase class="w-4 h-4 text-muted-foreground" />
      {props.children}
    </div>
  );
}

export function LooseBriefcaseWithText(props: TextOnlyProps) {
  return (
    <div class={`flex items-center gap-8 ${props.class || ''}`}>
      <Briefcase class="w-4 h-4 text-muted-foreground" />
      {props.children}
    </div>
  );
}
