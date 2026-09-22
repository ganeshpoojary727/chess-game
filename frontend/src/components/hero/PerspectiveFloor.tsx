import React from 'react';

export const PerspectiveFloor: React.FC = () => {
  const rows = 6;
  const cols = 12;

  return (
    <div className="absolute inset-x-0 bottom-0 h-64 overflow-hidden pointer-events-none select-none flex items-end justify-center -z-10">
      {/* 3D Perspective Chessboard Plane */}
      <div
        className="w-[1200px] h-[400px] grid grid-cols-12 grid-rows-6 shadow-2xl"
        style={{
          transform: 'perspective(580px) rotateX(72deg) translateY(60px)',
          transformOrigin: '50% 100%',
          maskImage:
            'radial-gradient(ellipse 70% 80% at 50% 90%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 80% at 50% 90%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0) 100%)',
        }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const isLight = (row + col) % 2 === 0;

          return (
            <div
              key={index}
              className={`relative border-[0.5px] border-black/[0.04] transition-colors duration-500 ${
                isLight
                  ? 'bg-gradient-to-b from-[#f2ece2] to-[#e4ded2]'
                  : 'bg-gradient-to-b from-[#38332c] to-[#25221d]'
              }`}
            >
              {isLight && (
                <div className="absolute inset-x-0 top-0 h-[1px] bg-white/40" />
              )}
            </div>
          );
        })}
      </div>

      {/* Glossy Horizon Reflections */}
      <div className="absolute bottom-8 w-[600px] h-14 bg-gradient-to-r from-transparent via-[#b5493c]/10 to-transparent filter blur-2xl" />
      <div className="absolute bottom-2 w-[480px] h-8 bg-gradient-to-r from-transparent via-white/30 to-transparent filter blur-md" />
    </div>
  );
};

export default PerspectiveFloor;
