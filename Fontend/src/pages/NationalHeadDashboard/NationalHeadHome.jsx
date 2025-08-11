import React, { useState, useEffect } from 'react';
import { 
  FiMap, 
  FiTrendingUp, 
  FiUsers, 
  FiTarget,
  FiCalendar,
  FiBarChart2,
  FiGlobe,
  FiAward
} from 'react-icons/fi';
import BASE_URL from '../../BaseUrl/baseUrl';
import { formatNumber, formatCurrency } from '../../utils/formatNumber';

export default function NationalHeadHome() {
  const [stats, setStats] = useState({
    totalStates: 0,
    nationalRevenue: 0,
    totalTeamMembers: 0,
    performanceScore: '92%',
    topPerformingState: 'Maharashtra',
    monthlyGrowth: '+15%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNationalHeadData();
  }, []);

  const fetchNationalHeadData = async () => {
    try {
      const [usersRes, expensesRes] = await Promise.all([
        fetch(`${BASE_URL}/api/users`).catch(() => ({ json: () => [] })),
        fetch(`${BASE_URL}/api/expenses`).catch(() => ({ json: () => [] }))
      ]);

      const users = await usersRes.json().catch(() => []);
      const expenses = await expensesRes.json().catch(() => []);

      const stateHeads = users.filter(user => user.role === 'State Head');
      const totalRevenue = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

      setStats({
        totalStates: stateHeads.length,
        nationalRevenue: totalRevenue,
        totalTeamMembers: users.length,
        performanceScore: '92%',
        topPerformingState: 'Maharashtra',
        monthlyGrowth: '+15%'
      });
    } catch (error) {
      console.error('Error fetching national head data:', error);
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
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 rounded-xl shadow-lg text-white">
        <h1 className="text-4xl font-bold mb-2">National Head Dashboard</h1>
        <p className="text-purple-100 text-lg">Strategic oversight of national operations and performance.</p>
        <div className="mt-4 flex items-center text-purple-200">
          <FiCalendar className="mr-2" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total States"
          value={stats.totalStates}
          icon={FiMap}
          color="text-purple-600"
          subtitle="Under management"
        />
        <StatCard
          title="National Revenue"
          value={formatCurrency(stats.nationalRevenue)}
          icon={FiTrendingUp}
          color="text-green-600"
          subtitle="Total earnings"
        />
        <StatCard
          title="Team Members"
          value={stats.totalTeamMembers}
          icon={FiUsers}
          color="text-blue-600"
          subtitle="Nationwide team"
        />
        <StatCard
          title="Performance Score"
          value={stats.performanceScore}
          icon={FiTarget}
          color="text-orange-600"
          subtitle="National average"
        />
      </div>

      {/* National Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" />
            National Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Growth</span>
              <span className="font-semibold text-green-600">{stats.monthlyGrowth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Top Performing State</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">{stats.topPerformingState}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overall Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Excellent</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiGlobe className="mr-2" />
            Strategic Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <FiMap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-600">National Overview</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <FiTrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-600">State Performance</span>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <FiUsers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-600">Team Management</span>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
              <FiAward className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-orange-600">Strategic Planning</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}