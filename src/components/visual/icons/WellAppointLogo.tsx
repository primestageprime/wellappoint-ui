interface WellAppointLogoProps {
  className?: string;
  size?: number;
}

export function WellAppointLogo({ className = "", size = 80}: WellAppointLogoProps) {


  return (
    <svg 
      viewBox="0 0 100 100" 
      class={`${className}`}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Peaked Roof */}
      <path 
        d="M20 35 L50 15 L80 35 L75 40 L50 25 L25 40 Z" 
        stroke="currentColor" 
        stroke-width="2" 
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      {/* Roof Ridge Lines */}
      <path 
        d="M25 40 L75 40" 
        stroke="currentColor" 
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path 
        d="M28 37 L72 37" 
        stroke="currentColor" 
        stroke-width="1"
        stroke-linecap="round"
      />
      
      {/* Left Support Post */}
      <line 
        x1="35" y1="40" 
        x2="35" y2="65" 
        stroke="currentColor" 
        stroke-width="2.5"
        stroke-linecap="round"
      />
      
      {/* Right Support Post */}
      <line 
        x1="65" y1="40" 
        x2="65" y2="65" 
        stroke="currentColor" 
        stroke-width="2.5"
        stroke-linecap="round"
      />
      
      {/* Cross Beam */}
      <line 
        x1="35" y1="50" 
        x2="65" y2="50" 
        stroke="currentColor" 
        stroke-width="2"
        stroke-linecap="round"
      />
      
      {/* Pulley/Rope mechanism */}
      <circle 
        cx="50" cy="45" 
        r="3" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"
      />
      <line 
        x1="50" y1="48" 
        x2="50" y2="60" 
        stroke="currentColor" 
        stroke-width="1"
        stroke-linecap="round"
      />
      
      {/* Well Base - Main Circle */}
      <ellipse 
        cx="50" cy="75" 
        rx="25" ry="10" 
        stroke="currentColor" 
        stroke-width="2.5" 
        fill="none"
      />
      
      {/* Stone Pattern - Top Row */}
      <path 
        d="M30 68 Q35 66 40 68 Q45 70 50 68 Q55 66 60 68 Q65 70 70 68" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"
        stroke-linecap="round"
      />
      
      {/* Stone Pattern - Middle Row */}
      <path 
        d="M32 72 Q37 70 42 72 Q47 74 52 72 Q57 70 62 72 Q67 74 72 72" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"
        stroke-linecap="round"
      />
      
      {/* Stone Pattern - Bottom Row */}
      <path 
        d="M34 76 Q39 74 44 76 Q49 78 54 76 Q59 74 64 76 Q69 78 74 76" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"
        stroke-linecap="round"
      />
      
      {/* Bucket */}
      <ellipse 
        cx="50" cy="60" 
        rx="4" ry="2" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"
      />
      <line 
        x1="46" y1="60" 
        x2="46" y2="62" 
        stroke="currentColor" 
        stroke-width="1"
        stroke-linecap="round"
      />
      <line 
        x1="54" y1="60" 
        x2="54" y2="62" 
        stroke="currentColor" 
        stroke-width="1"
        stroke-linecap="round"
      />
      <ellipse 
        cx="50" cy="62" 
        rx="4" ry="2" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"
      />
      
      {/* Water Ripples */}
      <circle 
        cx="50" cy="82" 
        r="2" 
        stroke="currentColor" 
        stroke-width="1" 
        fill="none"
        opacity="0.7"
      />
      <circle 
        cx="50" cy="82" 
        r="4" 
        stroke="currentColor" 
        stroke-width="0.5" 
        fill="none"
        opacity="0.5"
      />
      <circle 
        cx="50" cy="82" 
        r="6" 
        stroke="currentColor" 
        stroke-width="0.3" 
        fill="none"
        opacity="0.3"
      />
      
      {/* Decorative Elements - Small Details */}
      <circle 
        cx="30" cy="45" 
        r="1" 
        fill="currentColor" 
        opacity="0.6"
      />
      <circle 
        cx="70" cy="45" 
        r="1" 
        fill="currentColor" 
        opacity="0.6"
      />
      
      {/* Roof Shingles Pattern */}
      <path 
        d="M25 35 L30 33 L35 35 L40 33 L45 35 L50 33 L55 35 L60 33 L65 35 L70 33 L75 35" 
        stroke="currentColor" 
        stroke-width="0.5" 
        fill="none"
        opacity="0.4"
      />
      
      {/* Additional Structural Details */}
      <line 
        x1="40" y1="40" 
        x2="40" y2="65" 
        stroke="currentColor" 
        stroke-width="1"
        stroke-linecap="round"
        opacity="0.3"
      />
      <line 
        x1="60" y1="40" 
        x2="60" y2="65" 
        stroke="currentColor" 
        stroke-width="1"
        stroke-linecap="round"
        opacity="0.3"
      />
    </svg>
  );
}
