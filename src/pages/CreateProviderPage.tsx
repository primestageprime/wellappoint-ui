import { createSignal, createEffect, onMount } from 'solid-js';
import { useNavigate, useSearchParams } from '@solidjs/router';
import {
  PageFrame,
  Content,
  FormField,
  SectionCard,
  StepSection,
  SuccessMessage,
  ErrorMessage,
  ActionButton,
  ProgressButton
} from '../components/visual';
import { useAuth } from '../auth/AuthProvider';
import { apiFetch } from '../config/api';
import { taskMetrics } from '../utils/taskMetrics';
import { animateProgress } from '../utils/progressAnimation';

export function CreateProviderPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if we're on localhost
  const isLocalhost = () => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Generate default username from Google auth
  const generateDefaultUsername = () => {
    const user = auth.user();
    const googleUsername = user?.nickname || user?.name?.split(' ')[0]?.toLowerCase() || 'provider';
    
    if (isLocalhost()) {
      const isoDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      return `${googleUsername}-${isoDate}`;
    }
    return googleUsername;
  };
  
  // Get provider name and email from Google auth
  const getProviderName = () => {
    const user = auth.user();
    return user?.name || '';
  };

  const getProviderEmail = () => {
    const user = auth.user();
    return user?.email || '';
  };

  const [username, setUsername] = createSignal('');
  const [providerName, setProviderName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [phone, setPhone] = createSignal('');
  const [refreshToken, setRefreshToken] = createSignal('');
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isProviderSetupSuccess, setIsProviderSetupSuccess] = createSignal(false);
  const [setupProgress, setSetupProgress] = createSignal(0);
  const [isOAuthLoading, setIsOAuthLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal<string | null>(null);

  // Track if we've already set the initial defaults
  const [hasSetDefaults, setHasSetDefaults] = createSignal(false);

  // Set default username, provider name, and email once when auth user is available
  createEffect(() => {
    const user = auth.user();
    if (user && !hasSetDefaults()) {
      setUsername(generateDefaultUsername());
      setProviderName(getProviderName());
      setEmail(getProviderEmail());
      setHasSetDefaults(true);
    }
  });

  // Check for token key from OAuth callback on mount (Safari-compatible)
  onMount(async () => {
    // Try to get token key from URL parameter first (works in all browsers including Safari)
    let tokenKey = searchParams.tokenKey;

    // Fallback to sessionStorage if URL parameter not present
    if (!tokenKey) {
      try {
        tokenKey = sessionStorage.getItem('oauth_token_key');
        if (tokenKey) {
          // Clear the key from sessionStorage after reading
          sessionStorage.removeItem('oauth_token_key');
        }
      } catch (e) {
        console.warn('sessionStorage not available:', e);
      }
    }

    if (tokenKey) {
      try {
        // Fetch the actual refresh token from server using the key
        const response = await apiFetch('/api/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tokenKey }),
        });

        const data = await response.json();

        if (data.success && data.refreshToken) {
          setRefreshToken(data.refreshToken);

          // Clean up URL parameter if present
          if (searchParams.tokenKey) {
            navigate('/admin/create-provider', { replace: true });
          }
        } else {
          setError(data.error || 'Failed to retrieve OAuth token');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to retrieve OAuth token');
      }
    }
  });

  const handleOAuthSetup = async () => {
    setIsOAuthLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Call the backend OAuth setup endpoint to get the auth URL
      const response = await apiFetch('/api/oauth/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OAuth setup failed');
      }

      if (data.success && data.authUrl) {
        // Redirect to Google OAuth - the callback will handle the rest
        window.location.href = data.authUrl;
      } else {
        throw new Error('No OAuth URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth setup failed');
      setIsOAuthLoading(false);
    }
  };

  const handleProviderSetup = async (e: Event) => {
    e.preventDefault();

    if (!username() || !providerName() || !email() || !refreshToken()) {
      setError('Username, name, and email are required');
      return;
    }

    setIsSubmitting(true);
    setIsProviderSetupSuccess(false);
    setSetupProgress(0);
    setError(null);
    setSuccess(null);

    // Start progress animation
    const stopProgress = animateProgress(
      10000, // 10 second estimate
      (progress) => setSetupProgress(progress),
      () => {} // onComplete handled by API response
    );

    const startTime = Date.now();

    try {
      const response = await apiFetch('/api/provider/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username(),
          providerName: providerName(),
          email: email(),
          phone: phone(),
          refreshToken: refreshToken(),
        }),
      });

      const data = await response.json();

      // Record task completion time
      const elapsedMs = Date.now() - startTime;
      taskMetrics.recordTask('create-provider', elapsedMs);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup provider');
      }

      if (data.success) {
        stopProgress(); // Stop the animation
        setSetupProgress(100); // Jump to 100%
        setIsProviderSetupSuccess(true);
        setSuccess(`Provider ${username()} setup successfully! Redirecting to admin page...`);
        // Navigate to the provider's admin page after showing success
        setTimeout(() => {
          navigate(`/admin/${username()}`);
        }, 2000);
      } else {
        throw new Error(data.error || 'Provider setup failed');
      }
    } catch (err) {
      // Record time even on error
      const elapsedMs = Date.now() - startTime;
      taskMetrics.recordTask('create-provider', elapsedMs);

      stopProgress(); // Stop the animation on error
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageFrame>
      <Content>

        <SectionCard
          title="Become a Provider"
          description="Set up your WellAppoint scheduling system in two simple steps."
        >
          {/* Step 1 - Collapsed when step 2 is shown */}
          {!refreshToken() ? (
            <StepSection
              step={1}
              title="Authorize WellAppoint to Handle Scheduling for You"
              description="We'll create a special calendar called 'WellAppoint' in your Google Calendar so it doesn't conflict with your other calendaring. We'll also share an administrative spreadsheet with you to configure your services, pricing, and availability settings."
            >
              {/* Preview images */}
              <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Calendar preview */}
                <div class="rounded-lg overflow-hidden border border-border">
                  <img
                    src="/calendar-preview.svg"
                    alt="WellAppoint calendar showing available time blocks"
                    class="w-full h-auto"
                  />
                  <div class="bg-muted/30 px-3 py-2 text-xs text-muted-foreground text-center">
                    Your WellAppoint Calendar
                  </div>
                </div>

                {/* Spreadsheet preview */}
                <div class="rounded-lg overflow-hidden border border-border">
                  <img
                    src="/spreadsheet-preview.svg"
                    alt="Admin spreadsheet for configuring services"
                    class="w-full h-auto"
                  />
                  <div class="bg-muted/30 px-3 py-2 text-xs text-muted-foreground text-center">
                    Your Admin Spreadsheet
                  </div>
                </div>
              </div>

              <ActionButton
                onClick={handleOAuthSetup}
                isLoading={isOAuthLoading()}
                loadingText="Redirecting to Google..."
              >
                Authorize with Google
              </ActionButton>
            </StepSection>
          ) : (
            <div class="flex items-center gap-3 py-4 text-sm text-muted-foreground">
              <span class="text-green-600 font-medium">✓</span>
              <span>1. Authorization complete</span>
            </div>
          )}

          {/* Only show step 2 after authorization is complete */}
          {refreshToken() && (
            <StepSection step={2} title="Configure Your Provider Account" hasBorder>
              <form onSubmit={handleProviderSetup} class="space-y-4">
                <FormField
                  label="Username"
                  name="username"
                  placeholder="yourname-2025-12-19"
                  value={username}
                  onInput={setUsername}
                  helpText="URL-safe username for your booking page (example: wellappoint.com/yourname)"
                />

                <FormField
                  label="Your Name"
                  name="providerName"
                  placeholder="Peter Stradinger"
                  value={providerName}
                  onInput={setProviderName}
                  helpText="Your full name as it will appear to clients"
                />

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="peter@example.com"
                  value={email}
                  onInput={setEmail}
                  helpText="Your email address for client communications"
                />

                <FormField
                  label="Phone Number (Optional)"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onInput={setPhone}
                  helpText="Your phone number to display to clients"
                />

                <ProgressButton
                  text="Complete Setup"
                  loadingText="Creating your account..."
                  successText="Account Created!"
                  isLoading={isSubmitting()}
                  isSuccess={isProviderSetupSuccess()}
                  taskId="create-provider"
                  type="submit"
                  fixedProgress={setupProgress()}
                />
              </form>
            </StepSection>
          )}
        </SectionCard>

        {error() && <ErrorMessage>{error()}</ErrorMessage>}

        {success() && <SuccessMessage>{success()}</SuccessMessage>}

      </Content>
    </PageFrame>
  );
}
