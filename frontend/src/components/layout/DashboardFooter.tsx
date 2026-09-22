import React from 'react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 mt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.28em] text-[#8e8e93] uppercase select-none">
      {/* Left Statement */}
      <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
        <span className="text-[#545458]">EVERY MOVE</span>
        <span className="text-[#c9a86a]/80">BUILDS A BETTER YOU</span>
      </div>

      {/* Right Navigation Tags */}
      <div className="flex items-center gap-4 text-center">
        <div className="hidden sm:block w-12 h-[1px] bg-white/10" />
        <div className="flex items-center gap-3">
          <span className="hover:text-[#f5f5f7] transition-colors cursor-pointer">PLAY</span>
          <span className="text-white/20">&bull;</span>
          <span className="hover:text-[#f5f5f7] transition-colors cursor-pointer">LEARN</span>
          <span className="text-white/20">&bull;</span>
          <span className="hover:text-[#f5f5f7] transition-colors cursor-pointer">CONNECT</span>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
