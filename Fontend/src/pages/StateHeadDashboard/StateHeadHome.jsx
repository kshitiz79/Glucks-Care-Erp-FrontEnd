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

export default function StateHeadHome() {
  const [stats, setStats] = useState({
    totalZones: 0,
    stateRevenue: 0,
    stateTeamMembers: 0,
    statePerformance: '88%',
    topPerformingZone: 'Zone A',
    monthlyTarget: '85%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStateHeadData();
  }, []);

  const fetchStateHeadData = async () => {
    try {
      const [usersRes, expensesRes] = await Promise.all([
        fetch(`${BASE_URL}/api/users`).catch(() => ({ json: () => [] })),
        fetch(`${BASE_URL}/api/expenses`).catch(() => ({ json: () => [] }))
      ]);

      const users = await usersRes.json().catch(() => []);
      const expenses = await expensesRes.json().catch(() => []);

      const zonalManagers = users.filter(user => user.role === 'Zonal Manager');
      const stateRevenue = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0) * 0.3; // Assuming 30% of total

      setStats({
        totalZones: zonalManagers.length,
        stateRevenue: stateRevenue,
        stateTeamMembers: users.filter(user => ['Zonal Manager', 'Area Manager', 'Manager', 'User'].includes(user.role)).length,
        statePerformance: '88%',
        topPerformingZone: 'Zone A',
        monthlyTarget: '85%'
      });
    } catch (error) {
      console.error('Error fetching state head data:', error);
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
      <div className="bg-gradient-to-r from-yellow-600 to-orange-700 p-8 rounded-xl shadow-lg text-white">
        <h1 className="text-4xl font-bold mb-2">State Head Dashboard</h1>
        <p className="text-yellow-100 text-lg">Manage state operations and zonal performance effectively.</p>
        <div className="mt-4 flex items-center text-yellow-200">
          <FiCalendar className="mr-2" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Zones"
          value={stats.totalZones}
          icon={FiLayers}
          color="text-yellow-600"
          subtitle="Under supervision"
        />
        <StatCard
          title="State Revenue"
          value={formatCurrency(Math.round(stats.stateRevenue))}
          icon={FiTrendingUp}
          color="text-green-600"
          subtitle="Monthly earnings"
        />
        <StatCard
          title="Team Members"
          value={stats.stateTeamMembers}
          icon={FiUsers}
          color="text-blue-600"
          subtitle="State team size"
        />
        <StatCard
          title="Performance"
          value={stats.statePerformance}
          icon={FiTarget}
          color="text-purple-600"
          subtitle="State average"
        />
      </div>

      {/* State Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" />
            State Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Target</span>
              <span className="font-semibold text-green-600">{stats.monthlyTarget}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Top Performing Zone</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">{stats.topPerformingZone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">State Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">On Track</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiMapPin className="mr-2" />
            State Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors">
              <FiMapPin className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-yellow-600">State Overview</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <FiTrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-600">Zonal Performance</span>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <FiUsers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-600">Team Management</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <FiActivity className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-600">Field Operations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}