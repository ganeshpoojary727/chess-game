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
        'flex items-center gap-1.5 p-1 rounded-full bg-[#f7f5f0] border border-[#e8e4db] overflow-x-auto scrollbar-none',
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
                ? 'bg-[#b5493c] text-white shadow-sm font-semibold'
                : 'text-[#6b6b6b] hover:text-[#1c1c1c] hover:bg-[#ede9e1]'
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
