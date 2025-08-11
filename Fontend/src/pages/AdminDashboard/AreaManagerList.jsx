import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchUsersByRole } from '../../api/userApi';
import {
  FiUsers,
  FiMail,
  FiPhone,
  FiUser,
  FiSearch,
  FiRefreshCw,
  FiAlertCircle,
  FiUserCheck
} from 'react-icons/fi';

const AreaManagerList = () => {
  const [areaManagers, setAreaManagers] = useState([]);
  const [filteredAreaManagers, setFilteredAreaManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAreaManagers();
  }, []);

  useEffect(() => {
    // Filter area managers based on search term
    const filtered = areaManagers.filter(areaManager =>
      areaManager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      areaManager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (areaManager.managers && areaManager.managers.some(manager => 
        manager.name.toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
      (areaManager.manager && areaManager.manager.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredAreaManagers(filtered);
  }, [areaManagers, searchTerm]);

  const fetchAreaManagers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchUsersByRole('Area Manager');
      setAreaManagers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch area managers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAreaManagers();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading area managers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-4">
            <FiUserCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Area Manager Directory</h1>
          <p className="text-gray-600">View all area managers in your organization</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center"
          >
            <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800 font-medium">{error}</span>
          </motion.div>
        )}

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search area managers by name, email, or manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <FiRefreshCw className="mr-2" size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total Area Managers: <strong className="text-gray-900">{areaManagers.length}</strong></span>
              <span>Showing: <strong className="text-gray-900">{filteredAreaManagers.length}</strong> results</span>
            </div>
          </div>
        </div>

        {/* Area Manager Cards */}
        {filteredAreaManagers.length === 0 ? (
          <div className="text-center py-12">
            <FiUserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No area managers found' : 'No area managers available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first area manager to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAreaManagers.map((areaManager, index) => (
              <motion.div
                key={areaManager._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Area Manager Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {areaManager.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{areaManager.name}</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Area Manager
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FiMail className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm">{areaManager.email}</span>
                  </div>

                  {areaManager.phone && (
                    <div className="flex items-center text-gray-600">
                      <FiPhone className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-sm">{areaManager.phone}</span>
                    </div>
                  )}

                  {areaManager.managers && areaManager.managers.length > 0 && (
                    <div className="flex items-start text-gray-600">
                      <FiUser className="w-4 h-4 mr-3 text-gray-400 mt-0.5" />
                      <div className="text-sm flex-1">
                        <span className="text-gray-500">Reports to: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {areaManager.managers.map((manager, index) => (
                            <span key={manager._id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {manager.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Manager Info Card */}
                {areaManager.manager && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Manager Details</div>
                    <div className="text-sm font-medium text-gray-700">{areaManager.manager.name}</div>
                    <div className="text-xs text-gray-500">{areaManager.manager.email}</div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ID: {areaManager._id.slice(-6)}</span>
                    <span>Created: {new Date(areaManager.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-green-50 rounded-2xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <FiUserCheck className="mr-2" />
            Area Manager Role Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
            <div>
              <h4 className="font-semibold mb-2">Responsibilities</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Manage specific geographical areas</li>
                <li>Oversee field operations and sales teams</li>
                <li>Report to multiple assigned Managers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Hierarchy</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Reports to: Multiple Managers</li>
                <li>Manages: Field teams and operations</li>
                <li>Can be assigned to multiple Managers (not head office)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaManagerList;