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
 
  FiMoon,
  FiChevronDown,
  FiMapPin,
  FiBookOpen,
  FiPackage,
  FiBarChart2,
  FiUser,
  FiLogOut,
  FiSettings
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
    { to: '/mr-dashboard', icon: FiHome, label: 'Dashboard', exact: true },
    { to: '/mr-dashboard/pdf-files', icon: FiFileText, label: 'Pdf & Files' },
    { to: '/mr-dashboard/brochers-img', icon: FiBookOpen, label: 'Brochure' },
    { to: '/mr-dashboard/promotional-img', icon: BsFileImage, label: 'Promotion Images' },
    { to: '/mr-dashboard/daily-img', icon: SlSocialInstagram, label: 'Daily Post' },
    { to: '/mr-dashboard/add-doctor', icon: FiUserPlus, label: 'Add Doctors' },
    { to: '/mr-dashboard/doctor-visiting', icon: FiCalendar, label: 'Doctor Visiting' },
    { to: '/mr-dashboard/add-chemist', icon: FiUserPlus, label: 'Add Chemist' },
    { to: '/mr-dashboard/chemist-visit', icon: FiMapPin, label: 'Visit Chemist' },
    { to: '/mr-dashboard/add-stockist', icon: FiUserPlus, label: 'Add Stockist' },
    { to: '/mr-dashboard/stockist-visit', icon: FiMapPin, label: 'Stockist Visiting' },
    { to: '/mr-dashboard/sales-activity', icon: FiTrendingUp, label: 'Sales Activity' },
    { to: '/mr-dashboard/add-products', icon: FiPackage, label: 'Product' },
    { to: '/mr-dashboard/order', icon: FiShoppingCart, label: 'Order' },
    { to: '/mr-dashboard/expences', icon: FiDollarSign, label: 'Expenses' },
    { to: '/mr-dashboard/rase-ticket', icon: TicketCheckIcon, label: 'Rase Ticket' },
    { to: '/mr-dashboard/reports', icon: FiBarChart2, label: 'Reports' },
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

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'}`}>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          w-72 ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-y-auto fixed z-30 inset-y-0 left-0
          transform transition-all duration-300 ease-in-out shadow-xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 
        `}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 flex items-center p-6 px-8">
          <img src={logo} className="w-36" alt="Logo" />
        </div>
        
        {/* Search in sidebar for mobile */}
        <div className="p-4 md:hidden">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.exact || false}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? `${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-600'} font-medium`
                        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                    }`
                  }
                >
                  <item.icon className="mr-3 text-lg flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User info in sidebar */}
        <div className={`p-4 mt-auto border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
              <FiUser className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Medical Representative</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 flex items-center justify-between shadow-sm`}>
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Welcome back, {user ? user.name : 'User'}!
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search bar */}
            <div className="hidden md:block relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className={`pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-blue-500 w-64`}
              />
            </div>
            
            {/* Action buttons */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiMoon size={20} />
            </button>
            
            <button
          className="relative p-2 hover:bg-gray-100 rounded-full"
          onClick={() => navigate('/mr-dashboard/get-notification')}
        >
          <FiBell size={24} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                  <FiUser className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <FiChevronDown className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
              
              {isProfileOpen && (
                <div className={`absolute right-0 mt-2 w-56 shadow-lg rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/profile-settings');
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      <FiSettings className="mr-3" />
                      Profile Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className={`flex items-center w-full px-4 py-2 text-left ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
                    >
                      <FiLogOut className="mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className={`flex-1 p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}








