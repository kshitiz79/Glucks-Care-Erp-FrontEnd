import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChemist, fetchChemists, deleteChemist, updateChemist } from '../../api/chemistApi';
import { fetchHeadOffices } from '../../api/headofficeApi';

const AdminAddChemist = () => {
  const navigate = useNavigate();
  const [chemists, setChemists] = useState([]);
  const [headOffices, setHeadOffices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChemist, setEditingChemist] = useState(null);
  const [loading, setLoading] = useState(false);

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
    headOffice: '',
    // Annual turnover for last 2 years
    turnover2023: '',
    turnover2024: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [chemistsResponse, headOfficesData] = await Promise.all([
        fetchChemists(),
        fetchHeadOffices()
      ]);
      
      // Handle the response structure from chemist API
      const chemistsData = chemistsResponse.Data || chemistsResponse || [];
      setChemists(chemistsData);
      setHeadOffices(headOfficesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      headOffice: '',
      turnover2023: '',
      turnover2024: ''
    });
    setShowForm(false);
    setEditingChemist(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const chemistData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : undefined,
        annualTurnover: [
          ...(formData.turnover2023 ? [{ year: 2023, amount: parseFloat(formData.turnover2023) }] : []),
          ...(formData.turnover2024 ? [{ year: 2024, amount: parseFloat(formData.turnover2024) }] : [])
        ]
      };

      if (editingChemist) {
        const response = await updateChemist(editingChemist._id, chemistData);
        const updatedChemist = response.Data || response;
        setChemists(prev => prev.map(c => c._id === editingChemist._id ? updatedChemist : c));
        alert('Chemist updated successfully!');
      } else {
        const response = await createChemist(chemistData);
        const newChemist = response.Data || response;
        setChemists(prev => [...prev, newChemist]);
        alert('Chemist created successfully!');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving chemist:', error);
      alert(`Failed to ${editingChemist ? 'update' : 'create'} chemist: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (chemist) => {
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
      headOffice: typeof chemist.headOffice === 'object' ? chemist.headOffice._id : chemist.headOffice || '',
      turnover2023: chemist.annualTurnover?.find(t => t.year === 2023)?.amount || '',
      turnover2024: chemist.annualTurnover?.find(t => t.year === 2024)?.amount || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (chemistId) => {
    if (window.confirm('Are you sure you want to delete this chemist?')) {
      try {
        await deleteChemist(chemistId);
        setChemists(prev => prev.filter(c => c._id !== chemistId));
        alert('Chemist deleted successfully!');
      } catch (error) {
        console.error('Error deleting chemist:', error);
        alert('Failed to delete chemist');
      }
    }
  };

  const handleViewDetail = (chemistId) => {
    navigate(`/admin-dashboard/chemist-detail/${chemistId}`);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="md:text-3xl text-xl font-extrabold text-indigo-800 drop-shadow-lg">
          Chemists
        </h2>
        <button
          onClick={() => {
            if (showForm && editingChemist) {
              resetForm();
            } else {
              setShowForm(prev => !prev);
            }
          }}
          className="md:px-6 md:py-2 py-1 px-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl text-xs md:text-base hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          {showForm ? 'Close Form' : '+ Add Chemist'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-500 ease-in-out scale-100"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {editingChemist ? 'Edit Chemist' : 'Add New Chemist'}
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person Name *</label>
              <input
                type="text"
                name="contactPersonName"
                value={formData.contactPersonName}
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email ID</label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number</label>
              <input
                type="text"
                name="gstNo"
                value={formData.gstNo}
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Years in Business</label>
              <input
                type="number"
                name="yearsInBusiness"
                value={formData.yearsInBusiness}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Address */}
            <div className="col-span-full">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 mt-6">Address Information</h4>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
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

            {/* Business Details */}
            <div className="col-span-full">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 mt-6">Business Details</h4>
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
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editingChemist ? 'Update Chemist' : 'Add Chemist')}
            </button>
          </div>
        </form>
      )}

      {/* Chemist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chemists.map((chemist) => (
          <div
            key={chemist._id}
            className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-105 relative"
          >
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => handleViewDetail(chemist._id)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all"
                title="View Details"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
              <button
                onClick={() => handleEdit(chemist)}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-all"
                title="Edit Chemist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                onClick={() => handleDelete(chemist._id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-all"
                title="Delete Chemist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 truncate pr-20">
              {chemist.firmName}
            </h3>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Contact Person:</strong> {chemist.contactPersonName}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Mobile:</strong> {chemist.mobileNo}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Years in Business:</strong> {chemist.yearsInBusiness || 'N/A'} years
            </p>
            <p className="text-gray-600">
              <strong className="text-indigo-700">Head Office:</strong> {chemist.headOffice?.name || 'N/A'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAddChemist;