import React from 'react';
import logo from '../../assets/light logo.png';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img src={logo} alt="How2doAI platform logo – AI tools and workflow comparison" className="h-12 w-auto min-h-[48px]" />
    </div>
  );
};
