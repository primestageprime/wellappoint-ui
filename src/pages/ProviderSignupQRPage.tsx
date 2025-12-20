import { PageFrame, Content, QRCode } from '../components/visual';

export function ProviderSignupQRPage() {
  const getSignupLink = () => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    return `${baseUrl}/admin/create-provider`;
  };

  return (
    <PageFrame>
      <Content>
        <div class="max-w-md mx-auto text-center space-y-6 py-12">
          <h1 class="text-2xl font-semibold text-[#3d2e0a]">
            Provider Sign Up
          </h1>
          
          <p class="text-sm text-[#5a4510]">
            Scan this QR code to create your provider account
          </p>
          
          <div class="flex justify-center py-4">
            <QRCode content={getSignupLink()} size={200} />
          </div>
          
          <div class="text-sm text-[#5a4510]">
            <span class="font-medium">Or visit:</span>
            <a 
              href={getSignupLink()} 
              class="block text-[#8B6914] hover:underline mt-1"
            >
              {getSignupLink()}
            </a>
          </div>
        </div>
      </Content>
    </PageFrame>
  );
}

