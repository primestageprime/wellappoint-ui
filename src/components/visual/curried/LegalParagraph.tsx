import { JSX } from 'solid-js';

interface LegalParagraphProps {
  children: JSX.Element | string;
  muted?: boolean;
}

export function LegalParagraph(props: LegalParagraphProps) {
  return (
    <p class={`leading-relaxed ${props.muted ? 'text-sm text-[#5a4510]' : ''}`}>
      {props.children}
    </p>
  );
}

