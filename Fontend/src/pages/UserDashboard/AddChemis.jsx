// src/pages/UserDashboard/AddChemist.jsx
import React, { useState, useEffect } from 'react';
import { fetchChemists, createChemist, deleteChemist } from './../../api/chemistApi';
import { fetchHeadOffices } from './../../api/headofficeApi';
import { LoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { motion } from 'framer-motion';

const libraries = ['places'];

const AddChemist = () => {
  const [chemists, setChemists] = useState([]);
  const [showForm, setShowForm] = useState(false);
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

  const handleDeleteChemist = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this chemist?');
    if (!confirmDelete) return;
  
    try {
      await deleteChemist(id); // Fixed: Changed 'rate' to 'id' and added closing parenthesis
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
      const createdChemist = await createChemist(newChemistData);
      setChemists(prev => [...prev, createdChemist]);
      setErrorMessage('Chemist created successfully!');
      setShowErrorModal(true);
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
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Failed to create chemist');
      setShowErrorModal(true);
    }
  };

  const mapContainerStyle = { width: '100%', height: '400px' };

  const isFormValid = formData.firmName && formData.mobileNo && formData.headOffice &&
                     /^[0-9a-fA-F]{24}$/.test(formData.headOffice);

  return (
    <div className="p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-indigo-800">Chemists</h2>
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {showForm ? 'Close Form' : '+ Add Chemist'}
        </button>
      </div>

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

      {showForm && (
        <LoadScript googleMapsApiKey="AIzaSyCLRC2KUtUshQ7B1YX_gFaKYadrpThcM3g" libraries={libraries}>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-500 ease-in-out"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Chemist</h3>
            {headOffices.length === 0 && (
              <p className="text-red-500 mb-4">No head offices available. Please add a head office first.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firmName" className="block text-sm font-semibold text-gray-700">
                  Firm Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firmName"
                  name="firmName"
                  value={formData.firmName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="contactPersonName" className="block text-sm font-semibold text-gray-700">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  id="contactPersonName"
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="designation" className="block text-sm font-semibold text-gray-700">
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="mobileNo" className="block text-sm font-semibold text-gray-700">
                  Mobile No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="mobileNo"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="emailId" className="block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="emailId"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="drugLicenseNumber" className="block text-sm font-semibold text-gray-700">
                  Drug License Number
                </label>
                <input
                  type="text"
                  id="drugLicenseNumber"
                  name="drugLicenseNumber"
                  value={formData.drugLicenseNumber}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="gstNo" className="block text-sm font-semibold text-gray-700">
                  GST No
                </label>
                <input
                  type="text"
                  id="gstNo"
                  name="gstNo"
                  value={formData.gstNo}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                  Address
                </label>
                <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </Autocomplete>
              </div>
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
              <div>
                <label htmlFor="yearsInBusiness" className="block text-sm font-semibold text-gray-700">
                  Years in Business
                </label>
                <input
                  type="number"
                  id="yearsInBusiness"
                  name="yearsInBusiness"
                  value={formData.yearsInBusiness}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Annual Turnover
                </label>
                {formData.annualTurnover.map((turnover, index) => (
                  <div key={index} className="flex gap-4 mb-2">
                    <input
                      type="number"
                      name={`annualTurnover[${index}].year`}
                      value={turnover.year}
                      onChange={handleChange}
                      placeholder="Year"
                      className="w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="number"
                      name={`annualTurnover[${index}].amount`}
                      value={turnover.amount}
                      onChange={handleChange}
                      placeholder="Amount"
                      className="w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {formData.annualTurnover.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTurnoverYear(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTurnoverYear}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Add Turnover Year
                </button>
              </div>
              <div>
                <label htmlFor="headOffice" className="block text-sm font-semibold text-gray-700">
                  Head Office <span className="text-red-500">*</span>
                </label>
                <select
                  id="headOffice"
                  name="headOffice"
                  value={formData.headOffice}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Head Office</option>
                  {headOffices.map(office => (
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
                Add Chemist
              </button>
            </div>
          </form>
        </LoadScript>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chemists.map(chemist => (
          <div
            key={chemist._id}
            className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3 truncate">{chemist.firmName}</h3>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Contact:</strong> {chemist.contactPersonName || 'N/A'}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Mobile:</strong> {chemist.mobileNo}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Address:</strong> {chemist.address || 'N/A'}
            </p>
            <p className="text-gray-600">
              <strong className="text-indigo-700">Coordinates:</strong> {chemist.latitude || 'N/A'}, {chemist.longitude || 'N/A'}
            </p>
            <button
              onClick={() => handleDeleteChemist(chemist._id)}
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

export default AddChemist;