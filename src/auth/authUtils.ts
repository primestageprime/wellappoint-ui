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
