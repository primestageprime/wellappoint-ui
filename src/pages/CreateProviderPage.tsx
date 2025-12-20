import { createSignal, createEffect, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { 
  PageFrame,
  Content,
  FormField,
  SectionCard,
  StepSection,
  SuccessMessage,
  ErrorMessage,
  SubmitButton,
  ActionButton
} from '../components/visual';
import { useAuth } from '../auth/AuthProvider';
import { apiFetch } from '../config/api';

export function CreateProviderPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  
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
  
  // Get provider name from Google auth
  const getProviderName = () => {
    const user = auth.user();
    return user?.name || '';
  };

  const [username, setUsername] = createSignal('');
  const [providerName, setProviderName] = createSignal('');
  const [refreshToken, setRefreshToken] = createSignal('');
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isOAuthLoading, setIsOAuthLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal<string | null>(null);

  // Update username and provider name when auth user is available
  createEffect(() => {
    const user = auth.user();
    if (user) {
      if (!username()) {
        setUsername(generateDefaultUsername());
      }
      if (!providerName()) {
        setProviderName(getProviderName());
      }
    }
  });

  // Check for refresh token from OAuth callback on mount
  onMount(() => {
    const storedToken = sessionStorage.getItem('oauth_refresh_token');
    if (storedToken) {
      setRefreshToken(storedToken);
      setSuccess('Google authorization successful! You can now complete provider setup.');
      // Clear the token from sessionStorage
      sessionStorage.removeItem('oauth_refresh_token');
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
    
    if (!username() || !providerName() || !refreshToken()) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiFetch('/api/provider/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username(),
          providerName: providerName(),
          refreshToken: refreshToken(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup provider');
      }

      if (data.success) {
        setSuccess(`Provider ${username()} setup successfully! Redirecting to admin page...`);
        // Navigate to the provider's admin page after a short delay
        setTimeout(() => {
          navigate(`/admin/${username()}`);
        }, 2000);
      } else {
        throw new Error(data.error || 'Provider setup failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageFrame>
      <Content>

        <SectionCard
          title="Provider Setup"
          description="Log in to Google to grant us access to read and write to Google Calendar. We'll create a new calendar called WellAppoint for you. By dragging blocks of time named 'Available' into that calendar, you can make your time available to clients."
        >
          <StepSection
            step={1}
            title="Google OAuth Setup"
            description="Authenticate with Google to grant permission to create your WellAppoint calendar."
          >
            {!refreshToken() ? (
              <ActionButton
                onClick={handleOAuthSetup}
                isLoading={isOAuthLoading()}
                loadingText="Redirecting to Google..."
              >
                Start Google OAuth
              </ActionButton>
            ) : (
              <SuccessMessage inline>✅ Google authorization complete!</SuccessMessage>
            )}
          </StepSection>

          <StepSection step={2} title="Provider Configuration" hasBorder>
            <form onSubmit={handleProviderSetup} class="space-y-4">
              <FormField
                label="Username"
                name="username"
                placeholder="yourname-2025-12-19"
                value={username}
                onInput={setUsername}
                helpText="URL-safe username for the provider (used in your booking URL)"
              />

              <FormField
                label="Provider Name"
                name="providerName"
                placeholder="Peter Stradinger"
                value={providerName}
                onInput={setProviderName}
              />

              {refreshToken() && (
                <FormField
                  label="Refresh Token"
                  name="refreshToken"
                  placeholder="1//04..."
                  value={refreshToken}
                  onInput={setRefreshToken}
                  disabled
                  helpText="Token obtained from Google OAuth"
                />
              )}

              <SubmitButton
                disabled={!refreshToken()}
                isLoading={isSubmitting()}
                loadingText="Creating provider..."
              >
                Create Provider
              </SubmitButton>
            </form>
          </StepSection>
        </SectionCard>

        {error() && <ErrorMessage>{error()}</ErrorMessage>}

        {success() && <SuccessMessage>{success()}</SuccessMessage>}

      </Content>
    </PageFrame>
  );
}
