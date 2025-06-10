import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variantStyles: Record<ButtonVariant, string> = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 
      text-white 
      shadow-md shadow-blue-500/20
      hover:shadow-lg hover:shadow-blue-500/30 
      hover:from-blue-600 hover:to-blue-800
      active:shadow-sm
      focus-visible:ring-blue-500/30
    `,
    secondary: `
      bg-gradient-to-r from-gray-50 to-gray-100
      text-gray-800 
      border border-gray-200
      shadow-sm
      hover:shadow hover:border-gray-300 hover:from-white hover:to-gray-100
      active:bg-gray-100
      focus-visible:ring-gray-500/20
    `,
    outline: `
      border border-gray-300 
      bg-white
      text-gray-700 
      shadow-sm
      hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400
      active:bg-gray-100
      focus-visible:ring-gray-400/20
    `,
    ghost: `
      bg-transparent 
      text-gray-600 
      hover:bg-gray-100 hover:text-gray-900
      active:bg-gray-200
      focus-visible:ring-gray-300/30
    `,
    link: `
      bg-transparent 
      underline-offset-4 
      hover:underline 
      text-blue-600 hover:text-blue-700 
      p-0 h-auto
    `,
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-9 px-3.5 text-sm',
    md: 'h-11 px-5 py-2.5',
    lg: 'h-13 px-6 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
