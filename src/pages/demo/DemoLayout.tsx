import { DemoNav } from './DemoNav';
import { type JSX } from 'solid-js';

interface DemoLayoutProps {
  children: JSX.Element;
}

export function DemoLayout(props: DemoLayoutProps) {
  return (
    <div>
      <DemoNav />
      {props.children}
    </div>
  );
}

