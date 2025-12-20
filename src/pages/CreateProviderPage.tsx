import { createSignal, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { 
  PageFrame,
  Content,
  FormField,
  SectionCard,
  StepSection,
  SuccessMessage,
  ErrorMessage,
  InputWithButton,
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
  const [refreshToken, setRefreshToken] = createSignal('');
  const [authCode, setAuthCode] = createSignal('');
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isOAuthLoading, setIsOAuthLoading] = createSignal(false);
  const [isExchangingCode, setIsExchangingCode] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal<string | null>(null);
  const [step, setStep] = createSignal<'oauth' | 'provider'>('oauth');

  const handleExchangeCode = async () => {
    if (!authCode()) {
      setError('Please enter the authorization code');
      return;
    }

    setIsExchangingCode(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiFetch('/api/oauth/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: authCode(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to exchange authorization code');
      }

      if (data.success && data.refreshToken) {
        setRefreshToken(data.refreshToken);
        setSuccess('Refresh token obtained successfully!');
        setAuthCode(''); // Clear the auth code
      } else {
        throw new Error('No refresh token received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to exchange authorization code');
    } finally {
      setIsExchangingCode(false);
    }
  };

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
      console.log('OAuth setup response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'OAuth setup failed');
      }

      if (data.success && data.authUrl) {
        const authUrl = data.authUrl;
        console.log('Opening OAuth URL:', authUrl);
        setSuccess('Opening Google OAuth consent screen...');
        
        // Open the OAuth URL in a new window
        const popup = window.open(authUrl, 'oauth', 'width=600,height=600,scrollbars=yes,resizable=yes');
        
        if (!popup) {
          throw new Error('Popup blocked. Please allow popups and try again.');
        }

        // Poll for the popup to close (user completed OAuth)
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            setSuccess('OAuth completed! Please copy the authorization code from the Google page and paste it below, then we can exchange it for a refresh token.');
            setIsOAuthLoading(false);
          }
        }, 1000);

      } else if (data.success && data.error && data.error.includes('Please visit this URL')) {
        // Fallback: Extract the URL from the error message
        const urlMatch = data.error.match(/https:\/\/[^\s]+/);
        console.log('URL match result:', urlMatch);
        
        if (urlMatch) {
          const authUrl = urlMatch[0];
          console.log('Opening OAuth URL (fallback):', authUrl);
          setSuccess('Opening Google OAuth consent screen...');
          
          // Open the OAuth URL in a new window
          const popup = window.open(authUrl, 'oauth', 'width=600,height=600,scrollbars=yes,resizable=yes');
          
          if (!popup) {
            throw new Error('Popup blocked. Please allow popups and try again.');
          }

          // Poll for the popup to close (user completed OAuth)
          const checkClosed = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkClosed);
              setSuccess('OAuth completed! Please copy the authorization code from the Google page and paste it below.');
              setIsOAuthLoading(false);
            }
          }, 1000);

        } else {
          console.error('Could not extract URL from:', data.error);
          throw new Error('Could not extract OAuth URL from response');
        }
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Unexpected response from OAuth setup');
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

  const handleLogout = async () => {
    await auth.logout();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(refreshToken());
      setSuccess('Refresh token copied to clipboard!');
    } catch (err) {
      setError('Failed to copy to clipboard');
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
            description="First, we need to authenticate with Google to get permission to create calendars and sheets."
          >
            <ActionButton
              onClick={handleOAuthSetup}
              isLoading={isOAuthLoading()}
              loadingText="Setting up OAuth..."
            >
              Start Google OAuth
            </ActionButton>

            <div class="mt-4">
              <InputWithButton
                label="Authorization Code"
                placeholder="Paste the authorization code here"
                value={authCode}
                onInput={setAuthCode}
                buttonText="Authorize"
                buttonLoadingText="Authorizing..."
                onButtonClick={handleExchangeCode}
                isLoading={isExchangingCode()}
                helpText="After completing OAuth, copy the authorization code from the Google page and paste it above."
              />
            </div>

            {refreshToken() && (
              <div class="mt-4">
                <SuccessMessage inline>✅ Refresh token obtained successfully!</SuccessMessage>
              </div>
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

        {success() && !refreshToken() && <SuccessMessage>{success()}</SuccessMessage>}

      </Content>
    </PageFrame>
  );
}