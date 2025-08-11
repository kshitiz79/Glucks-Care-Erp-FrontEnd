// src/pages/AddHeadOffice.js
import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiHome, 
  FiMapPin,
  FiPhone,
  FiMail,
  FiSearch,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';
import { fetchDoctors } from './../../api/doctorApi';
import { fetchHeadOffices, createHeadOffice, updateHeadOffice, deleteHeadOffice } from './../../api/headofficeApi';
import { fetchStates } from './../../api/stateApi';
import BASE_URL from '../../BaseUrl/baseUrl';
const AddHeadOffice = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);
  const [headOffices, setHeadOffices] = useState([]);
  const [states, setStates] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching head offices data...');
      
      // Fetch head offices
      const headOfficesData = await fetchHeadOffices();
      console.log('Head offices data:', headOfficesData);
      setHeadOffices(Array.isArray(headOfficesData) ? headOfficesData : []);

      // Fetch states
      const statesData = await fetchStates();
      console.log('States data:', statesData);
      setStates(Array.isArray(statesData) ? statesData : []);

      // Fetch users
      try {
        const usersResponse = await fetch(`${BASE_URL}/api/users`);
        const usersData = await usersResponse.json();
        console.log('Users data:', usersData);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (userErr) {
        console.warn('Failed to fetch users:', userErr);
        setUsers([]);
      }

      // Fetch doctors
      try {
        const doctorsData = await fetchDoctors();
        console.log('Doctors data:', doctorsData);
        const doctorData = Array.isArray(doctorsData) ? doctorsData : doctorsData.Data || [];
        setDoctorList(doctorData);
      } catch (doctorErr) {
        console.warn('Failed to fetch doctors:', doctorErr);
        setDoctorList([]);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Head Office name is required');
      setLoading(false);
      return;
    }



    try {
      if (editingOffice) {
        const updatedOffice = await updateHeadOffice(editingOffice._id, formData);
        setHeadOffices(prev => prev.map(office => 
          office._id === editingOffice._id ? updatedOffice : office
        ));
        setSuccess('Head Office updated successfully!');
      } else {
        const newHeadOffice = await createHeadOffice(formData);
        setHeadOffices(prev => [...prev, newHeadOffice]);
        setSuccess('Head Office created successfully!');
      }
      
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (office) => {
    setEditingOffice(office);
    setFormData({
      name: office.name || '',
      state: office.state?._id || '',
      pincode: office.pincode || ''
    });
    setShowForm(true);
  };

  const handleDeleteHeadOffice = async (id) => {
    if (window.confirm('Are you sure you want to delete this head office?')) {
      try {
        await deleteHeadOffice(id);
        setHeadOffices(prev => prev.filter(office => office._id !== id));
        setSuccess('Head Office deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      state: '',
      pincode: ''
    });
    setEditingOffice(null);
    setShowForm(false);
    setError('');
  };

  const filteredOffices = headOffices.filter(office =>
    office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.state?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiHome className="mr-3 text-indigo-600" />
              Head Offices
            </h1>
            <p className="text-gray-600 mt-2">Manage your organization's head office locations</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <FiPlus className="mr-2" />
            Add Head Office
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
            placeholder="Search head offices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingOffice ? 'Edit Head Office' : 'Add New Head Office'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Head Office Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter head office name (e.g., Mumbai Head Office)"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State (Optional)
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                >
                  <option value="">Select State (Optional)</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>
                      {state.name} ({state.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="inline mr-2" />
                  PIN Code (Optional)
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter PIN code (e.g., 110001)"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  6-digit PIN code for the head office location
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingOffice ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Head Office Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffices.map((office) => {
          const assignedUsersCount = users.filter(
            user => user.headOffice === office._id
          ).length;
          
          const assignedDoctorsCount = doctorList.filter(doctor => {
            if (!doctor.headOffice) return false;
            if (typeof doctor.headOffice === 'object' && doctor.headOffice._id) {
              return doctor.headOffice._id.toString() === office._id.toString();
            }
            return doctor.headOffice === office._id;
          }).length;
          
          return (
            <div
              key={office._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <FiHome className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{office.name}</h3>
                    {office.state && (
                      <p className="text-sm text-gray-500">{office.state.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(office)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Head Office"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHeadOffice(office._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Head Office"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {office.state && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">{office.state.name} ({office.state.code})</span>
                  </p>
                )}
                {office.pincode && (
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">PIN: {office.pincode}</span>
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    <span className="font-medium">Users:</span> {assignedUsersCount}
                  </span>
                  <span className="text-gray-600">
                    <span className="font-medium">Doctors:</span> {assignedDoctorsCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOffices.length === 0 && (
        <div className="text-center py-12">
          <FiHome className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No head offices found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first head office'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddHeadOffice;
