// src/components/CreateUser.jsx
import React, { useState, useEffect } from 'react';
import { fetchHeadOffices } from '../../api/headofficeApi';
import { fetchStates } from '../../api/stateApi';
import { registerUser } from '../../api/authApi';
import { fetchUsersByRole } from '../../api/userApi';
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiUserCheck,
  FiMapPin,
  FiSearch,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { BsFillBuildingFill } from 'react-icons/bs';

// Multi-select searchable component for head offices
const MultiSelectHeadOffice = ({ headOffices, selectedOffices, onSelectionChange, isMultiple }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOffices = headOffices.filter(office =>
    office.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (office) => {
    if (isMultiple) {
      const isSelected = selectedOffices.some(selected => selected._id === office._id);
      if (isSelected) {
        onSelectionChange(selectedOffices.filter(selected => selected._id !== office._id));
      } else {
        onSelectionChange([...selectedOffices, office]);
      }
    } else {
      onSelectionChange([office]);
      setIsOpen(false);
    }
  };

  const removeSelection = (officeId) => {
    onSelectionChange(selectedOffices.filter(selected => selected._id !== officeId));
  };

  return (
    <div className="relative">
      <div
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all duration-200 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {selectedOffices.length === 0 ? (
              <span className="text-gray-500">Select head office{isMultiple ? 's' : ''}</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedOffices.map(office => (
                  <span
                    key={office._id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                  >
                    {office.name}
                    {isMultiple && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelection(office._id);
                        }}
                        className="ml-2 hover:text-indigo-600"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
          <FiSearch className="text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg max-h-60 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search head offices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOffices.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No head offices found</div>
            ) : (
              filteredOffices.map(office => {
                const isSelected = selectedOffices.some(selected => selected._id === office._id);
                return (
                  <div
                    key={office._id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between ${isSelected ? 'bg-indigo-50 text-indigo-700' : ''
                      }`}
                    onClick={() => handleSelect(office)}
                  >
                    <span>{office.name}</span>
                    {isSelected && <FiCheck size={16} className="text-indigo-600" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CreateUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    phone: '',
  });

  const [headOffices, setHeadOffices] = useState([]);
  const [states, setStates] = useState([]);
  const [managers, setManagers] = useState([]);
  const [areaManagers, setAreaManagers] = useState([]);
  const [selectedHeadOffices, setSelectedHeadOffices] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedAreaManagers, setSelectedAreaManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const allRoles = [
    'Super Admin',
    'Admin',
    'Opps Team',
    'National Head',
    'State Head',
    'Zonal Manager',
    'Area Manager',
    'Manager',
    'User'
  ];

  // Roles that can have multiple head offices
  const multiHeadOfficeRoles = ['Zonal Manager', 'Manager'];

  useEffect(() => {
    // Fetch head offices
    fetchHeadOffices()
      .then((data) => setHeadOffices(data))
      .catch((err) => console.error(err));

    // Fetch states
    fetchStates()
      .then((data) => setStates(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch managers when Area Manager role is selected
  useEffect(() => {
    if (formData.role === 'Area Manager') {
      fetchUsersByRole('Manager')
        .then((data) => setManagers(data))
        .catch((err) => console.error(err));
    }
  }, [formData.role]);

  // Fetch area managers when Zonal Manager role is selected
  useEffect(() => {
    if (formData.role === 'Zonal Manager') {
      fetchUsersByRole('Area Manager')
        .then((data) => setAreaManagers(data))
        .catch((err) => console.error(err));
    }
  }, [formData.role]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    // Define roles that don't need head office assignment
    const rolesWithoutHeadOffice = [
      'Super Admin',
      'Admin',
      'Opps Team',
      'National Head',
      'State Head',
      'Area Manager',
      'Zonal Manager'
    ];

    // Validation for State Head role
    if (formData.role === 'State Head') {
      if (!selectedState) {
        newErrors.state = 'State selection is required for State Head role';
      }
    } else if (formData.role === 'Area Manager') {
      // For Area Manager, managers selection is required
      if (selectedManagers.length === 0) {
        newErrors.managers = 'At least one Manager must be selected for Area Manager role';
      }
    } else if (formData.role === 'Zonal Manager') {
      // For Zonal Manager, area manager selection is required
      if (selectedAreaManagers.length === 0) {
        newErrors.areaManagers = 'At least one Area Manager must be selected for Zonal Manager role';
      }
    } else if (!rolesWithoutHeadOffice.includes(formData.role)) {
      // For roles that need head office assignment (Manager and User)
      if (selectedHeadOffices.length === 0) {
        newErrors.headOffice = 'At least one head office must be selected';
      }
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCreateUser = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      let userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        phone: formData.phone.trim(),
      };

      // For State Head role, use state instead of head office
      if (formData.role === 'State Head') {
        userData.state = selectedState;
      } else if (formData.role === 'Area Manager') {
        // For Area Manager, use managers instead of head office
        userData.managers = selectedManagers.map(m => m._id);
      } else if (formData.role === 'Zonal Manager') {
        // For Zonal Manager, use area managers instead of head office
        userData.areaManagers = selectedAreaManagers.map(am => am._id);
      } else {
        // For other roles, use head office
        userData.headOffice = selectedHeadOffices[0]._id;
      }

      const data = await registerUser(userData);

      setSuccess(`User created successfully! Welcome ${data.user.name}`);

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'User',
        phone: '',
      });
      setSelectedHeadOffices([]);
      setSelectedState('');
      setSelectedManager('');
      setSelectedManagers([]);
      setSelectedAreaManagers([]);
      setErrors({});

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);

    } catch (err) {
      console.error(err);
      setErrors({ submit: err.message || 'Server error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isMultipleHeadOfficeRole = multiHeadOfficeRoles.includes(formData.role);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <FiUserCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
          <p className="mt-2 text-gray-600">Add a new team member to your organization</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <FiCheck className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800">{errors.submit}</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiUser className="inline mr-2" />
                Full Name *
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiMail className="inline mr-2" />
                Email Address *
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                placeholder="user@company.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiPhone className="inline mr-2" />
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiLock className="inline mr-2" />
                Password *
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  placeholder="Enter secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiUserCheck className="inline mr-2" />
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
              >
                {allRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
            </div>

            {/* State Selection for State Head */}
            {formData.role === 'State Head' ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiMapPin className="inline mr-2" />
                  State *
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>
                      {state.name} ({state.code})
                    </option>
                  ))}
                </select>
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  State Head role requires state assignment instead of head office.
                </p>
              </div>
            ) : formData.role === 'Area Manager' ? (
              /* Manager Selection for Area Manager - MULTIPLE SELECT */
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiUserCheck className="inline mr-2" />
                  Managers *
                  <span className="ml-2 text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                    Multiple selection available
                  </span>
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {managers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No Managers available. Create Managers first.</p>
                  ) : (
                    managers.map((manager) => (
                      <label key={manager._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedManagers.some(selected => selected._id === manager._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedManagers([...selectedManagers, manager]);
                            } else {
                              setSelectedManagers(selectedManagers.filter(selected => selected._id !== manager._id));
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{manager.name}</p>
                          <p className="text-xs text-gray-500">{manager.email}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                {errors.managers && <p className="mt-1 text-sm text-red-600">{errors.managers}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Area Manager role can report to multiple managers. Select all applicable managers.
                </p>
              </div>
            ) : formData.role === 'Zonal Manager' ? (
              /* Area Manager Selection for Zonal Manager */
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiUserCheck className="inline mr-2" />
                  Area Managers *
                  <span className="ml-2 text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                    Multiple selection available
                  </span>
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {areaManagers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No Area Managers available. Create Area Managers first.</p>
                  ) : (
                    areaManagers.map((areaManager) => (
                      <label key={areaManager._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAreaManagers.some(selected => selected._id === areaManager._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAreaManagers([...selectedAreaManagers, areaManager]);
                            } else {
                              setSelectedAreaManagers(selectedAreaManagers.filter(selected => selected._id !== areaManager._id));
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{areaManager.name}</p>
                          <p className="text-xs text-gray-500">{areaManager.email}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                {errors.areaManagers && <p className="mt-1 text-sm text-red-600">{errors.areaManagers}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Zonal Manager role requires Area Manager assignments. Select multiple Area Managers to manage.
                </p>
              </div>
            ) : ['Super Admin', 'Admin', 'Opps Team', 'National Head'].includes(formData.role) ? (
              /* No assignment needed for high-level roles */
              <div className="md:col-span-2">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center">
                    <FiUserCheck className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {formData.role} Role - No Assignment Required
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        This role operates at the organizational level and doesn't require head office assignment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Head Office for Manager and User roles */
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <BsFillBuildingFill className="inline mr-2" />
                  Head Office{isMultipleHeadOfficeRole ? 's' : ''} *
                  {isMultipleHeadOfficeRole && (
                    <span className="ml-2 text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                      Multiple selection available
                    </span>
                  )}
                </label>
                <MultiSelectHeadOffice
                  headOffices={headOffices}
                  selectedOffices={selectedHeadOffices}
                  onSelectionChange={setSelectedHeadOffices}
                  isMultiple={isMultipleHeadOfficeRole}
                />
                {errors.headOffice && <p className="mt-1 text-sm text-red-600">{errors.headOffice}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  {isMultipleHeadOfficeRole
                    ? 'This role can be assigned to multiple head offices. Search and select as needed.'
                    : 'Select the head office this user will be assigned to.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              onClick={handleCreateUser}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating User...
                </div>
              ) : (
                'Create User'
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <FiAlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Role Information:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>Manager:</strong> Can be assigned to multiple head offices</li>
                  <li><strong>Zonal Manager:</strong> Manages multiple Area Managers</li>
                  <li><strong>Area Manager:</strong> Can report to multiple Managers instead of head office</li>
                  <li><strong>State Head:</strong> Assigned to a specific state</li>
                  <li><strong>Other roles:</strong> Single head office assignment</li>
                  <li>Users will receive login credentials via email after creation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
