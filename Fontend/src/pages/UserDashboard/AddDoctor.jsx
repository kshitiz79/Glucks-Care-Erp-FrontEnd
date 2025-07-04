import React, { useState, useEffect, useContext } from 'react';
import { fetchDoctors, createDoctor, deleteDoctor } from '../../api/doctorApi';
import { fetchHeadOffices } from '../../api/headofficeApi';
import { LoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const libraries = ['places'];

const AddDoctor = () => {
  const { user } = useContext(AuthContext); // Access user data from AuthContext
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
      const createdDoctor = await createDoctor(newDoctorData);
      setDoctors((prev) => [...prev, createdDoctor]);
      setErrorMessage('Doctor created successfully!');
      setShowErrorModal(true);
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
      setShowForm(false);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create doctor');
      setShowErrorModal(true);
    }
  };

  const mapContainerStyle = { width: '100%', height: '400px' };

  // Check if form is valid for submit button
  const isFormValid = formData.name && user?.headOffice;

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-indigo-800">Doctors</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {showForm ? 'Close Form' : '+ Add Doctor'}
        </button>
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

      {/* Form */}
      {showForm && (
        <LoadScript googleMapsApiKey="AIzaSyBbiU_NzDhQsrPJiH8dzchmVdkXnS2f_Pg" libraries={libraries}>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-500 ease-in-out"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h3>
            {user && !user.headOffice && (
              <p className="text-red-500 mb-4">No head office assigned to your account. Please contact an administrator.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Specialization */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700">
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Location (Address) */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
                  Address
                </label>
                <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter address"
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </Autocomplete>
              </div>
              {/* Latitude */}
              <div>
                <label htmlFor="latitude" className="block text-sm font-semibold text-gray-700">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  readOnly
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              {/* Longitude */}
              <div>
                <label htmlFor="longitude" className="block text-sm font-semibold text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  readOnly
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              {/* Google Map */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pin Location
                </label>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={12}
                  onClick={handleMapClick}
                >
                  {markerPosition && <Marker position={markerPosition} />}
                </GoogleMap>
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Registration Number */}
              <div>
                <label htmlFor="registration_number" className="block text-sm font-semibold text-gray-700">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="registration_number"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Years of Experience */}
              <div>
                <label htmlFor="years_of_experience" className="block text-sm font-semibold text-gray-700">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="years_of_experience"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Date of Birth */}
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-semibold text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* Anniversary */}
              <div>
                <label htmlFor="anniversary" className="block text-sm font-semibold text-gray-700">
                  Anniversary
                </label>
                <input
                  type="date"
                  id="anniversary"
                  name="anniversary"
                  value={formData.anniversary}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
                  isFormValid
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add Doctor
              </button>
            </div>
          </form>
        </LoadScript>
      )}

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3 truncate">{doctor.name}</h3>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Specialization:</strong> {doctor.specialization || 'N/A'}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Experience:</strong> {doctor.years_of_experience || 'N/A'} years
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Location:</strong> {doctor.location || 'N/A'}
            </p>
            <p className="text-gray-600">
              <strong className="text-indigo-700">Coordinates:</strong> {doctor.latitude || 'N/A'}, {doctor.longitude || 'N/A'}
            </p>
            <button
              onClick={() => handleDeleteDoctor(doctor._id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddDoctor;