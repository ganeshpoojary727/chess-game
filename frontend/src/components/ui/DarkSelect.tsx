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
        <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#6b6b6b] select-none">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={clsx(
          'w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#f7f5f0] border transition-all duration-200 text-left select-none shadow-sm',
          isOpen
            ? 'border-[#b5493c] ring-2 ring-[#b5493c]/15 bg-white'
            : 'border-[#e8e4db] hover:border-[#d4cec3] hover:bg-[#faf8f4]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className="text-[#6b6b6b] shrink-0 text-sm">{icon}</span>}
          <span className="text-sm font-sans font-medium text-[#1c1c1c] truncate">
            {selectedOption ? selectedOption.label : 'Select option'}
          </span>
        </div>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-[#8e8b82] transition-transform duration-200 shrink-0',
            isOpen && 'rotate-180 text-[#b5493c]'
          )}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl bg-white border border-[#e8e4db] shadow-[0_12px_32px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] py-1 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
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
                  'w-full flex items-center justify-between px-3.5 py-2 text-sm font-sans text-left transition-colors select-none',
                  isSelected
                    ? 'bg-[#b5493c]/10 text-[#b5493c] font-semibold'
                    : 'text-[#1c1c1c] hover:bg-[#f5f2ec]'
                )}
              >
                <div className="flex flex-col">
                  <span>{opt.label}</span>
                  {opt.description && (
                    <span className="text-[11px] text-[#6b6b6b]">{opt.description}</span>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#b5493c] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DarkSelect;
