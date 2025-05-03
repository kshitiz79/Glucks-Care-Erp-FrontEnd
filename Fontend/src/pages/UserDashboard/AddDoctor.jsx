// src/components/AddDoctor.jsx
import React, { useState, useEffect } from 'react';
import { fetchDoctors, createDoctor, deleteDoctor } from '../../api/doctorApi';
import { fetchHeadOffices } from '../../api/headofficeApi';
import { LoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { motion } from 'framer-motion';

const libraries = ['places'];

const AddDoctor = () => {
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
    head_office: '',
  });
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    fetchDoctors()
      .then(data => setDoctors(data))
      .catch(err => {
        console.error(err);
        setErrorMessage(err.message || 'Failed to fetch doctors');
        setShowErrorModal(true);
      });
  }, []);

  useEffect(() => {
    fetchHeadOffices()
      .then(data => setHeadOffices(data))
      .catch(err => {
        console.error(err);
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
      console.error(error);
      setErrorMessage(error.message || 'Failed to delete doctor');
      setShowErrorModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.specialization || !formData.email || !formData.phone ||
        !formData.registration_number || !formData.years_of_experience || !formData.date_of_birth ||
        !formData.gender || !formData.head_office) {
      setErrorMessage('Please fill all required fields.');
      setShowErrorModal(true);
      return;
    }

    // Validate head_office is a valid ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(formData.head_office)) {
      setErrorMessage('Please select a valid Head Office.');
      setShowErrorModal(true);
      return;
    }

    const newDoctorData = {
      name: formData.name,
      specialization: formData.specialization,
      location: formData.location,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      email: formData.email,
      phone: formData.phone,
      registration_number: formData.registration_number,
      years_of_experience: parseInt(formData.years_of_experience, 10),
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      anniversary: formData.anniversary || undefined,
      head_office: formData.head_office,
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
        head_office: '',
      });
      setMarkerPosition(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Failed to create doctor');
      setShowErrorModal(true);
    }
  };

  const mapContainerStyle = { width: '100%', height: '400px' };

  // Check if form is valid for submit button
  const isFormValid = formData.name && formData.specialization && formData.email &&
                     formData.phone && formData.registration_number && formData.years_of_experience &&
                     formData.date_of_birth && formData.gender && formData.head_office &&
                     /^[0-9a-fA-F]{24}$/.test(formData.head_office);

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
        <LoadScript googleMapsApiKey="AIzaSyCLRC2KUtUshQ7B1YX_gFaKYadrpThcM3g" libraries={libraries}>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-500 ease-in-out"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h3>
            {headOffices.length === 0 && (
              <p className="text-red-500 mb-4">No head offices available. Please add a head office first.</p>
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
                  Specialization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
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
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Registration Number */}
              <div>
                <label htmlFor="registration_number" className="block text-sm font-semibold text-gray-700">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="registration_number"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Years of Experience */}
              <div>
                <label htmlFor="years_of_experience" className="block text-sm font-semibold text-gray-700">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="years_of_experience"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Date of Birth */}
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-semibold text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
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
              {/* Head Office Dropdown */}
              <div>
                <label htmlFor="head_office" className="block text-sm font-semibold text-gray-700">
                  Head Office <span className="text-red-500">*</span>
                </label>
                <select
                  id="head_office"
                  name="head_office"
                  value={formData.head_office}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Head Office</option>
                  {headOffices.map((office) => (
                    <option key={office._id} value={office._id}>
                      {office.name}
                    </option>
                  ))}
                </select>
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
              <strong className="text-indigo-700">Specialization:</strong> {doctor.specialization}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Experience:</strong> {doctor.years_of_experience} years
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Location:</strong> {doctor.location}
            </p>
            <p className="text-gray-600">
              <strong className="text-indigo-700">Coordinates:</strong> {doctor.latitude}, {doctor.longitude}
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