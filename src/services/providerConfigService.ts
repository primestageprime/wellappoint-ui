import { apiFetch } from "../config/api";

export interface ProviderConfig {
  name: string;
  title: string;
  headshot?: string;
  username: string;
}

export async function fetchProviderConfig(
  username: string,
): Promise<ProviderConfig | null> {
  const response = await apiFetch(
    `/api/provider?username=${encodeURIComponent(username)}`,
  );

  // 404 means provider genuinely doesn't exist
  if (response.status === 404) return null;

  // Other HTTP errors are server/network problems — throw so consumers can distinguish
  if (!response.ok) {
    throw new Error(`Failed to load provider (${response.status})`);
  }

  const data = await response.json();
  if (!data.success) return null;

  return {
    name: data.name || username,
    title: data.title || "",
    headshot: data.headshot,
    username,
  };
}
