// src/pages/UserDashboard/AddChemist.jsx
import React, { useState, useEffect } from 'react';
import { fetchChemists, createChemist, deleteChemist, updateChemist } from './../../api/chemistApi';
import { fetchHeadOffices } from './../../api/headofficeApi';
import { LoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import ChemistDetail from './ChemistDetail';

const libraries = ['places'];

const AddChemist = () => {
  const [chemists, setChemists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChemist, setEditingChemist] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedChemist, setSelectedChemist] = useState(null);
  const [headOffices, setHeadOffices] = useState([]);
  const [formData, setFormData] = useState({
    firmName: '',
    contactPersonName: '',
    designation: '',
    mobileNo: '',
    emailId: '',
    drugLicenseNumber: '',
    gstNo: '',
    address: '',
    latitude: '',
    longitude: '',
    yearsInBusiness: '',
    annualTurnover: [{ year: '', amount: '' }],
    headOffice: '',
  });
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    fetchChemists()
      .then(response => {
        // Ensure data is an array; use response.Data if API returns an object
        const data = Array.isArray(response) ? response : response.Data || [];
        setChemists(data);
      })
      .catch(err => {
        console.error(err);
        setErrorMessage(err.message || 'Failed to fetch chemists');
        setShowErrorModal(true);
        setChemists([]); // Ensure chemists remains an array on error
      });
  }, []);

  useEffect(() => {
    fetchHeadOffices()
      .then(response => {
        const data = Array.isArray(response) ? response : response.Data || [];
        setHeadOffices(data);
      })
      .catch(err => {
        console.error(err);
        setErrorMessage(err.message || 'Failed to fetch head offices');
        setShowErrorModal(true);
        setHeadOffices([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('annualTurnover')) {
      const [_, index, field] = name.match(/annualTurnover\[(\d+)\]\.(\w+)/);
      setFormData(prev => {
        const newTurnover = [...prev.annualTurnover];
        newTurnover[index] = { ...newTurnover[index], [field]: value };
        return { ...prev, annualTurnover: newTurnover };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const addTurnoverYear = () => {
    setFormData(prev => ({
      ...prev,
      annualTurnover: [...prev.annualTurnover, { year: '', amount: '' }],
    }));
  };

  const removeTurnoverYear = (index) => {
    setFormData(prev => ({
      ...prev,
      annualTurnover: prev.annualTurnover.filter((_, i) => i !== index),
    }));
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setMapCenter({ lat, lng });
  };

  const onLoadAutocomplete = (autoC) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarkerPosition({ lat, lng });
        setMapCenter({ lat, lng });
        setFormData(prev => ({
          ...prev,
          address: place.formatted_address,
          latitude: lat,
          longitude: lng,
        }));
      }
    }
  };

  const handleEditChemist = (chemist) => {
    setEditingChemist(chemist);
    setFormData({
      firmName: chemist.firmName || '',
      contactPersonName: chemist.contactPersonName || '',
      designation: chemist.designation || '',
      mobileNo: chemist.mobileNo || '',
      emailId: chemist.emailId || '',
      drugLicenseNumber: chemist.drugLicenseNumber || '',
      gstNo: chemist.gstNo || '',
      address: chemist.address || '',
      latitude: chemist.latitude || '',
      longitude: chemist.longitude || '',
      yearsInBusiness: chemist.yearsInBusiness || '',
      annualTurnover: chemist.annualTurnover || [{ year: '', amount: '' }],
      headOffice: chemist.headOffice?._id || chemist.headOffice || '',
    });
    if (chemist.latitude && chemist.longitude) {
      const lat = parseFloat(chemist.latitude);
      const lng = parseFloat(chemist.longitude);
      setMapCenter({ lat, lng });
      setMarkerPosition({ lat, lng });
    }
    setShowForm(true);
  };

  const handleViewChemist = (chemist) => {
    setSelectedChemist(chemist);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setFormData({
      firmName: '',
      contactPersonName: '',
      designation: '',
      mobileNo: '',
      emailId: '',
      drugLicenseNumber: '',
      gstNo: '',
      address: '',
      latitude: '',
      longitude: '',
      yearsInBusiness: '',
      annualTurnover: [{ year: '', amount: '' }],
      headOffice: '',
    });
    setMarkerPosition(null);
    setEditingChemist(null);
  };

  const handleDeleteChemist = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this chemist?');
    if (!confirmDelete) return;

    try {
      await deleteChemist(id);
      setChemists(prev => prev.filter(chem => chem._id !== id));
      setErrorMessage('Chemist deleted successfully!');
      setShowErrorModal(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to delete chemist');
      setShowErrorModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firmName || !formData.mobileNo || !formData.headOffice) {
      setErrorMessage('Please fill all required fields (Firm Name, Mobile No, Head Office).');
      setShowErrorModal(true);
      return;
    }

    if (!/^[0-9a-fA-F]{24}$/.test(formData.headOffice)) {
      setErrorMessage('Please select a valid Head Office.');
      setShowErrorModal(true);
      return;
    }

    const newChemistData = {
      firmName: formData.firmName,
      contactPersonName: formData.contactPersonName || undefined,
      designation: formData.designation || undefined,
      mobileNo: formData.mobileNo,
      emailId: formData.emailId || undefined,
      drugLicenseNumber: formData.drugLicenseNumber || undefined,
      gstNo: formData.gstNo || undefined,
      address: formData.address || undefined,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness, 10) : undefined,
      annualTurnover: formData.annualTurnover
        .map(turnover => ({
          year: turnover.year ? parseInt(turnover.year, 10) : undefined,
          amount: turnover.amount ? parseFloat(turnover.amount) : undefined,
        }))
        .filter(turnover => turnover.year && turnover.amount),
      headOffice: formData.headOffice,
    };

    try {
      if (editingChemist) {
        // Update existing chemist
        const updatedChemist = await updateChemist(editingChemist._id, newChemistData);
        setChemists(prev => prev.map(chem => chem._id === editingChemist._id ? updatedChemist : chem));
        setErrorMessage('Chemist updated successfully!');
      } else {
        // Create new chemist
        const createdChemist = await createChemist(newChemistData);
        setChemists(prev => [...prev, createdChemist]);
        setErrorMessage('Chemist created successfully!');
      }
      setShowErrorModal(true);
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || `Failed to ${editingChemist ? 'update' : 'create'} chemist`);
      setShowErrorModal(true);
    }
  };

  const mapContainerStyle = { width: '100%', height: '400px' };

  const isFormValid = formData.firmName && formData.mobileNo && formData.headOffice &&
    /^[0-9a-fA-F]{24}$/.test(formData.headOffice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
                <span className="text-4xl">🧪</span>
                Chemist Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your pharmaceutical network and partnerships</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{chemists.length} Total Chemists</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Active Network</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(prev => !prev)}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 font-semibold"
            >
              {showForm ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close Form
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Chemist
                </>
              )}
            </motion.button>
          </div>
        </div>

        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border-2 ${errorMessage.includes('successfully') ? 'border-green-500' : 'border-red-500'
                }`}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {errorMessage.includes('successfully') ? 'Success' : 'Error'}
              </h2>
              <p className="text-gray-700 mb-6">{errorMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Enhanced Form */}
        {showForm && (
          <LoadScript googleMapsApiKey="AIzaSyCLRC2KUtUshQ7B1YX_gFaKYadrpThcM3g" libraries={libraries}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-8"
            >
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {editingChemist ? 'Edit Chemist' : 'Add New Chemist'}
                </h3>
                <p className="text-green-100 mt-2">
                  {editingChemist ? 'Update the chemist\'s information' : 'Register a new pharmaceutical partner in your network'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                {headOffices.length === 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-red-700 font-medium">No head offices available. Please add a head office first.</p>
                    </div>
                  </div>
                )}

                {/* Professional Form Sections */}
                <div className="space-y-8">
                  {/* Basic Information Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firmName" className="block text-sm font-semibold text-gray-700 mb-2">
                          Firm Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="firmName"
                          name="firmName"
                          value={formData.firmName}
                          onChange={handleChange}
                          required
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          placeholder="Enter pharmacy/firm name"
                        />
                      </div>

                      <div>
                        <label htmlFor="contactPersonName" className="block text-sm font-semibold text-gray-700 mb-2">
                          Contact Person Name
                        </label>
                        <input
                          type="text"
                          id="contactPersonName"
                          name="contactPersonName"
                          value={formData.contactPersonName}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          placeholder="Enter contact person's name"
                        />
                      </div>

                      <div>
                        <label htmlFor="designation" className="block text-sm font-semibold text-gray-700 mb-2">
                          Designation
                        </label>
                        <input
                          type="text"
                          id="designation"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          placeholder="e.g., Pharmacist, Manager"
                        />
                      </div>

                      <div>
                        <label htmlFor="mobileNo" className="block text-sm font-semibold text-gray-700 mb-2">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="mobileNo"
                          name="mobileNo"
                          value={formData.mobileNo}
                          onChange={handleChange}
                          required
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div>
                        <label htmlFor="emailId" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="emailId"
                          name="emailId"
                          value={formData.emailId}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          placeholder="chemist@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="drugLicenseNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                          Drug License Number
                        </label>
                        <input
                          type="text"
                          id="drugLicenseNumber"
                          name="drugLicenseNumber"
                          value={formData.drugLicenseNumber}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          placeholder="Enter drug license number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Information Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Business Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="gstNo" className="block text-sm font-semibold text-gray-700 mb-2">
                          GST Number
                        </label>
                        <input
                          type="text"
                          id="gstNo"
                          name="gstNo"
                          value={formData.gstNo}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          placeholder="Enter GST number"
                        />
                      </div>

                      <div>
                        <label htmlFor="yearsInBusiness" className="block text-sm font-semibold text-gray-700 mb-2">
                          Years in Business
                        </label>
                        <input
                          type="number"
                          id="yearsInBusiness"
                          name="yearsInBusiness"
                          value={formData.yearsInBusiness}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          placeholder="0"
                          min="0"
                        />
                      </div>

                      <div>
                        <label htmlFor="headOffice" className="block text-sm font-semibold text-gray-700 mb-2">
                          Head Office <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="headOffice"
                          name="headOffice"
                          value={formData.headOffice}
                          onChange={handleChange}
                          required
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        >
                          <option value="">Select Head Office</option>
                          {headOffices.map(office => (
                            <option key={office._id} value={office._id}>
                              {office.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Annual Turnover
                        </label>
                        {formData.annualTurnover.map((turnover, index) => (
                          <div key={index} className="flex gap-4 mb-3">
                            <input
                              type="number"
                              name={`annualTurnover[${index}].year`}
                              value={turnover.year}
                              onChange={handleChange}
                              placeholder="Year"
                              className="w-1/2 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            />
                            <input
                              type="number"
                              name={`annualTurnover[${index}].amount`}
                              value={turnover.amount}
                              onChange={handleChange}
                              placeholder="Amount (₹)"
                              className="w-1/2 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            />
                            {formData.annualTurnover.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTurnoverYear(index)}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addTurnoverYear}
                          className="mt-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all duration-200 font-medium flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Turnover Year
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Location Information Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Location Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                          Address
                        </label>
                        <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter pharmacy address"
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          />
                        </Autocomplete>
                      </div>

                      <div>
                        <label htmlFor="latitude" className="block text-sm font-semibold text-gray-700 mb-2">
                          Latitude
                        </label>
                        <input
                          type="number"
                          id="latitude"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleChange}
                          readOnly
                          className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none"
                          placeholder="Auto-filled from map"
                        />
                      </div>

                      <div>
                        <label htmlFor="longitude" className="block text-sm font-semibold text-gray-700 mb-2">
                          Longitude
                        </label>
                        <input
                          type="number"
                          id="longitude"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleChange}
                          readOnly
                          className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none"
                          placeholder="Auto-filled from map"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📍 Pin Location on Map
                        </label>
                        <div className="rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                          <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={mapCenter}
                            zoom={12}
                            onClick={handleMapClick}
                          >
                            {markerPosition && <Marker position={markerPosition} />}
                          </GoogleMap>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Click on the map to pin the exact location</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${isFormValid
                        ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingChemist ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                    </svg>
                    {editingChemist ? 'Update Chemist' : 'Add Chemist'}
                  </button>
                </div>
              </form>
            </motion.div>
          </LoadScript>
        )}

        {/* Enhanced Chemist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chemists.map((chemist) => (
            <motion.div
              key={chemist._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold truncate">{chemist.firmName}</h3>
                    <p className="text-green-100 text-sm">{chemist.contactPersonName || 'Pharmaceutical Partner'}</p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Business</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {chemist.yearsInBusiness || 'N/A'} years
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-gray-700">{chemist.mobileNo}</span>
                </div>

                {chemist.emailId && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700 truncate">{chemist.emailId}</span>
                  </div>
                )}

                {chemist.address && (
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-700 line-clamp-2">{chemist.address}</span>
                  </div>
                )}

                {chemist.drugLicenseNumber && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-700 truncate">License: {chemist.drugLicenseNumber}</span>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="px-6 pb-6 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewChemist(chemist)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditChemist(chemist)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteChemist(chemist._id)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedChemist && (
          <ChemistDetail
            chemist={selectedChemist}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedChemist(null);
            }}
            onEdit={(chemist) => {
              setShowDetailModal(false);
              setSelectedChemist(null);
              handleEditChemist(chemist);
            }}
          />
        )}
      </div>
      </div>
      );
};

      export default AddChemist;