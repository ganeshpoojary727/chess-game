import React from 'react';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outline' | 'gold';
  icon?: React.ReactNode;
  showArrow?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const PillButton: React.FC<PillButtonProps> = ({
  variant = 'filled',
  icon,
  showArrow = true,
  fullWidth = true,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'group relative inline-flex items-center justify-center gap-2.5 font-sans font-semibold tracking-wider uppercase text-xs sm:text-[13px] px-6 py-3.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#c9a86a]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variantClasses = {
    filled:
      'bg-[#f5f5f7] text-[#0a0a0d] hover:bg-white hover:shadow-[0_0_24px_rgba(245,245,247,0.25)] shadow-md',
    outline:
      'bg-[rgba(255,255,255,0.035)] text-[#f5f5f7] border border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.07)] hover:border-[#c9a86a]/60 hover:text-white hover:shadow-[0_0_20px_rgba(201,168,106,0.15)]',
    gold:
      'bg-[#c9a86a] text-[#0a0a0d] hover:bg-[#d8b87c] hover:shadow-[0_0_24px_rgba(201,168,106,0.4)] shadow-md',
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {showArrow && (
        <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </button>
  );
};

export default PillButton;
