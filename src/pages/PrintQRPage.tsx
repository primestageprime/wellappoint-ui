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
  const [config, { refetch }] = createResource(
    () => params.username,
    fetchProviderConfig,
  );
  const [printFormat, setPrintFormat] = createSignal<"card" | "poster" | null>(
    null,
  );

  const getScheduleLink = () => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    return `${baseUrl}/${params.username}`;
  };

  const handlePrint = (format: "card" | "poster") => {
    setPrintFormat(format);
    // Double-rAF ensures the print-format class is painted before the print dialog
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
        setPrintFormat(null);
      });
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
        when={!config.error}
        fallback={
          <div class="text-center py-8">
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
      </Show>
    </div>
  );
}
