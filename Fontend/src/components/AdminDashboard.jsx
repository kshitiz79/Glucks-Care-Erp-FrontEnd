// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  FiHome,
  FiUser,
  FiTrendingUp,
  FiCalendar,

  FiDollarSign,

  FiFolderMinus,
  FiBox,
  FiMenu,
  FiUserPlus,
  FiMapPin,
  FiUsers, 
} from 'react-icons/fi';
import { ImFileOpenoffice } from 'react-icons/im';
import { DiTravis } from 'react-icons/di';
import { FaJediOrder } from 'react-icons/fa';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-b from-blue-600 to-indigo-700 ">
          <h2 className="text-2xl font-extrabold text-white drop-shadow-md">
            Admin Dashboard
          </h2>
        </div>
        <nav className="p-6 text-lg">
          <ul className="space-y-4">
            {[
              { to: '/admin-dashboard', icon: FiHome, label: 'Dashboard' },
              { to: '/admin-dashboard/create-user', icon: FiUserPlus, label: 'Create User' },
              { to: '/admin-dashboard/head-office', icon: ImFileOpenoffice, label: 'Add HeadOffice' },
              { to: '/admin-dashboard/all-user', icon: FiUsers, label: 'All User' },
              { to: '/admin-dashboard/user-tracker', icon: FiMapPin, label: 'User tracker' },
              { to: '/admin-dashboard/add-pdf', icon: FiFolderMinus, label: 'Add Pdf & Files' },
              { to: '/admin-dashboard/all-pdf', icon: FiFolderMinus, label: 'All Pdf & Files' },
              { to: '/admin-dashboard/add-doctor', icon: FiUser, label: 'Add Doctors' },
              { to: '/admin-dashboard/sales', icon: FiTrendingUp, label: 'Sales Activity' },
              { to: '/admin-dashboard/doctor-visiting', icon: DiTravis, label: 'Doctor Visiting' },
              { to: '/admin-dashboard/add-products', icon: FiBox, label: 'Product' },
              { to: '/admin-dashboard/admin-expenses', icon: FiDollarSign, label: 'expences' },
              { to: '/admin-dashboard/orders', icon: FaJediOrder, label: 'Order' },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2 hover:shadow-md"
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
        <header className="bg-white shadow-lg p-4 flex items-center justify-between md:justify-end ">
          <button
            className="text-gray-600 md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={28} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 hidden md:block mr-auto md:ml-8 drop-shadow-md">
            Welcome Admin
          </h1>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
