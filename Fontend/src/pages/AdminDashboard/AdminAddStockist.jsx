import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStockist, fetchStockists, deleteStockist, updateStockist } from '../../api/stockistApi';
import { fetchHeadOffices } from '../../api/headofficeApi';

const AdminAddStockist = () => {
  const navigate = useNavigate();
  const [stockists, setStockists] = useState([]);
  const [headOffices, setHeadOffices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStockist, setEditingStockist] = useState(null);
  const [loading, setLoading] = useState(false);

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
    warehouseFacility: false,
    storageFacilitySize: '',
    coldStorageAvailable: false,
    numberOfSalesRepresentatives: '',
    headOffice: '',
    // Annual turnover for last 2 years
    turnover2023: '',
    turnover2024: '',
    // Bank details
    bankName: '',
    branch: '',
    accountNumber: '',
    ifscCode: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stockistsData, headOfficesData] = await Promise.all([
        fetchStockists(),
        fetchHeadOffices()
      ]);
      setStockists(stockistsData);
      setHeadOffices(headOfficesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
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
      warehouseFacility: false,
      storageFacilitySize: '',
      coldStorageAvailable: false,
      numberOfSalesRepresentatives: '',
      headOffice: '',
      turnover2023: '',
      turnover2024: '',
      bankName: '',
      branch: '',
      accountNumber: '',
      ifscCode: ''
    });
    setShowForm(false);
    setEditingStockist(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const stockistData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        yearsInBusiness: parseInt(formData.yearsInBusiness),
        storageFacilitySize: formData.storageFacilitySize ? parseInt(formData.storageFacilitySize) : undefined,
        numberOfSalesRepresentatives: formData.numberOfSalesRepresentatives ? parseInt(formData.numberOfSalesRepresentatives) : undefined,
        areasOfOperation: formData.areasOfOperation ? formData.areasOfOperation.split(',').map(s => s.trim()) : [],
        currentPharmaDistributorships: formData.currentPharmaDistributorships ? formData.currentPharmaDistributorships.split(',').map(s => s.trim()) : [],
        annualTurnover: [
          ...(formData.turnover2023 ? [{ year: 2023, amount: parseFloat(formData.turnover2023) }] : []),
          ...(formData.turnover2024 ? [{ year: 2024, amount: parseFloat(formData.turnover2024) }] : [])
        ],
        bankDetails: {
          bankName: formData.bankName,
          branch: formData.branch,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode
        }
      };

      if (editingStockist) {
        await updateStockist(editingStockist._id, stockistData);
        setStockists(prev => prev.map(s => s._id === editingStockist._id ? { ...s, ...stockistData } : s));
        alert('Stockist updated successfully!');
      } else {
        const newStockist = await createStockist(stockistData);
        setStockists(prev => [...prev, newStockist]);
        alert('Stockist created successfully!');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving stockist:', error);
      alert(`Failed to ${editingStockist ? 'update' : 'create'} stockist: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stockist) => {
    setEditingStockist(stockist);
    setFormData({
      firmName: stockist.firmName || '',
      registeredBusinessName: stockist.registeredBusinessName || '',
      natureOfBusiness: stockist.natureOfBusiness || '',
      gstNumber: stockist.gstNumber || '',
      drugLicenseNumber: stockist.drugLicenseNumber || '',
      panNumber: stockist.panNumber || '',
      registeredOfficeAddress: stockist.registeredOfficeAddress || '',
      latitude: stockist.latitude || '',
      longitude: stockist.longitude || '',
      contactPerson: stockist.contactPerson || '',
      designation: stockist.designation || '',
      mobileNumber: stockist.mobileNumber || '',
      emailAddress: stockist.emailAddress || '',
      website: stockist.website || '',
      yearsInBusiness: stockist.yearsInBusiness || '',
      areasOfOperation: stockist.areasOfOperation ? stockist.areasOfOperation.join(', ') : '',
      currentPharmaDistributorships: stockist.currentPharmaDistributorships ? stockist.currentPharmaDistributorships.join(', ') : '',
      warehouseFacility: stockist.warehouseFacility || false,
      storageFacilitySize: stockist.storageFacilitySize || '',
      coldStorageAvailable: stockist.coldStorageAvailable || false,
      numberOfSalesRepresentatives: stockist.numberOfSalesRepresentatives || '',
      headOffice: typeof stockist.headOffice === 'object' ? stockist.headOffice._id : stockist.headOffice || '',
      turnover2023: stockist.annualTurnover?.find(t => t.year === 2023)?.amount || '',
      turnover2024: stockist.annualTurnover?.find(t => t.year === 2024)?.amount || '',
      bankName: stockist.bankDetails?.bankName || '',
      branch: stockist.bankDetails?.branch || '',
      accountNumber: stockist.bankDetails?.accountNumber || '',
      ifscCode: stockist.bankDetails?.ifscCode || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (stockistId) => {
    if (window.confirm('Are you sure you want to delete this stockist?')) {
      try {
        await deleteStockist(stockistId);
        setStockists(prev => prev.filter(s => s._id !== stockistId));
        alert('Stockist deleted successfully!');
      } catch (error) {
        console.error('Error deleting stockist:', error);
        alert('Failed to delete stockist');
      }
    }
  };

  const handleViewDetail = (stockistId) => {
    navigate(`/admin-dashboard/stockist-detail/${stockistId}`);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="md:text-3xl text-xl font-extrabold text-indigo-800 drop-shadow-lg">
          Stockists
        </h2>
        <button
          onClick={() => {
            if (showForm && editingStockist) {
              resetForm();
            } else {
              setShowForm(prev => !prev);
            }
          }}
          className="md:px-6 md:py-2 py-1 px-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl text-xs md:text-base hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          {showForm ? 'Close Form' : '+ Add Stockist'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-500 ease-in-out scale-100"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {editingStockist ? 'Edit Stockist' : 'Add New Stockist'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="col-span-full">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Basic Information</h4>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Firm Name *</label>
              <input
                type="text"
                name="firmName"
                value={formData.firmName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Registered Business Name *</label>
              <input
                type="text"
                name="registeredBusinessName"
                value={formData.registeredBusinessName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nature of Business *</label>
              <select
                name="natureOfBusiness"
                value={formData.natureOfBusiness}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Business Type</option>
                <option value="Proprietorship">Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Private Ltd.">Private Ltd.</option>
                <option value="Public Ltd.">Public Ltd.</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Drug License Number</label>
              <input
                type="text"
                name="drugLicenseNumber"
                value={formData.drugLicenseNumber}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Contact Information */}
            <div className="col-span-full">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 mt-6">Contact Information</h4>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Registered Office Address *</label>
              <textarea
                name="registeredOfficeAddress"
                value={formData.registeredOfficeAddress}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person *</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Head Office *</label>
              <select
                name="headOffice"
                value={formData.headOffice}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Head Office</option>
                {headOffices.map((office) => (
                  <option key={office._id} value={office._id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Details */}
            <div className="col-span-full">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 mt-6">Business Details</h4>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Years in Business *</label>
              <input
                type="number"
                name="yearsInBusiness"
                value={formData.yearsInBusiness}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Turnover 2023</label>
              <input
                type="number"
                name="turnover2023"
                value={formData.turnover2023}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Turnover 2024</label>
              <input
                type="number"
                name="turnover2024"
                value={formData.turnover2024}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Areas of Operation (comma separated)</label>
              <input
                type="text"
                name="areasOfOperation"
                value={formData.areasOfOperation}
                onChange={handleChange}
                placeholder="e.g., Mumbai, Delhi, Bangalore"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Pharma Distributorships (comma separated)</label>
              <input
                type="text"
                name="currentPharmaDistributorships"
                value={formData.currentPharmaDistributorships}
                onChange={handleChange}
                placeholder="e.g., Company A, Company B"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Facilities */}
            <div className="col-span-full">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 mt-6">Facilities</h4>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="warehouseFacility"
                checked={formData.warehouseFacility}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-semibold text-gray-700">Warehouse Facility</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="coldStorageAvailable"
                checked={formData.coldStorageAvailable}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-semibold text-gray-700">Cold Storage Available</label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Storage Facility Size (sq ft)</label>
              <input
                type="number"
                name="storageFacilitySize"
                value={formData.storageFacilitySize}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Sales Representatives</label>
              <input
                type="number"
                name="numberOfSalesRepresentatives"
                value={formData.numberOfSalesRepresentatives}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Bank Details */}
            <div className="col-span-full">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 mt-6">Bank Details</h4>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Location */}
            <div className="col-span-full">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 mt-6">Location (Optional)</h4>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editingStockist ? 'Update Stockist' : 'Add Stockist')}
            </button>
          </div>
        </form>
      )}

      {/* Stockist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stockists.map((stockist) => (
          <div
            key={stockist._id}
            className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-105 relative"
          >
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => handleViewDetail(stockist._id)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all"
                title="View Details"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
              <button
                onClick={() => handleEdit(stockist)}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-all"
                title="Edit Stockist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                onClick={() => handleDelete(stockist._id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-all"
                title="Delete Stockist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 truncate pr-20">
              {stockist.firmName}
            </h3>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Contact:</strong> {stockist.contactPerson}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Business Type:</strong> {stockist.natureOfBusiness}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Years in Business:</strong> {stockist.yearsInBusiness} years
            </p>
            <p className="text-gray-600">
              <strong className="text-indigo-700">Head Office:</strong> {stockist.headOffice?.name || 'N/A'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAddStockist;