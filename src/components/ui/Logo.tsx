import React from 'react';
import logo from '../../assets/light logo.png';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img src={logo} alt="Logo" className="h-8 w-auto min-h-[32px]" />
    </div>
  );
};
