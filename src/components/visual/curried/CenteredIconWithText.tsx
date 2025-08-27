import { JSX } from 'solid-js';
import { IconWithText } from '../base';

interface CenteredIconWithTextProps {
  icon: JSX.Element;
  children: JSX.Element;
  class?: string;
}

export function CenteredIconWithText(props: CenteredIconWithTextProps) {
  return (
    <IconWithText icon={props.icon} class={`justify-center ${props.class || ''}`}>
      {props.children}
    </IconWithText>
  );
}
