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
  const { adminData, refetch, tokenValid } = useAdmin();
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

      if (errorMsg.includes("REAUTH_REQUIRED")) {
        // Store context so we return here after re-auth
        sessionStorage.setItem("reauth_username", params.username);
        sessionStorage.setItem("reauth_return_url", window.location.pathname);

        setDeleteError(
          "Your Google authorization has expired. Redirecting to re-authorize...",
        );
        setIsDeleting(false);

        // Start the re-auth flow
        try {
          const response = await apiFetch("/api/oauth/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          if (data.success && data.authUrl) {
            window.location.href = data.authUrl;
            return;
          }
        } catch {}
        setDeleteError(
          "Your Google authorization has expired. Please re-authorize from the headshot page, then try deleting again.",
        );
      } else {
        setDeleteError(errorMsg);
      }
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

      if (!response.ok) {
        const text = await response.text();
        let errorMsg = "Failed to revoke access";
        try { errorMsg = JSON.parse(text).error || errorMsg; } catch {}
        throw new Error(errorMsg);
      }

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
        `/api/provider/export-data?username=${encodeURIComponent(params.username)}`,
      );

      if (!response.ok) {
        const text = await response.text();
        let errorMsg = "Failed to export data";
        try { errorMsg = JSON.parse(text).error || errorMsg; } catch {}
        throw new Error(errorMsg);
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

            <Show when={tokenValid() === false}>
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p class="text-sm text-amber-800 font-medium mb-2">
                  Google authorization has expired
                </p>
                <p class="text-sm text-amber-700 mb-3">
                  Some features (headshot upload, calendar access) won't work until you re-authorize.
                </p>
                <button
                  onClick={async () => {
                    sessionStorage.setItem('reauth_username', params.username);
                    sessionStorage.setItem('reauth_return_url', window.location.pathname);
                    try {
                      const response = await apiFetch('/api/oauth/setup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                      });
                      const data = await response.json();
                      if (data.success && data.authUrl) {
                        window.location.href = data.authUrl;
                      }
                    } catch {}
                  }}
                  class="text-sm font-medium text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded transition-colors"
                >
                  Re-authorize with Google
                </button>
              </div>
            </Show>

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

      {/* Delete Confirmation Modal */}
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
