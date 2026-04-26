import React from 'react';

interface FluentlyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const FluentlyButton: React.FC<FluentlyButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-gradient-fluently text-white hover:shadow-lg hover:shadow-purple-500/50 active:scale-95',
    secondary: 'bg-gray-800 text-white border border-gray-700 hover:border-gray-600 hover:bg-gray-700',
    outline: 'border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:bg-opacity-10',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
