import logoSvg from '../../../assets/Logo.svg';

interface WellAppointLogoProps {
  className?: string;
  size?: number;
}

export function WellAppointLogo({ className = "", size = 80 }: WellAppointLogoProps) {
  return (
    <img 
      src={logoSvg} 
      alt="WellAppoint" 
      class={className}
      width={size}
      style={{ height: 'auto' }}
    />
  );
}
