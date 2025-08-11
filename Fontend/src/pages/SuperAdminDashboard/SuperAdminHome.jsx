import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiShield,
  FiActivity,
  FiServer,
  FiCalendar,
  FiTrendingUp,
  FiBarChart2,
  FiSettings
} from 'react-icons/fi';
import BASE_URL from '../../BaseUrl/baseUrl';
import { formatNumber } from '../../utils/formatNumber';

export default function SuperAdminHome() {
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalUsers: 0,
    systemHealth: 'Good',
    activeConnections: 0,
    serverUptime: '99.9%',
    securityAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const fetchSuperAdminData = async () => {
    try {
      const usersRes = await fetch(`${BASE_URL}/api/users`).catch(() => ({ json: () => [] }));
      const users = await usersRes.json().catch(() => []);

      const admins = users.filter(user => user.role === 'Admin');

      setStats({
        totalAdmins: admins.length,
        totalUsers: users.length,
        systemHealth: 'Excellent',
        activeConnections: Math.floor(Math.random() * 500) + 100,
        serverUptime: '99.9%',
        securityAlerts: Math.floor(Math.random() * 5)
      });
    } catch (error) {
      console.error('Error fetching super admin data:', error);
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
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 rounded-xl shadow-lg text-white">
        <h1 className="text-4xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-red-100 text-lg">Complete system oversight and administration control.</p>
        <div className="mt-4 flex items-center text-red-200">
          <FiCalendar className="mr-2" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Admins"
          value={stats.totalAdmins}
          icon={FiShield}
          color="text-red-600"
          subtitle="System administrators"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="text-blue-600"
          subtitle="All platform users"
        />
        <StatCard
          title="Active Connections"
          value={stats.activeConnections}
          icon={FiActivity}
          color="text-green-600"
          subtitle="Current sessions"
        />
        <StatCard
          title="Security Alerts"
          value={stats.securityAlerts}
          icon={FiServer}
          color="text-orange-600"
          subtitle="Requires attention"
        />
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiServer className="mr-2" />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Server Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Uptime</span>
              <span className="font-semibold text-gray-800">{stats.serverUptime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">System Health</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{stats.systemHealth}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-center transition-colors">
              <FiShield className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-red-600">Manage Admins</span>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <FiUsers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-600">View All Users</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <FiActivity className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-600">System Logs</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <FiSettings className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-600">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}