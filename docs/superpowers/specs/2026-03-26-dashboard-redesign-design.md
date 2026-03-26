# Dashboard Redesign: Separation of Concerns

Split the current monolithic AdminPage into three focused pages: a provider-facing admin dashboard, a client-facing landing page, and a printable QR code page.

## Motivation

The current `AdminPage.tsx` mixes provider-facing operational concerns (config, services, clients, account management) with client-facing presentation (headshot, QR code, schedule link). This redesign separates them into pages optimized for their actual audience and use context.

## Route Structure

### Changed Routes

| Route | Page | Audience | Purpose |
|-------|------|----------|---------|
| `/:username` | ClientLandingPage (new) | Clients | Headshot, name, title, "Book an Appointment" button |
| `/:username/book` | ProviderBookingPage (moved) | Clients | Existing booking flow, relocated from `/:username` |
| `/admin/:username` | AdminDashboardPage (slimmed) | Providers | Config, services, clients, danger zone |
| `/admin/:username/print-qr` | PrintQRPage (new) | Providers | Print-optimized QR code in card and poster formats |

### Unchanged Routes

| Route | Page |
|-------|------|
| `/:username/authorize` | ProviderReauthPage |
| `/admin/:username/headshot` | HeadshotSettingsPage |
| `/admin/:username/settings` | ProviderSettingsPage |
| `/admin/:username/book` | ProviderBookingForClientWrapper (unchanged — stays as its own component) |

## Design Principle: Mobile-First

All pages are designed for mobile as the primary viewport. Providers use these pages on their phones. Desktop is supported but not the primary target.

## Page 1: Client Landing (`/:username`)

The page clients see when they scan a QR code or visit a provider's link.

### Content (top to bottom)

1. Provider headshot (circular, ~100px, falls back to initials)
2. Provider name (22px)
3. Provider title (15px, muted)
4. "Book an Appointment" button — full-width block, large tap target (16px padding), links to `/:username/book`

### Design Constraints

- No app header/footer/navigation chrome
- Centered vertically — feels like a focused card, not a page with empty space
- Everything fits in one mobile viewport without scrolling
- Mobile-first: full-width button, readable font sizes

### Data Requirements

- Provider config: `name`, `title`, `headshot` (from existing `/api/provider?username={username}` endpoint)

## Page 2: Admin Dashboard (`/admin/:username`)

The provider's operational hub for managing their practice.

### Content (top to bottom)

1. **Action pills** — horizontally scrollable row of pill buttons:
   - "Client Page" (primary/filled) → opens `/:username`
   - "Print QR" → navigates to `/admin/:username/print-qr`
   - "Book for Client" → navigates to `/admin/:username/book`
   - "Headshot" → navigates to `/admin/:username/headshot`

2. **Configuration card** — key-value pairs: name, title, email, phone, min delay, admin sheet link, calendar link

3. **Services card** — service names with durations and pricing, compact format (e.g., "60min $90 · 90min $120")

4. **Clients card** — count badge in header, card-layout per client (not a table): name, email, visit count. Stacked vertically.

5. **Danger Zone card** — red border: Revoke Google Access, Export My Data, Delete Provider buttons

### Design Constraints

- Mobile-first: full-width stacked cards, no multi-column grids
- All content visible by scrolling — no collapsed/accordion sections
- Action pills scroll horizontally with `-webkit-overflow-scrolling: touch`
- Large tap targets throughout (minimum 44px)
- Client list uses card layout (name + email + visits stacked) instead of table rows

### What Was Removed (vs. Current AdminPage)

- Headshot display → moved to Client Landing
- QR code rendering → moved to Print QR page
- Schedule link with copy button → replaced by "Client Page" action pill
- The "Provider Information" card is gone entirely; its contents are distributed across Client Landing and the action pills

### Data Requirements

- Same as current AdminPage: admin config, services, clients (from AdminStore)

## Page 3: Print QR (`/admin/:username/print-qr`)

Print-optimized page for generating physical QR code materials.

### On-Screen View (what the provider sees)

Two format previews stacked vertically, each followed by a full-width "Print" button:

**Card Format (desk/corkboard):**
- Smaller headshot (~56px)
- Name and title (compact)
- QR code (~120px)
- "Scan to book an appointment" tagline

**Poster Format (wall):**
- Larger headshot (~80px)
- Name and title (prominent)
- QR code (~180px)
- "Scan to book an appointment" tagline
- Human-readable URL below QR code

### Print Behavior

- Each "Print" button triggers `window.print()` with a CSS class indicating which format was selected
- `@media print` CSS hides: all app chrome, the non-selected format, all buttons
- Only the selected format renders on paper, centered, with no margins/borders from the app

### QR Code Content

- Points to `/:username` (the client landing page)
- Same QR code component already in use (`src/components/visual/curried/QRCode.tsx`)

### Data Requirements

- Provider config: `name`, `title`, `headshot`, `username`

## Component Changes

### New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ClientLandingPage` | `src/pages/ClientLandingPage.tsx` | Client-facing landing page |
| `PrintQRPage` | `src/pages/PrintQRPage.tsx` | Print-optimized QR code page |
| `ActionPills` | `src/components/visual/curried/ActionPills.tsx` | Horizontally scrollable action buttons |

### Modified Components

| Component | Change |
|-----------|--------|
| `AdminPage.tsx` | Remove provider info section (headshot, QR, schedule link). Add ActionPills at top. Restructure remaining sections as full-width stacked cards. |
| `App.tsx` | Update route table: `/:username` → ClientLandingPage, add `/:username/book` → ProviderBookingPageWrapper, add `/admin/:username/print-qr` → PrintQRPage |
| `ClientsTable.tsx` | Already has responsive card layout — verify it works well in the new stacked context |

### Unchanged Components

- `QRCode.tsx` — reused as-is in PrintQRPage
- `AdminCard.tsx` — reused in slimmed dashboard
- `ConfigTable.tsx` — reused in slimmed dashboard
- `ServiceAdminCard.tsx` — reused in slimmed dashboard
- `AdminStore` / `adminStore.tsx` — data fetching unchanged

## Data Fetching

### Client Landing Page

Needs only provider config (name, title, headshot). The existing `/api/provider?username={username}` endpoint provides this. This page does NOT need the full AdminStore — it should make a lightweight fetch for just the provider config.

### Print QR Page

Same lightweight provider config fetch as Client Landing. Does not need services or clients data.

### Admin Dashboard

Uses the existing AdminStore with no changes to data fetching.

## Testing Considerations

- Route changes: verify `/:username` renders ClientLandingPage, `/:username/book` renders booking flow
- Client Landing: renders headshot (or initials fallback), name, title, book button linking to `/:username/book`
- Print QR: both formats render, print buttons trigger `window.print()`, `@media print` hides correct elements
- Admin Dashboard: action pills render and link correctly, provider info section is gone, remaining sections render
- Existing booking flow works at new `/:username/book` route
