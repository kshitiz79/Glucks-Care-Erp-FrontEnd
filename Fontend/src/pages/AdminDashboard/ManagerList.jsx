import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchUsersByRole } from '../../api/userApi';
import { 
  FiUsers, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiAlertCircle,
  FiUser
} from 'react-icons/fi';
import { BsFillBuildingFill } from 'react-icons/bs';

const ManagerList = () => {
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchManagers();
  }, []);

  useEffect(() => {
    // Filter managers based on search term
    const filtered = managers.filter(manager =>
      manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (manager.headOffice && manager.headOffice.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredManagers(filtered);
  }, [managers, searchTerm]);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchUsersByRole('Manager');
      setManagers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch managers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchManagers();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading managers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <FiUsers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manager Directory</h1>
          <p className="text-gray-600">View all managers in your organization</p>
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
                placeholder="Search managers by name, email, or head office..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <FiRefreshCw className="mr-2" size={16} />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total Managers: <strong className="text-gray-900">{managers.length}</strong></span>
              <span>Showing: <strong className="text-gray-900">{filteredManagers.length}</strong> results</span>
            </div>
          </div>
        </div>

        {/* Manager Cards */}
        {filteredManagers.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No managers found' : 'No managers available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first manager to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredManagers.map((manager, index) => (
              <motion.div
                key={manager._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Manager Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {manager.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{manager.name}</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Manager
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FiMail className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-sm">{manager.email}</span>
                  </div>
                  
                  {manager.phone && (
                    <div className="flex items-center text-gray-600">
                      <FiPhone className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-sm">{manager.phone}</span>
                    </div>
                  )}

                  {manager.headOffice && (
                    <div className="flex items-center text-gray-600">
                      <BsFillBuildingFill className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-sm">{manager.headOffice.name}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ID: {manager._id.slice(-6)}</span>
                    <span>Created: {new Date(manager.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <FiUsers className="mr-2" />
            Manager Role Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Responsibilities</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Oversee Area Managers and their teams</li>
                <li>Manage multiple head office operations</li>
                <li>Report to Zonal Managers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Hierarchy</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Reports to: Zonal Manager</li>
                <li>Manages: Area Managers</li>
                <li>Can be assigned to multiple head offices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerList;