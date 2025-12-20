import { JSX } from 'solid-js';
import { PageFrame, Content } from '../';

interface LegalPageProps {
  title: string;
  lastUpdated?: string;
  children: JSX.Element;
}

export function LegalPage(props: LegalPageProps) {
  return (
    <PageFrame>
      <Content>
        <div class="max-w-4xl mx-auto px-4 py-8">
          <h1 class="text-3xl font-bold text-[#3d2e0a] mb-2">{props.title}</h1>
          {props.lastUpdated && (
            <p class="text-sm text-[#5a4510] mb-8">Last updated: {props.lastUpdated}</p>
          )}
          <div class="space-y-6 text-[#3d2e0a]">
            {props.children}
          </div>
        </div>
      </Content>
    </PageFrame>
  );
}

