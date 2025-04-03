// src/pages/DashboardHome.jsx
import React from 'react';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome / Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">Welcome Back, Admin!</h1>
        <p className="text-gray-600">Here is an overview of your platform performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Revenue</h2>
          <p className="text-3xl font-bold text-blue-600">₹98,450</p>
          <p className="text-sm text-gray-500">Monthly revenue</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
          <p className="text-3xl font-bold text-green-600">78</p>
          <p className="text-sm text-gray-500">Ongoing this month</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          <p className="text-3xl font-bold text-purple-600">2,640</p>
          <p className="text-sm text-gray-500">New sign-ups</p>
        </div>
      </div>

      {/* Chart / Graph Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          {/* Replace with a chart library component, e.g., Recharts or Chart.js */}
          <p>Chart Placeholder</p>
        </div>
      </div>
      
    </div>
  );
}
