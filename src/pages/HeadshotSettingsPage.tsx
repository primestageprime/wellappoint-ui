import { createSignal, Show, createResource } from 'solid-js';
import { useNavigate, useParams, A } from '@solidjs/router';
import { useAuth } from '../auth/AuthProvider';
import { PageFrame, Content, SectionCard } from '../components/visual';
import { HeadshotPicker } from '../components/HeadshotPicker';
import { getProviderDetails } from '../services/providerService';

export function HeadshotSettingsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const username = () => params.username as string;

  const [saved, setSaved] = createSignal(false);
  const [provider] = createResource(username, getProviderDetails);

  if (!auth.isAuthenticated()) {
    navigate('/');
  }

  return (
    <PageFrame>
      <Content>
        <div class="max-w-md mx-auto">
          <SectionCard title="Profile Photo" description="Update the photo clients see on your booking page.">
            <Show when={!provider.loading} fallback={<p class="text-sm text-muted-foreground">Loading...</p>}>
              <HeadshotPicker
                username={username()}
                currentHeadshot={provider()?.headshot}
                onHeadshotChanged={() => {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 3000);
                }}
              />
            </Show>

            <Show when={saved()}>
              <div class="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded text-sm text-center">
                Photo saved!
              </div>
            </Show>
          </SectionCard>

          <div class="text-center mt-6">
            <A
              href={`/admin/${username()}`}
              class="text-sm text-primary hover:text-primary/80"
            >
              Back to Admin Dashboard
            </A>
          </div>
        </div>
      </Content>
    </PageFrame>
  );
}
