import { createEffect, createSignal, onMount } from 'solid-js';
import { useNavigate, useSearchParams } from '@solidjs/router';
import { PageFrame, Content } from '../components/visual';
import { apiFetch } from '../config/api';

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = createSignal<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = createSignal('');

  const handleReauthCallback = async (tokenKey: string, username: string, returnUrl: string | null) => {
    sessionStorage.removeItem('reauth_username');
    sessionStorage.removeItem('reauth_return_url');

    const tokenResponse = await apiFetch('/api/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenKey }),
    });
    const tokenData = await tokenResponse.json();

    if (!tokenData.success || !tokenData.refreshToken) {
      setStatus('error');
      setError(tokenData.error || 'Failed to retrieve token');
      return;
    }

    const reauthResponse = await apiFetch('/api/provider/reauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, refreshToken: tokenData.refreshToken }),
    });
    const reauthData = await reauthResponse.json();

    if (!reauthData.success) {
      setStatus('error');
      setError(reauthData.error || 'Failed to update provider token');
      return;
    }

    setStatus('success');
    sessionStorage.setItem('reauth_success', 'true');
    setTimeout(() => {
      navigate(returnUrl || `/admin/${username}/headshot`);
    }, 1500);
  };

  const handleSignupCallback = (tokenKey: string) => {
    try {
      sessionStorage.setItem('oauth_token_key', tokenKey);
    } catch (storageError) {
      console.warn('sessionStorage unavailable, using URL parameter fallback');
    }

    setStatus('success');
    setTimeout(() => {
      navigate(`/admin/create-provider?tokenKey=${tokenKey}`);
    }, 1500);
  };

  onMount(async () => {
    // Debug: log the full URL and search params
    console.log('OAuth Callback - Full URL:', window.location.href);
    console.log('OAuth Callback - Search:', window.location.search);
    console.log('OAuth Callback - searchParams:', searchParams);

    // Try getting code and state from both useSearchParams and URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const code = searchParams.code || urlParams.get('code');
    const state = searchParams.state || urlParams.get('state');
    const errorParam = searchParams.error || urlParams.get('error');

    console.log('OAuth Callback - code:', code);
    console.log('OAuth Callback - state:', state);
    console.log('OAuth Callback - error:', errorParam);

    if (errorParam) {
      setStatus('error');
      setError(`OAuth error: ${errorParam}`);
      return;
    }

    if (!code) {
      setStatus('error');
      setError(`No authorization code received. URL: ${window.location.href}`);
      return;
    }

    try {
      console.log('📤 Sending exchange request to backend:', { code: code?.substring(0, 20) + '...', state });

      // Exchange the code for a token key (stored server-side for Safari compatibility)
      // Include state to help backend determine the correct redirect URI
      const response = await apiFetch('/api/oauth/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });

      console.log('📥 Exchange response status:', response.status, response.statusText);

      const data = await response.json();
      console.log('📥 Exchange response data:', data);

      if (data.success && data.tokenKey) {
        // Check if this is a re-auth flow (provider updating their OAuth token)
        const reauthUsername = sessionStorage.getItem('reauth_username');
        const reauthReturnUrl = sessionStorage.getItem('reauth_return_url');

        if (reauthUsername) {
          await handleReauthCallback(data.tokenKey, reauthUsername, reauthReturnUrl);
        } else {
          handleSignupCallback(data.tokenKey);
        }
      } else {
        setStatus('error');
        setError(data.error || 'Failed to exchange authorization code');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to exchange authorization code');
    }
  });

  return (
    <PageFrame>
      <Content>
        <div class="max-w-md mx-auto py-12 text-center">
          {status() === 'loading' && (
            <div class="space-y-4">
              <div class="animate-spin w-12 h-12 border-4 border-[#8B6914] border-t-transparent rounded-full mx-auto"></div>
              <p class="text-[#5a4510]">Completing authorization...</p>
            </div>
          )}

          {status() === 'success' && (
            <div class="space-y-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p class="text-green-700 font-medium">Authorization successful!</p>
              <p class="text-sm text-[#5a4510]">Redirecting you back...</p>
            </div>
          )}

          {status() === 'error' && (
            <div class="space-y-4">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p class="text-red-700 font-medium">Authorization failed</p>
              <p class="text-sm text-red-600">{error()}</p>
              <button
                onClick={() => navigate('/admin/create-provider')}
                class="mt-4 px-4 py-2 bg-[#8B6914] text-white rounded-md hover:bg-[#6d5410] transition-colors"
              >
                Back to Provider Setup
              </button>
            </div>
          )}
        </div>
      </Content>
    </PageFrame>
  );
}

