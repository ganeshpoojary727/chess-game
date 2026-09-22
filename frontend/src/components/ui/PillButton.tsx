import React from 'react';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';

export type PillButtonVariant = 'filled-red' | 'filled-dark' | 'outline' | 'sand' | 'filled' | 'gold';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PillButtonVariant;
  icon?: React.ReactNode;
  showArrow?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const PillButton: React.FC<PillButtonProps> = ({
  variant = 'filled-red',
  icon,
  showArrow = true,
  fullWidth = true,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'group relative inline-flex items-center justify-center gap-2.5 font-sans font-bold tracking-widest uppercase text-xs sm:text-[13px] px-6 py-3.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#b5493c]/30 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] shadow-sm';

  const getVariantClasses = (v: PillButtonVariant) => {
    switch (v) {
      case 'filled-dark':
        return 'bg-[#1c1c1c] text-[#fbfaf7] hover:bg-[#2e2e2e] hover:shadow-md';
      case 'outline':
      case 'sand':
        return 'bg-[#ede9e1] text-[#1c1c1c] border border-[#d8d2c6] hover:bg-[#e4dfd5] hover:border-[#c5bea0] hover:shadow-sm';
      case 'filled-red':
      case 'filled':
      case 'gold':
      default:
        return 'bg-[#b5493c] text-white hover:bg-[#9e3e32] hover:shadow-[0_4px_16px_rgba(181,73,60,0.3)] shadow-[0_2px_10px_rgba(181,73,60,0.2)]';
    }
  };

  return (
    <button
      className={clsx(
        baseClasses,
        getVariantClasses(variant),
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0 text-current">{icon}</span>}
      <span className="truncate">{children}</span>
      {showArrow && (
        <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 text-current" />
      )}
    </button>
  );
};

export default PillButton;
