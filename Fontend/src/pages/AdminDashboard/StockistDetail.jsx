import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../../BaseUrl/baseUrl';
import { formatCurrency } from '../../utils/formatNumber';

const StockistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stockist, setStockist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStockistDetail();
  }, [id]);

  const fetchStockistDetail = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/stockists`);
      if (!response.ok) {
        throw new Error('Failed to fetch stockists');
      }
      const stockists = await response.json();
      const stockistDetail = stockists.find(s => s._id === id);
      
      if (!stockistDetail) {
        throw new Error('Stockist not found');
      }
      
      setStockist(stockistDetail);
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
            onClick={() => navigate('/admin-dashboard/add-stockist')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Back to Stockists
          </button>
        </div>
      </div>
    );
  }

  if (!stockist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Stockist Not Found</h2>
          <button
            onClick={() => navigate('/admin-dashboard/add-stockist')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Back to Stockists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin-dashboard/add-stockist')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Stockists
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Stockist Details</h1>
        </div>

        {/* Stockist Information Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl font-bold text-indigo-600">
                  {stockist.firmName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-6 text-white">
                <h2 className="text-2xl font-bold">{stockist.firmName}</h2>
                <p className="text-indigo-100">{stockist.registeredBusinessName}</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nature of Business</label>
                    <p className="text-gray-900">{stockist.natureOfBusiness || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">GST Number</label>
                    <p className="text-gray-900">{stockist.gstNumber || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Drug License Number</label>
                    <p className="text-gray-900">{stockist.drugLicenseNumber || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">PAN Number</label>
                    <p className="text-gray-900">{stockist.panNumber || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Years in Business</label>
                    <p className="text-gray-900">{stockist.yearsInBusiness || 'Not provided'} years</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Head Office</label>
                    <p className="text-gray-900">{stockist.headOffice?.name || 'Not assigned'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Person</label>
                    <p className="text-gray-900">{stockist.contactPerson || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Designation</label>
                    <p className="text-gray-900">{stockist.designation || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mobile Number</label>
                    <p className="text-gray-900">{stockist.mobileNumber || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-gray-900">{stockist.emailAddress || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <p className="text-gray-900">
                      {stockist.website ? (
                        <a href={stockist.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          {stockist.website}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registered Office Address</label>
                    <p className="text-gray-900">{stockist.registeredOfficeAddress || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Areas of Operation</label>
                  <p className="text-gray-900">
                    {stockist.areasOfOperation && stockist.areasOfOperation.length > 0 
                      ? stockist.areasOfOperation.join(', ') 
                      : 'Not provided'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Pharma Distributorships</label>
                  <p className="text-gray-900">
                    {stockist.currentPharmaDistributorships && stockist.currentPharmaDistributorships.length > 0 
                      ? stockist.currentPharmaDistributorships.join(', ') 
                      : 'Not provided'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Number of Sales Representatives</label>
                  <p className="text-gray-900">{stockist.numberOfSalesRepresentatives || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">Facilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Warehouse Facility</label>
                  <p className="text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stockist.warehouseFacility 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stockist.warehouseFacility ? 'Available' : 'Not Available'}
                    </span>
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Cold Storage</label>
                  <p className="text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stockist.coldStorageAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stockist.coldStorageAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Storage Facility Size</label>
                  <p className="text-gray-900">
                    {stockist.storageFacilitySize ? `${stockist.storageFacilitySize} sq ft` : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Annual Turnover */}
            {stockist.annualTurnover && stockist.annualTurnover.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">Annual Turnover</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stockist.annualTurnover.map((turnover, index) => (
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

            {/* Bank Details */}
            {stockist.bankDetails && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bank Name</label>
                    <p className="text-gray-900">{stockist.bankDetails.bankName || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Branch</label>
                    <p className="text-gray-900">{stockist.bankDetails.branch || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Number</label>
                    <p className="text-gray-900">{stockist.bankDetails.accountNumber || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                    <p className="text-gray-900">{stockist.bankDetails.ifscCode || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            {(stockist.latitude && stockist.longitude) && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">Location</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    Coordinates: {stockist.latitude.toFixed(6)}, {stockist.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockistDetail;