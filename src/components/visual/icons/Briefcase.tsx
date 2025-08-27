import { JSX } from 'solid-js';
import { Briefcase as BriefcaseIcon } from 'lucide-solid';

interface BriefcaseProps {
  class?: string;
}

export function Briefcase(props: BriefcaseProps) {
  return (
    <BriefcaseIcon class={`w-4 h-4 text-muted-foreground ${props.class || ''}`} />
  );
}
