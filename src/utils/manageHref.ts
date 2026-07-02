/**
 * Path to the client self-service manage page for an appointment, or
 * undefined when the backend sent no manageToken (item stays non-clickable).
 */
export function manageHref(manageToken?: string): string | undefined {
  return manageToken ? `/manage/${encodeURIComponent(manageToken)}` : undefined;
}
