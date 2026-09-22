import React from 'react';
import clsx from 'clsx';

export interface TabItem {
  id: string;
  label: string;
}

interface FilterTabProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const FilterTab: React.FC<FilterTabProps> = ({
  tabs,
  activeId,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-1.5 p-1 rounded-full bg-[rgba(255,255,255,0.035)] border border-[rgba(255,255,255,0.08)] overflow-x-auto scrollbar-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={clsx(
              'px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-200 whitespace-nowrap select-none',
              isActive
                ? 'bg-[#f5f5f7] text-[#0a0a0d] shadow-sm font-semibold'
                : 'text-[#8e8e93] hover:text-[#f5f5f7] hover:bg-[rgba(255,255,255,0.05)]'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTab;
