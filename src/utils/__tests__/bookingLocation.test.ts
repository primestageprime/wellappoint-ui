import { test } from 'node:test';
import assert from 'node:assert';
import { resolveBookingLocation } from '../bookingLocation.ts';

test('resolves the office modality to the provider address', () => {
  assert.equal(
    resolveBookingLocation({
      rawLocation: 'OFFICE',
      providerLocation: '666 heck st apt 0, 9th circle',
    }),
    '666 heck st apt 0, 9th circle',
  );
});

test('never surfaces the raw OFFICE enum to the client', () => {
  assert.equal(
    resolveBookingLocation({
      rawLocation: 'OFFICE',
      providerLocation: undefined,
    }),
    undefined,
  );
});

test('returns undefined when the provider has no address configured', () => {
  assert.equal(
    resolveBookingLocation({ rawLocation: 'OFFICE', providerLocation: '' }),
    undefined,
  );
});

test('treats a whitespace-only provider address as unconfigured', () => {
  assert.equal(
    resolveBookingLocation({ rawLocation: 'OFFICE', providerLocation: '   ' }),
    undefined,
  );
});

test('trims surrounding whitespace from the provider address', () => {
  assert.equal(
    resolveBookingLocation({
      rawLocation: 'OFFICE',
      providerLocation: '  123 Main St  ',
    }),
    '123 Main St',
  );
});

test('labels house calls rather than showing the provider address', () => {
  assert.equal(
    resolveBookingLocation({
      rawLocation: 'HOUSE_CALL',
      providerLocation: '666 heck st apt 0, 9th circle',
    }),
    'House Call',
  );
});
