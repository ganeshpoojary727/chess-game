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
        'flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[rgba(255,255,255,0.035)] border border-[rgba(255,255,255,0.08)] transition-all duration-300 hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.055)]',
        className
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[rgba(201,168,106,0.1)] border border-[rgba(201,168,106,0.2)] text-[#c9a86a] shrink-0">
        {icon}
      </div>

      <div className="flex flex-col min-w-0">
        {loading ? (
          <div className="h-6 w-16 bg-white/10 rounded animate-pulse mb-1" />
        ) : (
          <span className="text-lg sm:text-xl font-sans font-bold text-[#f5f5f7] tracking-tight leading-none truncate">
            {value}
          </span>
        )}
        <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#8e8e93] mt-1 truncate">
          {label}
        </span>
      </div>
    </div>
  );
};

export default StatTile;
