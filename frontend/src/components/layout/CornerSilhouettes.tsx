import React from 'react';

export const CornerSilhouettes: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-20">
      {/* Bottom-Left Rocky Silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-[240px] sm:w-[320px] lg:w-[420px] h-[160px] sm:h-[220px] lg:h-[280px] opacity-70 mix-blend-multiply"
        viewBox="0 0 400 250"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rockGradientLeft" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1815" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#2b2723" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#453e37" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f5f2ec" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Craggy mountain rock formation */}
        <path
          d="M0,250 L0,120 L35,100 L60,130 L110,65 L145,110 L195,45 L240,115 L290,90 L340,170 L380,210 L400,250 Z"
          fill="url(#rockGradientLeft)"
        />
        {/* Forefront rock crags */}
        <path
          d="M0,250 L0,160 L45,130 L80,180 L130,120 L180,175 L230,195 L270,250 Z"
          fill="#1c1916"
          opacity="0.5"
        />
      </svg>

      {/* Bottom-Right Rocky Silhouette */}
      <svg
        className="absolute bottom-0 right-0 w-[240px] sm:w-[320px] lg:w-[420px] h-[160px] sm:h-[220px] lg:h-[280px] opacity-70 mix-blend-multiply"
        viewBox="0 0 400 250"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rockGradientRight" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#1a1815" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#2b2723" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#453e37" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f5f2ec" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Craggy mountain rock formation mirrored */}
        <path
          d="M400,250 L400,115 L365,95 L340,125 L290,60 L255,105 L205,40 L160,110 L110,85 L60,165 L20,205 L0,250 Z"
          fill="url(#rockGradientRight)"
        />
        {/* Forefront rock crags */}
        <path
          d="M400,250 L400,155 L355,125 L320,175 L270,115 L220,170 L170,190 L130,250 Z"
          fill="#1c1916"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};

export default CornerSilhouettes;
