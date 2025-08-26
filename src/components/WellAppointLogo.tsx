interface WellAppointLogoProps {
  className?: string;
}

export function WellAppointLogo({ className = "" }: WellAppointLogoProps) {


  return (
    <svg 
      viewBox="0 0 100 100" 
      class={`${className}`}
      width={80}
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
        d="M28 72 Q33 70 38 72 Q43 74 48 72 Q53 70 58 72 Q63 74 68 72" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"
        stroke-linecap="round"
      />
      
      {/* Stone Pattern - Bottom Row */}
      <path 
        d="M26 76 Q31 74 36 76 Q41 78 46 76 Q51 74 56 76 Q61 78 66 76" 
        stroke="currentColor" 
        stroke-width="1.5" 
        fill="none"
        stroke-linecap="round"
      />
      
      {/* Individual Stone Details */}
      <path 
        d="M32 69 L34 71 L32 73 L30 71 Z" 
        stroke="currentColor" 
        stroke-width="1" 
        fill="none"
      />
      <path 
        d="M42 67 L44 69 L42 71 L40 69 Z" 
        stroke="currentColor" 
        stroke-width="1" 
        fill="none"
      />
      <path 
        d="M58 69 L60 71 L58 73 L56 71 Z" 
        stroke="currentColor" 
        stroke-width="1" 
        fill="none"
      />
      <path 
        d="M66 67 L68 69 L66 71 L64 69 Z" 
        stroke="currentColor" 
        stroke-width="1" 
        fill="none"
      />
      
      {/* Mortar Lines */}
      <path 
        d="M35 75 L37 77" 
        stroke="currentColor" 
        stroke-width="0.8"
        stroke-linecap="round"
      />
      <path 
        d="M45 73 L47 75" 
        stroke="currentColor" 
        stroke-width="0.8"
        stroke-linecap="round"
      />
      <path 
        d="M55 75 L57 77" 
        stroke="currentColor" 
        stroke-width="0.8"
        stroke-linecap="round"
      />
      
      {/* Well Opening Shadow */}
      <ellipse 
        cx="50" cy="75" 
        rx="12" ry="4" 
        fill="currentColor" 
        opacity="0.15"
      />
    </svg>
  );
}