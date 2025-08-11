import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiMapPin, 
  FiSearch,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';
import { fetchStates, createState, updateState, deleteState } from '../../api/stateApi';

const ManageStates = () => {
  const [states, setStates] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    country: 'India'
  });

  useEffect(() => {
    fetchStatesData();
  }, []);

  useEffect(() => {
    const filtered = states.filter(state =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStates(filtered);
  }, [states, searchTerm]);

  const fetchStatesData = async () => {
    try {
      const data = await fetchStates();
      setStates(data);
    } catch (err) {
      setError('Failed to fetch states');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingState) {
        const updatedState = await updateState(editingState._id, formData);
        setStates(prev => prev.map(state => 
          state._id === editingState._id ? updatedState : state
        ));
        setSuccess('State updated successfully!');
      } else {
        const newState = await createState(formData);
        setStates(prev => [...prev, newState]);
        setSuccess('State created successfully!');
      }
      
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (state) => {
    setEditingState(state);
    setFormData({
      name: state.name,
      code: state.code,
      country: state.country
    });
    setShowForm(true);
  };

  const handleDelete = async (stateId) => {
    if (window.confirm('Are you sure you want to delete this state?')) {
      try {
        await deleteState(stateId);
        setStates(prev => prev.filter(state => state._id !== stateId));
        setSuccess('State deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', country: 'India' });
    setEditingState(null);
    setShowForm(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiMapPin className="mr-3 text-indigo-600" />
              Manage States
            </h1>
            <p className="text-gray-600 mt-2">Add, edit, and manage states for your organization</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <FiPlus className="mr-2" />
            Add State
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <FiCheck className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-800">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingState ? 'Edit State' : 'Add New State'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter state name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  maxLength="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                  placeholder="e.g., MH, DL, KA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Country name"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingState ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* States Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStates.map((state) => (
          <div
            key={state._id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-lg">{state.code}</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{state.name}</h3>
                  <p className="text-sm text-gray-500">{state.country}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(state)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit State"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(state._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete State"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              Created: {new Date(state.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {filteredStates.length === 0 && (
        <div className="text-center py-12">
          <FiMapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No states found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first state'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageStates;