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
  const response = await apiFetch(`/api/provider?username=${username}`);
  if (!response.ok) return null;

  const data = await response.json();
  if (!data.success) return null;

  return {
    name: data.name || username,
    title: data.title || "",
    headshot: data.headshot,
    username,
  };
}
