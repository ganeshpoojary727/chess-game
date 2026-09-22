import React from 'react';
import clsx from 'clsx';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  elevated = false,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'relative rounded-2xl p-6 transition-all duration-300',
        elevated
          ? 'bg-[#ffffff] border border-[#e8e4db] shadow-md'
          : 'bg-[#fbfaf7] border border-[rgba(0,0,0,0.06)] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04),0_4px_12px_-2px_rgba(0,0,0,0.02)]',
        hoverEffect &&
          'hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.07),0_6px_16px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:border-[rgba(181,73,60,0.25)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
