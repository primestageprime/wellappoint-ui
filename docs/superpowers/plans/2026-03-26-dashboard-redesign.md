# Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the monolithic AdminPage into a client landing page, a slimmed admin dashboard, and a printable QR code page.

**Architecture:** Three new/modified pages share a common provider config fetch. The client landing and print QR pages use a lightweight `fetchProviderConfig()` function (no AdminStore). The admin dashboard keeps using AdminStore but drops the provider info section, replacing it with horizontally scrollable action pills. Routes change: `/:username` becomes the client landing, booking moves to `/:username/book`.

**Tech Stack:** SolidJS, SolidJS Router, Tailwind CSS, qrcode-svg

**Spec:** `docs/superpowers/specs/2026-03-26-dashboard-redesign-design.md`

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `src/services/providerConfigService.ts` | Create | Lightweight provider config fetch for client-facing pages |
| `src/pages/ClientLandingPage.tsx` | Create | Client-facing landing page (headshot, name, book button) |
| `src/pages/PrintQRPage.tsx` | Create | Print-optimized QR code page (card + poster formats) |
| `src/components/visual/curried/ActionPills.tsx` | Create | Horizontally scrollable action pill buttons |
| `src/components/visual/curried/index.ts` | Modify | Add ActionPills export |
| `src/pages/AdminPage.tsx` | Modify | Remove provider info section, add ActionPills, mobile-first layout |
| `src/App.tsx` | Modify | Update route table |

---

### Task 1: Create Provider Config Service

A lightweight fetch for just provider config — used by ClientLandingPage and PrintQRPage so they don't need the full AdminStore.

**Files:**
- Create: `src/services/providerConfigService.ts`

- [ ] **Step 1: Create the provider config fetch function**

```typescript
// src/services/providerConfigService.ts
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
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/services/providerConfigService.ts 2>&1 || echo "Check complete"`

If there's a tsconfig issue, just verify the imports resolve by checking that `src/config/api.ts` exports `apiFetch` (it does — confirmed in exploration).

- [ ] **Step 3: Commit**

```bash
git add src/services/providerConfigService.ts
git commit -m "feat: add lightweight provider config fetch service"
```

---

### Task 2: Create Client Landing Page

The page clients see after scanning a QR code. Minimal: headshot, name, title, full-width "Book an Appointment" button. No app chrome. Mobile-first.

**Files:**
- Create: `src/pages/ClientLandingPage.tsx`

- [ ] **Step 1: Create the ClientLandingPage component**

```tsx
// src/pages/ClientLandingPage.tsx
import { Show, createResource } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { fetchProviderConfig } from "../services/providerConfigService";

function Initials(props: { name: string }) {
  const initials = () =>
    props.name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div class="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[#d4c5a0] to-[#8B6914] flex items-center justify-center text-white text-3xl font-semibold">
      {initials()}
    </div>
  );
}

export function ClientLandingPage() {
  const params = useParams<{ username: string }>();
  const [config] = createResource(() => params.username, fetchProviderConfig);

  return (
    <div class="min-h-screen flex items-center justify-center bg-[#faf8f3] px-6">
      <Show
        when={config()}
        fallback={
          <Show
            when={config.loading}
            fallback={
              <p class="text-[#5a4510] text-sm">Provider not found.</p>
            }
          >
            <p class="text-[#5a4510] text-sm">Loading...</p>
          </Show>
        }
      >
        {(provider) => (
          <div class="text-center w-full max-w-sm">
            {/* Headshot or initials */}
            <div class="flex justify-center mb-4">
              <Show
                when={provider().headshot}
                fallback={<Initials name={provider().name} />}
              >
                <img
                  src={provider().headshot}
                  alt={provider().name}
                  referrerPolicy="no-referrer"
                  class="w-[100px] h-[100px] rounded-full object-cover border-2 border-[#8B6914]/20"
                />
              </Show>
            </div>

            {/* Name & Title */}
            <h1 class="text-[22px] font-semibold text-[#3d2e0a] m-0 mb-1">
              {provider().name}
            </h1>
            <Show when={provider().title}>
              <p class="text-[15px] text-[#5a4510] m-0 mb-8">
                {provider().title}
              </p>
            </Show>

            {/* Book Button */}
            <A
              href={`/${params.username}/book`}
              class="block w-full bg-[#8B6914] text-white py-4 rounded-[10px] text-[17px] font-semibold text-center no-underline hover:bg-[#6d5410] transition-colors"
            >
              Book an Appointment
            </A>
          </div>
        )}
      </Show>
    </div>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/pages/ClientLandingPage.tsx
git commit -m "feat: add ClientLandingPage for client-facing QR code landing"
```

