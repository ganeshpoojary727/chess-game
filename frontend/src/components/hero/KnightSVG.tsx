import React from 'react';

interface KnightSVGProps {
  variant: 'white' | 'black';
  className?: string;
  mirrored?: boolean;
}

export const KnightSVG: React.FC<KnightSVGProps> = ({
  variant,
  className = '',
  mirrored = false,
}) => {
  const isWhite = variant === 'white';
  const idPrefix = isWhite ? 'white-knight' : 'black-knight';

  return (
    <svg
      viewBox="0 0 280 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        transform: mirrored ? 'scaleX(-1)' : undefined,
        filter: isWhite
          ? 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 25px rgba(255, 255, 255, 0.2))'
          : 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 25px rgba(201, 168, 106, 0.15))',
      }}
    >
      <defs>
        {/* White Knight Gradients */}
        <linearGradient id={`${idPrefix}-body-grad`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#f3f4f6" />
          <stop offset="70%" stopColor="#d1d5db" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>

        <linearGradient id={`${idPrefix}-rim-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#e5e7eb" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.1" />
        </linearGradient>

        {/* Black Knight Gradients */}
        <linearGradient id={`${idPrefix}-black-body`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#373943" />
          <stop offset="25%" stopColor="#252730" />
          <stop offset="65%" stopColor="#13141a" />
          <stop offset="100%" stopColor="#08080a" />
        </linearGradient>

        <linearGradient id={`${idPrefix}-black-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9a86a" stopOpacity="0.75" />
          <stop offset="35%" stopColor="#8e8e93" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#111114" stopOpacity="0.1" />
        </linearGradient>

        {/* Specular & Gloss Filters */}
        <filter id={`${idPrefix}-gloss-filter`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="4"
            specularConstant="0.9"
            specularExponent="20"
            result="specular"
            lightingColor={isWhite ? '#ffffff' : '#c9a86a'}
          >
            <fePointLight x={isWhite ? '60' : '220'} y="50" z="200" />
          </feSpecularLighting>
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specular" />
          <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="0.8" k4="0" />
        </filter>

        <linearGradient id={`${idPrefix}-sheen`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={isWhite ? '0.45' : '0.15'} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* PEDESTAL BASE */}
      {/* Tier 1: Bottom Pedestal Foundation */}
      <path
        d="M 40 355 C 40 342, 240 342, 240 355 C 240 368, 40 368, 40 355 Z"
        fill={isWhite ? `url(#${idPrefix}-body-grad)` : `url(#${idPrefix}-black-body)`}
        stroke={isWhite ? '#ffffff' : '#3f3f46'}
        strokeWidth="1.5"
      />
      <ellipse
        cx="140"
        cy="353"
        rx="98"
        ry="13"
        fill={isWhite ? '#ffffff' : '#22232a'}
        fillOpacity={isWhite ? '0.6' : '0.4'}
      />

      {/* Tier 2: Fluted Column Base Collar */}
      <path
        d="M 58 335 L 68 315 C 100 310, 180 310, 212 315 L 222 335 C 190 342, 90 342, 58 335 Z"
        fill={isWhite ? `url(#${idPrefix}-body-grad)` : `url(#${idPrefix}-black-body)`}
        stroke={isWhite ? '#e5e7eb' : '#33353e'}
        strokeWidth="1"
      />
      <ellipse
        cx="140"
        cy="315"
        rx="72"
        ry="9"
        fill={isWhite ? '#ffffff' : '#2b2d37'}
        fillOpacity={isWhite ? '0.5' : '0.6'}
      />

      {/* Tier 3: Torus Ring Neck */}
      <ellipse
        cx="140"
        cy="300"
        rx="64"
        ry="8"
        fill={isWhite ? '#f3f4f6' : '#1c1d24'}
        stroke={isWhite ? '#ffffff' : '#c9a86a'}
        strokeOpacity={isWhite ? '0.8' : '0.35'}
        strokeWidth="1.5"
      />

      {/* MAIN KNIGHT SCULPTED BODY (Head, Arched Mane, Snout, Breast) */}
      <g filter={`url(#${idPrefix}-gloss-filter)`}>
        <path
          d="
            M 76 300
            C 72 260, 62 205, 78 155
            C 84 135, 70 120, 64 105
            C 78 108, 90 102, 95 90
            C 105 100, 118 92, 122 80
            C 134 94, 148 88, 154 75
            C 165 88, 178 78, 184 62
            C 192 45, 195 24, 198 12
            C 204 22, 212 40, 206 58
            C 214 55, 218 42, 222 30
            C 226 44, 228 65, 222 82
            C 216 98, 202 112, 188 122
            C 178 130, 182 142, 198 150
            C 214 158, 235 174, 228 198
            C 222 216, 204 224, 188 226
            C 176 228, 168 222, 155 220
            C 142 218, 134 224, 138 234
            C 144 246, 158 255, 174 258
            C 188 260, 198 274, 204 300
            Z
          "
          fill={isWhite ? `url(#${idPrefix}-body-grad)` : `url(#${idPrefix}-black-body)`}
          stroke={isWhite ? `url(#${idPrefix}-rim-grad)` : `url(#${idPrefix}-black-rim)`}
          strokeWidth="1.5"
        />

        {/* CHEEK / JAW CONTOUR & VOLUME SHADOW */}
        <path
          d="M 135 155 C 158 160, 182 178, 178 205 C 160 215, 142 195, 135 155 Z"
          fill={isWhite ? '#d1d5db' : '#0e0f14'}
          fillOpacity={isWhite ? '0.45' : '0.75'}
        />

        {/* EYE SOCKET & HIGHLIGHT */}
        <ellipse
          cx="174"
          cy="142"
          rx="9"
          ry="6"
          transform="rotate(-15 174 142)"
          fill={isWhite ? '#9ca3af' : '#08080b'}
        />
        <ellipse
          cx="173"
          cy="141"
          rx="5"
          ry="3"
          transform="rotate(-15 173 141)"
          fill={isWhite ? '#ffffff' : '#c9a86a'}
          fillOpacity={isWhite ? '0.9' : '0.65'}
        />

        {/* NOSTRIL FLARE */}
        <path
          d="M 216 188 C 218 194, 212 198, 206 195 C 204 192, 210 186, 216 188 Z"
          fill={isWhite ? '#6b7280' : '#050507'}
        />

        {/* MOUTH INDENTATION SLIT */}
        <path
          d="M 188 226 C 178 224, 168 220, 158 220"
          stroke={isWhite ? '#9ca3af' : '#27272a'}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* MANE HAIR CARVED FURROWS */}
        <path
          d="M 175 75 C 155 105, 130 135, 105 165"
          stroke={isWhite ? 'rgba(255,255,255,0.7)' : 'rgba(201,168,106,0.3)'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 150 90 C 135 118, 115 142, 92 170"
          stroke={isWhite ? 'rgba(255,255,255,0.6)' : 'rgba(201,168,106,0.25)'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 125 108 C 112 135, 98 158, 82 185"
          stroke={isWhite ? 'rgba(255,255,255,0.5)' : 'rgba(201,168,106,0.2)'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* GLOSSY SURFACE HIGHLIGHT (Curved Spine Sheen) */}
        <path
          d="M 188 65 C 196 95, 185 130, 198 152 C 180 145, 172 120, 178 85 Z"
          fill={`url(#${idPrefix}-sheen)`}
        />
        <ellipse
          cx="145"
          cy="260"
          rx="18"
          ry="30"
          transform="rotate(20 145 260)"
          fill={`url(#${idPrefix}-sheen)`}
          opacity={isWhite ? '0.7' : '0.4'}
        />
      </g>
    </svg>
  );
};

export default KnightSVG;
