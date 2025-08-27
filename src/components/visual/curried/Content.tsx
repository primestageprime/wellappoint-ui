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
      <CenteredContent>
        {/* Well Logo */}
        <WellAppointLogo className="text-primary" size={48} />
        {/* Company Name */}
        <h1 class="text-lg font-bold text-primary">WellAppoint</h1>
      </CenteredContent>
      {props.children}
    </div>
  );
}