---

### Task 3: Create ActionPills Component

Horizontally scrollable row of pill-shaped action buttons for the admin dashboard.

**Files:**
- Create: `src/components/visual/curried/ActionPills.tsx`
- Modify: `src/components/visual/curried/index.ts`

- [ ] **Step 1: Create the ActionPills component**

```tsx
// src/components/visual/curried/ActionPills.tsx
import { For, JSX } from "solid-js";
import { A } from "@solidjs/router";

interface ActionPill {
  label: string;
  href: string;
  primary?: boolean;
  icon?: JSX.Element;
}

interface ActionPillsProps {
  pills: ActionPill[];
}

export function ActionPills(props: ActionPillsProps) {
  return (
    <div class="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4" style={{ "-webkit-overflow-scrolling": "touch" }}>
      <For each={props.pills}>
        {(pill) => (
          <A
            href={pill.href}
            class={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap no-underline transition-colors ${
              pill.primary
                ? "bg-[#8B6914] text-white hover:bg-[#6d5410]"
                : "bg-white text-[#3d2e0a] border border-[#d4c5a0] hover:bg-[#f5f0e8]"
            }`}
          >
            {pill.icon}
            {pill.label}
          </A>
        )}
      </For>
    </div>
  );
}
```

- [ ] **Step 2: Add ActionPills to the curried barrel export**

Add this line to the end of `src/components/visual/curried/index.ts`:

```typescript
export { ActionPills } from './ActionPills';
```

- [ ] **Step 3: Verify the file compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 4: Commit**

```bash
git add src/components/visual/curried/ActionPills.tsx src/components/visual/curried/index.ts
git commit -m "feat: add ActionPills component for admin dashboard"
```

---

### Task 4: Create Print QR Page

Print-optimized page with card and poster formats, each with its own print button. Uses `@media print` CSS to show only the selected format.

**Files:**
- Create: `src/pages/PrintQRPage.tsx`

- [ ] **Step 1: Create the PrintQRPage component**

```tsx
// src/pages/PrintQRPage.tsx
import { Show, createSignal, createResource } from "solid-js";
import { useParams } from "@solidjs/router";
import { QRCode } from "../components/visual";
import { fetchProviderConfig } from "../services/providerConfigService";

function Initials(props: { name: string; size: string; textSize: string }) {
  const initials = () =>
    props.name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div
      class={`${props.size} rounded-full bg-gradient-to-br from-[#d4c5a0] to-[#8B6914] flex items-center justify-center text-white font-semibold ${props.textSize}`}
    >
      {initials()}
    </div>
  );
}

function ProviderHeadshot(props: {
  headshot?: string;
  name: string;
  size: string;
  textSize: string;
}) {
  return (
    <div class="flex justify-center mb-2">
      <Show
        when={props.headshot}
        fallback={
          <Initials name={props.name} size={props.size} textSize={props.textSize} />
        }
      >
        <img
          src={props.headshot}
          alt={props.name}
          referrerPolicy="no-referrer"
          class={`${props.size} rounded-full object-cover border-2 border-[#8B6914]/20`}
        />
      </Show>
    </div>
  );
}

