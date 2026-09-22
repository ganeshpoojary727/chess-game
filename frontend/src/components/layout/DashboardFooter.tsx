import React from 'react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 py-5 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.28em] text-[#6b6b6b] uppercase select-none relative z-20">
      {/* Bottom-Left Statement */}
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="flex flex-col leading-tight">
          <span>MORE THAN A GAME</span>
          <span className="text-[#1c1c1c]">A BRIGHTER YOU</span>
        </div>
        <div className="hidden sm:block w-10 h-[1.5px] bg-[#d8d2c6]" />
      </div>

      {/* Bottom-Right Navigation Tags */}
      <div className="flex items-center gap-3 text-center">
        <div className="hidden sm:block w-10 h-[1.5px] bg-[#d8d2c6]" />
        <div className="flex items-center gap-2 sm:gap-3 text-[#6b6b6b]">
          <span className="hover:text-[#1c1c1c] transition-colors cursor-pointer">PLAY</span>
          <span className="text-[#b5493c]">&bull;</span>
          <span className="hover:text-[#1c1c1c] transition-colors cursor-pointer">LEARN</span>
          <span className="text-[#b5493c]">&bull;</span>
          <span className="hover:text-[#1c1c1c] transition-colors cursor-pointer">CONNECT</span>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
