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
  LogoutButton,
  WellAppointLogo
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
      <Content>
        {/* Logo Header */}
        <div class="text-center mb-8 pt-8">
          <div class="inline-flex items-center justify-center mb-3">
            <WellAppointLogo size={64} />
          </div>
          <h1 class="text-2xl font-semibold text-[#8B6914]">WellAppoint</h1>
        </div>

        {/* Provider Setup Card */}
        <div class="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Provider Setup</h2>
            <p class="text-sm text-gray-600 mt-1">
              Set up a new provider by authenticating with Google and creating the necessary resources.
            </p>
          </div>
          <div class="p-6">

            {/* Step 1: OAuth Setup */}
            <div class="mb-6">
              <h3 class="text-base font-semibold text-gray-900 mb-3">1. Google OAuth Setup</h3>
              <p class="text-sm text-gray-600 mb-4">
                First, we need to authenticate with Google to get permission to create calendars and sheets.
              </p>
              
              <button
                onClick={handleOAuthSetup}
                disabled={isOAuthLoading()}
                class="px-4 py-2 bg-[#8B6914] text-white rounded-md hover:bg-[#6d5410] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isOAuthLoading() ? 'Setting up OAuth...' : 'Start Google OAuth'}
              </button>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Authorization Code
                </label>
                       <div class="flex gap-2">
                         <input
                           type="text"
                           value={authCode()}
                           onInput={(e) => setAuthCode(e.currentTarget.value)}
                           placeholder="Paste the authorization code here"
                           class="flex-1 h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                         />
                         <button
                           onClick={handleExchangeCode}
                           disabled={isExchangingCode() || !authCode()}
                           class="h-10 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                         >
                           {isExchangingCode() ? 'Exchanging...' : 'Exchange'}
                         </button>
                       </div>
                <p class="text-xs text-gray-500 mt-2">
                  After completing OAuth, copy the authorization code from the Google page and paste it above.
                </p>
              </div>

              {refreshToken() && (
                <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p class="text-sm text-green-800">
                    ✅ Refresh token obtained successfully!
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Provider Configuration */}
            <div class="pt-6 border-t border-gray-200">
              <h3 class="text-base font-semibold text-gray-900 mb-4">2. Provider Configuration</h3>
              
              <form onSubmit={handleProviderSetup} class="space-y-4">
                       <div>
                         <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                           Username
                         </label>
                         <input
                           id="username"
                           type="text"
                           value={username()}
                           onInput={(e) => setUsername(e.currentTarget.value)}
                           placeholder="emlprime-2025-09-19"
                           required
                           class="w-full h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50"
                         />
                         <p class="text-xs text-gray-500 mt-1">
                           URL-safe username for the provider (defaults to emlprime-{new Date().toISOString().split('T')[0]})
                         </p>
                       </div>

                       <div>
                         <label for="providerName" class="block text-sm font-medium text-gray-700 mb-2">
                           Provider Name
                         </label>
                         <input
                           id="providerName"
                           type="text"
                           value={providerName()}
                           onInput={(e) => setProviderName(e.currentTarget.value)}
                           placeholder="Peter Stradinger"
                           required
                           class="w-full h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                         />
                       </div>

                       <div>
                         <label for="refreshToken" class="block text-sm font-medium text-gray-700 mb-2">
                           Refresh Token
                         </label>
                         <input
                           id="refreshToken"
                           type="text"
                           value={refreshToken()}
                           onInput={(e) => setRefreshToken(e.currentTarget.value)}
                           placeholder="1//04..."
                           required
                           disabled={!refreshToken()}
                           class="w-full h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                         />
                         <p class="text-xs text-gray-500 mt-1">
                           {refreshToken() 
                             ? "Complete OAuth setup above to get your refresh token"
                             : "Complete OAuth setup above to get your refresh token"
                           }
                         </p>
                       </div>

                <button
                  type="submit"
                  disabled={isSubmitting() || !refreshToken()}
                  class="w-full px-4 py-2 bg-[#8B6914] text-white rounded-md hover:bg-[#6d5410] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting() ? 'Creating provider...' : 'Create Provider'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {error() && (
          <div class="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error()}
          </div>
        )}

        {success() && !refreshToken() && (
          <div class="max-w-3xl mx-auto mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success()}
          </div>
        )}

        {/* Info Cards */}
        <div class="max-w-3xl mx-auto space-y-4">
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 mb-2">What this process does:</h4>
                <ul class="text-sm text-gray-600 space-y-1.5">
                  <li>• <span class="font-medium">Step 1:</span> Authenticates with Google to get calendar/sheets permissions</li>
                  <li>• <span class="font-medium">Step 2:</span> Clones the admin sheet template for the provider</li>
                  <li>• <span class="font-medium">Step 2:</span> Creates a WellAppoint calendar in the provider's Google account</li>
                  <li>• <span class="font-medium">Step 2:</span> Adds the provider to the providers spreadsheet</li>
                  <li>• <span class="font-medium">Step 2:</span> Redirects you to the provider's booking page</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </Content>
    </PageFrame>
  );
}