import React from 'react';
import { MetricWidgetProps } from '../../types/widgets';
import { Widget } from './Widget';
import { cn } from '../../../utils/cn';

const formatValue = (value: number | string, format: 'number' | 'currency' | 'percentage' = 'number'): string => {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    
    case 'percentage':
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }).format(value / 100);
    
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
};

export const MetricWidget: React.FC<MetricWidgetProps> = ({
  id,
  title,
  value,
  change,
  trend = 'neutral',
  format = 'number',
  loading,
  error,
  onRefresh,
  className
}) => {
  const trendColor = {
    up: 'text-green-600 bg-green-50 border-green-200',
    down: 'text-red-600 bg-red-50 border-red-200',
    neutral: 'text-gray-600 bg-gray-50 border-gray-200'
  };

  const TrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <Widget
      id={id}
      title={title}
      loading={loading}
      error={error}
      onRefresh={onRefresh}
      className={cn('bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105', className)}
    >
      <div className="flex flex-col justify-center h-full p-2">
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          {formatValue(value, format)}
        </div>
        {typeof change !== 'undefined' && (
          <div className={cn(
            'inline-flex items-center px-3 py-1.5 rounded-full border transition-all duration-200 text-sm font-medium',
            trendColor[trend]
          )}>
            <TrendIcon />
            <span className="ml-1">
              {change > 0 ? '+' : ''}
              {formatValue(change, 'percentage')}
            </span>
            <span className="ml-2 text-gray-500 font-normal">vs last period</span>
          </div>
        )}
      </div>
    </Widget>
  );
};