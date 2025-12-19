import { Show, For } from 'solid-js';
import { useParams } from '@solidjs/router';
import { PageFrame, Content, AdminCard, ConfigTable, ServiceAdminCard, ClientsTable } from '../components/visual';
import { useAdmin } from '../stores/adminStore';

export function AdminPage() {
  const params = useParams<{ username: string }>();
  const { adminData } = useAdmin();

  return (
    <PageFrame>
      <Content>
        <div class="max-w-6xl mx-auto space-y-6">
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
                    <div class="text-sm text-[#5a4510]">
                      <span class="font-medium">Username:</span>{' '}
                      <span class="text-[#8B6914]">{data().username}</span>
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
