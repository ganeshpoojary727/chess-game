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
        'relative rounded-[20px] p-6 backdrop-blur-xl transition-all duration-300',
        elevated
          ? 'bg-[rgba(255,255,255,0.055)] border border-[rgba(255,255,255,0.12)]'
          : 'bg-[rgba(255,255,255,0.035)] border border-[rgba(255,255,255,0.08)]',
        hoverEffect &&
          'hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(201,168,106,0.35)] hover:shadow-[0_12px_36px_-8px_rgba(0,0,0,0.7)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
