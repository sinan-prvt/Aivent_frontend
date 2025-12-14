import React, { useEffect, useState } from "react";
import { 
  fetchDashboardMetrics, 
//   fetchRecentUsers, 
//   fetchRecentActivities,
//   fetchRevenueStats 
} from "../api/adminApi";
import { 
  UserGroupIcon, 
  UserIcon, 
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

export default function DashboardHome() {
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [revenueStats, setRevenueStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');
  const [metrics, setMetrics] = useState({
    avg_session_duration: 0,
    bounce_rate: 0,
    new_users: 0,
    returning_users: 0,
    server_load: 0,
    uptime: 0,
  });
  
  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [metricsData, usersData, activitiesData, revenueData] = await Promise.all([
        fetchDashboardMetrics(timeRange),
        // fetchRecentUsers(),
        // fetchRecentActivities(),
        // fetchRevenueStats(timeRange)
      ]);

      setMetrics(metricsData?.results || metricsData || {});
    //   setRecentUsers(usersData?.results || usersData?.data || []);
    //   setRecentActivities(activitiesData?.results || activitiesData?.data || []);
    //   setRevenueStats(revenueData?.results || revenueData || {});
    } catch (err) {
      console.error("Dashboard data fetch failed", err);
    } finally {
      setLoading(false);
    }
  }

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getMetricCards = () => {
    if (!metrics) return [];
    
    return [
      {
        title: "Total Users",
        value: formatNumber(metrics.total_users || 0),
        icon: <UserGroupIcon className="h-6 w-6 text-blue-600" />,
        change: calculatePercentageChange(
          metrics.total_users || 0,
          metrics.previous_total_users || 0
        ),
        trend: 'up',
        color: 'bg-blue-50',
        iconColor: 'text-blue-600'
      },
      {
        title: "Active Users",
        value: formatNumber(metrics.active_users || 0),
        icon: <UserIcon className="h-6 w-6 text-green-600" />,
        change: calculatePercentageChange(
          metrics.active_users || 0,
          metrics.previous_active_users || 0
        ),
        trend: 'up',
        color: 'bg-green-50',
        iconColor: 'text-green-600'
      },
      {
        title: "Total Vendors",
        value: formatNumber(metrics.total_vendors || 0),
        icon: <BuildingStorefrontIcon className="h-6 w-6 text-purple-600" />,
        change: calculatePercentageChange(
          metrics.total_vendors || 0,
          metrics.previous_total_vendors || 0
        ),
        trend: 'up',
        color: 'bg-purple-50',
        iconColor: 'text-purple-600'
      },
      {
        title: "Total Revenue",
        value: `$${formatNumber(revenueStats.current || 0)}`,
        icon: <CurrencyDollarIcon className="h-6 w-6 text-amber-600" />,
        change: calculatePercentageChange(
          revenueStats.current || 0,
          revenueStats.previous || 0
        ),
        trend: revenueStats.current >= (revenueStats.previous || 0) ? 'up' : 'down',
        color: 'bg-amber-50',
        iconColor: 'text-amber-600',
        isCurrency: true
      },
      {
        title: "Pending Approvals",
        value: formatNumber(metrics.awaiting_vendor_approval || 0),
        icon: <ClockIcon className="h-6 w-6 text-orange-600" />,
        change: calculatePercentageChange(
          metrics.awaiting_vendor_approval || 0,
          metrics.previous_awaiting_approval || 0
        ),
        trend: 'up',
        color: 'bg-orange-50',
        iconColor: 'text-orange-600'
      },
      {
        title: "Conversion Rate",
        value: `${metrics.conversion_rate || 0}%`,
        icon: <ChartBarIcon className="h-6 w-6 text-indigo-600" />,
        change: calculatePercentageChange(
          metrics.conversion_rate || 0,
          metrics.previous_conversion_rate || 0
        ),
        trend: metrics.conversion_rate >= (metrics.previous_conversion_rate || 0) ? 'up' : 'down',
        color: 'bg-indigo-50',
        iconColor: 'text-indigo-600'
      }
    ];
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'login': return '🔐';
      case 'signup': return '👤';
      case 'purchase': return '🛒';
      case 'vendor_signup': return '🏪';
      case 'admin_action': return '⚡';
      default: return '📝';
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { color: 'bg-green-100 text-green-800', icon: '✅' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      suspended: { color: 'bg-red-100 text-red-800', icon: '⛔' },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: '💤' }
    };
    return config[status] || config.inactive;
  };

  const getTimeRangeOptions = () => [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {getTimeRangeOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            onClick={loadDashboardData}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {getMetricCards().map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`inline-flex items-center text-xs font-medium ${
                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.trend === 'up' ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(card.change)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-2">vs previous period</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.slice(0, 5).map((user) => {
                  const statusBadge = getStatusBadge(user.status);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-3">
                            {user.name?.[0] || user.email?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || user.username || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'vendor' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          {statusBadge.icon} {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All →
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.slice(0, 6).map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 mt-1 text-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user_name || activity.user_email}
                  </p>
                  <p className="text-sm text-gray-600">{activity.description || activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Session Duration</span>
              <span className="text-sm font-medium text-gray-900">
                {metrics.avg_session_duration ? `${Math.floor(metrics.avg_session_duration / 60)}m ${metrics.avg_session_duration % 60}s` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bounce Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {metrics.bounce_rate ? `${metrics.bounce_rate}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New vs Returning</span>
              <span className="text-sm font-medium text-gray-900">
                {metrics.new_users && metrics.returning_users 
                  ? `${Math.round((metrics.new_users / (metrics.new_users + metrics.returning_users)) * 100)}% New`
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
              <span className="font-medium text-indigo-700">📊 Generate Report</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
              <span className="font-medium text-green-700">👥 Add New User</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
              <span className="font-medium text-purple-700">📈 View Analytics</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
              <span className="font-medium text-amber-700">🔔 Manage Notifications</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <CheckCircleIcon className="h-4 w-4 mr-1" /> Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <CheckCircleIcon className="h-4 w-4 mr-1" /> Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Load</span>
              <span className="text-sm font-medium text-green-600">
                {metrics.server_load ? `${metrics.server_load}%` : 'Normal'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-gray-900">
                {metrics.uptime ? `${metrics.uptime}%` : '99.9%'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}