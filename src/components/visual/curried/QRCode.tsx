import { createMemo } from 'solid-js';
import QRCodeSVG from 'qrcode-svg';

interface QRCodeProps {
  content: string;
  size?: number;
  padding?: number;
  color?: string;
  background?: string;
}

export function QRCode(props: QRCodeProps) {
  const svgString = createMemo(() => {
    const qr = new QRCodeSVG({
      content: props.content,
      padding: props.padding ?? 2,
      width: props.size ?? 128,
      height: props.size ?? 128,
      color: props.color ?? '#3d2e0a',
      background: props.background ?? '#ffffff',
      ecl: 'M',
    });
    return qr.svg();
  });

  return (
    <div 
      class="inline-block rounded-lg overflow-hidden border border-[#8B6914]/20"
      innerHTML={svgString()}
    />
  );
}

