import React from 'react';
import { WidgetProps } from '../../types/widgets';
import { cn } from '../../../utils/cn';

export const Widget: React.FC<WidgetProps> = ({
  id,
  title,
  children,
  loading,
  error,
  onRefresh,
  className
}) => {
  return (
    <div
      id={id}
      className={cn(
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        'p-4 relative min-h-[200px]',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Refresh widget"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
      </div>

      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="text-red-500 text-center p-4">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};