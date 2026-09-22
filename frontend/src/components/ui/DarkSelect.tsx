import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface DarkSelectProps {
  label?: string;
  icon?: React.ReactNode;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const DarkSelect: React.FC<DarkSelectProps> = ({
  label,
  icon,
  options,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={clsx('relative flex flex-col gap-1.5', className)} ref={containerRef}>
      {label && (
        <label className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#8e8e93] select-none">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={clsx(
          'w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] border transition-all duration-200 text-left select-none',
          isOpen
            ? 'border-[#c9a86a]/60 shadow-[0_0_16px_rgba(201,168,106,0.15)] bg-[rgba(255,255,255,0.07)]'
            : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.055)]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className="text-[#8e8e93] shrink-0 text-sm">{icon}</span>}
          <span className="text-sm font-sans font-medium text-[#f5f5f7] truncate">
            {selectedOption ? selectedOption.label : 'Select option'}
          </span>
        </div>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-[#8e8e93] transition-transform duration-200 shrink-0',
            isOpen && 'rotate-180 text-[#c9a86a]'
          )}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl bg-[#141419]/95 backdrop-blur-2xl border border-[rgba(255,255,255,0.12)] shadow-[0_12px_32px_rgba(0,0,0,0.8)] py-1 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-sans text-left transition-colors select-none',
                  isSelected
                    ? 'bg-[#c9a86a]/15 text-[#c9a86a] font-medium'
                    : 'text-[#8e8e93] hover:text-[#f5f5f7] hover:bg-[rgba(255,255,255,0.06)]'
                )}
              >
                <div className="flex flex-col">
                  <span>{opt.label}</span>
                  {opt.description && (
                    <span className="text-[11px] text-[#545458]">{opt.description}</span>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#c9a86a] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DarkSelect;
