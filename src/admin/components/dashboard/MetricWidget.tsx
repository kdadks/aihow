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
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
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
      className={className}
    >
      <div className="flex flex-col justify-center h-full">
        <div className="text-3xl font-semibold text-gray-900">
          {formatValue(value, format)}
        </div>
        {typeof change !== 'undefined' && (
          <div className={cn('flex items-center mt-2 space-x-1', trendColor[trend])}>
            <TrendIcon />
            <span className="text-sm">
              {change > 0 ? '+' : ''}
              {formatValue(change, 'percentage')}
            </span>
            <span className="text-sm text-gray-500">vs last period</span>
          </div>
        )}
      </div>
    </Widget>
  );
};