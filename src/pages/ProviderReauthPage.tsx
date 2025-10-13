import { createSignal } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
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

export function ProviderReauthPage() {
  const auth = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = createSignal(false);
  const [refreshToken, setRefreshToken] = createSignal('');
  const [authCode, setAuthCode] = createSignal('');
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal<string | null>(null);

  const providerUsername = () => params.username;

  const handleReauth = async () => {
    setIsLoading(true);
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

      if (!response.ok) {
        throw new Error(data.error || 'OAuth setup failed');
      }

      if (data.success && data.error && data.error.includes('Please visit this URL')) {
        // Extract the URL from the error message
        const urlMatch = data.error.match(/https:\/\/[^\s]+/);
        if (urlMatch) {
          const authUrl = urlMatch[0];
          setSuccess('Opening OAuth consent screen...');
          
          // Open the OAuth URL in a new window
          const popup = window.open(authUrl, 'oauth', 'width=600,height=600,scrollbars=yes,resizable=yes');
          
          if (!popup) {
            throw new Error('Popup blocked. Please allow popups and try again.');
          }

          // Poll for the popup to close (user completed OAuth)
          const checkClosed = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkClosed);
              setSuccess('OAuth completed! Check the callback page for your refresh token.');
              setIsLoading(false);
            }
          }, 1000);

        } else {
          throw new Error('Could not extract OAuth URL from response');
        }
      } else {
        throw new Error('Unexpected response from OAuth setup');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth setup failed');
      setIsLoading(false);
    }
  };

  const handleUpdateProvider = async () => {
    if (!refreshToken()) {
      setError('Please complete OAuth or exchange authorization code first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/provider/reauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: providerUsername(),
          refreshToken: refreshToken(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update provider token');
      }

      if (data.success) {
        setSuccess(`Provider ${providerUsername()} re-authenticated successfully! Redirecting to booking page...`);
        // Navigate to the provider's booking page after a short delay
        setTimeout(() => {
          navigate(`/${providerUsername()}`);
        }, 2000);
      } else {
        throw new Error(data.error || 'Provider re-authentication failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExchangeCode = async () => {
    if (!authCode().trim()) {
      setError('Please enter an authorization code');
      return;
    }

    setIsLoading(true);
    setError(null);

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
        setSuccess('Authorization code exchanged successfully! You can now update your provider.');
      } else {
        throw new Error('No refresh token received from exchange');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to exchange authorization code');
    } finally {
      setIsLoading(false);
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
          <H3>Provider Re-authentication</H3>
          <LogoutButton onLogout={handleLogout} />
        </CenteredContent>
      </HeaderCard>

      <Content>
        <Card>
          <div class="max-w-2xl mx-auto">
            <H3>Re-authenticate Provider: {providerUsername()}</H3>
            <p class="text-gray-600 mb-6">
              Your provider's OAuth token has expired. Re-authenticate with Google to restore access to your calendar and booking system.
            </p>

            <div class="space-y-4">
              {/* Step 1: OAuth Setup */}
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">Step 1: Get New OAuth Token</h4>
                <p class="text-sm text-gray-600 mb-3">
                  Click the button below to open Google's OAuth consent screen and get a new refresh token.
                </p>
                <Button
                  onClick={handleReauth}
                  disabled={isLoading()}
                  class="w-full"
                >
                  {isLoading() ? 'Opening OAuth...' : 'Start OAuth Re-authentication'}
                </Button>
              </div>

              {/* Authorization Code Exchange */}
              <div class="p-4 border rounded-lg bg-yellow-50">
                <h4 class="font-medium mb-2">Step 1.5: Exchange Authorization Code</h4>
                <p class="text-sm text-gray-600 mb-3">
                  If you have an authorization code (starts with "4/"), paste it here to exchange it for a refresh token.
                </p>
                
                <div class="space-y-3">
                  <div>
                    <Label for="auth-code">Authorization Code:</Label>
                    <Input
                      id="auth-code"
                      type="text"
                      value={authCode()}
                      onInput={(e) => setAuthCode(e.currentTarget.value)}
                      placeholder="Paste your authorization code here (starts with 4/)..."
                      class="w-full"
                    />
                  </div>
                  
                  <Button
                    onClick={handleExchangeCode}
                    disabled={isLoading() || !authCode().trim()}
                    class="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    {isLoading() ? 'Exchanging Code...' : 'Exchange Code for Refresh Token'}
                  </Button>
                </div>
              </div>


              {/* Step 2: Update Provider */}
              {refreshToken() && (
                <div class="p-4 border rounded-lg bg-green-50">
                  <h4 class="font-medium mb-2">Step 2: Update Provider Token</h4>
                  <p class="text-sm text-gray-600 mb-3">
                    Your new refresh token is ready. Click below to update your provider with the new token.
                  </p>
                  
                  <div class="mb-3 p-3 bg-white border rounded">
                    <h5 class="font-medium text-sm mb-1">New Refresh Token:</h5>
                    <div class="flex items-center space-x-2">
                      <code class="flex-1 p-2 bg-gray-50 border rounded text-xs break-all">
                        {refreshToken()}
                      </code>
                      <Button
                        onClick={copyToClipboard}
                        class="px-3 py-1 text-sm"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleUpdateProvider}
                    disabled={isLoading()}
                    class="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isLoading() ? 'Updating Provider...' : 'Update Provider Token'}
                  </Button>
                </div>
              )}

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

              {success() && refreshToken() && (
                <div class="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                  {success()}
                </div>
              )}
            </div>

          </div>
        </Card>
      </Content>
    </PageFrame>
  );
}
