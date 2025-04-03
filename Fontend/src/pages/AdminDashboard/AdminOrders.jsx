import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminOrders = () => {
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5050/api/orders');
        const data = await response.json();
        if (Array.isArray(data)) {
          const groups = data.reduce((acc, order) => {
            const uid = order.user;
            if (!acc[uid]) {
              acc[uid] = {
                userId: uid,
                userName: order.userName || 'Unknown User',
                orders: [],
              };
            }
            acc[uid].orders.push(order);
            return acc;
          }, {});
          setGroupedOrders(Object.values(groups));
        } else {
          throw new Error(data.message || 'Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
        setGroupedOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
          <span className="font-semibold">Error:</span> {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 text-indigo-600 hover:underline font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-indigo-600">🛒</span> Admin Orders Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Review and manage order requests by user</p>
        </div>

        {/* Orders Grid */}
        {groupedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-gray-600 text-lg">No orders found</p>
            <p className="text-gray-500 mt-2">Check back later for new order requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupedOrders.map((group) => (
              <Link
                key={group.userId}
                to={`/admin-dashboard/orders/${group.userId}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100 
                           hover:shadow-xl transition-all duration-300 group transform 
                           hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {/* User Avatar */}
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xl shadow-sm">
                      {group.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                        {group.userName}
                      </h2>
                      <p className="text-sm text-gray-500">ID: {group.userId.slice(-6)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Order Requests</span>
                    <span className="text-lg font-semibold text-indigo-600">
                      {group.orders.length}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 flex items-center justify-end">
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                    Click to view details
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;