import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiTrendingUp, 
  FiCheckCircle, 
  FiClock,
  FiCalendar,
  FiBarChart2,
  FiActivity,
  FiTarget
} from 'react-icons/fi';
import BASE_URL from '../../BaseUrl/baseUrl';
import { formatNumber } from '../../utils/formatNumber';

export default function ManagerHome() {
  const [stats, setStats] = useState({
    teamMembers: 0,
    completedTasks: 0,
    pendingTasks: 0,
    teamPerformance: '88%',
    monthlyTarget: '75%',
    efficiency: '92%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagerData();
  }, []);

  const fetchManagerData = async () => {
    try {
      const [usersRes, visitsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/users`).catch(() => ({ json: () => [] })),
        fetch(`${BASE_URL}/api/doctor-visits`).catch(() => ({ json: () => [] }))
      ]);

      const users = await usersRes.json().catch(() => []);
      const visits = await visitsRes.json().catch(() => []);

      const teamMembers = users.filter(user => user.role === 'User').length;
      const completedTasks = visits.filter(visit => visit.confirmed).length;
      const pendingTasks = visits.filter(visit => !visit.confirmed).length;

      setStats({
        teamMembers: teamMembers,
        completedTasks: completedTasks,
        pendingTasks: pendingTasks,
        teamPerformance: '88%',
        monthlyTarget: '75%',
        efficiency: '92%'
      });
    } catch (error) {
      console.error('Error fetching manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{loading ? '...' : formatNumber(value)}</p>
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
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-8 rounded-xl shadow-lg text-white">
        <h1 className="text-4xl font-bold mb-2">Manager Dashboard</h1>
        <p className="text-indigo-100 text-lg">Lead your team and track performance effectively.</p>
        <div className="mt-4 flex items-center text-indigo-200">
          <FiCalendar className="mr-2" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Team Members"
          value={stats.teamMembers}
          icon={FiUsers}
          color="text-blue-600"
          subtitle="Direct reports"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={FiCheckCircle}
          color="text-green-600"
          subtitle="This month"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={FiClock}
          color="text-orange-600"
          subtitle="Requires attention"
        />
        <StatCard
          title="Team Performance"
          value={stats.teamPerformance}
          icon={FiTrendingUp}
          color="text-purple-600"
          subtitle="Overall score"
        />
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" />
            Team Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Target</span>
              <span className="font-semibold text-green-600">{stats.monthlyTarget}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Team Efficiency</span>
              <span className="font-semibold text-blue-600">{stats.efficiency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Team Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiTarget className="mr-2" />
            Management Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <FiUsers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-600">Team Overview</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <FiTrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-600">Performance Tracking</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <FiActivity className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-600">Task Management</span>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
              <FiTarget className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-orange-600">Goal Setting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}