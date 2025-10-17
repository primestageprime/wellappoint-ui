import { createSignal } from 'solid-js';
import { PageFrame, HeaderCard, Content, Avatar, Split, LogoutButton, CenteredContent, H3, H4 } from '../../components/visual';
import { DemoLayout } from './DemoLayout';

export function ProcessingStatePage() {
  const [username] = createSignal('azula');

  return (
    <DemoLayout>
    <PageFrame>
      <HeaderCard>
        <Split 
          left={<Avatar username={username} />}
          right={<LogoutButton onLogout={() => console.log('Logout')}>Logout</LogoutButton>}
        />
      </HeaderCard>
      
      <Content>
        <div class="space-y-6">
          <CenteredContent>
            <H3>Processing Your Request</H3>
            <H4>Please wait while we confirm your appointment...</H4>
          </CenteredContent>

          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            <p class="text-primary mt-6 text-lg">Submitting your appointment request...</p>
            <p class="text-muted-foreground mt-2 text-sm">This should only take a moment</p>
          </div>
        </div>
      </Content>
    </PageFrame>
    </DemoLayout>
  );
}

