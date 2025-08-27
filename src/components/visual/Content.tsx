import { JSX } from 'solid-js';

interface ContentProps {
  children?: JSX.Element;
  class?: string;
}

export function Content(props: ContentProps) {
  return (
    <div class={`bg-white p-4 ${props.class || ''}`}>
      <div class="flex flex-col items-center space-y-2">
        {/* Well Logo */}
        <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
            {/* Peaked roof */}
            <path d="M12 2L4 8v2h16V8L12 2z"/>
            {/* Support posts */}
            <path d="M6 10v8h2v-6h8v6h2v-8H6z"/>
            {/* Well base */}
            <path d="M4 18h16v2H4v-2z"/>
            {/* Bucket */}
            <path d="M10 14h4v2h-4v-2z"/>
          </svg>
        </div>
        {/* Company Name */}
        <h1 class="text-2xl font-bold text-primary">WellAppoint</h1>
      </div>
      {props.children}
    </div>
  );
}
