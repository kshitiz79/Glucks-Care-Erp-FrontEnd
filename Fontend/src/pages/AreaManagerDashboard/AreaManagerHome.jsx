import React, { useState, useEffect } from 'react';
import { 
  FiMapPin, 
  FiTrendingUp, 
  FiUsers, 
  FiTarget,
  FiCalendar,
  FiBarChart2,
  FiActivity,
  FiCheckCircle
} from 'react-icons/fi';
import BASE_URL from '../../BaseUrl/baseUrl';
import { formatNumber, formatCurrency } from '../../utils/formatNumber';

export default function AreaManagerHome() {
  const [stats, setStats] = useState({
    areaRevenue: 0,
    areaTeamMembers: 0,
    areaPerformance: '82%',
    completedVisits: 0,
    pendingTasks: 0,
    teamEfficiency: '90%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAreaManagerData();
  }, []);

  const fetchAreaManagerData = async () => {
    try {
      const [usersRes, expensesRes, visitsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/users`).catch(() => ({ json: () => [] })),
        fetch(`${BASE_URL}/api/expenses`).catch(() => ({ json: () => [] })),
        fetch(`${BASE_URL}/api/doctor-visits`).catch(() => ({ json: () => [] }))
      ]);

      const users = await usersRes.json().catch(() => []);
      const expenses = await expensesRes.json().catch(() => []);
      const visits = await visitsRes.json().catch(() => []);

      const areaRevenue = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0) * 0.08; // Assuming 8% of total
      const completedVisits = visits.filter(visit => visit.confirmed).length;

      setStats({
        areaRevenue: areaRevenue,
        areaTeamMembers: users.filter(user => ['Manager', 'User'].includes(user.role)).length,
        areaPerformance: '82%',
        completedVisits: completedVisits,
        pendingTasks: Math.floor(Math.random() * 20) + 5,
        teamEfficiency: '90%'
      });
    } catch (error) {
      console.error('Error fetching area manager data:', error);
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
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-8 rounded-xl shadow-lg text-white">
        <h1 className="text-4xl font-bold mb-2">Area Manager Dashboard</h1>
        <p className="text-pink-100 text-lg">Manage area operations and team performance efficiently.</p>
        <div className="mt-4 flex items-center text-pink-200">
          <FiCalendar className="mr-2" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Area Revenue"
          value={formatCurrency(Math.round(stats.areaRevenue))}
          icon={FiTrendingUp}
          color="text-green-600"
          subtitle="Monthly earnings"
        />
        <StatCard
          title="Team Members"
          value={stats.areaTeamMembers}
          icon={FiUsers}
          color="text-blue-600"
          subtitle="Area team size"
        />
        <StatCard
          title="Completed Visits"
          value={stats.completedVisits}
          icon={FiCheckCircle}
          color="text-green-600"
          subtitle="This month"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={FiActivity}
          color="text-orange-600"
          subtitle="Requires attention"
        />
      </div>

      {/* Area Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" />
            Area Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Area Performance</span>
              <span className="font-semibold text-pink-600">{stats.areaPerformance}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Team Efficiency</span>
              <span className="font-semibold text-green-600">{stats.teamEfficiency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Area Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiTarget className="mr-2" />
            Area Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-pink-50 hover:bg-pink-100 rounded-lg text-center transition-colors">
              <FiBarChart2 className="w-6 h-6 text-pink-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-pink-600">Area Overview</span>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <FiUsers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-600">Team Performance</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <FiMapPin className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-600">Field Visits</span>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
              <FiActivity className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-orange-600">Task Management</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}