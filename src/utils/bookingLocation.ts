/**
 * Resolve a raw booking location modality into text a client should see.
 *
 * The availability API echoes back the `location` value the client sent
 * ("OFFICE" / "HOUSE_CALL"), so a slot's `location` is a modality enum and
 * never an address. The provider's actual address lives in their config
 * (`/api/provider` -> `location`), so display text has to be derived from
 * both. This mirrors `formatBookingLocation` in the backend's
 * src/notifications/bookingLocation.ts, which does the same job for emails.
 *
 * Returns undefined when there is nothing meaningful to show, so callers can
 * omit the row entirely rather than leaking the raw "OFFICE" enum.
 */
export function resolveBookingLocation(args: {
  rawLocation?: string;
  providerLocation?: string;
}): string | undefined {
  if (args.rawLocation === 'HOUSE_CALL') return 'House Call';

  return args.providerLocation?.trim() || undefined;
}
