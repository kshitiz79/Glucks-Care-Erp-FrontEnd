import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../../BaseUrl/baseUrl';

const StockistVisitingAdminById = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserVisits();
  }, [userId]);

  const fetchUserVisits = async () => {
    try {
      // Fetch all visits and filter by user
      const response = await fetch(`${BASE_URL}/api/stockists/visits`);
      if (!response.ok) {
        throw new Error('Failed to fetch visits');
      }
      const allVisits = await response.json();
      
      // Filter visits for this specific user
      const userVisits = allVisits.filter(visit => visit.user && visit.user._id === userId);
      setVisits(userVisits);
      
      if (userVisits.length > 0) {
        setUser(userVisits[0].user);
      }
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
            onClick={() => navigate('/admin-dashboard/stockist-visiting')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Back to Stockist Visits
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
            onClick={() => navigate('/admin-dashboard/stockist-visiting')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Stockist Visits
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Stockist Visits</h1>
            <p className="text-gray-600">
              {user ? `${user.name} (ID: ${userId.slice(-6)})` : 'User Details'}
            </p>
          </div>
        </div>

        {/* Visits List */}
        {visits.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-gray-600 text-lg">No stockist visits found</p>
            <p className="text-gray-500 mt-2">This user hasn't scheduled any stockist visits yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {visits.map((visit) => (
              <div
                key={visit._id}
                className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {visit.stockist?.firmName || 'Unknown Stockist'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Contact Person:</span> {visit.stockist?.contactPerson || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Mobile:</span> {visit.stockist?.mobileNumber || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span> {visit.stockist?.registeredOfficeAddress || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">GST Number:</span> {visit.stockist?.gstNumber || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      visit.confirmed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {visit.confirmed ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Scheduled Date:</span>
                      <p className="text-gray-900">
                        {new Date(visit.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Visit Notes:</span>
                      <p className="text-gray-900">{visit.notes || 'No notes provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Created:</span>
                      <p className="text-gray-900">
                        {new Date(visit.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {visit.confirmed && visit.latitude && visit.longitude && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Visit Confirmation Details</h4>
                      <div className="text-sm text-green-700">
                        <p>Confirmed at coordinates: {visit.latitude.toFixed(6)}, {visit.longitude.toFixed(6)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockistVisitingAdminById;