import React from 'react';
import clsx from 'clsx';

interface IconBadgeProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  children,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  return (
    <div
      className={clsx(
        'flex items-center justify-center bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[#c9a86a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
};

export default IconBadge;
