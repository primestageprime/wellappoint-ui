import { Show, For, onMount, createSignal } from 'solid-js';
import { useParams } from '@solidjs/router';
import { Copy, Check } from 'lucide-solid';
import { PageFrame, Content, AdminCard, ConfigTable, ServiceAdminCard, ClientsTable, QRCode } from '../components/visual';
import { useAdmin } from '../stores/adminStore';

export function AdminPage() {
  const params = useParams<{ username: string }>();
  const { adminData, refetch } = useAdmin();
  const [copied, setCopied] = createSignal(false);

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

  return (
    <PageFrame>
      <Content>
        <div class="max-w-screen-2xl mx-auto space-y-6 px-4">
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
  );
}
