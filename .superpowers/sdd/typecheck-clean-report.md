# typecheck-clean branch — implementation report

## Commands

```
pnpm run typecheck   → 0 errors (was 56 across 27 files)
pnpm test            → 23/23 pass
pnpm run build       → success, 319 kB bundle
```

## Commits

| SHA       | Subject                                               |
|-----------|-------------------------------------------------------|
| `1543ea3` | chore: add typescript devDep and typecheck script     |
| `fd11dff` | chore: drop unused imports and dead local variables   |
| `bde10e6` | fix: align component prop types with runtime usage    |

---

## Category 1 — Unused imports / locals (TS6133/TS6192)

Pure dead-code removal, no runtime effect.

- **Icon files** (Briefcase, Calendar, ChevronRight, Craniosacral, Currency,
  FootReflexology, Globe, Heart, Mail, MapPin, Phone, User): removed
  `import { JSX } from 'solid-js'` — JSX namespace was imported but no
  JSX-namespaced type was referenced.
- **Curried components** (ErrorCard, LoadingCard, ProfilePic, TimeItem):
  same JSX removal; TimeItem also dropped unused `IconWithTitleAndSubtitle`.
- **ProviderContent**: narrowed `import { JSX, Show }` → `import { Show }`.
- **Ratio**: removed `import { JSX }`.
- **Content.tsx** (biggest change here): removed `Show`, `createSignal`,
  `createMemo`, `LogOut`/`Settings` from lucide, `useAuth`, `apiFetch`, the
  `fetchProviderUsernames` function, and the `matchingProvider` memo. All of
  that code computed a value that was never rendered. A side-effect was
  eliminated: the component previously made an HTTP call to `/api/providers`
  on every mount that went nowhere. Flagged as low-risk behaviour change
  (invisible to the user; no test covers it).
- **AvailabilityList**: removed `createEffect`, `selectedDate`/`setSelectedDate`,
  `selectedTime`/`setSelectedTime` signals — signals were set but never read.
- **BookingConfirmationStep**: removed `Show`, `PrimaryButton`, `LoadingState`.
- **Spinner**: removed `elapsed` signal and its `setElapsed(elapsedMs)` call.
  Progress was calculated from `elapsedMs` local but only `progress()` was
  ever rendered. Elapsed signal was set and discarded.
- **AuthProvider**: removed `JSX` import; changed
  `const [auth0Config, setAuth0Config]` → `const [, setAuth0Config]` so the
  setter call is preserved but the unused getter variable is not declared.
- **OAuthCallbackPage**: removed unused `createEffect`.
- **OAuthSetupPage**: changed `const [refreshToken, setRefreshToken]` →
  `const [refreshToken]` — getter is used in template; setter was never called.
- **TimezoneDisplay**: removed `getUserTimezone` import after the unused
  `const timezone = getUserTimezone()` line was deleted.
- **ProviderCard**: removed unused `A` router import.
- **ConfirmationPanel**: after removing the dead `buttons` call-site prop (see
  Category 2), `handleCreateAppointment` became unreachable — removed it.

---

## Category 2 — Excess props at call sites (TS2322/TS2769/TS2353)

SolidJS silently ignores unknown props, so these were runtime no-ops already.
Deletion preserves behaviour.

- **AppointmentDetails → AppointmentDetailsGrid**: deleted `details={[…]}` prop.
  `AppointmentDetailsGrid` accepts `children`, not `details`. The details array
  was never rendered.  Also deleted the now-dead icon/util imports that were
  only used inside the deleted array.
- **ConfirmationPanel → ActionButtons**: deleted `buttons={[…]}` prop.
- **ErrorPanel → ActionButtons**: deleted `buttons={[…]}` prop.
- **ConfirmationCard → ConfirmationPanel**: deleted `isSubmitting`, `error`,
  `success` props — none are in `ConfirmationPanelProps`.
- **ProviderReauthPage → Input**: deleted `id="auth-code"` — `InputProps` does
  not include `id`.

To avoid "required children" errors after the prop deletions, made `children`
optional in `ActionButtons` and `AppointmentDetailsGrid` (was `children: JSX.Element`,
now `children?: JSX.Element`). This matches runtime reality (components already
rendered fine with no children).

---

## Category 3 — Missing required prop (TS2322)

**BookingSuccessStep `appointments`** in `ProviderBookingForClientPage`:

Chose: make `appointments` optional in `BookingSuccessStepProps`.

Rationale: the existing type was already `UserAppointmentsResponse | null | undefined`
(explicitly typed to tolerate absence) and the implementation guards with
`Show when={props.appointments && typeof props.appointments === 'object' && 'appointments' in props.appointments}` before any field access. Making it `appointments?:` exactly describes how callers use it without any runtime change.

---

## Category 4 — Wrong call signatures (risky — reviewer attention needed)

### `useProvider.ts` (TS2554 — Expected 1 arg, got 0)

`getProviderDetails` requires `username: string`. The hook called it with 0 args
(runtime: `username = undefined`). This is dead code — `useProvider` is defined
but never imported anywhere.

