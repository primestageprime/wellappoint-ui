import { createSignal, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { 
  PageFrame,
  HeaderCard,
  Content,
  Card,
  H3,
  Button,
  Input,
  Label,
  CenteredContent,
  LogoutButton
} from '../components/visual';
import { useAuth } from '../auth/AuthProvider';

export function CreateProviderPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  
  // Generate default username with ISO date
  const generateDefaultUsername = () => {
    const now = new Date();
    const isoDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    return `emlprime-${isoDate}`;
  };

  const [username, setUsername] = createSignal(generateDefaultUsername());
  const [providerName, setProviderName] = createSignal('Peter Stradinger');
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
      const response = await fetch('/api/oauth/exchange', {
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
      const response = await fetch('/api/oauth/setup', {
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
      const response = await fetch('/api/provider/setup', {
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
        setSuccess(`Provider ${username()} setup successfully! Redirecting to booking page...`);
        // Navigate to the provider's booking page after a short delay
        setTimeout(() => {
          navigate(`/${username()}`);
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
      <HeaderCard>
        <CenteredContent>
          <H3>Create New Provider</H3>
          <LogoutButton onLogout={handleLogout} />
        </CenteredContent>
      </HeaderCard>

      <Content>
        <Card>
          <div class="max-w-2xl mx-auto">
            <H3>Provider Setup</H3>
            <p class="text-gray-600 mb-6">
              Set up a new provider by authenticating with Google and creating the necessary resources.
            </p>

            {/* Step 1: OAuth Setup */}
            <div class="mb-8">
              <div class="flex items-center mb-4">
                <div class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step() === 'oauth' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <h4 class="ml-3 text-lg font-medium">Google OAuth Setup</h4>
              </div>
              
              <div class="ml-11">
                <p class="text-gray-600 mb-4">
                  First, we need to authenticate with Google to get permission to create calendars and sheets.
                </p>
                
                <Button
                  onClick={handleOAuthSetup}
                  disabled={isOAuthLoading()}
                  class="mb-4"
                >
                  {isOAuthLoading() ? 'Setting up OAuth...' : 'Start Google OAuth'}
                </Button>

                {!refreshToken() && (
                  <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                    <h5 class="font-medium text-blue-900 mb-2">Authorization Code:</h5>
                    <div class="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={authCode()}
                        onInput={(e) => setAuthCode(e.currentTarget.value)}
                        placeholder="Paste the authorization code here"
                        class="flex-1"
                      />
                      <Button
                        onClick={handleExchangeCode}
                        disabled={isExchangingCode() || !authCode()}
                        class="px-3 py-1 text-sm"
                      >
                        {isExchangingCode() ? 'Exchanging...' : 'Exchange'}
                      </Button>
                    </div>
                    <p class="text-sm text-blue-700 mt-2">
                      After completing OAuth, copy the authorization code from the Google page and paste it above.
                    </p>
                  </div>
                )}

                {refreshToken() && (
                  <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                    <h5 class="font-medium text-green-900 mb-2">Refresh Token Received:</h5>
                    <div class="flex items-center space-x-2">
                      <code class="flex-1 p-2 bg-white border rounded text-sm break-all">
                        {refreshToken()}
                      </code>
                      <Button
                        onClick={copyToClipboard}
                        class="px-3 py-1 text-sm"
                      >
                        Copy
                      </Button>
                    </div>
                    <p class="text-sm text-green-700 mt-2">
                      ✅ OAuth setup complete! You can now proceed to provider setup.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Provider Setup */}
            <div class="mb-8">
              <div class="flex items-center mb-4">
                <div class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  refreshToken() ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <h4 class="ml-3 text-lg font-medium">Provider Configuration</h4>
              </div>
              
              <div class="ml-11">
                <form onSubmit={handleProviderSetup} class="space-y-4">
                  <div>
                    <Label for="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username()}
                      onInput={(e) => setUsername(e.currentTarget.value)}
                      placeholder="emlprime-2025-09-19"
                      required
                    />
                    <p class="text-sm text-gray-500 mt-1">
                      URL-safe username for the provider (defaults to emlprime-{new Date().toISOString().split('T')[0]})
                    </p>
                  </div>

                  <div>
                    <Label for="providerName">Provider Name</Label>
                    <Input
                      id="providerName"
                      type="text"
                      value={providerName()}
                      onInput={(e) => setProviderName(e.currentTarget.value)}
                      placeholder="Peter Stradinger"
                      required
                    />
                  </div>

                  <div>
                    <Label for="refreshToken">Refresh Token</Label>
                    <Input
                      id="refreshToken"
                      type="text"
                      value={refreshToken()}
                      onInput={(e) => setRefreshToken(e.currentTarget.value)}
                      placeholder="1//04..."
                      required
                      disabled={!refreshToken()}
                    />
                    <p class="text-sm text-gray-500 mt-1">
                      {refreshToken() 
                        ? "✅ Token received from OAuth setup above"
                        : "Complete OAuth setup above to get your refresh token"
                      }
                    </p>
                  </div>

                  <div class="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting() || !refreshToken()}
                      class="w-full"
                    >
                      {isSubmitting() ? 'Creating provider...' : 'Create Provider'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {error() && (
              <div class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error()}
              </div>
            )}

            {success() && !refreshToken() && (
              <div class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success()}
              </div>
            )}

            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 class="font-medium text-blue-900 mb-2">What this process does:</h4>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• <strong>Step 1:</strong> Authenticates with Google to get calendar/sheets permissions</li>
                <li>• <strong>Step 2:</strong> Clones the admin sheet template for the provider</li>
                <li>• <strong>Step 2:</strong> Creates a WellAppoint calendar in the provider's Google account</li>
                <li>• <strong>Step 2:</strong> Adds the provider to the providers spreadsheet</li>
                <li>• <strong>Step 2:</strong> Redirects you to the provider's booking page</li>
              </ul>
            </div>

            <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h4 class="font-medium text-yellow-900 mb-2">Alternative:</h4>
              <p class="text-sm text-yellow-800">
                You can also run <code class="bg-yellow-100 px-1 rounded">deno task oauth:setup</code> in the terminal
                to get a refresh token, then paste it in Step 2.
              </p>
            </div>
          </div>
        </Card>
      </Content>
    </PageFrame>
  );
}