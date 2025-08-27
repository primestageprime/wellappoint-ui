import { JSX } from 'solid-js';
import { WellAppointLogo } from '../WellAppointLogo';

interface ContentProps {
  children?: JSX.Element;
  class?: string;
}

export function Content(props: ContentProps) {
  return (
    <div class={`bg-white p-4 ${props.class || ''}`}>
      <div class="flex flex-col items-center space-y-2">
        {/* Well Logo */}
        <WellAppointLogo className="text-primary" size={48} />
        {/* Company Name */}
        <h1 class="text-lg font-bold text-primary">WellAppoint</h1>
      </div>
      {props.children}
    </div>
  );
}
