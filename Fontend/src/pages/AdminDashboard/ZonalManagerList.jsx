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
  FiUserCheck,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';

const ZonalManagerList = () => {
  const [zonalManagers, setZonalManagers] = useState([]);
  const [filteredZonalManagers, setFilteredZonalManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    fetchZonalManagers();
  }, []);

  useEffect(() => {
    // Filter zonal managers based on search term
    const filtered = zonalManagers.filter(zonalManager =>
      zonalManager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zonalManager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (zonalManager.areaManagers && zonalManager.areaManagers.some(am => 
        am.name.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
    setFilteredZonalManagers(filtered);
  }, [zonalManagers, searchTerm]);

  const fetchZonalManagers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchUsersByRole('Zonal Manager');
      setZonalManagers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch zonal managers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchZonalManagers();
  };

  const toggleCardExpansion = (managerId) => {
    setExpandedCards(prev => ({
      ...prev,
      [managerId]: !prev[managerId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading zonal managers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-4">
            <FiUserCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Zonal Manager Directory</h1>
          <p className="text-gray-600">View all zonal managers and their area managers</p>
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
                placeholder="Search zonal managers by name, email, or area managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                <FiRefreshCw className="mr-2" size={16} />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total Zonal Managers: <strong className="text-gray-900">{zonalManagers.length}</strong></span>
              <span>Showing: <strong className="text-gray-900">{filteredZonalManagers.length}</strong> results</span>
            </div>
          </div>
        </div>

        {/* Zonal Manager Cards */}
        {filteredZonalManagers.length === 0 ? (
          <div className="text-center py-12">
            <FiUserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No zonal managers found' : 'No zonal managers available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first zonal manager to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredZonalManagers.map((zonalManager, index) => {
              const isExpanded = expandedCards[zonalManager._id];
              const areaManagerCount = zonalManager.areaManagers ? zonalManager.areaManagers.length : 0;
              
              return (
                <motion.div
                  key={zonalManager._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Zonal Manager Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {zonalManager.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">{zonalManager.name}</h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Zonal Manager
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Area Managers</div>
                        <div className="text-2xl font-bold text-purple-600">{areaManagerCount}</div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <FiMail className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-sm">{zonalManager.email}</span>
                      </div>
                      
                      {zonalManager.phone && (
                        <div className="flex items-center text-gray-600">
                          <FiPhone className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="text-sm">{zonalManager.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Area Managers Toggle */}
                    {areaManagerCount > 0 && (
                      <button
                        onClick={() => toggleCardExpansion(zonalManager._id)}
                        className="mt-4 w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <span className="text-sm font-medium text-purple-800">
                          View Area Managers ({areaManagerCount})
                        </span>
                        {isExpanded ? (
                          <FiChevronUp className="w-4 h-4 text-purple-600" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-purple-600" />
                        )}
                      </button>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>ID: {zonalManager._id.slice(-6)}</span>
                        <span>Created: {new Date(zonalManager.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Area Managers List */}
                  {isExpanded && areaManagerCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-100 bg-gray-50"
                    >
                      <div className="p-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                          <FiUsers className="w-4 h-4 mr-2" />
                          Managed Area Managers
                        </h4>
                        <div className="space-y-3">
                          {zonalManager.areaManagers.map((areaManager) => (
                            <div key={areaManager._id} className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                {areaManager.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">{areaManager.name}</p>
                                <p className="text-xs text-gray-500">{areaManager.email}</p>
                              </div>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Area Manager
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* No Area Managers Message */}
                  {isExpanded && areaManagerCount === 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 p-6">
                      <div className="text-center text-gray-500">
                        <FiUser className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No area managers assigned yet</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-purple-50 rounded-2xl p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
            <FiUserCheck className="mr-2" />
            Zonal Manager Role Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-800">
            <div>
              <h4 className="font-semibold mb-2">Responsibilities</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Oversee multiple Area Managers</li>
                <li>Coordinate regional operations</li>
                <li>Report to National/State Heads</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Hierarchy</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Reports to: National Head / State Head</li>
                <li>Manages: Area Managers</li>
                <li>Assigned to multiple Area Managers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonalManagerList;