import React, { useState, useEffect } from 'react';
import { 
  FiMapPin, 
  FiTrendingUp, 
  FiUsers, 
  FiTarget,
  FiCalendar,
  FiBarChart2,
  FiLayers,
  FiActivity
} from 'react-icons/fi';
import BASE_URL from '../../BaseUrl/baseUrl';
import { formatNumber, formatCurrency } from '../../utils/formatNumber';

export default function ZonalManagerHome() {
  const [stats, setStats] = useState({
    totalAreas: 0,
    zoneRevenue: 0,
    zoneTeamMembers: 0,
    zonePerformance: '85%',
    topPerformingArea: 'Area 1',
    fieldVisits: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZonalManagerData();
  }, []);

  const fetchZonalManagerData = async () => {
    try {
      const [usersRes, expensesRes, visitsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/users`).catch(() => ({ json: () => [] })),
        fetch(`${BASE_URL}/api/expenses`).catch(() => ({ json: () => [] })),
        fetch(`${BASE_URL}/api/doctor-visits`).catch(() => ({ json: () => [] }))
      ]);

      const users = await usersRes.json().catch(() => []);
      const expenses = await expensesRes.json().catch(() => []);
      const visits = await visitsRes.json().catch(() => []);

      const areaManagers = users.filter(user => user.role === 'Area Manager');
      const zoneRevenue = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0) * 0.15; // Assuming 15% of total

      setStats({
        totalAreas: areaManagers.length,
        zoneRevenue: zoneRevenue,
        zoneTeamMembers: users.filter(user => ['Area Manager', 'Manager', 'User'].includes(user.role)).length,
        zonePerformance: '85%',
        topPerformingArea: 'Area 1',
        fieldVisits: visits.length
      });
    } catch (error) {
      console.error('Error fetching zonal manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{loading ? '...' : (typeof value === 'string' && value.includes('₹') ? value : formatNumber(value))}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-8 rounded-xl shadow-lg text-white">
        <h1 className="text-4xl font-bold mb-2">Zonal Manager Dashboard</h1>
        <p className="text-teal-100 text-lg">Oversee zone operations and area performance management.</p>
        <div className="mt-4 flex items-center text-teal-200">
          <FiCalendar className="mr-2" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Areas"
          value={stats.totalAreas}
          icon={FiLayers}
          color="text-teal-600"
          subtitle="Under management"
        />
        <StatCard
          title="Zone Revenue"
          value={formatCurrency(Math.round(stats.zoneRevenue))}
          icon={FiTrendingUp}
          color="text-green-600"
          subtitle="Monthly earnings"
        />
        <StatCard
          title="Team Members"
          value={stats.zoneTeamMembers}
          icon={FiUsers}
          color="text-blue-600"
          subtitle="Zone team size"
        />
        <StatCard
          title="Field Visits"
          value={stats.fieldVisits}
          icon={FiMapPin}
          color="text-purple-600"
          subtitle="Total visits"
        />
      </div>

      {/* Zone Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" />
            Zone Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Zone Performance</span>
              <span className="font-semibold text-teal-600">{stats.zonePerformance}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Top Performing Area</span>
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">{stats.topPerformingArea}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Zone Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiTarget className="mr-2" />
            Zone Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-teal-50 hover:bg-teal-100 rounded-lg text-center transition-colors">
              <FiBarChart2 className="w-6 h-6 text-teal-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-teal-600">Zone Overview</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <FiTrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-600">Area Performance</span>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <FiUsers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-600">Team Management</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <FiMapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-600">Field Operations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}