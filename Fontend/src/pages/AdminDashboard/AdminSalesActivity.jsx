import React, { useState, useEffect, useMemo } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { fetchAllSales } from '../../api/salesApi';

const AdminSalesActivity = () => {
  const [sales, setSales] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSales = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllSales();
        setSales(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadSales();
  }, []);

  const salesByUser = useMemo(() => {
    const grouped = sales.reduce((acc, sale) => {
      const key = sale.user?._id ?? sale.userName;
      if (!acc[key]) {
        acc[key] = {
          user: sale.user,
          userName: sale.user?.name ?? sale.userName,
          sales: [],
        };
      }
      acc[key].sales.push(sale);
      return acc;
    }, {});

    Object.values(grouped).forEach((userData) => {
      userData.sales.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    });

    return grouped;
  }, [sales]);

  const filteredUsers = useMemo(() => {
    return Object.keys(salesByUser).filter((key) =>
      salesByUser[key].userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [salesByUser, searchTerm]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-indigo-600">📈</span> Admin Sales Dashboard
          </h2>
          <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search reps..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* User Cards */}
          <div className="bg-white rounded-xl shadow-md p-6 h-[calc(100vh-200px)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Sales Representatives</h3>
             
            </div>
            {filteredUsers.length === 0 ? (
              <div className="flex-grow flex items-center justify-center text-gray-500">
                <p>No matching representatives found</p>
              </div>
            ) : (
              <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredUsers.map((userKey) => {
                  const userData = salesByUser[userKey];
                  const latestSale = userData.sales[0];
                  return (
                    <motion.div
                      key={userKey}
                      onClick={() => setSelectedUser(userKey)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`cursor-pointer p-4 bg-gray-50 rounded-lg border-2 transition-all duration-200 mb-4 last:mb-0 ${
                        selectedUser === userKey
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-100 hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {userData.userName}
                        </h4>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {userData.sales.length} Sales
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Last: {formatDate(latestSale.dateTime)}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {latestSale.callNotes || 'No recent notes'}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sales Details */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6 min-h-[calc(100vh-200px)] flex flex-col">
            {selectedUser ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-grow"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Activity for {salesByUser[selectedUser].userName}
                  </h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium"
                  >
                    <XMarkIcon className="h-5 w-5 mr-1" />
                    <span className="md:hidden">Close</span>
                    <span className="hidden md:inline">Clear Selection</span>
                  </button>
                </div>
                <div className="space-y-4 overflow-y-auto h-[calc(100vh-300px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {salesByUser[selectedUser].sales.map((sale) => (
                    <motion.div
                      key={sale._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="grid sm:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Doctor</label>
                          <p className="text-base font-medium text-gray-900 truncate">
                            {sale.doctorName || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Date</label>
                          <p className="text-base font-medium text-gray-900">{formatDate(sale.dateTime)}</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Notes</label>
                        <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-3">
                          {sale.callNotes || 'No notes available'}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Sales Rep:</span>{' '}
                        {sale.salesRep || 'N/A'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-pulse" />
                  <p className="text-lg font-medium">Select a sales representative to view details</p>
                  <p className="text-sm text-gray-400 mt-2">Click a card on the left to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSalesActivity;