import React from 'react';
import { WidgetGridProps } from '../../types/widgets';
import { cn } from '../../../utils/cn';

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  children,
  columns = 2,
  className
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div
      className={cn(
        'grid gap-4',
        gridCols[columns],
        className
      )}
    >
      {children}
    </div>
  );
};