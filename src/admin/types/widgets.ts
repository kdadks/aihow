import { ReactNode } from 'react';

export interface WidgetData {
  id: string;
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  error?: string;
}

export interface WidgetProps {
  id: string;
  title: string;
  children: ReactNode;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  className?: string;
}

export interface WidgetGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export interface MetricWidgetProps extends Omit<WidgetProps, 'children'> {
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'currency' | 'percentage';
}