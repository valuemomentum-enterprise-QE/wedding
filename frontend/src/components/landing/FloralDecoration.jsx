import React from 'react';

/** Botanical corner flourishes inspired by the floral landing reference. */
export const FloralDecoration = ({ position = 'top-left', className = '' }) => {
  const transforms = {
    'top-left': '',
    'top-right': 'scale-x-[-1]',
    'bottom-left': 'scale-y-[-1]',
    'bottom-right': 'scale-[-1]',
  };

  return (
    <svg
      viewBox="0 0 200 200"
      className={`pointer-events-none absolute w-28 sm:w-36 md:w-44 lg:w-52 h-auto text-floral-red/90 ${transforms[position]} ${className}`}
      aria-hidden="true"
    >
      <g fill="currentColor" opacity="0.92">
        <ellipse cx="48" cy="42" rx="14" ry="22" transform="rotate(-25 48 42)" fill="#C41E3A" />
        <ellipse cx="72" cy="58" rx="12" ry="18" transform="rotate(15 72 58)" fill="#D4622A" />
        <ellipse cx="38" cy="68" rx="11" ry="16" transform="rotate(-40 38 68)" fill="#E8A317" />
        <circle cx="55" cy="52" r="8" fill="#F4C430" />
        <path
          d="M20 90 Q40 70 65 85 T110 95 Q130 100 145 120"
          stroke="#4A6741"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M30 110 Q55 95 80 108 T125 118"
          stroke="#5C7A52"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="95" cy="130" rx="8" ry="14" fill="#4A6741" transform="rotate(30 95 130)" />
        <ellipse cx="115" cy="145" rx="7" ry="12" fill="#5C7A52" transform="rotate(-20 115 145)" />
        <path d="M8 140 Q25 120 45 135 Q30 155 8 140" fill="#6B8F5E" opacity="0.8" />
      </g>
    </svg>
  );
};

export default FloralDecoration;
