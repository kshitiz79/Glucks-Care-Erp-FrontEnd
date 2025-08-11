import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllSales } from '../../api/salesApi';
import { 
  FiSearch, 
  FiX, 
  FiTrendingUp, 
  FiUsers, 
  FiCalendar, 
  FiFileText,
  FiActivity,
  FiBarChart2,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';

const AdminSalesActivity = () => {
  const [sales, setSales] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    loadSales();
  }, []);

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

  const getStats = () => {
    const totalSales = sales.length;
    const totalReps = Object.keys(salesByUser).length;
    const avgSalesPerRep = totalReps > 0 ? Math.round(totalSales / totalReps) : 0;
    const todaySales = sales.filter(sale => {
      const saleDate = new Date(sale.dateTime);
      const today = new Date();
      return saleDate.toDateString() === today.toDateString();
    }).length;

    return { totalSales, totalReps, avgSalesPerRep, todaySales };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiActivity className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadSales}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center mx-auto"
            >
              <FiRefreshCw className="mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                  <FiTrendingUp className="w-6 h-6 text-white" />
                </div>
                Sales Activity Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Monitor and analyze sales team performance</p>
            </div>
            <button
              onClick={loadSales}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalSales}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiBarChart2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sales Reps</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalReps}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiUsers className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg per Rep</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.avgSalesPerRep}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FiActivity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.todaySales}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sales representatives..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white appearance-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sales Representatives List */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FiUsers className="mr-3 text-indigo-600" />
                Sales Representatives
                <span className="ml-auto bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                  {filteredUsers.length}
                </span>
              </h3>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No representatives found</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredUsers.map((userKey) => {
                    const userData = salesByUser[userKey];
                    const latestSale = userData.sales[0];
                    return (
                      <motion.div
                        key={userKey}
                        onClick={() => setSelectedUser(userKey)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedUser === userKey
                            ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                            : 'border-gray-100 hover:border-indigo-200 hover:shadow-md bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-gray-900 truncate">
                            {userData.userName}
                          </h4>
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">
                            {userData.sales.length}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 flex items-center">
                            <FiCalendar className="w-4 h-4 mr-2" />
                            Last: {formatDate(latestSale.dateTime)}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2 flex items-start">
                            <FiFileText className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            {latestSale.callNotes || 'No recent notes'}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sales Details */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <AnimatePresence mode="wait">
              {selectedUser ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <FiActivity className="mr-3 text-indigo-600" />
                        Activity for {salesByUser[selectedUser].userName}
                      </h3>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 max-h-[600px] overflow-y-auto">
                    <div className="space-y-4">
                      {salesByUser[selectedUser].sales.map((sale, index) => (
                        <motion.div
                          key={sale._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Doctor</label>
                              <p className="text-lg font-semibold text-gray-900 mt-1">
                                {sale.doctorName || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</label>
                              <p className="text-lg font-semibold text-gray-900 mt-1">{formatDate(sale.dateTime)}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Call Notes</label>
                            <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200">
                              <p className="text-gray-700 whitespace-pre-line">
                                {sale.callNotes || 'No notes available'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              <span className="font-semibold">Sales Rep:</span> {sale.salesRep || 'N/A'}
                            </span>
                            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                              Activity #{index + 1}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center p-8"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiTrendingUp className="w-12 h-12 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Sales Representative</h3>
                    <p className="text-gray-500 mb-4">Choose a representative from the list to view their detailed sales activity</p>
                    <div className="flex items-center justify-center text-sm text-gray-400">
                      <FiUsers className="mr-2" />
                      {filteredUsers.length} representatives available
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSalesActivity;