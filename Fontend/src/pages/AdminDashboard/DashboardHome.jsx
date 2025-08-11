// src/pages/DashboardHome.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiUserCheck, 
  FiTrendingUp, 
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiActivity,
  FiBarChart2
} from 'react-icons/fi';
import { FlaskConical, Truck } from 'lucide-react';
import BASE_URL from '../../BaseUrl/baseUrl';
import { formatNumber, formatCurrency } from '../../utils/formatNumber';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalChemists: 0,
    totalStockists: 0,
    totalVisits: 0,
    totalExpenses: 0,
    totalOrders: 0,
    totalTickets: 0,
    usersByRole: {},
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        usersRes,
        doctorsRes,
        chemistsRes,
        stockistsRes,
        doctorVisitsRes,
        expensesRes,
        ordersRes,
        ticketsRes
      ] = await Promise.all([
        fetch(`${BASE_URL}/api/users`).catch(() => ({ json: () => Promise.resolve([]) })),
        fetch(`${BASE_URL}/api/doctors`).catch(() => ({ json: () => Promise.resolve([]) })),
        fetch(`${BASE_URL}/api/chemists`).catch(() => ({ json: () => Promise.resolve({ Data: [] }) })),
        fetch(`${BASE_URL}/api/stockists`).catch(() => ({ json: () => Promise.resolve([]) })),
        fetch(`${BASE_URL}/api/doctor-visits`).catch(() => ({ json: () => Promise.resolve([]) })),
        fetch(`${BASE_URL}/api/expenses`).catch(() => ({ json: () => Promise.resolve([]) })),
        fetch(`${BASE_URL}/api/orders`).catch(() => ({ json: () => Promise.resolve([]) })),
        fetch(`${BASE_URL}/api/tickets`).catch(() => ({ json: () => Promise.resolve([]) }))
      ]);

      const users = await usersRes.json().catch(() => []);
      const doctors = await doctorsRes.json().catch(() => []);
      const chemistsData = await chemistsRes.json().catch(() => ({ Data: [] }));
      const chemists = chemistsData.Data || chemistsData || [];
      const stockists = await stockistsRes.json().catch(() => []);
      const visits = await doctorVisitsRes.json().catch(() => []);
      const expenses = await expensesRes.json().catch(() => []);
      const orders = await ordersRes.json().catch(() => []);
      const tickets = await ticketsRes.json().catch(() => []);

      // Count users by role with safety check
      const usersByRole = Array.isArray(users) ? users.reduce((acc, user) => {
        if (user && user.role) {
          acc[user.role] = (acc[user.role] || 0) + 1;
        }
        return acc;
      }, {}) : {};

      // Calculate total expenses with safety check
      const totalExpenses = Array.isArray(expenses) ? expenses.reduce((sum, expense) => {
        return sum + (expense && typeof expense.amount === 'number' ? expense.amount : 0);
      }, 0) : 0;

      setStats({
        totalUsers: Array.isArray(users) ? users.length : 0,
        totalDoctors: Array.isArray(doctors) ? doctors.length : 0,
        totalChemists: Array.isArray(chemists) ? chemists.length : 0,
        totalStockists: Array.isArray(stockists) ? stockists.length : 0,
        totalVisits: Array.isArray(visits) ? visits.length : 0,
        totalExpenses: totalExpenses,
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        totalTickets: Array.isArray(tickets) ? tickets.length : 0,
        usersByRole: usersByRole,
        recentActivities: [
          ...(Array.isArray(visits) ? visits.slice(-5).map(v => ({ type: 'visit', data: v || {} })) : []),
          ...(Array.isArray(expenses) ? expenses.slice(-3).map(e => ({ type: 'expense', data: e || {} })) : []),
          ...(Array.isArray(orders) ? orders.slice(-3).map(o => ({ type: 'order', data: o || {} })) : [])
        ].slice(-10)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values in case of error
      setStats({
        totalUsers: 0,
        totalDoctors: 0,
        totalChemists: 0,
        totalStockists: 0,
        totalVisits: 0,
        totalExpenses: 0,
        totalOrders: 0,
        totalTickets: 0,
        usersByRole: {},
        recentActivities: []
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend, isCurrency = false }) => {
    // Ensure value is a valid number and handle edge cases
    const displayValue = loading ? '...' : 
      (isCurrency ? formatCurrency(value) : formatNumber(value));

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{displayValue}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center">
            <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500">{trend}</span>
          </div>
        )}
      </div>
    );
  };

  const RoleDistributionChart = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FiBarChart2 className="mr-2" />
        Users by Role
      </h3>
      <div className="space-y-3">
        {Object.entries(stats.usersByRole).map(([role, count]) => (
          <div key={role} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">{role}</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-800 w-8">{count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RecentActivities = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FiActivity className="mr-2" />
        Recent Activities
      </h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {stats.recentActivities.map((activity, index) => (
          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {activity.type === 'visit' && 'New doctor visit scheduled'}
                {activity.type === 'expense' && 'New expense recorded'}
                {activity.type === 'order' && 'New order placed'}
              </p>
              <p className="text-xs text-gray-500">
                {activity.data.createdAt ? new Date(activity.data.createdAt).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>
        ))}
        {stats.recentActivities.length === 0 && (
          <p className="text-gray-500 text-center py-4">No recent activities</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 rounded-xl shadow-lg text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome Back, Admin!</h1>
        <p className="text-indigo-100 text-lg">Here's an overview of your platform performance and activities.</p>
        <div className="mt-4 flex items-center text-indigo-200">
          <FiCalendar className="mr-2" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="text-blue-600"
          subtitle="Registered users"
          trend="+12% from last month"
        />
        <StatCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon={FiUserCheck}
          color="text-green-600"
          subtitle="Active doctors"
          trend="+8% from last month"
        />
        <StatCard
          title="Total Visits"
          value={stats.totalVisits}
          icon={FiMapPin}
          color="text-purple-600"
          subtitle="Scheduled visits"
          trend="+15% from last month"
        />
        <StatCard
          title="Total Expenses"
          value={stats.totalExpenses}
          icon={FiDollarSign}
          color="text-red-600"
          subtitle="Total amount"
          trend="+5% from last month"
          isCurrency={true}
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Chemists"
          value={stats.totalChemists}
          icon={FlaskConical}
          color="text-teal-600"
          subtitle="Registered chemists"
        />
        <StatCard
          title="Stockists"
          value={stats.totalStockists}
          icon={Truck}
          color="text-orange-600"
          subtitle="Active stockists"
        />
        <StatCard
          title="Orders"
          value={stats.totalOrders}
          icon={FiTrendingUp}
          color="text-indigo-600"
          subtitle="Total orders"
        />
        <StatCard
          title="Support Tickets"
          value={stats.totalTickets}
          icon={FiActivity}
          color="text-pink-600"
          subtitle="Raised tickets"
        />
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoleDistributionChart />
        <RecentActivities />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
            <FiUsers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-blue-600">Add User</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <FiUserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-600">Add Doctor</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <FiMapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-purple-600">Track Visits</span>
          </button>
          <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-center transition-colors">
            <FiDollarSign className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-red-600">View Expenses</span>
          </button>
        </div>
      </div>
    </div>
  );
}
