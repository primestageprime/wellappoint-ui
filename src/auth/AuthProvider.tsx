import {
  createContext,
  useContext,
  createSignal,
  onMount,
  JSX,
  Show,
} from "solid-js";
import { Auth0Client } from "@auth0/auth0-spa-js";
import { setAuth0Client } from "./authUtils";

declare global {
  interface Window {
    __ENV__?: {
      OAUTH_DOMAIN: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_AUDIENCE: string;
    };
  }
}

export interface UserProfile {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  nickname?: string;
  picture?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  updated_at: string;
}

type AuthContextType = {
  isAuthenticated: () => boolean;
  user: () => UserProfile | null;
  login: () => Promise<void>;
  logout: () => void;
  loading: () => boolean;
  error: () => string | null;
  getAccessToken: () => Promise<string>;
};

const AuthContext = createContext<AuthContextType>();

interface AuthProviderProps {
  children: JSX.Element;
}

// Utility to fetch runtime env
function getRuntimeEnv() {
  if (typeof window !== "undefined" && window.__ENV__) {
    return window.__ENV__;
  }
  throw new Error("Runtime env not found on window.__ENV__");
}

export function AuthProvider(props: AuthProviderProps) {
  const [client, setClient] = createSignal<Auth0Client>();
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [user, setUser] = createSignal<UserProfile | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [auth0Config, setAuth0Config] = createSignal<any | null>(null);

  onMount(async () => {
    try {
      const env = getRuntimeEnv();
      setAuth0Config(env);
      const auth0 = new Auth0Client({
        domain: env.OAUTH_DOMAIN,
        clientId: env.AUTH0_CLIENT_ID,
        authorizationParams: {
          redirect_uri: window.location.origin,
          scope: "openid profile email phone offline_access", // Includes: name, given_name, family_name, nickname, picture, phone_number
          response_type: "code",
          ...(env.AUTH0_AUDIENCE && { audience: env.AUTH0_AUDIENCE }),
        },
        useRefreshTokens: true,
        sessionCheckExpiryDays: 7,
        cacheLocation: "localstorage",
        useFormData: true,
      });
      setClient(auth0);
      setAuth0Client(auth0);

      // Handle the redirect callback
      if (window.location.search.includes("code=")) {
        try {
          await auth0.handleRedirectCallback();
          window.history.replaceState({}, document.title, "/");

          // Set auth state after successful callback handling
          setIsAuthenticated(true);
          const userProfile = await auth0.getUser();
          if (userProfile) {
            setUser(userProfile as UserProfile);
          }
        } catch (e) {
          setError(
            e instanceof Error ? e.message : "Failed to handle login redirect"
          );
          setLoading(false);
          return;
        }
      } else if (window.location.search.includes("error=")) {
        setError("Failed to handle login");
        setLoading(false);
        return;
      } else {
        // Only check auth state if we're not handling a callback
        try {
          const userExists = await auth0.isAuthenticated();
          let token: string | null = null;
          if (userExists) {
            try {
              token = await auth0.getTokenSilently();
            } catch (e) {
              // Optionally log or handle token fetch error
              token = null;
            }
          }
          const isAuth = userExists && !!token;
          if (isAuth) {
            setIsAuthenticated(isAuth);
            const userProfile = await auth0.getUser();
            if (userProfile) {
              setUser(userProfile as UserProfile);
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (e) {
          console.error("Error checking auth state:", e);
        }
      }
    } catch (e) {
      console.error("Auth initialization error:", e);
      setError(
        e instanceof Error ? e.message : "Failed to initialize authentication"
      );
    } finally {
      setLoading(false);
    }
  });

  const login = async () => {
    try {
      setError(null);
      if (!client()) {
        throw new Error("Auth client not initialized");
      }
      await client()!.loginWithRedirect({
        authorizationParams: {
          connection: "google-oauth2",
          redirect_uri: window.location.origin,
          scope: "openid profile email phone offline_access",
          prompt: "login",
        },
      });
    } catch (e) {
      console.error("Login error:", e);
      setError(e instanceof Error ? e.message : "Failed to initiate login");
    }
  };

  const logout = async () => {
    try {
      if (!client()) {
        throw new Error("Auth client not initialized");
      }
      await client()!.logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } catch (e) {
      console.error("Logout error:", e);
      setError(e instanceof Error ? e.message : "Failed to logout");
    }
  };

  const getAccessToken = async () => {
    try {
      if (!client()) {
        throw new Error("Auth client not initialized");
      }
      const userExists = await client()!.isAuthenticated();
      if (!userExists) {
        throw new Error("User is not authenticated");
      }
      return await client()!.getTokenSilently();
    } catch (e) {
      console.error("Error getting access token:", e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        error,
        getAccessToken,
      }}
    >
      <Show when={loading()}>
        <div
          style={{
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            height: "100vh",
            "flex-direction": "column",
            gap: "1rem",
          }}
        >
          Loading...
        </div>
      </Show>
      <Show when={error() && !loading()}>
        <div
          style={{
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            height: "100vh",
            "flex-direction": "column",
            gap: "2rem",
          }}
        >
          <h2>Authentication Error</h2>
          <p>{error()}</p>
          <button
            onClick={() => {
              setError(null);
              login();
            }}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </Show>
      <Show when={!loading() && !error()}>{props.children}</Show>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
