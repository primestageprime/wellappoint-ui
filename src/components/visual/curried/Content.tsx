import { JSX } from 'solid-js';
import { WellAppointLogo } from '../icons';
import { CenteredContent } from '../base';

interface ContentProps {
  children?: JSX.Element;
  class?: string;
}

export function Content(props: ContentProps) {
  return (
    <div class={`bg-white p-3 ${props.class || ''}`}>
      {/* Header with logo */}
      <div class="relative">
        {/* Centered logo and title */}
        <CenteredContent>
          <a href="/" class="flex flex-col items-center no-underline">
            {/* Well Logo */}
            <WellAppointLogo className="text-primary" size={48} />
            {/* Company Name */}
            <h1 class="text-lg font-bold text-primary">WellAppoint</h1>
          </a>
        </CenteredContent>
      </div>

      <div class="space-y-4 mt-4">
        {props.children}
      </div>
    </div>
  );
}
