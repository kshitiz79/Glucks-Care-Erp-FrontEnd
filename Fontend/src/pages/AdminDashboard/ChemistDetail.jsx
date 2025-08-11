import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchChemists } from '../../api/chemistApi';
import { formatCurrency } from '../../utils/formatNumber';

const ChemistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chemist, setChemist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChemistDetail();
  }, [id]);

  const fetchChemistDetail = async () => {
    try {
      const response = await fetchChemists();
      const chemistsData = response.Data || response || [];
      const chemistDetail = chemistsData.find(c => c._id === id);
      
      if (!chemistDetail) {
        throw new Error('Chemist not found');
      }
      
      setChemist(chemistDetail);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin-dashboard/add-chemist')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Back to Chemists
          </button>
        </div>
      </div>
    );
  }

  if (!chemist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Chemist Not Found</h2>
          <button
            onClick={() => navigate('/admin-dashboard/add-chemist')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Back to Chemists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin-dashboard/add-chemist')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Chemists
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Chemist Details</h1>
        </div>

        {/* Chemist Information Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl font-bold text-indigo-600">
                  {chemist.firmName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-6 text-white">
                <h2 className="text-2xl font-bold">{chemist.firmName}</h2>
                <p className="text-indigo-100">{chemist.contactPersonName}</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Person Name</label>
                    <p className="text-gray-900">{chemist.contactPersonName || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Designation</label>
                    <p className="text-gray-900">{chemist.designation || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile Number</label>
                    <p className="text-gray-900">{chemist.mobileNo || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email ID</label>
                    <p className="text-gray-900">{chemist.emailId || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{chemist.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Business Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Drug License Number</label>
                    <p className="text-gray-900">{chemist.drugLicenseNumber || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">GST Number</label>
                    <p className="text-gray-900">{chemist.gstNo || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Years in Business</label>
                    <p className="text-gray-900">{chemist.yearsInBusiness || 'Not provided'} years</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Head Office</label>
                    <p className="text-gray-900">
                      {chemist.headOffice?.name || 'Not assigned'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Annual Turnover */}
            {chemist.annualTurnover && chemist.annualTurnover.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Annual Turnover</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chemist.annualTurnover.map((turnover, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Year {turnover.year}</span>
                        <span className="text-lg font-semibold text-indigo-600">
                          {turnover.amount ? formatCurrency(turnover.amount) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {(chemist.latitude && chemist.longitude) && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Location</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    Coordinates: {chemist.latitude.toFixed(6)}, {chemist.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            )}

            {/* Creation Date */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Additional Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">
                  <p>Created: {chemist.createdAt ? new Date(chemist.createdAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemistDetail;