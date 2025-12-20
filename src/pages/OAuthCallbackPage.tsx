import { createEffect, createSignal, onMount } from 'solid-js';
import { useNavigate, useSearchParams } from '@solidjs/router';
import { PageFrame, Content } from '../components/visual';
import { apiFetch } from '../config/api';

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = createSignal<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = createSignal('');

  onMount(async () => {
    // Debug: log the full URL and search params
    console.log('OAuth Callback - Full URL:', window.location.href);
    console.log('OAuth Callback - Search:', window.location.search);
    console.log('OAuth Callback - searchParams:', searchParams);
    
    // Try getting code from both useSearchParams and URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const code = searchParams.code || urlParams.get('code');
    const errorParam = searchParams.error || urlParams.get('error');
    
    console.log('OAuth Callback - code:', code);
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
      // Exchange the code for a refresh token
      const response = await apiFetch('/api/oauth/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success && data.refreshToken) {
        // Store the refresh token in sessionStorage for the create-provider page
        sessionStorage.setItem('oauth_refresh_token', data.refreshToken);
        setStatus('success');
        
        // Redirect back to create-provider page after a brief moment
        setTimeout(() => {
          navigate('/admin/create-provider');
        }, 1500);
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