Fix: pass `''` (empty string) as username. **Runtime delta**: previously URL was
`/api/provider?username=undefined`; now `/api/provider?username=`. Both are
broken for different reasons. Flagged for reviewer. Recommend deleting the
entire hook if it remains unused.

### `BookingPage.tsx` (TS2345 — boolean not assignable to string)

`createResource(getProviderDetails)` without a source → SolidJS passes `true`
as the implicit source, so `getProviderDetails(true)` was called at runtime.

Fix: `createResource(() => getProviderDetails(''))`.

**Runtime delta — real behaviour change on the routed `/booking` page, strictly
in the fixing direction:**

- **Old** (`username=true`): backend executed the full provider lookup including
  `providerConfigService.refresh()` (Google Sheets refresh), returned
  `PROVIDER_NOT_FOUND`, which caused the frontend to re-throw
  `ProviderNotFoundError`. With no ErrorBoundary in the component tree, this
  became an uncaught exception during render.
- **New** (`username=''`): backend returns an early 400, the frontend catches
  the generic error and returns `null`, `provider()` stays null, and the
  provider header card is simply skipped — clean render, no exception.

`BookingPage` appears to be an older page superseded by `ProviderBookingPage`.
Flagged for reviewer.

### `useBookingFlow.ts` (TS2345 — BookingRequest | Record<string,unknown>)

`buildRequest` was typed as returning `Record<string, unknown>`, but
`createAppointment` expects `BookingRequest`. Changed return type to
`BookingRequest`. The only caller (`ProviderBookingForClientPage`) spreads a
`BookingRequest` and overrides `userProfile`, which is structurally compatible.
No runtime change; purely an annotation tightening.

---

## Category 5 — `string | string[]` narrowing

### `OAuthCallbackPage.tsx` (TS2339 — substring on string[])

`code` can be `string | string[]` from search params. Added typeof guard:
`(typeof code === 'string' ? code : String(code ?? '')).substring(0, 20)`.
This is a debug log line; at runtime `code` is always a string here (URL param
from OAuth redirect). No visible behaviour change.

### `CreateProviderPage.tsx` (TS2322 — null not assignable to string | string[] | undefined)

`sessionStorage.getItem()` returns `string | null`. Changed assignment to use
`?? undefined` to convert `null → undefined`. Both `null` and `undefined` are
falsy, and the immediately following `if (tokenKey)` check handles both
identically. No behaviour change.

---

## Category 6 — AuthContextType missing members

Added `error: () => string | null` and `getAccessToken: () => Promise<string>`
to `AuthContextType` in `src/types/global.ts`. Both were already set on the
context value at runtime; the type was simply behind.

---

## Category 7 — qrcode-svg ambient module (TS7016)

Added `src/types/qrcode-svg.d.ts` with a minimal class declaration matching
actual usage (`new QRCodeSVG(options).svg()`). No `@types/qrcode-svg` exists
on npm.

---

## Category 8 — ComponentsStatePage Spinner size (TS2322)

`Spinner.size` is `'small' | 'medium' | 'large' | undefined`; call site passed
numeric literals `16` and `48`. Changed to `"small"` and `"large"`.
**Runtime delta**: the spinner previously received `undefined` size (the number
16/48 didn't match the string union, so `props.size || 'medium'` evaluated to
`'medium'`). After the fix, the sizes are `'small'` and `'large'`. Visual
difference in spinner size — considered low risk since this is a demo/component
showcase page, not production booking flow. Flagged for reviewer.

---

## Category 9 — ProvidersPage void in Show children (TS2769)

`{console.log('🔴 Show component rendering…')}` inside `Show` returns `void`,
which is not a valid JSX child. Removed the debug log. **Runtime delta**: the
console.log no longer fires. Acceptable for a debug statement.

---

## ProviderCard createResource type params (TS2769/TS7006)

`createResource<Provider | null>` without specifying the source type `S` caused
TypeScript to assume `S = true` (default), making the `(username)` parameter
implicitly `any`. Added `createResource<Provider | null, string>` to supply both
type params. No runtime change.

---

## Casts / ts-ignore used

None. All fixes use narrowing, optional chaining, nullish coalescing, or type
annotations. No `@ts-ignore` added anywhere.

---

## Risky fixes needing reviewer attention: 5

1. **useProvider** — `getProviderDetails('')` preserves broken behaviour; hook
   is unused and likely should be deleted.
2. **BookingPage** — `getProviderDetails('')` replaces `getProviderDetails(true)`;
   both broken; page may be superseded.
3. **Content.tsx** — dead `fetchProviderUsernames` network call removed as a
   side-effect of removing the unused `matchingProvider` memo.
4. **ComponentsStatePage Spinner size** — `size={16}` was effectively `medium`
   (number didn't match union); now `"small"`. Visual change on demo page.
5. **ConfirmationPanel/ErrorPanel ActionButtons** — the `buttons` array was the
   intended data source for real buttons, but since `ActionButtons` uses
   `children` not `buttons`, these buttons were never rendered. The deletion
   makes the empty state explicit. Functional gap that predates this branch.
