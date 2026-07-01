import { Auth0Client } from "@auth0/auth0-spa-js";

let auth0Client: Auth0Client | null = null;

export const setAuth0Client = (client: Auth0Client) => {
  auth0Client = client;
};

export const getAuthToken = async () => {
  if (!auth0Client) {
    console.warn("Auth0 client not initialized when requesting token");
    return null;
  }

  try {
    return await auth0Client.getTokenSilently();
  } catch (e) {
    console.error("Error getting access token:", e);
    return null;
  }
};

/**
 * Raw Auth0 ID token (RS256 JWT). Used as the Bearer credential for
 * provider-authenticated backend routes: the tenant has no API audience, so the
 * access token is an opaque JWE, but the ID token is a verifiable JWS carrying
 * the provider's verified email.
 */
export const getIdTokenRaw = async (): Promise<string | null> => {
  if (!auth0Client) {
    console.warn("Auth0 client not initialized when requesting id token");
    return null;
  }

  try {
    const claims = await auth0Client.getIdTokenClaims();
    return claims?.__raw ?? null;
  } catch (e) {
    console.error("Error getting id token:", e);
    return null;
  }
};
