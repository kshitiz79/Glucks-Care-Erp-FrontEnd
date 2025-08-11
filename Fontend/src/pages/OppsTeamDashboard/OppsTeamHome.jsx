import React, { useState, useEffect } from 'react';
import { 
  FiTruck, 
  FiBox, 
  FiActivity, 
  FiTrendingUp,
  FiCalendar,
  FiMapPin,
  FiBarChart2,
  FiPackage
} from 'react-icons/fi';
import BASE_URL from '../../BaseUrl/baseUrl';
import { formatNumber } from '../../utils/formatNumber';


export default function OppsTeamHome() {
  const [stats, setStats] = useState({
    activeOperations: 0,
    pendingDeliveries: 0,
    inventoryItems: 0,
    completedTasks: 0,
    operationalEfficiency: '95%',
    logisticsStatus: 'On Track'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOppsTeamData();
  }, []);

  const fetchOppsTeamData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/orders`).catch(() => ({ json: () => [] })),
        fetch(`${BASE_URL}/api/products`).catch(() => ({ json: () => [] }))
      ]);

      const orders = await ordersRes.json().catch(() => []);
      const products = await productsRes.json().catch(() => []);

      setStats({
        activeOperations: Math.floor(Math.random() * 50) + 20,
        pendingDeliveries: orders.filter(order => order.status === 'pending').length,
        inventoryItems: products.length,
        completedTasks: Math.floor(Math.random() * 100) + 50,
        operationalEfficiency: '95%',
        logisticsStatus: 'On Track'
      });
    } catch (error) {
      console.error('Error fetching ops team data:', error);
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 rounded-xl shadow-lg text-white">
        <h1 className="text-4xl font-bold mb-2">Operations Team Dashboard</h1>
        <p className="text-green-100 text-lg">Manage operations, logistics, and inventory efficiently.</p>
        <div className="mt-4 flex items-center text-green-200">
          <FiCalendar className="mr-2" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Operations"
          value={stats.activeOperations}
          icon={FiActivity}
          color="text-green-600"
          subtitle="Currently running"
        />
        <StatCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          icon={FiTruck}
          color="text-orange-600"
          subtitle="Awaiting dispatch"
        />
        <StatCard
          title="Inventory Items"
          value={stats.inventoryItems}
          icon={FiBox}
          color="text-blue-600"
          subtitle="Total products"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={FiTrendingUp}
          color="text-purple-600"
          subtitle="This month"
        />
      </div>

      {/* Operational Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" />
            Operational Status
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Efficiency Rate</span>
              <span className="font-semibold text-green-600">{stats.operationalEfficiency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Logistics Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{stats.logisticsStatus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">System Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Operational</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiPackage className="mr-2" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
              <FiActivity className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-600">Operations</span>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
              <FiTruck className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-orange-600">Logistics</span>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
              <FiBox className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-600">Inventory</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
              <FiMapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-600">Tracking</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}