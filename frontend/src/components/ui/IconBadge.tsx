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
    sm: 'w-9 h-9 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-13 h-13 rounded-2xl',
  };

  return (
    <div
      className={clsx(
        'flex items-center justify-center bg-[#b5493c] text-white shadow-sm transition-transform duration-200 group-hover:scale-105 shrink-0',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
};

export default IconBadge;
