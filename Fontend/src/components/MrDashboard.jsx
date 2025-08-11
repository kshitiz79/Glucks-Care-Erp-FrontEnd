import React, { useState, useContext, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiUserPlus,
  FiTrendingUp,
  FiCalendar,
  FiShoppingCart,
  FiDollarSign,
  FiFileText,
  FiSearch,
  FiBell,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiMapPin,
  FiBookOpen,
  FiPackage,
  FiBarChart2,
  FiUser,
  FiLogOut,
  FiSettings,
  FiMenu,
  FiX
} from 'react-icons/fi';
import logo from './../../public/logo.png';
import { AuthContext } from '../context/AuthContext';
import { BsFileImage } from 'react-icons/bs';
import { SlSocialInstagram } from 'react-icons/sl';
import { TicketCheckIcon } from 'lucide-react';
import BASE_URL from '../BaseUrl/baseUrl';

export default function MrDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);



  const menuItems = [
    {
      category: 'Overview',
      items: [
        { to: '/mr-dashboard', icon: FiHome, label: 'Dashboard', exact: true },
        { to: '/mr-dashboard/reports', icon: FiBarChart2, label: 'Reports' },
      ]
    },
    {
      category: 'Content Management',
      items: [
        { to: '/mr-dashboard/pdf-files', icon: FiFileText, label: 'PDF & Files' },
        { to: '/mr-dashboard/brochers-img', icon: FiBookOpen, label: 'Brochures' },
        { to: '/mr-dashboard/promotional-img', icon: BsFileImage, label: 'Promotional Images' },
        { to: '/mr-dashboard/daily-img', icon: SlSocialInstagram, label: 'Daily Posts' },
      ]
    },
    {
      category: 'Client Management',
      items: [
        { to: '/mr-dashboard/add-doctor', icon: FiUserPlus, label: 'Add Doctors' },
        { to: '/mr-dashboard/doctor-visiting', icon: FiCalendar, label: 'Doctor Visits' },
        { to: '/mr-dashboard/add-chemist', icon: FiUserPlus, label: 'Add Chemists' },
        { to: '/mr-dashboard/chemist-visit', icon: FiMapPin, label: 'Chemist Visits' },
        { to: '/mr-dashboard/add-stockist', icon: FiUserPlus, label: 'Add Stockists' },
        { to: '/mr-dashboard/stockist-visit', icon: FiMapPin, label: 'Stockist Visits' },
      ]
    },
    {
      category: 'Business Operations',
      items: [
        { to: '/mr-dashboard/sales-activity', icon: FiTrendingUp, label: 'Sales Activity' },
        { to: '/mr-dashboard/add-products', icon: FiPackage, label: 'Products' },
        { to: '/mr-dashboard/order', icon: FiShoppingCart, label: 'Orders' },
        { to: '/mr-dashboard/expences', icon: FiDollarSign, label: 'Expenses' },
        { to: '/mr-dashboard/rase-ticket', icon: TicketCheckIcon, label: 'Support Tickets' },
      ]
    }
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`${BASE_URL}/api/locations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              latitude,
              longitude,
              userName: user ? user.name : undefined,
              userId: user ? user.id : undefined
            })
          })
            .then(res => res.json())
            .then(data => console.log('Location sent:', data))
            .catch(err => console.error('Error sending location:', err));
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [user]);

  const filteredMenuItems = menuItems.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`${BASE_URL}/api/notifications/count?userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch unread count');
        }

        const data = await response.json();
        setUnreadCount(data.count || 0);
      } catch (err) {
        console.error('Error fetching unread count:', err);
      }
    };

    fetchUnreadCount();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'}`}>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
      >
        <FiMenu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
          overflow-y-auto fixed z-30 inset-y-0 left-0 border-r
          transform transition-all duration-300 ease-in-out shadow-2xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 
        `}
      >
        {/* Header with Logo and Close Button */}
        <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between p-6`}>
          <img src={logo} className="w-36" alt="Company Logo" />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Search in sidebar */}
        <div className="p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 pb-4 space-y-6">
          {filteredMenuItems.map((category) => (
            <div key={category.category}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                {category.category}
              </h3>
              <ul className="space-y-1">
                {category.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.exact || false}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center p-3 rounded-xl transition-all duration-200 group ${isActive
                          ? `${darkMode ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-blue-100 shadow-lg' : 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md'} font-medium`
                          : `${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`
                        }`
                      }
                    >
                      <item.icon className="mr-3 text-lg flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Profile Card */}
        <div className={`p-4 mt-auto border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${darkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                } shadow-lg`}>
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name || 'User'}
                </p>
                <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Medical Representative
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
          } backdrop-blur-md border-b px-6 py-4`}>
          <div className="flex items-center justify-between">
            {/* Welcome Section */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent`}>
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="md:hidden">
                <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Dashboard
                </h1>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center space-x-3">
              {/* Global Search */}
              <div className="hidden lg:block relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className={`pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-200 w-80 ${darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${darkMode
                    ? 'text-yellow-400 hover:bg-gray-700 bg-gray-700/50'
                    : 'text-gray-600 hover:bg-gray-100 bg-gray-50'
                  }`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Notifications */}
              <button
                className={`relative p-2.5 rounded-xl transition-all duration-200 ${darkMode ? 'hover:bg-gray-700 bg-gray-700/50' : 'hover:bg-gray-100 bg-gray-50'
                  }`}
                onClick={() => navigate('/mr-dashboard/get-notification')}
                title="Notifications"
              >
                <FiBell size={20} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full shadow-lg animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${darkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    } shadow-lg`}>
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user?.name || 'User'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Medical Rep
                    </p>
                  </div>
                  <FiChevronDown className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''
                    } ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className={`absolute right-0 mt-2 w-64 shadow-2xl rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } border overflow-hidden backdrop-blur-md`}>
                    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${darkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                          } shadow-lg`}>
                          <FiUser className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user?.name || 'User'}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/profile-settings');
                        }}
                        className={`flex items-center w-full px-4 py-3 text-left transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                      >
                        <FiSettings className="mr-3" />
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-4 py-3 text-left transition-colors ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-50 text-red-600'
                          }`}
                      >
                        <FiLogOut className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="p-6">
            <div className={`rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border shadow-xl backdrop-blur-sm`}>
              <div className="p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}








