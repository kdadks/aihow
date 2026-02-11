import { AnalyticsWorkflow } from '../components/analytics/AnalyticsWorkflow';

export default function AnalyticsPage() {
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Analytics Workflow - Main Feature */}
        <AnalyticsWorkflow />
      </div>
    </div>
  );
}
