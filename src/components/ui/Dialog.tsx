import React, { Fragment } from 'react';
import { cn } from '../../utils/cn';

interface DialogProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export const Dialog: React.FC<DialogProps> = ({ children, open, onClose }) => {
  if (!open) return null;

  return (
    <Fragment>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className={cn(
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        "w-full max-w-md bg-white rounded-lg shadow-xl z-50",
        "transform transition-all"
      )}>
        {children}
      </div>
    </Fragment>
  );
};