import { createSignal } from 'solid-js';
import { 
  PageFrame,
  HeaderCard,
  Content,
  Card,
  H3,
  Button,
  CenteredContent,
  LogoutButton
} from '../components/visual';
import { useAuth } from '../auth/AuthProvider';

export function OAuthSetupPage() {
  const auth = useAuth();
  const [isLoading, setIsLoading] = createSignal(false);
  const [refreshToken, setRefreshToken] = createSignal('');
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal<string | null>(null);

  const handleOAuthSetup = async () => {
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
          <H3>OAuth Setup</H3>
          <LogoutButton onLogout={handleLogout} />
        </CenteredContent>
      </HeaderCard>

      <Content>
        <Card>
          <div class="max-w-2xl mx-auto">
            <H3>Google OAuth Setup</H3>
            <p class="text-gray-600 mb-6">
              Set up OAuth authentication with Google to get a refresh token for provider setup.
            </p>

            <div class="space-y-4">
              <div>
                <Button
                  onClick={handleOAuthSetup}
                  disabled={isLoading()}
                  class="w-full"
                >
                  {isLoading() ? 'Setting up OAuth...' : 'Start OAuth Setup'}
                </Button>
              </div>

              {refreshToken() && (
                <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                  <h4 class="font-medium text-green-900 mb-2">Refresh Token:</h4>
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
                    Copy this token and use it in the Create Provider form.
                  </p>
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
            </div>

            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 class="font-medium text-blue-900 mb-2">What this does:</h4>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• Opens Google OAuth consent screen in a new window</li>
                <li>• Requests calendar and sheets permissions</li>
                <li>• Returns a refresh token for API access</li>
                <li>• Use this token when creating new providers</li>
              </ul>
            </div>

            <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h4 class="font-medium text-yellow-900 mb-2">Alternative:</h4>
              <p class="text-sm text-yellow-800">
                You can also run <code class="bg-yellow-100 px-1 rounded">deno task oauth:setup</code> in the terminal
                if the web interface doesn't work properly.
              </p>
            </div>
          </div>
        </Card>
      </Content>
    </PageFrame>
  );
}
