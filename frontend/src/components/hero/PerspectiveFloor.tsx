import React from 'react';

export const PerspectiveFloor: React.FC = () => {
  const rows = 6;
  const cols = 10;

  return (
    <div className="relative w-full max-w-xl h-48 -mt-20 overflow-hidden pointer-events-none select-none flex items-center justify-center">
      {/* 3D Perspective Plane */}
      <div
        className="w-[640px] h-[340px] grid grid-cols-10 grid-rows-6 border border-white/5 shadow-2xl"
        style={{
          transform: 'perspective(520px) rotateX(68deg) translateY(-20px)',
          transformOrigin: '50% 100%',
          maskImage:
            'radial-gradient(ellipse 65% 75% at 50% 85%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 95%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 65% 75% at 50% 85%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 95%)',
        }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const isLight = (row + col) % 2 === 0;

          return (
            <div
              key={index}
              className={`relative border-[0.5px] border-white/[0.04] transition-colors duration-500 ${
                isLight
                  ? 'bg-gradient-to-b from-[#1b1c24] to-[#121319]'
                  : 'bg-gradient-to-b from-[#101116] to-[#08080b]'
              }`}
            >
              {/* Subtle top edge light reflection */}
              {isLight && (
                <div className="absolute inset-x-0 top-0 h-[1px] bg-white/[0.08]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Surface Reflection & Rim Glow */}
      <div className="absolute bottom-6 w-96 h-12 bg-gradient-to-r from-transparent via-[#c9a86a]/15 to-transparent filter blur-xl" />
      <div className="absolute bottom-2 w-72 h-8 bg-gradient-to-r from-transparent via-white/10 to-transparent filter blur-md" />
    </div>
  );
};

export default PerspectiveFloor;
