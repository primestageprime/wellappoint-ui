import { createSignal, createEffect, onCleanup } from 'solid-js';
import { createAuth0Client, Auth0Client, GetTokenSilentlyOptions, LogoutOptions } from '@auth0/auth0-spa-js';

interface Auth0User {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
}

interface Auth0State {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Auth0User | null;
  error: Error | null;
}

export function useAuth0() {
  const [auth0Client, setAuth0Client] = createSignal<Auth0Client | null>(null);
  const [state, setState] = createSignal<Auth0State>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  // Initialize Auth0 client
  createEffect(async () => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      const client = await createAuth0Client({
        domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-domain.auth0.com',
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email'
        }
      });

      setAuth0Client(client);

      // Check if we're returning from Auth0
      if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        await client.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Check authentication state
      const isAuthenticated = await client.isAuthenticated();
      let user = null;
      
      if (isAuthenticated) {
        user = await client.getUser();
      }

      setState({
        isAuthenticated,
        isLoading: false,
        user,
        error: null,
      });

    } catch (error) {
      console.error('Auth0 initialization error:', error);
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error as Error,
      });
    }
  });

  const loginWithRedirect = async (options?: { authorizationParams?: { connection?: string } }) => {
    const client = auth0Client();
    if (client) {
      await client.loginWithRedirect(options);
    }
  };

  const logout = async (options?: LogoutOptions) => {
    const client = auth0Client();
    if (client) {
      await client.logout(options);
    }
  };

  const getAccessTokenSilently = async (options?: GetTokenSilentlyOptions) => {
    const client = auth0Client();
    if (client) {
      return await client.getTokenSilently(options);
    }
    return null;
  };

  return {
    isAuthenticated: state().isAuthenticated,
    isLoading: state().isLoading,
    user: state().user,
    error: state().error,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  };
}
