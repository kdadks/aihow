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
        'rounded-2xl border border-white/30 bg-white/80 backdrop-blur-xl shadow-xl',
        'p-6 relative min-h-[200px] transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]',
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {title}
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
            aria-label="Refresh widget"
          >
            <svg
              className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-200 group-hover:rotate-180 transform"
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
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600" />
            <span className="text-sm font-medium text-gray-600">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl">
          <div className="text-red-500 text-center p-6">
            <div className="bg-red-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8"
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
            </div>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};