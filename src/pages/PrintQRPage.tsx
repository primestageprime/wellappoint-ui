// src/pages/PrintQRPage.tsx
import { Show, createSignal, createResource } from "solid-js";
import { useParams } from "@solidjs/router";
import { QRCode } from "../components/visual";
import { fetchProviderConfig } from "../services/providerConfigService";

function Initials(props: { name: string; class: string; textClass: string }) {
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
      class={`rounded-full bg-gradient-to-br from-[#d4c5a0] to-[#8B6914] flex items-center justify-center text-white font-semibold ${props.class} ${props.textClass}`}
    >
      {initials()}
    </div>
  );
}

function ProviderPhoto(props: {
  headshot?: string;
  name: string;
  sizePx: number;
}) {
  return (
    <div class="flex justify-center mb-3">
      <Show
        when={props.headshot}
        fallback={
          <Initials
            name={props.name}
            class={`shrink-0`}
            textClass={props.sizePx > 60 ? "text-3xl" : "text-lg"}
          />
        }
      >
        <img
          src={props.headshot}
          alt={props.name}
          referrerPolicy="no-referrer"
          class="rounded-full object-cover border-2 border-[#8B6914]/20 shrink-0"
          style={{ width: `${props.sizePx}px`, height: `${props.sizePx}px` }}
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
          <div class="max-w-md mx-auto space-y-6">
            <h1 class="text-lg font-semibold text-[#3d2e0a] no-print">
              Print QR Code
            </h1>

            {/* Card Format — compact, for desk or corkboard */}
            <div class="card-format print-section">
              <div class="bg-white border border-[#e8dcc8] rounded-[10px] py-6 px-8 text-center max-w-[280px] mx-auto">
                <div class="text-[11px] text-[#5a4510] uppercase tracking-wider mb-3 no-print">
                  Card Format
                </div>
                <ProviderPhoto
                  headshot={provider().headshot}
                  name={provider().name}
                  sizePx={48}
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
                  <QRCode content={getScheduleLink()} size={100} />
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

            {/* Poster Format — large, for wall display */}
            <div class="poster-format print-section">
              <div class="bg-white border border-[#e8dcc8] rounded-[10px] py-10 px-8 text-center">
                <div class="text-[11px] text-[#5a4510] uppercase tracking-wider mb-6 no-print">
                  Poster Format
                </div>
                <ProviderPhoto
                  headshot={provider().headshot}
                  name={provider().name}
                  sizePx={100}
                />
                <h3 class="text-2xl font-bold text-[#3d2e0a] m-0 mb-1">
                  {provider().name}
                </h3>
                <Show when={provider().title}>
                  <p class="text-base text-[#5a4510] m-0 mb-6">
                    {provider().title}
                  </p>
                </Show>
                <div class="flex justify-center mb-4">
                  <QRCode content={getScheduleLink()} size={220} />
                </div>
                <p class="text-lg font-semibold text-[#3d2e0a] m-0 mb-1">
                  Scan to book an appointment
                </p>
                <p class="text-sm text-[#5a4510] m-0">
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
