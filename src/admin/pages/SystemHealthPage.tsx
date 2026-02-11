import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Activity, Database, Server, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface HealthStatus {
  status: string;
  database: {
    size_bytes: number;
    size_mb: number;
    table_count: number;
  };
  statistics: {
    total_users: number;
    total_tools: number;
  };
  timestamp: string;
}

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: any;
}

export default function SystemHealthPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadHealth();

    if (autoRefresh) {
      const interval = setInterval(loadHealth, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadHealth = async () => {
    setLoading(true);
    try {
      // Get system health
      const { data: healthData, error } = await supabase.rpc('get_system_health');

      if (error) throw error;
      setHealth(healthData);

      // Perform health checks
      const healthChecks: HealthCheck[] = [];

      // Check 1: Database connection
      healthChecks.push({
        name: 'Database Connection',
        status: healthData ? 'healthy' : 'error',
        message: healthData ? 'Connected' : 'Connection failed',
      });

      // Check 2: Database size
      const dbSizeMB = healthData?.database?.size_mb || 0;
      healthChecks.push({
        name: 'Database Size',
        status: dbSizeMB < 1000 ? 'healthy' : dbSizeMB < 5000 ? 'warning' : 'error',
        message: `${dbSizeMB.toFixed(2)} MB`,
        details: `${healthData?.database?.table_count || 0} tables`,
      });

      // Check 3: Users
      const totalUsers = healthData?.statistics?.total_users || 0;
      healthChecks.push({
        name: 'Total Users',
        status: 'healthy',
        message: `${totalUsers} registered users`,
      });

      // Check 4: Tools
      const totalTools = healthData?.statistics?.total_tools || 0;
      healthChecks.push({
        name: 'Total Tools',
        status: totalTools > 0 ? 'healthy' : 'warning',
        message: `${totalTools} tools in directory`,
      });

      // Check 5: API Response Time
      const startTime = Date.now();
      await supabase.from('tools_v2').select('id').limit(1);
      const responseTime = Date.now() - startTime;
      healthChecks.push({
        name: 'API Response Time',
        status: responseTime < 200 ? 'healthy' : responseTime < 500 ? 'warning' : 'error',
        message: `${responseTime}ms`,
      });

      setChecks(healthChecks);
    } catch (error) {
      console.error('Error loading system health:', error);
      setChecks([
        {
          name: 'System Health',
          status: 'error',
          message: 'Failed to load system health',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const overallStatus = checks.some((c) => c.status === 'error')
    ? 'error'
    : checks.some((c) => c.status === 'warning')
    ? 'warning'
    : 'healthy';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="w-8 h-8 text-green-600" />
              System Health
              <span
                className={cn(
                  'inline-flex px-3 py-1 rounded-full text-sm font-medium',
                  getStatusColor(overallStatus)
                )}
              >
                {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
              </span>
            </h1>
            <p className="text-gray-600 mt-1">Monitor system performance and uptime</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Auto-refresh (30s)</span>
            </label>
            <button
              onClick={loadHealth}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {loading ? 'Checking...' : 'Refresh Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Health Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {checks.map((check) => (
          <div
            key={check.name}
            className={cn(
              'bg-white border-2 rounded-lg p-6 transition-all',
              getStatusColor(check.status)
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(check.status)}
                  <h3 className="font-semibold">{check.name}</h3>
                </div>
                <p className="text-sm mb-1">{check.message}</p>
                {check.details && <p className="text-xs opacity-75">{check.details}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Information */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Database Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Database</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Size</span>
                <span className="font-medium">{health.database.size_mb.toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tables</span>
                <span className="font-medium">{health.database.table_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Connected
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-6 h-6 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Statistics</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-medium">{health.statistics.total_users.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tools</span>
                <span className="font-medium">{health.statistics.total_tools.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium text-sm">
                  {new Date(health.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm text-green-800">All systems operational</span>
            <span className="text-xs text-green-600">
              Last checked: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
