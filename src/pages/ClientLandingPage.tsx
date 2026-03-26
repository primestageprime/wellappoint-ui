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
  const [config, { refetch }] = createResource(
    () => params.username,
    fetchProviderConfig,
  );

  return (
    <div class="min-h-screen flex items-center justify-center bg-[#faf8f3] px-6">
      <Show
        when={!config.error}
        fallback={
          <div class="text-center">
            <p class="text-red-700 text-sm mb-3">
              Something went wrong loading this page.
            </p>
            <button
              onClick={() => refetch()}
              class="text-sm text-[#8B6914] underline"
            >
              Try again
            </button>
          </div>
        }
      >
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
      </Show>
    </div>
  );
}
