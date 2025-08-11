import React, { useState, useEffect, useContext } from 'react';
import { fetchDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../api/doctorApi';
import { fetchHeadOffices } from '../../api/headofficeApi';
import { LoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import DoctorDetail from './DoctorDetail';

const libraries = ['places'];

const AddDoctor = () => {
  const { user } = useContext(AuthContext); // Access user data from AuthContext
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [headOffices, setHeadOffices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    location: '',
    latitude: '',
    longitude: '',
    email: '',
    phone: '',
    registration_number: '',
    years_of_experience: '',
    date_of_birth: '',
    gender: '',
    anniversary: '',
  });
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors()
      .then(data => setDoctors(data))
      .catch(err => {
        setErrorMessage(err.message || 'Failed to fetch doctors');
        setShowErrorModal(true);
      });
  }, []);

  // Fetch head offices on mount
  useEffect(() => {
    fetchHeadOffices()
      .then(data => setHeadOffices(data))
      .catch(err => {
        setErrorMessage(err.message || 'Failed to fetch head offices');
        setShowErrorModal(true);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    setFormData((prev) => ({
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
        setFormData((prev) => ({
          ...prev,
          location: place.formatted_address,
          latitude: lat,
          longitude: lng,
        }));
      }
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      location: doctor.location || '',
      latitude: doctor.latitude || '',
      longitude: doctor.longitude || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      registration_number: doctor.registration_number || '',
      years_of_experience: doctor.years_of_experience || '',
      date_of_birth: doctor.date_of_birth ? doctor.date_of_birth.split('T')[0] : '',
      gender: doctor.gender || '',
      anniversary: doctor.anniversary ? doctor.anniversary.split('T')[0] : '',
    });
    if (doctor.latitude && doctor.longitude) {
      const lat = parseFloat(doctor.latitude);
      const lng = parseFloat(doctor.longitude);
      setMapCenter({ lat, lng });
      setMarkerPosition({ lat, lng });
    }
    setShowForm(true);
  };

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      location: '',
      latitude: '',
      longitude: '',
      email: '',
      phone: '',
      registration_number: '',
      years_of_experience: '',
      date_of_birth: '',
      gender: '',
      anniversary: '',
    });
    setMarkerPosition(null);
    setEditingDoctor(null);
  };

  const handleDeleteDoctor = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this doctor?');
    if (!confirmDelete) return;

    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
      setErrorMessage('Doctor deleted successfully!');
      setShowErrorModal(true);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete doctor');
      setShowErrorModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name) {
      setErrorMessage('Doctor name is required.');
      setShowErrorModal(true);
      return;
    }

    // Ensure user has a headOffice
    if (!user?.headOffice) {
      setErrorMessage('No head office assigned to your account. Please contact an administrator.');
      setShowErrorModal(true);
      return;
    }

    // Prepare data for submission
    const newDoctorData = {
      name: formData.name,
      headOffice: user.headOffice, // Use headOffice from user context
      ...(formData.specialization && { specialization: formData.specialization }),
      ...(formData.location && { location: formData.location }),
      ...(formData.latitude && { latitude: parseFloat(formData.latitude) }),
      ...(formData.longitude && { longitude: parseFloat(formData.longitude) }),
      ...(formData.email && { email: formData.email }),
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.registration_number && { registration_number: formData.registration_number }),
      ...(formData.years_of_experience && { years_of_experience: parseInt(formData.years_of_experience, 10) }),
      ...(formData.date_of_birth && { date_of_birth: formData.date_of_birth }),
      ...(formData.gender && { gender: formData.gender }),
      ...(formData.anniversary && { anniversary: formData.anniversary }),
    };

    try {
      if (editingDoctor) {
        // Update existing doctor
        const updatedDoctor = await updateDoctor(editingDoctor._id, newDoctorData);
        setDoctors((prev) => prev.map(doc => doc._id === editingDoctor._id ? updatedDoctor : doc));
        setErrorMessage('Doctor updated successfully!');
      } else {
        // Create new doctor
        const createdDoctor = await createDoctor(newDoctorData);
        setDoctors((prev) => [...prev, createdDoctor]);
        setErrorMessage('Doctor created successfully!');
      }
      setShowErrorModal(true);
      resetForm();
      setShowForm(false);
    } catch (error) {
      setErrorMessage(error.message || `Failed to ${editingDoctor ? 'update' : 'create'} doctor`);
      setShowErrorModal(true);
    }
  };

  const mapContainerStyle = { width: '100%', height: '400px' };

  // Check if form is valid for submit button
  const isFormValid = formData.name && user?.headOffice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Doctor Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your healthcare professional network</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{doctors.length} Total Doctors</span>
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
              onClick={() => setShowForm((prev) => !prev)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 font-semibold"
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
                  Add New Doctor
                </>
              )}
            </motion.button>
          </div>
        </div>

      {/* Error/Success Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border-2 ${
              errorMessage.includes('successfully') ? 'border-green-500' : 'border-red-500'
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
          <LoadScript googleMapsApiKey="AIzaSyBbiU_NzDhQsrPJiH8dzchmVdkXnS2f_Pg" libraries={libraries}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-8"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h3>
                <p className="text-blue-100 mt-2">
                  {editingDoctor ? 'Update the doctor\'s information' : 'Fill in the doctor\'s information to add them to your network'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8">
                {user && !user.headOffice && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-red-700 font-medium">No head office assigned to your account. Please contact an administrator.</p>
                    </div>
                  </div>
                )}
                {/* Professional Form Sections */}
                <div className="space-y-8">
                  {/* Basic Information Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter doctor's full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700 mb-2">
                          Specialization
                        </label>
                        <input
                          type="text"
                          id="specialization"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="e.g., Cardiologist, Neurologist"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="doctor@example.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="+91 9876543210"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="registration_number" className="block text-sm font-semibold text-gray-700 mb-2">
                          Medical Registration Number
                        </label>
                        <input
                          type="text"
                          id="registration_number"
                          name="registration_number"
                          value={formData.registration_number}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter registration number"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="years_of_experience" className="block text-sm font-semibold text-gray-700 mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          id="years_of_experience"
                          name="years_of_experience"
                          value={formData.years_of_experience}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="date_of_birth" className="block text-sm font-semibold text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="date_of_birth"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="anniversary" className="block text-sm font-semibold text-gray-700 mb-2">
                          Anniversary Date
                        </label>
                        <input
                          type="date"
                          id="anniversary"
                          name="anniversary"
                          value={formData.anniversary}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
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
                        <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                          Address
                        </label>
                        <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter clinic/hospital address"
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                      isFormValid
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingDoctor ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                    </svg>
                    {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                  </button>
                </div>
          </form>
          </motion.div> 
        </LoadScript>
      )}

        {/* Professional Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold truncate">{doctor.name}</h3>
                    <p className="text-blue-100 text-sm">{doctor.specialization || 'General Practitioner'}</p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Experience</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {doctor.years_of_experience || 'N/A'} years
                  </span>
                </div>

                {doctor.phone && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm text-gray-700">{doctor.phone}</span>
                  </div>
                )}

                {doctor.email && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700 truncate">{doctor.email}</span>
                  </div>
                )}

                {doctor.location && (
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-700 line-clamp-2">{doctor.location}</span>
                  </div>
                )}

                {doctor.registration_number && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Registration No.</span>
                    <p className="text-sm font-medium text-gray-900">{doctor.registration_number}</p>
                  </div>
                )}
              </div>

              {/* Card Actions */}
{/* Card Actions */}
<div className="px-6 pb-6 flex gap-3">
  <button
    onClick={() => handleEditDoctor(doctor)}
    className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
  >
    {/* …edit icon… */}
    Edit
  </button>

  <button
    onClick={() => handleViewDoctor(doctor)}
    className="flex-1 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
  >
    {/* …view icon… */}
    View
  </button>

  <button
    onClick={() => handleDeleteDoctor(doctor._id)}
    className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
  >
    {/* …delete icon… */}
    Delete
  </button>
</div>

            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors added yet</h3>
            <p className="text-gray-600 mb-6">Start building your healthcare professional network by adding your first doctor.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              Add Your First Doctor
            </button>
          </motion.div>
        )}

        {/* Doctor Detail Modal */}
        {showDetailModal && selectedDoctor && (
          <DoctorDetail
            doctor={selectedDoctor}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedDoctor(null);
            }}
            onEdit={(doctor) => {
              setShowDetailModal(false);
              setSelectedDoctor(null);
              handleEditDoctor(doctor);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AddDoctor;
