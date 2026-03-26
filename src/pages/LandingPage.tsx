import { createResource, Show } from 'solid-js';
import { A } from '@solidjs/router';
import { WellAppointLogo } from '../components/visual/icons';
import { useAuth } from '../auth/AuthProvider';
import { apiFetch } from '../config/api';

export function LandingPage() {
  const auth = useAuth();

  const [providerData] = createResource(
    () => auth.user()?.email,
    async (email) => {
      const response = await apiFetch(`/api/provider/me?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error(`Provider lookup failed with status ${response.status}`);
      }
      const data = await response.json();
      return data.exists ? (data.username as string) : null;
    }
  );

  return (
    <div class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div class="paper-background">
        <div class="max-w-md w-full space-y-8">
          <div>
            <div class="flex justify-center mb-4">
              <WellAppointLogo className="text-card-foreground" />
            </div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-card-foreground">
              WellAppoint
            </h2>
            <p class="mt-2 text-center text-sm text-muted-foreground">
              Keep coming back to the Well
            </p>
          </div>

          <Show when={providerData.error}>
            <div class="text-center py-4">
              <p class="text-sm text-red-600">
                Unable to load your account. Please refresh the page or try again later.
              </p>
            </div>
          </Show>

          <Show when={!providerData.loading && !providerData.error} fallback={
            <div class="text-center py-8">
              <p class="text-sm text-muted-foreground">Loading...</p>
            </div>
          }>
            <div class="mt-8 space-y-4">
              <Show when={providerData()} fallback={
                <>
                  <div class="text-center">
                    <A
                      href="/admin/create-provider"
                      class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8B6914] hover:bg-[#6d5410] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
                    >
                      Become a Provider
                    </A>
                  </div>
                  <div class="text-center">
                    <p class="text-sm text-muted-foreground">
                      Looking to book an appointment? Ask your provider for their booking link or scan their QR code.
                    </p>
                  </div>
                </>
              }>
                <div class="space-y-4">
                  <p class="text-center text-sm text-muted-foreground">
                    Welcome back, {auth.user()?.name || 'Provider'}
                  </p>
                  <div>
                    <A
                      href={`/admin/${providerData()}`}
                      class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8B6914] hover:bg-[#6d5410] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
                    >
                      Go to Dashboard
                    </A>
                  </div>
                  <div>
                    <A
                      href={`/${providerData()}`}
                      class="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-card-foreground bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
                    >
                      View Booking Page
                    </A>
                  </div>
                </div>
              </Show>
            </div>

            <div class="text-center">
              <button
                onClick={() => auth.logout()}
                type="button"
                class="text-sm text-[#8B6914] hover:underline"
              >
                Sign out
              </button>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
