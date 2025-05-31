import { FC } from 'react';
import { useAdminAuth } from '../auth/hooks/useAdminAuth';
import { Widget } from '../components/dashboard/Widget';
import { WidgetGrid } from '../components/dashboard/WidgetGrid';
import { MetricWidget } from '../components/dashboard/MetricWidget';

export const AdminDashboard: FC = () => {
  const { admin } = useAdminAuth();

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {admin?.firstName}</h1>
        <p className="text-gray-600">Admin Dashboard</p>
      </header>

      <WidgetGrid>
        <MetricWidget
          id="active-users"
          title="Active Users"
          value="1,234"
          change={12}
          trend="up"
        />
        <MetricWidget
          id="page-views"
          title="Page Views"
          value="45.6K"
          change={5}
          trend="up"
        />
        <MetricWidget
          id="conversion-rate"
          title="Conversion Rate"
          value="3.2%"
          change={-1}
          trend="down"
          format="percentage"
        />
        <Widget
          id="recent-activity"
          title="Recent Activity"
        >
          <div className="space-y-2">
            <p>• New user registration spike</p>
            <p>• System maintenance completed</p>
            <p>• Latest backup successful</p>
          </div>
        </Widget>
      </WidgetGrid>
    </div>
  );
};