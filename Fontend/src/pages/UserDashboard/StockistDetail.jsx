import React from 'react';
import { motion } from 'framer-motion';

const StockistDetail = ({ stockist, onClose, onEdit }) => {
  if (!stockist) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{stockist.firmName}</h2>
                <p className="text-purple-100 text-lg">{stockist.registeredBusinessName || 'Distribution Partner'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Business Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Business Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Nature of Business</p>
                      <p className="font-medium text-gray-900">{stockist.natureOfBusiness}</p>
                    </div>
                  </div>

                  {stockist.gstNumber && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">GST Number</p>
                        <p className="font-medium text-gray-900">{stockist.gstNumber}</p>
                      </div>
                    </div>
                  )}

                  {stockist.drugLicenseNumber && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Drug License</p>
                        <p className="font-medium text-gray-900">{stockist.drugLicenseNumber}</p>
                      </div>
                    </div>
                  )}

                  {stockist.panNumber && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">PAN Number</p>
                        <p className="font-medium text-gray-900">{stockist.panNumber}</p>
                      </div>
                    </div>
                  )}

                  {stockist.yearsInBusiness && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Years in Business</p>
                        <p className="font-medium text-gray-900">{stockist.yearsInBusiness} years</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact & Operations */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {stockist.contactPerson && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Contact Person</p>
                        <p className="font-medium text-gray-900">{stockist.contactPerson}</p>
                        {stockist.designation && (
                          <p className="text-sm text-gray-600">{stockist.designation}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Mobile Number</p>
                      <p className="font-medium text-gray-900">{stockist.mobileNumber}</p>
                    </div>
                  </div>

                  {stockist.emailAddress && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{stockist.emailAddress}</p>
                      </div>
                    </div>
                  )}

                  {stockist.website && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <p className="font-medium text-gray-900">{stockist.website}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Operations */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Operations
                </h3>
                <div className="space-y-4">
                  {stockist.areasOfOperation && stockist.areasOfOperation.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Areas of Operation</p>
                      <div className="flex flex-wrap gap-2">
                        {stockist.areasOfOperation.map((area, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {stockist.currentPharmaDistributorships && stockist.currentPharmaDistributorships.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Current Distributorships</p>
                      <div className="flex flex-wrap gap-2">
                        {stockist.currentPharmaDistributorships.map((dist, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {dist}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {stockist.numberOfSalesRepresentatives && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Sales Representatives</p>
                        <p className="font-medium text-gray-900">{stockist.numberOfSalesRepresentatives}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Financial & Facilities */}
            <div className="space-y-6">
              {/* Annual Turnover */}
              {stockist.annualTurnover && stockist.annualTurnover.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Annual Turnover
                  </h3>
                  <div className="space-y-3">
                    {stockist.annualTurnover.map((turnover, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Year {turnover.year}</span>
                        <span className="font-semibold text-gray-900">₹{turnover.amount?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Facilities
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stockist.warehouseFacility ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-gray-700">Warehouse Facility</span>
                    <span className={`text-sm font-medium ${stockist.warehouseFacility ? 'text-green-600' : 'text-red-600'}`}>
                      {stockist.warehouseFacility ? 'Available' : 'Not Available'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stockist.coldStorageAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-gray-700">Cold Storage</span>
                    <span className={`text-sm font-medium ${stockist.coldStorageAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {stockist.coldStorageAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </div>

                  {stockist.storageFacilitySize && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Storage Size</p>
                        <p className="font-medium text-gray-900">{stockist.storageFacilitySize} sq ft</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Details */}
              {stockist.bankDetails && (stockist.bankDetails.bankName || stockist.bankDetails.accountNumber) && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    Bank Details
                  </h3>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    {stockist.bankDetails.bankName && (
                      <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p className="font-medium text-gray-900">{stockist.bankDetails.bankName}</p>
                      </div>
                    )}
                    {stockist.bankDetails.branch && (
                      <div>
                        <p className="text-sm text-gray-500">Branch</p>
                        <p className="font-medium text-gray-900">{stockist.bankDetails.branch}</p>
                      </div>
                    )}
                    {stockist.bankDetails.accountNumber && (
                      <div>
                        <p className="text-sm text-gray-500">Account Number</p>
                        <p className="font-medium text-gray-900">****{stockist.bankDetails.accountNumber.slice(-4)}</p>
                      </div>
                    )}
                    {stockist.bankDetails.ifscCode && (
                      <div>
                        <p className="text-sm text-gray-500">IFSC Code</p>
                        <p className="font-medium text-gray-900">{stockist.bankDetails.ifscCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location Information */}
          {stockist.registeredOfficeAddress && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Location
              </h3>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Registered Office Address</p>
                  <p className="font-medium text-gray-900">{stockist.registeredOfficeAddress}</p>
                  {stockist.latitude && stockist.longitude && (
                    <p className="text-sm text-gray-500 mt-1">
                      Coordinates: {stockist.latitude}, {stockist.longitude}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-200 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(stockist)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Stockist
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StockistDetail;