export function PrintQRPage() {
  const params = useParams<{ username: string }>();
  const [config] = createResource(() => params.username, fetchProviderConfig);
  const [printFormat, setPrintFormat] = createSignal<"card" | "poster" | null>(
    null,
  );

  const getScheduleLink = () => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    return `${baseUrl}/${params.username}`;
  };

  const handlePrint = (format: "card" | "poster") => {
    setPrintFormat(format);
    // Allow the DOM to update with the print format class before printing
    requestAnimationFrame(() => {
      window.print();
      setPrintFormat(null);
    });
  };

  return (
    <div
      class="min-h-screen bg-[#faf8f3] px-4 py-6"
      classList={{
        "print-card": printFormat() === "card",
        "print-poster": printFormat() === "poster",
      }}
    >
      {/* Print-only styles */}
      <style>{`
        @media print {
          body { margin: 0; padding: 0; background: white; }
          .no-print { display: none !important; }
          .print-card .poster-format { display: none !important; }
          .print-poster .card-format { display: none !important; }
          .print-section {
            display: flex !important;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .print-section > div {
            border: none !important;
            box-shadow: none !important;
          }
        }
        @media not print {
          .print-section { display: block; }
        }
      `}</style>

      <Show
        when={config()}
        fallback={
          <div class="text-center py-8">
            <Show
              when={config.loading}
              fallback={
                <p class="text-[#5a4510] text-sm">Provider not found.</p>
              }
            >
              <p class="text-[#5a4510] text-sm">Loading...</p>
            </Show>
          </div>
        }
      >
        {(provider) => (
          <div class="max-w-sm mx-auto space-y-6">
            <h1 class="text-lg font-semibold text-[#3d2e0a] no-print">
              Print QR Code
            </h1>

            {/* Card Format */}
            <div class="card-format print-section">
              <div class="bg-white border border-[#e8dcc8] rounded-[10px] p-6 text-center">
                <div class="text-[11px] text-[#5a4510] uppercase tracking-wider mb-3 no-print">
                  Card Format
                </div>
                <ProviderHeadshot
                  headshot={provider().headshot}
                  name={provider().name}
                  size="w-14 h-14"
                  textSize="text-lg"
                />
                <h3 class="text-sm font-semibold text-[#3d2e0a] m-0 mb-0.5">
                  {provider().name}
                </h3>
                <Show when={provider().title}>
                  <p class="text-[11px] text-[#5a4510] m-0 mb-3">
                    {provider().title}
                  </p>
                </Show>
                <div class="flex justify-center mb-2">
                  <QRCode content={getScheduleLink()} size={120} />
                </div>
                <p class="text-[10px] text-[#5a4510] m-0">
                  Scan to book an appointment
                </p>
              </div>
            </div>
            <button
              onClick={() => handlePrint("card")}
              class="no-print w-full bg-[#8B6914] text-white py-3.5 rounded-[10px] text-[15px] font-medium hover:bg-[#6d5410] transition-colors"
            >
              Print Card
            </button>

            {/* Poster Format */}
            <div class="poster-format print-section">
              <div class="bg-white border border-[#e8dcc8] rounded-[10px] p-8 text-center">
                <div class="text-[11px] text-[#5a4510] uppercase tracking-wider mb-4 no-print">
                  Poster Format
                </div>
                <ProviderHeadshot
                  headshot={provider().headshot}
                  name={provider().name}
                  size="w-20 h-20"
                  textSize="text-[28px]"
                />
                <h3 class="text-xl font-semibold text-[#3d2e0a] m-0 mb-1">
                  {provider().name}
                </h3>
                <Show when={provider().title}>
                  <p class="text-sm text-[#5a4510] m-0 mb-5">
                    {provider().title}
                  </p>
                </Show>
                <div class="flex justify-center mb-3">
                  <QRCode content={getScheduleLink()} size={180} />
                </div>
                <p class="text-[15px] font-semibold text-[#3d2e0a] m-0 mb-1">
                  Scan to book an appointment
                </p>
                <p class="text-xs text-[#5a4510] m-0">
                  {getScheduleLink()}
                </p>
              </div>
            </div>
            <button
              onClick={() => handlePrint("poster")}
              class="no-print w-full bg-[#8B6914] text-white py-3.5 rounded-[10px] text-[15px] font-medium hover:bg-[#6d5410] transition-colors"
            >
              Print Poster
            </button>
          </div>
        )}
      </Show>
    </div>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/pages/PrintQRPage.tsx
git commit -m "feat: add PrintQRPage with card and poster print formats"
```

---

### Task 5: Slim Down AdminPage

Remove the provider info section (headshot, QR code, schedule link, copy button, external links, delete section from the provider info card). Add ActionPills at the top. Restructure as mobile-first stacked cards. Move the danger zone operations into a standalone card at the bottom.

**Files:**
- Modify: `src/pages/AdminPage.tsx`

- [ ] **Step 1: Rewrite AdminPage to remove provider info and add ActionPills**

Replace the entire contents of `src/pages/AdminPage.tsx` with:

```tsx
// src/pages/AdminPage.tsx
import { createSignal, For, onMount, Show } from "solid-js";
import { A, useNavigate, useParams } from "@solidjs/router";
import { ExternalLink } from "lucide-solid";
import {
  ActionPills,
  AdminCard,
  ClientsTable,
  ConfigTable,
  Content,
  DangerButton,
  PageFrame,
  ServiceAdminCard,
} from "../components/visual";
import { useAdmin } from "../stores/adminStore";
import { deleteProviderAccount } from "../services/providerService";
import { apiFetch } from "../config/api";

export function AdminPage() {
  const params = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { adminData, refetch } = useAdmin();
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false);
  const [confirmationText, setConfirmationText] = createSignal("");
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [deleteError, setDeleteError] = createSignal<string | null>(null);
  const [isRevokingAccess, setIsRevokingAccess] = createSignal(false);
  const [revokeMessage, setRevokeMessage] = createSignal<
    { type: "success" | "error"; text: string } | null
  >(null);
  const [isExportingData, setIsExportingData] = createSignal(false);
  const [exportError, setExportError] = createSignal<string | null>(null);

  onMount(() => {
    refetch();
  });

  const actionPills = () => [
    { label: "Client Page", href: `/${params.username}`, primary: true },
    { label: "Print QR", href: `/admin/${params.username}/print-qr` },
    { label: "Book for Client", href: `/admin/${params.username}/book` },
    { label: "Headshot", href: `/admin/${params.username}/headshot` },
  ];

  const openDeleteDialog = () => {
    setConfirmationText("");
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setConfirmationText("");
  };

  const handleDeleteProvider = async () => {
    if (confirmationText() !== params.username) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteProviderAccount(params.username);
      closeDeleteDialog();
      setTimeout(() => navigate("/admin/providers"), 500);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to delete provider";
      setDeleteError(errorMsg);
      setIsDeleting(false);
    }
  };

  const handleRevokeAccess = async () => {
    const confirmed = confirm(
      "Are you sure you want to revoke WellAppoint's access to your Google account?\n\n" +
        "This will:\n" +
        "- Revoke calendar access permissions\n" +
        "- Prevent WellAppoint from creating/managing appointments\n" +
        "- Require re-authorization to use WellAppoint again\n\n" +
        "Your calendar and data will remain, but WellAppoint cannot access them.",
    );

    if (!confirmed) return;

    setIsRevokingAccess(true);
    setRevokeMessage(null);

    try {
      const response = await apiFetch("/api/provider/revoke-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: params.username }),
      });

      const data = await response.json();

      if (data.success) {
        setRevokeMessage({
          type: "success",
          text: data.message || "Access revoked successfully",
        });
      } else {
        setRevokeMessage({
          type: "error",
          text: data.error || "Failed to revoke access",
        });
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to revoke access";
      setRevokeMessage({ type: "error", text: errorMsg });
    } finally {
      setIsRevokingAccess(false);
    }
  };

  const handleExportData = async () => {
    setIsExportingData(true);
    setExportError(null);

    try {
      const response = await apiFetch(
        `/api/provider/export-data?username=${params.username}`,
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to export data");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to export data");
      }

      const blob = new Blob([JSON.stringify(data.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wellappoint-data-${params.username}-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to export data";
      setExportError(errorMsg);
    } finally {
      setIsExportingData(false);
    }
  };

  return (
    <>
      <PageFrame wide>
        <Content>
          <div class="space-y-4 px-4">
            <h1 class="text-xl font-semibold text-[#3d2e0a]">
              Admin {params.username}
            </h1>

            <Show when={adminData.loading}>
              <div class="text-center py-8 text-[#5a4510]">
                Loading admin data...
              </div>
            </Show>

            <Show when={adminData.error}>
              <div class="text-center py-8 text-red-600">
                Failed to load admin data: {String(adminData.error)}
              </div>
            </Show>

            <Show when={adminData() && !adminData()!.config.email}>
              <div class="text-center py-8">
                <h2 class="text-lg font-semibold text-[#3d2e0a] mb-2">
                  Provider not found
                </h2>
                <p class="text-sm text-[#5a4510] mb-4">
                  No provider account exists for "{params.username}".
                </p>
                <A href="/" class="text-sm text-[#8B6914] hover:underline">
                  Go to home page
                </A>
              </div>
            </Show>

            <Show when={adminData()?.config.email ? adminData() : null}>
              {(data) => (
                <>
                  {/* Action Pills */}
                  <ActionPills pills={actionPills()} />

                  {/* Configuration */}
                  <AdminCard title="Configuration">
                    <ConfigTable
                      rows={[
                        { name: "Name", value: data().config.name },
                        { name: "Title", value: data().config.title },
                        { name: "Email", value: data().config.email },
                        { name: "Phone", value: data().config.phone },
                        {
                          name: "Min. Delay",
                          value: data().config.minimumAppointmentDelay
                            ? `${data().config.minimumAppointmentDelay} min`
                            : "Not set",
                        },
                      ]}
                    />
                    {/* External Links */}
                    <div class="mt-4 flex flex-col gap-2">
                      <Show when={data().config.adminSheetId}>
                        <a
                          href={`https://docs.google.com/spreadsheets/d/${data().config.adminSheetId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center gap-1.5 text-sm text-[#8B6914] hover:underline"
                        >
                          Admin Spreadsheet
                          <ExternalLink size={12} />
                        </a>
                      </Show>
                      <Show when={data().config.availabilityCalendarId}>
                        <a
                          href="https://calendar.google.com/calendar/r"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center gap-1.5 text-sm text-[#8B6914] hover:underline"
                        >
                          Google Calendar
                          <ExternalLink size={12} />
                        </a>
                      </Show>
                    </div>
                  </AdminCard>

                  {/* Services */}
                  <AdminCard title="Services">
                    <Show
                      when={data().services.length > 0}
                      fallback={
                        <p class="text-sm text-[#5a4510]">
                          No services configured
                        </p>
                      }
                    >
                      <For each={data().services}>
                        {(service) => (
                          <ServiceAdminCard
                            name={service.name}
                            durations={service.durations}
                          />
                        )}
                      </For>
                    </Show>
                  </AdminCard>

                  {/* Clients */}
                  <AdminCard title={`Clients (${data().clients.length})`}>
                    <ClientsTable clients={data().clients} />
                  </AdminCard>

                  {/* Danger Zone */}
                  <div class="bg-white rounded-lg border border-red-200 shadow-sm p-6">
                    <h2 class="text-lg font-semibold text-red-700 mb-4">
                      Danger Zone
                    </h2>

                    {/* Revoke Access Messages */}
                    <Show when={revokeMessage()}>
                      <div
                        class={`mb-3 px-3 py-2 rounded text-sm ${
                          revokeMessage()!.type === "success"
                            ? "bg-green-50 border border-green-200 text-green-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                        }`}
                      >
                        {revokeMessage()!.text}
                      </div>
                    </Show>

                    <Show when={exportError()}>
                      <div class="mb-3 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
                        {exportError()}
                      </div>
                    </Show>

                    <div class="flex flex-col gap-3">
                      <button
                        onClick={handleRevokeAccess}
                        disabled={isRevokingAccess()}
                        class="w-full px-4 py-3 bg-white text-red-700 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                      >
                        {isRevokingAccess()
                          ? "Revoking..."
                          : "Revoke Google Access"}
                      </button>

                      <button
                        onClick={handleExportData}
                        disabled={isExportingData()}
                        class="w-full px-4 py-3 bg-white text-red-700 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                      >
                        {isExportingData() ? "Exporting..." : "Export My Data"}
                      </button>

                      <DangerButton
                        onClick={openDeleteDialog}
                        disabled={isDeleting()}
                      >
                        Delete Provider Account
                      </DangerButton>
                    </div>

                    <p class="text-xs text-[#5a4510] mt-3">
                      These actions are destructive. Revoking access disconnects
                      Google. Export downloads your data as JSON. Deleting is
                      permanent.
                    </p>
                  </div>
                </>
              )}
            </Show>
          </div>
        </Content>
      </PageFrame>

      {/* Delete Confirmation Modal — unchanged from original */}
      <Show when={deleteDialogOpen()}>
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            "background-color": "rgba(0, 0, 0, 0.5)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": "99999",
          }}
          onClick={closeDeleteDialog}
        >
          <div
            style={{
              "background-color": "white",
              "border-radius": "8px",
              padding: "24px",
              "max-width": "500px",
              width: "90%",
              "box-shadow":
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 class="text-xl font-bold text-card-foreground mb-4">
              Delete Provider Account
            </h2>

            <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded">
              <p class="text-sm text-red-800 font-semibold mb-2">
                WARNING: This action cannot be undone!
              </p>
              <p class="text-sm text-red-800">This will permanently:</p>
              <ul class="text-sm text-red-800 list-disc list-inside mt-2 space-y-1">
                <li>Delete the WellAppoint calendar from Google Calendar</li>
                <li>Delete the administrative spreadsheet</li>
                <li>Remove the provider listing</li>
                <li>Revoke all access permissions</li>
                <li>Delete all appointment data</li>
              </ul>
            </div>

            <Show when={deleteError()}>
              <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                <p class="text-sm text-red-800">{deleteError()}</p>
              </div>
            </Show>

            <div class="mb-4">
              <p class="text-sm text-card-foreground mb-2">
                To confirm, please type the provider username:{" "}
                <strong>{params.username}</strong>
              </p>
              <input
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Type provider username to confirm"
                value={confirmationText()}
                onInput={(e) => setConfirmationText(e.currentTarget.value)}
                disabled={isDeleting()}
              />
            </div>

            <div class="flex gap-2 justify-end">
              <button
                class="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 text-sm disabled:opacity-50"
                onClick={closeDeleteDialog}
                disabled={isDeleting()}
              >
                Cancel
              </button>
              <DangerButton
                onClick={handleDeleteProvider}
                disabled={isDeleting() ||
                  confirmationText() !== params.username}
              >
                {isDeleting() ? "Deleting..." : "Delete Provider"}
              </DangerButton>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
```

Key changes from the original:
- Removed: headshot display, QR code, schedule link, copy button, username display, external Google links from provider info card, the entire "Provider Information" AdminCard
- Removed: the "Privacy & Data Management" AdminCard (permissions, data stored, legal links) — condensed danger zone into its own card
- Added: `ActionPills` at the top with links to Client Page, Print QR, Book for Client, Headshot
- Changed: layout from `grid grid-cols-1 md:grid-cols-2` to single-column stacked `space-y-4` (mobile-first)
- Changed: Danger zone is now a standalone card at the bottom with full-width buttons
- Changed: Clients card shows count in title
- Removed: `copied` signal and `copyScheduleLink` / `getScheduleLink` functions (no longer needed)
- Removed: `Spinner` import (unused after removing provider info loading state)
- Removed: `Copy`, `Check` icon imports (no longer needed)

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/pages/AdminPage.tsx
git commit -m "refactor: slim AdminPage to operational dashboard with action pills"
```

---

### Task 6: Update Routes in App.tsx

Update the route table: `/:username` → ClientLandingPage, add `/:username/book` → ProviderBookingPageWrapper, add `/admin/:username/print-qr` → PrintQRPage.

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add imports for new pages**

Add these imports to the top of `src/App.tsx`, after the existing page imports:

```typescript
import { ClientLandingPage } from './pages/ClientLandingPage';
import { PrintQRPage } from './pages/PrintQRPage';
```

- [ ] **Step 2: Update the route for `/:username` and add `/:username/book`**

In `src/App.tsx`, replace:

```tsx
{/* Provider-specific booking pages - wrap with providers */}
<Route path="/:username" component={ProviderBookingPageWrapper} />
```

with:

```tsx
{/* Client-facing landing page */}
<Route path="/:username" component={ClientLandingPage} />

{/* Booking flow (moved from /:username) */}
<Route path="/:username/book" component={ProviderBookingPageWrapper} />
```

- [ ] **Step 3: Add the print-qr admin route**

In `src/App.tsx`, add the print-qr route right before the existing `/admin/:username` route:

```tsx
<Route path="/admin/:username/print-qr" component={PrintQRPage} />
```

This must come before the dynamic `/admin/:username` route so it's matched first.

- [ ] **Step 4: Verify the file compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 5: Verify the app builds**

Run: `npx vite build 2>&1 | tail -10`

This is the full integration check — all routes, all imports, all components wired together.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update routes for dashboard redesign

/:username now shows ClientLandingPage, booking moved to /:username/book,
added /admin/:username/print-qr for printable QR codes."
```

---

### Task 7: Manual Smoke Test

Verify all pages work by running the dev server and checking each route.

**Files:** None (testing only)

- [ ] **Step 1: Start the dev server**

Run: `npx vite dev`

- [ ] **Step 2: Test the client landing page**

Navigate to `http://localhost:5173/<any-username>`. Verify:
- Centered layout with loading state, then provider info or "not found"
- Headshot (or initials), name, title displayed
- "Book an Appointment" button is full-width, links to `/<username>/book`
- No header/footer chrome visible

- [ ] **Step 3: Test the booking flow**

Navigate to `http://localhost:5173/<username>/book`. Verify:
- The existing booking flow loads and works as before

- [ ] **Step 4: Test the admin dashboard**

Navigate to `http://localhost:5173/admin/<username>`. Verify:
- Action pills appear at top, scrollable horizontally
- No headshot, QR code, or schedule link on this page
- Configuration, Services, Clients, Danger Zone cards are stacked vertically
- Client count shows in the Clients card title
- All danger zone buttons work (revoke, export, delete)

- [ ] **Step 5: Test the print QR page**

Navigate to `http://localhost:5173/admin/<username>/print-qr`. Verify:
- Card and poster formats both render with QR codes
- "Print Card" and "Print Poster" buttons open print dialog
- In print preview, only the selected format is visible

- [ ] **Step 6: Commit (if any fixes were needed)**

Only if fixes were made during smoke testing:

```bash
git add -u
git commit -m "fix: address issues found during smoke testing"
```
