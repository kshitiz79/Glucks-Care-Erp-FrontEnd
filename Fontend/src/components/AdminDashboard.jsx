// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
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
  FiChevronDown
} from 'react-icons/fi';
import { FlaskConical, TicketCheck, Truck } from 'lucide-react';
import { ImFileOpenoffice } from 'react-icons/im';
import { DiTravis } from 'react-icons/di';
import { FaJediOrder } from 'react-icons/fa';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


const navigate = useNavigate();




  const menuGroups = [
    {
      title: 'User Management',
      items: [
        { to: '/admin-dashboard/create-user', icon: FiUserPlus, label: 'Create User' },
        { to: '/admin-dashboard/all-user', icon: FiUsers, label: 'All Users' },
        { to: '/admin-dashboard/user-tracker', icon: FiMapPin, label: 'User Tracker' }
      ]
    },
    {
      title: 'Facilities',
      items: [
        { to: '/admin-dashboard/head-office', icon: ImFileOpenoffice, label: 'Add HeadOffice' },
        { to: '/admin-dashboard/add-doctor', icon: FiUser, label: 'Add Doctors' }
      ]
    },
    {
      title: 'Visits & Activities',
      items: [
        { to: '/admin-dashboard/doctor-visiting', icon: DiTravis, label: 'Doctor Visiting' },
        { to: '/admin-dashboard/chemist-visiting', icon: FlaskConical, label: 'Chemist Visiting' },
        { to: '/admin-dashboard/stockist-visiting', icon: Truck, label: 'Stockist Visiting' },
        { to: '/admin-dashboard/sales', icon: FiTrendingUp, label: 'Sales Activity' }
      ]
    },
    {
      title: 'Content & Resources',
      items: [
        { to: '/admin-dashboard/add-pdf', icon: FiFolderMinus, label: 'Add PDF & Files' },
        { to: '/admin-dashboard/all-pdf', icon: FiFolderMinus, label: 'All PDF & Files' },
        { to: '/admin-dashboard/add-products', icon: FiBox, label: 'Products' }
      ]
    },
    {
      title: 'Financials',
      items: [
        { to: '/admin-dashboard/admin-expenses', icon: FiDollarSign, label: 'Expenses' },
        { to: '/admin-dashboard/orders', icon: FaJediOrder, label: 'Orders' },
        { to: '/admin-dashboard/raise-tickets', icon: TicketCheck, label: 'Raised Tickets' }
      ]
    }
  ];

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
        <div className="p-6 border-b border-gray-200 bg-gradient-to-b from-blue-600 to-indigo-700">
          <h2 className="text-2xl font-extrabold text-white drop-shadow-md">
            Admin Dashboard
          </h2>
        </div>
        <nav className="p-4">
          {/* Dashboard Link */}
          <div className="mb-6">
            <Link
              to="/admin-dashboard"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiHome className="mr-3 text-xl" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>

          {/* Menu Groups */}
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
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
            </div>
          ))}
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
              Welcome Admin
            </h1>
          </div>

          {/* Header Right Section */}
          <div className="flex items-center space-x-6">



          <button
      className="relative p-2 hover:bg-gray-100 rounded-full"
      onClick={() => navigate('/admin-dashboard/send-notification')}
    >
      <FiBell size={24} className="text-gray-600" />
      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
    </button>

            <div className="relative">
              <button 
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">A</span>
                </div>
                <FiChevronDown className={`text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Admin User</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                  <div className="p-1">
                    <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md text-left">
                      My Profile
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md text-left">
                      Settings
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md text-left">
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