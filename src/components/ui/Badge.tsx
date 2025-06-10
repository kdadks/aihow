import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200';
  
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 shadow-sm hover:shadow',
    primary: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 shadow-sm hover:shadow',
    secondary: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 shadow-sm hover:shadow',
    success: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 shadow-sm hover:shadow',
    warning: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 shadow-sm hover:shadow',
    danger: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 shadow-sm hover:shadow',
    outline: 'bg-gradient-to-r from-gray-50 to-white border border-gray-200 text-gray-800 hover:border-gray-300',
  };
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
