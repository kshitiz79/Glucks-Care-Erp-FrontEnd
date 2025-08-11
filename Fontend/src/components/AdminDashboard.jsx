// src/components/AdminDashboard.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FiHome,
  FiUser,
  FiTrendingUp,
  FiDollarSign,
  FiFolderMinus,
  FiBox,
  FiMenu,
  FiUserPlus,
  FiMapPin,
  FiUsers,
  FiBell,
  FiChevronDown,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiX,
  FiChevronRight,
  FiActivity,
  FiBarChart2
} from 'react-icons/fi';
import { FlaskConical, TicketCheck, Truck } from 'lucide-react';
import { ImFileOpenoffice } from 'react-icons/im';
import { DiTravis } from 'react-icons/di';
import { FaJediOrder } from 'react-icons/fa';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [notifications] = useState(3); // Mock notification count

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Initialize expanded groups
  useEffect(() => {
    const initialExpanded = {};
    menuGroups.forEach(group => {
      initialExpanded[group.title] = true;
    });
    setExpandedGroups(initialExpanded);
  }, []);

  const menuGroups = [
    {
      title: 'Overview',
      color: 'blue',
      items: [
        { to: '/admin-dashboard', icon: FiHome, label: 'Dashboard', description: 'Main overview and analytics' },
        { to: '/admin-dashboard/user-tracker', icon: FiActivity, label: 'Activity Monitor', description: 'Real-time user activities' }
      ]
    },
    {
      title: 'User Management',
      color: 'indigo',
      items: [
        { to: '/admin-dashboard/create-user', icon: FiUserPlus, label: 'Create User', description: 'Add new team members' },
        { to: '/admin-dashboard/all-user', icon: FiUsers, label: 'All Users', description: 'Manage existing users' },
        { to: '/admin-dashboard/managers', icon: FiUsers, label: 'Managers', description: 'View all managers' },
        { to: '/admin-dashboard/area-managers', icon: FiUsers, label: 'Area Managers', description: 'View all area managers' },
        { to: '/admin-dashboard/zonal-managers', icon: FiUsers, label: 'Zonal Managers', description: 'View all zonal managers' },
        { to: '/admin-dashboard/user-tracker', icon: FiMapPin, label: 'User Tracker', description: 'Track user locations' }
      ]
    },
    {
      title: 'Organization',
      color: 'purple',
      items: [
        { to: '/admin-dashboard/manage-states', icon: FiMapPin, label: 'States', description: 'Manage states and regions' },
        { to: '/admin-dashboard/head-office', icon: ImFileOpenoffice, label: 'Head Offices', description: 'Manage office locations' },
        { to: '/admin-dashboard/add-doctor', icon: FiUser, label: 'Doctors', description: 'Doctor management' },
        { to: '/admin-dashboard/add-stockist', icon: Truck, label: 'Stockists', description: 'Stockist management' },
        { to: '/admin-dashboard/add-chemist', icon: FlaskConical, label: 'Chemists', description: 'Chemist management' }
      ]
    },
    {
      title: 'Field Operations',
      color: 'green',
      items: [
        { to: '/admin-dashboard/doctor-visiting', icon: DiTravis, label: 'Doctor Visits', description: 'Track doctor visits' },
        { to: '/admin-dashboard/chemist-visiting', icon: FlaskConical, label: 'Chemist Visits', description: 'Monitor chemist visits' },
        { to: '/admin-dashboard/stockist-visiting', icon: Truck, label: 'Stockist Visits', description: 'Stockist visit tracking' },
        { to: '/admin-dashboard/sales', icon: FiTrendingUp, label: 'Sales Activity', description: 'Sales performance' }
      ]
    },
    {
      title: 'Resources',
      color: 'orange',
      items: [
        { to: '/admin-dashboard/add-pdf', icon: FiFolderMinus, label: 'Upload Files', description: 'Add documents and files' },
        { to: '/admin-dashboard/all-pdf', icon: FiFolderMinus, label: 'File Library', description: 'Browse all files' },
        { to: '/admin-dashboard/add-products', icon: FiBox, label: 'Products', description: 'Product catalog' }
      ]
    },
    {
      title: 'Financial',
      color: 'red',
      items: [
        { to: '/admin-dashboard/admin-expenses', icon: FiDollarSign, label: 'Expenses', description: 'Expense management' },
        { to: '/admin-dashboard/orders', icon: FaJediOrder, label: 'Orders', description: 'Order tracking' },
        { to: '/admin-dashboard/raise-tickets', icon: TicketCheck, label: 'Support Tickets', description: 'Customer support' }
      ]
    }
  ];

  const toggleGroup = (groupTitle) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  const filteredMenuGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  const isActiveRoute = (path) => {
    if (path === '/admin-dashboard') {
      return location.pathname === '/admin-dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* SIDEBAR */}
      <aside
        className={`
          w-80 bg-white shadow-xl border-r border-gray-200 overflow-y-auto fixed z-50 inset-y-0 left-0
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <FiBarChart2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                  <p className="text-xs text-gray-500">Management Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 pb-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 pb-6">
          {filteredMenuGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
              >
                <span className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${group.color === 'blue' ? 'bg-blue-500' :
                      group.color === 'indigo' ? 'bg-indigo-500' :
                        group.color === 'purple' ? 'bg-purple-500' :
                          group.color === 'green' ? 'bg-green-500' :
                            group.color === 'orange' ? 'bg-orange-500' :
                              group.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                  {group.title}
                </span>
                <FiChevronRight
                  className={`w-3 h-3 transition-transform duration-200 ${expandedGroups[group.title] ? 'rotate-90' : ''
                    }`}
                />
              </button>

              {expandedGroups[group.title] && (
                <ul className="mt-2 space-y-1">
                  {group.items.map((item) => {
                    const isActive = isActiveRoute(item.to);
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          className={`group flex items-center p-3 rounded-xl transition-all duration-200 ${isActive
                            ? `border-l-4 ${group.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-500' :
                              group.color === 'indigo' ? 'bg-indigo-50 text-indigo-700 border-indigo-500' :
                                group.color === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-500' :
                                  group.color === 'green' ? 'bg-green-50 text-green-700 border-green-500' :
                                    group.color === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-500' :
                                      group.color === 'red' ? 'bg-red-50 text-red-700 border-red-500' : 'bg-gray-50 text-gray-700 border-gray-500'
                            }`
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <div className={`p-2 rounded-lg mr-3 transition-colors ${isActive
                            ? `${group.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                              group.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                                group.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                  group.color === 'green' ? 'bg-green-100 text-green-600' :
                                    group.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                                      group.color === 'red' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                            }`
                            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                            }`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isActive ? `${group.color === 'blue' ? 'text-blue-900' :
                                group.color === 'indigo' ? 'text-indigo-900' :
                                  group.color === 'purple' ? 'text-purple-900' :
                                    group.color === 'green' ? 'text-green-900' :
                                      group.color === 'orange' ? 'text-orange-900' :
                                        group.color === 'red' ? 'text-red-900' : 'text-gray-900'
                              }` : 'text-gray-900'
                              }`}>
                              {item.label}
                            </p>
                            <p className={`text-xs truncate ${isActive ? `${group.color === 'blue' ? 'text-blue-600' :
                                group.color === 'indigo' ? 'text-indigo-600' :
                                  group.color === 'purple' ? 'text-purple-600' :
                                    group.color === 'green' ? 'text-green-600' :
                                      group.color === 'orange' ? 'text-orange-600' :
                                        group.color === 'red' ? 'text-red-600' : 'text-gray-600'
                              }` : 'text-gray-500'
                              }`}>
                              {item.description}
                            </p>
                          </div>
                          {isActive && (
                            <div className={`w-2 h-2 rounded-full ${group.color === 'blue' ? 'bg-blue-500' :
                                group.color === 'indigo' ? 'bg-indigo-500' :
                                  group.color === 'purple' ? 'bg-purple-500' :
                                    group.color === 'green' ? 'bg-green-500' :
                                      group.color === 'orange' ? 'bg-orange-500' :
                                        group.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                              }`}></div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center space-x-4">
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <FiMenu className="w-6 h-6 text-gray-600" />
                </button>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name || 'Admin'}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                {/* Quick Actions */}
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/admin-dashboard/create-user"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FiUserPlus className="w-4 h-4 inline mr-2" />
                    Add User
                  </Link>
                </div>

                {/* Notifications */}
                <button
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => navigate('/admin-dashboard/send-notification')}
                >
                  <FiBell className="w-6 h-6 text-gray-600" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                      <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
                    </div>
                    <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                            <p className="text-sm text-gray-500">{user?.email || 'admin@company.com'}</p>
                            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full mt-1">
                              {user?.role || 'Administrator'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                          <FiUser className="w-4 h-4 mr-3" />
                          My Profile
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                          <FiSettings className="w-4 h-4 mr-3" />
                          Settings
                        </button>
                        <div className="border-t border-gray-100 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <FiLogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}