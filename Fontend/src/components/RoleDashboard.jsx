// src/components/RoleDashboard.jsx
import React, { useState, useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FiHome,
  FiUser,
  FiTrendingUp,

  FiFolderMinus,
  FiBox,
  FiMenu,

  FiMapPin,
  FiUsers,
  FiBell,
  FiChevronDown,
  FiBarChart2,
  FiSettings,
  FiFileText,

} from 'react-icons/fi';

export default function RoleDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getRoleColor = (role) => {
    const colors = {
      'Super Admin': 'from-red-600 to-red-700',
      'Admin': 'from-blue-600 to-indigo-700',
      'Opps Team': 'from-green-600 to-green-700',
      'National Head': 'from-purple-600 to-purple-700',
      'State Head': 'from-yellow-600 to-orange-700',
      'Zonal Manager': 'from-teal-600 to-teal-700',
      'Area Manager': 'from-pink-600 to-pink-700',
      'Manager': 'from-indigo-600 to-blue-700',
      'User': 'from-gray-600 to-gray-700'
    };
    return colors[role] || 'from-gray-600 to-gray-700';
  };

  const getRoleMenuItems = (role) => {
    const baseItems = [
      { to: `/${role.toLowerCase().replace(' ', '-')}-dashboard`, icon: FiHome, label: 'Dashboard' },
      { to: `/${role.toLowerCase().replace(' ', '-')}-dashboard/profile`, icon: FiUser, label: 'My Profile' },
      { to: `/${role.toLowerCase().replace(' ', '-')}-dashboard/reports`, icon: FiBarChart2, label: 'Reports' },
      { to: `/${role.toLowerCase().replace(' ', '-')}-dashboard/settings`, icon: FiSettings, label: 'Settings' }
    ];

    // Add role-specific items
    const roleSpecificItems = {
      'Super Admin': [
        { to: '/super-admin-dashboard/system-management', icon: FiSettings, label: 'System Management' },
        { to: '/super-admin-dashboard/all-admins', icon: FiUsers, label: 'All Admins' },
        { to: '/super-admin-dashboard/audit-logs', icon: FiFileText, label: 'Audit Logs' }
      ],
      'Opps Team': [
        { to: '/opps-team-dashboard/operations', icon: FiTrendingUp, label: 'Operations' },
        { to: '/opps-team-dashboard/logistics', icon: FiBox, label: 'Logistics' },
        { to: '/opps-team-dashboard/inventory', icon: FiFolderMinus, label: 'Inventory' }
      ],
      'National Head': [
        { to: '/national-head-dashboard/national-overview', icon: FiBarChart2, label: 'National Overview' },
        { to: '/national-head-dashboard/state-performance', icon: FiTrendingUp, label: 'State Performance' },
        { to: '/national-head-dashboard/strategic-planning', icon: FiFileText, label: 'Strategic Planning' }
      ],
      'State Head': [
        { to: '/state-head-dashboard/state-overview', icon: FiBarChart2, label: 'State Overview' },
        { to: '/state-head-dashboard/zonal-performance', icon: FiTrendingUp, label: 'Zonal Performance' },
        { to: '/state-head-dashboard/team-management', icon: FiUsers, label: 'Team Management' }
      ],
      'Zonal Manager': [
        { to: '/zonal-manager-dashboard/zone-overview', icon: FiBarChart2, label: 'Zone Overview' },
        { to: '/zonal-manager-dashboard/area-performance', icon: FiTrendingUp, label: 'Area Performance' },
        { to: '/zonal-manager-dashboard/field-operations', icon: FiMapPin, label: 'Field Operations' }
      ],
      'Area Manager': [
        { to: '/area-manager-dashboard/area-overview', icon: FiBarChart2, label: 'Area Overview' },
        { to: '/area-manager-dashboard/team-performance', icon: FiUsers, label: 'Team Performance' },
        { to: '/area-manager-dashboard/field-visits', icon: FiMapPin, label: 'Field Visits' }
      ],
      'Manager': [
        { to: '/manager-dashboard/team-overview', icon: FiUsers, label: 'Team Overview' },
        { to: '/manager-dashboard/performance-tracking', icon: FiTrendingUp, label: 'Performance Tracking' },
        { to: '/manager-dashboard/task-management', icon: FiFileText, label: 'Task Management' }
      ]
    };

    return [...baseItems, ...(roleSpecificItems[role] || [])];
  };

  const menuItems = getRoleMenuItems(user?.role || 'User');

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* SIDEBAR */}
      <aside
        className={`
          w-72 bg-white shadow-2xl overflow-y-auto fixed z-50 inset-y-0 left-0
          transform transition-all duration-500 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:shadow-[10px_0_25px_rgba(0,0,0,0.1)]
        `}
      >
        <div className={`p-6 border-b border-gray-200 bg-gradient-to-b ${getRoleColor(user?.role || 'User')}`}>
          <h2 className="text-2xl font-extrabold text-white drop-shadow-md">
            {user?.role || 'User'} Dashboard
          </h2>
          <p className="text-white/80 text-sm mt-1">{user?.name || 'Welcome'}</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="mr-3 text-xl" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* FIXED HEADER */}
        <header className="sticky top-0 bg-white shadow-lg p-4 flex items-center justify-between z-30">
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-600 md:hidden p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu size={28} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 drop-shadow-md">
              Welcome {user?.role || 'User'}
            </h1>
          </div>

          {/* Header Right Section */}
          <div className="flex items-center space-x-6">
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <FiBell size={24} className="text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button 
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <FiChevronDown className={`text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                    <p className="text-xs text-blue-600 font-medium">{user?.role || 'User'}</p>
                  </div>
                  <div className="p-1">
                    <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md text-left">
                      My Profile
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md text-left">
                      Settings
                    </button>
                    <button 
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md text-left"
                      onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/');
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}