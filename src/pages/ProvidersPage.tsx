import { createResource, createSignal, For, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../auth/AuthProvider';
import { apiFetch } from '../config/api';
import {
  PageFrame,
  HeaderCard,
  Content,
  Split,
  Avatar,
  LogoutButton,
  DangerButton,
} from '../components/visual';

interface Provider {
  username: string;
  name: string;
  adminSheetId: string;
  createdAt: string;
}

interface ProvidersListResponse {
  success: boolean;
  providers: Provider[];
}

async function fetchProviders(): Promise<Provider[]> {
  try {
    const response = await apiFetch('/api/providers/list');
    if (response.ok) {
      const data: ProvidersListResponse = await response.json();
      return data.providers || [];
    }
  } catch (e) {
    console.error('Failed to fetch providers:', e);
  }
  return [];
}

async function deleteProvider(username: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await apiFetch(`/api/providers/${encodeURIComponent(username)}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Failed to delete provider:', e);
    return { success: false, error: 'Network error' };
  }
}

export function ProvidersPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [providers, { refetch }] = createResource(fetchProviders);
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false);
  const [providerToDelete, setProviderToDelete] = createSignal<Provider | null>(null);
  const [confirmationText, setConfirmationText] = createSignal('');
  const [isDeleting, setIsDeleting] = createSignal(false);

  const loggedInUsername = () => {
    return auth.user()?.nickname || auth.user()?.email?.split('@')[0] || '';
  };

  const openDeleteDialog = (provider: Provider) => {
    console.log('🔴 Opening delete dialog for:', provider.name);
    setProviderToDelete(provider);
    setConfirmationText('');
    setDeleteDialogOpen(true);
    console.log('🔴 Delete dialog state after setting:', deleteDialogOpen());
  };

  const closeDeleteDialog = () => {
    console.log('🔴 Closing delete dialog');
    setDeleteDialogOpen(false);
    setProviderToDelete(null);
    setConfirmationText('');
  };

  const handleDelete = async () => {
    const provider = providerToDelete();
    if (!provider || confirmationText() !== provider.name) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteProvider(provider.username);
    setIsDeleting(false);

    if (result.success) {
      alert(`Successfully deleted provider: ${provider.name}\n\n${result.message || ''}`);
      closeDeleteDialog();
      refetch();
    } else {
      alert(`Failed to delete provider: ${result.error || 'Unknown error'}`);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <PageFrame>
      <HeaderCard>
        <Split
          left={<Avatar username={loggedInUsername} />}
          right={<LogoutButton onLogout={() => auth.logout()}>Logout</LogoutButton>}
        />
      </HeaderCard>

      <Content>
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-card-foreground">Providers</h1>
          </div>

          <Show when={providers.loading}>
            <div class="text-center text-muted-foreground py-8">Loading providers...</div>
          </Show>

          <Show when={providers.error}>
            <div class="text-center text-red-600 py-8">Failed to load providers</div>
          </Show>

          <Show when={providers() && providers()!.length > 0}>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-4 font-semibold text-card-foreground">Username</th>
                    <th class="text-left py-3 px-4 font-semibold text-card-foreground">Name</th>
                    <th class="text-left py-3 px-4 font-semibold text-card-foreground">Created At</th>
                    <th class="text-left py-3 px-4 font-semibold text-card-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={providers()}>
                    {(provider) => (
                      <tr class="border-b border-gray-100 hover:bg-gray-50">
                        <td class="py-3 px-4 text-card-foreground">{provider.username}</td>
                        <td class="py-3 px-4 text-card-foreground">{provider.name}</td>
                        <td class="py-3 px-4 text-muted-foreground">{formatDate(provider.createdAt)}</td>
                        <td class="py-3 px-4">
                          <DangerButton onClick={() => openDeleteDialog(provider)}>
                            DELETE
                          </DangerButton>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </Show>

          <Show when={providers() && providers()!.length === 0}>
            <div class="text-center text-muted-foreground py-8">No providers found</div>
          </Show>
        </div>
      </Content>
      </PageFrame>

      {/* Delete Confirmation Modal */}
      <Show when={deleteDialogOpen()}>
        {console.log('🔴 Show component rendering, deleteDialogOpen:', deleteDialogOpen())}
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
              <h2 class="text-xl font-bold text-card-foreground mb-4">Delete Provider</h2>

              <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                <p class="text-sm text-red-800">
                  This will remove the provider admin Google sheet, delete the WellAppoint calendar from their Google account, and close their billing account.
                </p>
              </div>

              <div class="mb-4">
                <p class="text-sm text-card-foreground mb-2">
                  To confirm, please type the provider's name: <strong>{providerToDelete()?.name}</strong>
                </p>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Type provider name to confirm"
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
                  onClick={handleDelete}
                  disabled={isDeleting() || confirmationText() !== providerToDelete()?.name}
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
