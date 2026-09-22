import React from 'react';
import clsx from 'clsx';

interface StatTileProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  className?: string;
  loading?: boolean;
}

export const StatTile: React.FC<StatTileProps> = ({
  icon,
  value,
  label,
  className = '',
  loading = false,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-3 sm:p-3.5 rounded-xl bg-[#f7f5f0] border border-[#e8e4db] transition-all duration-300 hover:border-[#d4cec3] hover:bg-white shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#b5493c]/10 text-[#b5493c] shrink-0">
        {icon}
      </div>

      <div className="flex flex-col min-w-0">
        {loading ? (
          <div className="h-5 w-12 bg-stone-200 rounded animate-pulse mb-1" />
        ) : (
          <span className="text-base sm:text-lg font-sans font-bold text-[#1c1c1c] tracking-tight leading-none truncate">
            {value}
          </span>
        )}
        <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-wider text-[#6b6b6b] mt-0.5 truncate">
          {label}
        </span>
      </div>
    </div>
  );
};

export default StatTile;
