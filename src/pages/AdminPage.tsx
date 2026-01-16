import { Show, For, onMount, createSignal } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import { Copy, Check, ExternalLink } from 'lucide-solid';
import { PageFrame, Content, AdminCard, ConfigTable, ServiceAdminCard, ClientsTable, QRCode, DangerButton, Spinner } from '../components/visual';
import { useAdmin } from '../stores/adminStore';
import { deleteProviderAccount } from '../services/providerService';
import { apiFetch } from '../config/api';

export function AdminPage() {
  const params = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { adminData, refetch } = useAdmin();
  const [copied, setCopied] = createSignal(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false);
  const [confirmationText, setConfirmationText] = createSignal('');
  const [isDeleting, setIsDeleting] = createSignal(false);
  const [deleteError, setDeleteError] = createSignal<string | null>(null);
  const [isRevokingAccess, setIsRevokingAccess] = createSignal(false);
  const [revokeMessage, setRevokeMessage] = createSignal<{ type: 'success' | 'error', text: string } | null>(null);
  const [isExportingData, setIsExportingData] = createSignal(false);
  const [exportError, setExportError] = createSignal<string | null>(null);

  // Refetch admin data when the page loads
  onMount(() => {
    refetch();
  });

  const getScheduleLink = () => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    return `${baseUrl}/${params.username}`;
  };

  const copyScheduleLink = async () => {
    try {
      await navigator.clipboard.writeText(getScheduleLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openDeleteDialog = () => {
    setConfirmationText('');
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setConfirmationText('');
  };

  const handleDeleteProvider = async () => {
    const username = params.username;

    if (confirmationText() !== username) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteProviderAccount(username);

      // Close modal and redirect to providers list after successful deletion
      closeDeleteDialog();
      setTimeout(() => {
        navigate('/admin/providers');
      }, 500);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete provider';
      setDeleteError(errorMsg);
      setIsDeleting(false);
    }
  };

  const handleRevokeAccess = async () => {
    const confirmed = confirm(
      'Are you sure you want to revoke WellAppoint\'s access to your Google account?\n\n' +
      'This will:\n' +
      '- Revoke calendar access permissions\n' +
      '- Prevent WellAppoint from creating/managing appointments\n' +
      '- Require re-authorization to use WellAppoint again\n\n' +
      'Your calendar and data will remain, but WellAppoint cannot access them.'
    );

    if (!confirmed) return;

    setIsRevokingAccess(true);
    setRevokeMessage(null);

    try {
      const response = await apiFetch('/api/provider/revoke-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: params.username }),
      });

      const data = await response.json();

      if (data.success) {
        setRevokeMessage({ type: 'success', text: data.message || 'Access revoked successfully' });
      } else {
        setRevokeMessage({ type: 'error', text: data.error || 'Failed to revoke access' });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to revoke access';
      setRevokeMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsRevokingAccess(false);
    }
  };

  const handleExportData = async () => {
    setIsExportingData(true);
    setExportError(null);

    try {
      const response = await apiFetch(`/api/provider/export-data?username=${params.username}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to export data');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to export data');
      }

      // Create a downloadable JSON file
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wellappoint-data-${params.username}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to export data';
      setExportError(errorMsg);
    } finally {
      setIsExportingData(false);
    }
  };

  return (
    <>
      <PageFrame wide>
        <Content>
          <div class="space-y-6 px-4">
          {/* Header */}
          <h1 class="text-2xl font-semibold text-[#3d2e0a]">
            Admin {params.username}
          </h1>

          <Show when={adminData.loading}>
            <div class="text-center py-8 text-[#5a4510]">Loading admin data...</div>
          </Show>

          <Show when={adminData.error}>
            <div class="text-center py-8 text-red-600">
              Failed to load admin data: {String(adminData.error)}
            </div>
          </Show>

          <Show when={adminData()}>
            {(data) => (
              <>
                {/* Top Row: Provider Info & Configuration */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Provider Information */}
                  <AdminCard title="Provider Information">
                    <div class="space-y-4">
                      {/* Info */}
                      <div class="space-y-3">
                        <div class="text-sm text-[#5a4510]">
                          <span class="font-medium">Username:</span>{' '}
                          <span class="text-[#8B6914]">{data().username}</span>
                        </div>
                        
                        <div class="text-sm text-[#5a4510]">
                          <span class="font-medium">Schedule Link:</span>
                          <div class="flex items-center gap-2 mt-1">
                            <a 
                              href={getScheduleLink()} 
                              target="_blank" 
                              class="text-[#8B6914] hover:underline break-all"
                            >
                              {getScheduleLink()}
                            </a>
                            <button
                              onClick={copyScheduleLink}
                              class="flex-shrink-0 p-1 text-[#8B6914] hover:text-[#6d5410] transition-colors"
                              title={copied() ? 'Copied!' : 'Copy to clipboard'}
                            >
                              {copied() ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* QR Code */}
                      <div class="pt-2 text-center">
                        <div class="text-sm text-[#5a4510] font-medium mb-2">QR Code:</div>
                        <div class="flex justify-center">
                          <QRCode content={getScheduleLink()} size={120} />
                        </div>
                        <p class="text-xs text-[#5a4510] mt-3 max-w-xs mx-auto">
                          Have potential customers scan this QR code. They'll have to log in to their Google account to sign up.
                        </p>
                      </div>
                      
                      {/* Admin Spreadsheet Link */}
                      <Show when={data().config.adminSheetId}>
                        <div class="pt-4 text-center border-t border-[#8B6914]/10 mt-4">
                          <a
                            href={`https://docs.google.com/spreadsheets/d/${data().config.adminSheetId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-2 text-sm text-[#8B6914] hover:underline"
                          >
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm4-8h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2z"/>
                            </svg>
                            Open Admin Spreadsheet
                          </a>
                        </div>
                      </Show>

                      {/* Delete Provider Section */}
                      <div class="pt-4 border-t border-red-200 mt-4">
                        <div class="text-center">
                          <p class="text-xs text-red-600 mb-2 font-semibold">Danger Zone</p>
                          <DangerButton
                            onClick={openDeleteDialog}
                            disabled={isDeleting()}
                          >
                            Delete Provider Account
                          </DangerButton>
                          <p class="text-xs text-[#5a4510] mt-2 max-w-xs mx-auto">
                            Permanently delete this provider's account, calendar, and all data. This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AdminCard>

                  {/* Configuration */}
                  <AdminCard title="Configuration">
                    <ConfigTable
                      rows={[
                        { name: 'Headshot', value: data().config.headshot || '—' },
                        { name: 'Name', value: data().config.name },
                        { name: 'Title', value: data().config.title },
                        { name: 'Email', value: data().config.email },
                        { name: 'Phone Number', value: data().config.phone },
                        { name: 'Minimum Appointment Delay', value: data().config.minimumAppointmentDelay },
                      ]}
                    />
                  </AdminCard>
                </div>

                {/* Services Section */}
                <AdminCard title="Services">
                  <Show 
                    when={data().services.length > 0}
                    fallback={<p class="text-sm text-[#5a4510]">No services configured</p>}
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

                {/* Privacy & Data Management Section */}
                <AdminCard title="Privacy & Data Management">
                  <div class="space-y-6">
                    {/* Connected Account */}
                    <div>
                      <h3 class="text-sm font-semibold text-[#3d2e0a] mb-2">Connected Google Account</h3>
                      <p class="text-sm text-[#5a4510]">
                        <strong>Email:</strong> {data().config.email}
                      </p>
                    </div>

                    {/* Permissions Granted */}
                    <div>
                      <h3 class="text-sm font-semibold text-[#3d2e0a] mb-2">Permissions Granted</h3>
                      <ul class="text-sm text-[#5a4510] space-y-1 list-disc list-inside">
                        <li><strong>calendar.app.created</strong> - Access ONLY to calendars created by WellAppoint (not your other calendars)</li>
                        <li><strong>userinfo.email</strong> - Read your email address for account identification</li>
                      </ul>
                    </div>

                    {/* Data Stored */}
                    <div>
                      <h3 class="text-sm font-semibold text-[#3d2e0a] mb-2">Data Stored by WellAppoint</h3>
                      <div class="text-sm text-[#5a4510] space-y-2">
                        <p><strong>WellAppoint Calendar ID:</strong> <code class="text-xs bg-[#f5f0e8] px-1 py-0.5 rounded">{data().config.availabilityCalendarId}</code></p>
                        <p><strong>Admin Spreadsheet ID:</strong> <code class="text-xs bg-[#f5f0e8] px-1 py-0.5 rounded">{data().config.adminSheetId}</code></p>
                        <p class="text-xs italic text-[#5a4510]">
                          Note: We also store an encrypted OAuth refresh token to access your WellAppoint calendar. All data is deleted when you delete your account.
                        </p>
                      </div>
                    </div>

                    {/* Legal Links */}
                    <div>
                      <h3 class="text-sm font-semibold text-[#3d2e0a] mb-2">Legal</h3>
                      <div class="flex gap-4 text-sm">
                        <a href="/privacy" target="_blank" class="text-[#8B6914] hover:underline inline-flex items-center gap-1">
                          Privacy Policy
                          <ExternalLink size={12} />
                        </a>
                        <a href="/terms" target="_blank" class="text-[#8B6914] hover:underline inline-flex items-center gap-1">
                          Terms of Service
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>

                    {/* Data Management Actions */}
                    <div class="border-t border-[#8B6914]/10 pt-4">
                      <h3 class="text-sm font-semibold text-[#3d2e0a] mb-3">Data Management</h3>

                      {/* Revoke Access Messages */}
                      <Show when={revokeMessage()}>
                        <div class={`mb-3 px-3 py-2 rounded text-sm ${
                          revokeMessage()!.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                          {revokeMessage()!.text}
                        </div>
                      </Show>

                      {/* Export Data Error */}
                      <Show when={exportError()}>
                        <div class="mb-3 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
                          {exportError()}
                        </div>
                      </Show>

                      <div class="flex flex-col sm:flex-row gap-3">
                        {/* Export Data Button */}
                        <button
                          onClick={handleExportData}
                          disabled={isExportingData()}
                          class="px-4 py-2 bg-[#8B6914] text-white rounded hover:bg-[#6d5410] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                          <Show when={!isExportingData()} fallback={<span>Exporting...</span>}>
                            Export My Data
                          </Show>
                        </button>

                        {/* Revoke Access Button */}
                        <button
                          onClick={handleRevokeAccess}
                          disabled={isRevokingAccess()}
                          class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                          <Show when={!isRevokingAccess()} fallback={<span>Revoking...</span>}>
                            Revoke Access
                          </Show>
                        </button>
                      </div>

                      <p class="text-xs text-[#5a4510] mt-3">
                        <strong>Export Data:</strong> Download all your data (appointments, services, settings) as JSON.
                        <br />
                        <strong>Revoke Access:</strong> Disconnect WellAppoint from your Google account. You'll need to re-authorize to use WellAppoint again.
                      </p>
                    </div>
                  </div>
                </AdminCard>

                {/* Clients Section */}
                <AdminCard title="Clients">
                  <ClientsTable clients={data().clients} />
                </AdminCard>
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
          "position": "fixed",
          "top": "0",
          "left": "0",
          "right": "0",
          "bottom": "0",
          "background-color": "rgba(0, 0, 0, 0.5)",
          "display": "flex",
          "align-items": "center",
          "justify-content": "center",
          "z-index": "99999",
        }}
        onClick={closeDeleteDialog}
      >
        {/* Modal content */}
        <div
          style={{
            "background-color": "white",
            "border-radius": "8px",
            "padding": "24px",
            "max-width": "500px",
            "width": "90%",
            "box-shadow": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 class="text-xl font-bold text-card-foreground mb-4">Delete Provider Account</h2>

          <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded">
            <p class="text-sm text-red-800 font-semibold mb-2">
              WARNING: This action cannot be undone!
            </p>
            <p class="text-sm text-red-800">
              This will permanently:
            </p>
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
              To confirm, please type the provider username: <strong>{params.username}</strong>
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

          <div style={{ "display": "flex", "gap": "8px", "justify-content": "flex-end" }}>
            <button
              style={{
                "padding": "8px 16px",
                "border": "1px solid #d1d5db",
                "border-radius": "4px",
                "background-color": "white",
                "color": "#374151",
                "cursor": isDeleting() ? "not-allowed" : "pointer",
                "font-size": "14px",
                "opacity": isDeleting() ? "0.5" : "1",
              }}
              onClick={closeDeleteDialog}
              disabled={isDeleting()}
            >
              Cancel
            </button>
            <DangerButton
              onClick={handleDeleteProvider}
              disabled={isDeleting() || confirmationText() !== params.username}
            >
              {isDeleting() ? 'Deleting...' : 'Delete Provider'}
            </DangerButton>
          </div>
        </div>
      </div>
      </Show>
    </>
  );
}
