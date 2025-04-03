import React, { useState, useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  FiHome,
  FiUser,
  FiTrendingUp,
  FiCalendar,
  FiShoppingCart,
  FiDollarSign,
  FiFileText,
  FiFolderMinus,
  FiMenu,
  FiSearch,
  FiBell,
  FiGrid,
  FiMoon,
  FiChevronDown,
} from 'react-icons/fi';
import logo from './../../public/logo.png';
import { AuthContext } from './../context/AuthContext';
import { BsFileEarmark, BsFileImage, BsPostcard } from 'react-icons/bs';
import { SlSocialInstagram } from 'react-icons/sl';

export default function MrDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Get the logged-in user's data from AuthContext
  const { user } = useContext(AuthContext);

  const menuItems = [
    { to: '/mr-dashboard', icon: FiHome, label: 'Dashboard', exact: true },
    { to: '/mr-dashboard/pdf-files', icon: FiFolderMinus, label: 'Pdf & Files' },
    { to: '/mr-dashboard/brochers-img', icon: BsFileEarmark, label: 'Brochure' },
    { to: '/mr-dashboard/promotional-img', icon: BsFileImage, label: 'Promotion Images' },
    { to: '/mr-dashboard/daily-img', icon: SlSocialInstagram, label: 'Daily Post' },
    { to: '/mr-dashboard/add-doctor', icon: FiUser, label: 'Add Doctors' },
    { to: '/mr-dashboard/sales-activity', icon: FiTrendingUp, label: 'Sales Activity' },
    { to: '/mr-dashboard/doctor-visiting', icon: FiCalendar, label: 'Doctor Visiting' },
    { to: '/mr-dashboard/add-products', icon: FiShoppingCart, label: 'Product' },
    { to: '/mr-dashboard/order', icon: FiDollarSign, label: 'Order' },
    { to: '/mr-dashboard/expences', icon: FiFileText, label: 'Expenses' },
    { to: '/mr-dashboard/reports', icon: FiFileText, label: 'Reports' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* SIDEBAR */}
      <aside
        className={`
          w-72 bg-white overflow-y-auto fixed z-10 inset-y-0 left-0
          transform transition-all duration-500 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="border-b flex items-center p-6 px-10">
          <img src={logo} className="w-36 mt-5" alt="Logo" />
        </div>
        <nav className="p-6 text-lg">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.exact || false}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-all duration-300 transform ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 translate-x-2'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-2 hover:shadow-md'
                    }`
                  }
                >
                  <item.icon className="mr-3 text-xl" />
                  <span>{item.label}</span>
                </NavLink>
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
        <header className="bg-white p-4 flex items-center justify-between shadow-md">
          {/* Left Side: Logo & Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-indigo-700">
              Hi! {user ? user.name : 'Loading...'}
            </h1>
          </div>

          {/* Right Side: Icons & Profile */}
          <div className="flex items-center space-x-6">
            <FiSearch className="text-gray-600 cursor-pointer" size={22} />
            <FiGrid className="text-gray-600 cursor-pointer" size={22} />
            <FiMoon className="text-gray-600 cursor-pointer" size={22} />
            <FiBell className="text-gray-600 cursor-pointer" size={22} />

            <div className="relative">
            <button
  onClick={() => setIsProfileOpen(!isProfileOpen)}
  className="flex items-center space-x-2 bg-white p-2 rounded-lg hover:bg-gray-100 transition"
>
<div className="flex items-center justify-center w-10 h-10 bg-sky-100 rounded-full">
  <FiUser className="w-5 h-5 text-sky-500" />
</div>

  <FiChevronDown className="text-gray-600" />
</button>

              {/* Profile Dropdown Content */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                  <FiUser className="w-10 h-10 text-gray-600" />
                    <div>
                      <p className="text-lg font-semibold">{user.name }</p>
                      <p className="text-sm text-gray-500">
                        { user.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.phone }
                      </p>
                    </div>
                  </div>
                  <hr className="my-3" />
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-gray-700">
                    Profile Settings
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-red-500">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
