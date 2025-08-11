import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../../BaseUrl/baseUrl';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctorDetail();
  }, [id]);

  const fetchDoctorDetail = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/doctors/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctor details');
      }
      const data = await response.json();
      setDoctor(data);
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
            onClick={() => navigate('/admin-dashboard/add-doctor')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Doctor Not Found</h2>
          <button
            onClick={() => navigate('/admin-dashboard/add-doctor')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Back to Doctors
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
            onClick={() => navigate('/admin-dashboard/add-doctor')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Doctors
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Details</h1>
        </div>

        {/* Doctor Information Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl font-bold text-indigo-600">
                  {doctor.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-6 text-white">
                <h2 className="text-2xl font-bold">{doctor.name}</h2>
                <p className="text-indigo-100">{doctor.specialization}</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{doctor.email || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{doctor.phone || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900">{doctor.gender || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">
                      {doctor.date_of_birth 
                        ? new Date(doctor.date_of_birth).toLocaleDateString() 
                        : 'Not provided'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Anniversary</label>
                    <p className="text-gray-900">
                      {doctor.anniversary 
                        ? new Date(doctor.anniversary).toLocaleDateString() 
                        : 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Number</label>
                    <p className="text-gray-900">{doctor.registration_number || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Years of Experience</label>
                    <p className="text-gray-900">{doctor.years_of_experience || 'Not provided'} years</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900">{doctor.location || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Head Office</label>
                    <p className="text-gray-900">
                      {doctor.headOffice?.name || 'Not assigned'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visit History */}
            {doctor.visit_history && doctor.visit_history.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Visit History</h3>
                <div className="space-y-3">
                  {doctor.visit_history.map((visit, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(visit.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">{visit.notes || 'No notes'}</p>
                          <p className="text-sm text-gray-500">By: {visit.userName || 'Unknown'}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          visit.confirmed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {visit.confirmed ? 'Confirmed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;