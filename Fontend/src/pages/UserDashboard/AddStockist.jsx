// src/components/AddStockist.jsx
import React, { useState, useEffect } from 'react';
import { fetchStockists, createStockist, updateStockist, deleteStockist } from './../../api/stockistApi';
import { fetchHeadOffices } from './../../api/headofficeApi';
import { LoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import StockistDetail from './StockistDetail';

const libraries = ['places'];

const AddStockist = () => {
  const [stockists, setStockists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStockist, setEditingStockist] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStockist, setSelectedStockist] = useState(null);
  const [headOffices, setHeadOffices] = useState([]);
  const [formData, setFormData] = useState({
    firmName: '',
    registeredBusinessName: '',
    natureOfBusiness: '',
    gstNumber: '',
    drugLicenseNumber: '',
    panNumber: '',
    registeredOfficeAddress: '',
    latitude: '',
    longitude: '',
    contactPerson: '',
    designation: '',
    mobileNumber: '',
    emailAddress: '',
    website: '',
    yearsInBusiness: '',
    areasOfOperation: '',
    currentPharmaDistributorships: '',
    annualTurnover: [
      { year: new Date().getFullYear() - 1, amount: '' }, // Pre-fill 2024
      { year: new Date().getFullYear() - 2, amount: '' }, // Pre-fill 2023
    ],
    warehouseFacility: false,
    storageFacilitySize: '',
    coldStorageAvailable: false,
    numberOfSalesRepresentatives: '',
    bankDetails: { bankName: '', branch: '', accountNumber: '', ifscCode: '' },
    headOffice: '',
  });
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    fetchStockists()
      .then(data => setStockists(data))
      .catch(err => {
        console.error(err);
        setErrorMessage(err.message || 'Failed to fetch stockists');
        setShowErrorModal(true);
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
    if (name.includes('bankDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bankDetails: { ...prev.bankDetails, [field]: value },
      }));
    } else if (name.includes('annualTurnover')) {
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
          registeredOfficeAddress: place.formatted_address,
          latitude: lat,
          longitude: lng,
        }));
      }
    }
  };

  const handleDeleteStockist = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this stockist?');
    if (!confirmDelete) return;

    try {
      await deleteStockist(id);
      setStockists(prev => prev.filter(stock => stock._id !== id));
      setErrorMessage('Stockist deleted successfully!');
      setShowErrorModal(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to delete stockist');
      setShowErrorModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firmName || !formData.natureOfBusiness || !formData.mobileNumber || !formData.headOffice) {
      setErrorMessage('Please fill all required fields (Firm Name, Nature of Business, Mobile Number, Head Office).');
      setShowErrorModal(true);
      return;
    }

    if (!/^[0-9a-fA-F]{24}$/.test(formData.headOffice)) {
      setErrorMessage('Please select a valid Head Office.');
      setShowErrorModal(true);
      return;
    }

    // Validate annualTurnover for last two years
    const currentYear = new Date().getFullYear();
    const requiredYears = [currentYear - 1, currentYear - 2]; // e.g., [2024, 2023]
    const turnoverYears = formData.annualTurnover.map(t => parseInt(t.year, 10)).filter(y => !isNaN(y));
    const missingYears = requiredYears.filter(year => !turnoverYears.includes(year));
    if (missingYears.length > 0) {
      setErrorMessage(`Please provide turnover data for years ${missingYears.join(', ')}.`);
      setShowErrorModal(true);
      return;
    }

    // Validate turnover amounts
    for (const turnover of formData.annualTurnover) {
      if (turnover.year && (!turnover.amount || parseFloat(turnover.amount) <= 0)) {
        setErrorMessage(`Please provide a valid positive amount for year ${turnover.year}.`);
        setShowErrorModal(true);
        return;
      }
    }

    const newStockistData = {
      firmName: formData.firmName,
      registeredBusinessName: formData.registeredBusinessName || undefined,
      natureOfBusiness: formData.natureOfBusiness,
      gstNumber: formData.gstNumber || undefined,
      drugLicenseNumber: formData.drugLicenseNumber || undefined,
      panNumber: formData.panNumber || undefined,
      registeredOfficeAddress: formData.registeredOfficeAddress || undefined,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      contactPerson: formData.contactPerson || undefined,
      designation: formData.designation || undefined,
      mobileNumber: formData.mobileNumber,
      emailAddress: formData.emailAddress || undefined,
      website: formData.website || undefined,
      yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness, 10) : undefined,
      areasOfOperation: formData.areasOfOperation ? formData.areasOfOperation.split(',').map(s => s.trim()) : [],
      currentPharmaDistributorships: formData.currentPharmaDistributorships ? formData.currentPharmaDistributorships.split(',').map(s => s.trim()) : [],
      annualTurnover: formData.annualTurnover
        .map(turnover => ({
          year: turnover.year ? parseInt(turnover.year, 10) : undefined,
          amount: turnover.amount ? parseFloat(turnover.amount) : undefined,
        }))
        .filter(turnover => turnover.year && turnover.amount),
      warehouseFacility: formData.warehouseFacility,
      storageFacilitySize: formData.storageFacilitySize ? parseInt(formData.storageFacilitySize, 10) : undefined,
      coldStorageAvailable: formData.coldStorageAvailable,
      numberOfSalesRepresentatives: formData.numberOfSalesRepresentatives ? parseInt(formData.numberOfSalesRepresentatives, 10) : undefined,
      bankDetails: {
        bankName: formData.bankDetails.bankName || undefined,
        branch: formData.bankDetails.branch || undefined,
        accountNumber: formData.bankDetails.accountNumber || undefined,
        ifscCode: formData.bankDetails.ifscCode || undefined,
      },
      headOffice: formData.headOffice,
    };

    try {
      const createdStockist = await createStockist(newStockistData);
      setStockists(prev => [...prev, createdStockist]);
      setErrorMessage('Stockist created successfully!');
      setShowErrorModal(true);
      setFormData({
        firmName: '',
        registeredBusinessName: '',
        natureOfBusiness: '',
        gstNumber: '',
        drugLicenseNumber: '',
        panNumber: '',
        registeredOfficeAddress: '',
        latitude: '',
        longitude: '',
        contactPerson: '',
        designation: '',
        mobileNumber: '',
        emailAddress: '',
        website: '',
        yearsInBusiness: '',
        areasOfOperation: '',
        currentPharmaDistributorships: '',
        annualTurnover: [
          { year: currentYear - 1, amount: '' },
          { year: currentYear - 2, amount: '' },
        ],
        warehouseFacility: false,
        storageFacilitySize: '',
        coldStorageAvailable: false,
        numberOfSalesRepresentatives: '',
        bankDetails: { bankName: '', branch: '', accountNumber: '', ifscCode: '' },
        headOffice: '',
      });
      setMarkerPosition(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Failed to create stockist');
      setShowErrorModal(true);
    }
  };

  const mapContainerStyle = { width: '100%', height: '400px' };

  const isFormValid = formData.firmName && formData.natureOfBusiness && formData.mobileNumber &&
                     formData.headOffice && /^[0-9a-fA-F]{24}$/.test(formData.headOffice) &&
                     formData.annualTurnover.every(turnover => {
                       const year = parseInt(turnover.year, 10);
                       const amount = parseFloat(turnover.amount);
                       return year && amount > 0;
                     });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <span className="text-4xl">🏢</span>
                Stockist Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your distribution network and stockist partnerships</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>{stockists.length} Total Stockists</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Distribution Network</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(prev => !prev)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 font-semibold"
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
                  Add New Stockist
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
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Stockist</h3>
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
                <label htmlFor="registeredBusinessName" className="block text-sm font-semibold text-gray-700">
                  Registered Business Name
                </label>
                <input
                  type="text"
                  id="registeredBusinessName"
                  name="registeredBusinessName"
                  value={formData.registeredBusinessName}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="natureOfBusiness" className="block text-sm font-semibold text-gray-700">
                  Nature of Business <span className="text-red-500">*</span>
                </label>
                <select
                  id="natureOfBusiness"
                  name="natureOfBusiness"
                  value={formData.natureOfBusiness}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Nature</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Private Ltd.">Private Ltd.</option>
                  <option value="Public Ltd.">Public Ltd.</option>
                </select>
              </div>
              <div>
                <label htmlFor="gstNumber" className="block text-sm font-semibold text-gray-700">
                  GST Number
                </label>
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  value={formData.gstNumber}
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
                <label htmlFor="panNumber" className="block text-sm font-semibold text-gray-700">
                  PAN Number
                </label>
                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="registeredOfficeAddress" className="block text-sm font-semibold text-gray-700">
                  Registered Office Address
                </label>
                <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                  <input
                    type="text"
                    id="registeredOfficeAddress"
                    name="registeredOfficeAddress"
                    value={formData.registeredOfficeAddress}
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
                <label htmlFor="contactPerson" className="block text-sm font-semibold text-gray-700">
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
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
                <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
              <div>
                <label htmlFor="areasOfOperation" className="block text-sm font-semibold text-gray-700">
                  Areas of Operation (comma-separated)
                </label>
                <input
                  type="text"
                  id="areasOfOperation"
                  name="areasOfOperation"
                  value={formData.areasOfOperation}
                  onChange={handleChange}
                  placeholder="e.g., Delhi, Mumbai"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="currentPharmaDistributorships" className="block text-sm font-semibold text-gray-700">
                  Current Pharma Distributorships (comma-separated)
                </label>
                <input
                  type="text"
                  id="currentPharmaDistributorships"
                  name="currentPharmaDistributorships"
                  value={formData.currentPharmaDistributorships}
                  onChange={handleChange}
                  placeholder="e.g., Pfizer, Cipla"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Annual Turnover (Last two years mandatory) <span className="text-red-500">*</span>
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
                      required={index < 2} // Mandatory for first two entries
                    />
                    <input
                      type="number"
                      name={`annualTurnover[${index}].amount`}
                      value={turnover.amount}
                      onChange={handleChange}
                      placeholder="Amount"
                      className="w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required={index < 2} // Mandatory for first two entries
                    />
                    {index >= 2 && (
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
                <label htmlFor="warehouseFacility" className="block text-sm font-semibold text-gray-700">
                  Warehouse Facility
                </label>
                <input
                  type="checkbox"
                  id="warehouseFacility"
                  name="warehouseFacility"
                  checked={formData.warehouseFacility}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="storageFacilitySize" className="block text-sm font-semibold text-gray-700">
                  Storage Facility Size (sq ft)
                </label>
                <input
                  type="number"
                  id="storageFacilitySize"
                  name="storageFacilitySize"
                  value={formData.storageFacilitySize}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="coldStorageAvailable" className="block text-sm font-semibold text-gray-700">
                  Cold Storage Available
                </label>
                <input
                  type="checkbox"
                  id="coldStorageAvailable"
                  name="coldStorageAvailable"
                  checked={formData.coldStorageAvailable}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div>
              <label htmlFor="numberOfSalesRepresentatives" className="block text-sm font-semibold text-gray-700">
                  Number of Sales Representatives
                </label>
                <input
                  type="number"
                  id="numberOfSalesRepresentatives"
                  name="numberOfSalesRepresentatives"
                  value={formData.numberOfSalesRepresentatives}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
           
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bank Details
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bankDetails.bankName" className="block text-sm font-semibold text-gray-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      id="bankDetails.bankName"
                      name="bankDetails.bankName"
                      value={formData.bankDetails.bankName}
                      onChange={handleChange}
                      className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="bankDetails.branch" className="block text-sm font-semibold text-gray-700">
                      Branch
                    </label>
                    <input
                      type="text"
                      id="bankDetails.branch"
                      name="bankDetails.branch"
                      value={formData.bankDetails.branch}
                      onChange={handleChange}
                      className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="bankDetails.accountNumber" className="block text-sm font-semibold text-gray-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="bankDetails.accountNumber"
                      name="bankDetails.accountNumber"
                      value={formData.bankDetails.accountNumber}
                      onChange={handleChange}
                      className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="bankDetails.ifscCode" className="block text-sm font-semibold text-gray-700">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      id="bankDetails.ifscCode"
                      name="bankDetails.ifscCode"
                      value={formData.bankDetails.ifscCode}
                      onChange={handleChange}
                      className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
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
                className={isFormValid 
                  ? 'px-6 py-3 rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg'
                  : 'px-6 py-3 rounded-lg shadow-md transition-all duration-300 bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              >
                Add Stockist
              </button>
            </div>
          </form>
        </LoadScript>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stockists.map(stockist => (
          <div
            key={stockist._id}
            className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3 truncate">{stockist.firmName}</h3>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Business Type:</strong> {stockist.natureOfBusiness}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Contact:</strong> {stockist.contactPerson || 'N/A'}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Mobile:</strong> {stockist.mobileNumber}
            </p>
            <p className="text-gray-600">
              <strong className="text-indigo-700">Address:</strong> {stockist.registeredOfficeAddress || 'N/A'}
            </p>
            <button
              onClick={() => handleDeleteStockist(stockist._id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>
          ))}                                 // 1: end of stockists.map
          </div>                                 // 2: close grid wrapper
        </div>                                   // 3: close max-w-7xl container
      </div>                                     // 4: close min-h-screen wrapper
    );                                           // 5: end of return(
    
    };                                           // 6: end of AddStockist component
    
    export default AddStockist;      