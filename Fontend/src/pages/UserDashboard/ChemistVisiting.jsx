// src/components/ChemistVisiting.jsx
import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from './../../context/AuthContext';
import { fetchChemists, scheduleChemistVisit, fetchChemistVisits, confirmChemistVisit } from './../../api/chemistApi';
import BASE_URL from '../../BaseUrl/baseUrl';

const ChemistVisiting = () => {
  const { user } = useContext(AuthContext);
  const [chemists, setChemists] = useState([]);
  const [visits, setVisits] = useState([]);
  const [scheduledVisits, setScheduledVisits] = useState([]);
  const [confirmedVisits, setConfirmedVisits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedChemistId, setSelectedChemistId] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');



  const fetchChemistsList = async () => {
    try {
      const response = await fetchChemists();
      // Ensure data is an array; use response.Data if API returns an object
      const data = Array.isArray(response) ? response : response.Data || [];
      setChemists(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to fetch chemists');
      setShowErrorModal(true);
      setChemists([]); // Ensure chemists remains an array on error
    }
  };

  const fetchVisits = async () => {
    if (!user) return;
    try {
      const response = await fetchChemistVisits(user.id);
      // Ensure data is an array; use response.Data if API returns an object
      const data = Array.isArray(response) ? response : response.Data || [];
      setVisits(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to fetch visits');
      setShowErrorModal(true);
      setVisits([]); // Ensure visits remains an array on error
    }
  };

  useEffect(() => {
    const scheduled = visits.filter((v) => !v.confirmed);
    const confirmed = visits.filter((v) => v.confirmed);
    setScheduledVisits(scheduled);
    setConfirmedVisits(confirmed);
  }, [visits]);

  useEffect(() => {
    fetchChemistsList();
  }, []);

  useEffect(() => {
    if (user) fetchVisits();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChemistId || !date || !notes || !user) {
      setErrorMessage('Please fill all required fields.');
      setShowErrorModal(true);
      return;
    }

    try {
      await scheduleChemistVisit({
        chemistId: selectedChemistId,
        userId: user.id,
        date,
        notes,
      });
      await fetchVisits();
      setShowModal(false);
      setSelectedChemistId('');
      setDate('');
      setNotes('');
      setErrorMessage('Visit scheduled successfully!');
      setShowErrorModal(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to schedule visit');
      setShowErrorModal(true);
    }
  };

  const handleConfirmVisit = async (visitId) => {
    try {
      let userLatitude, userLongitude;
  
      // Try to get the current geolocation
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
        console.log('Geolocation success:', { userLatitude, userLongitude });
      } catch (geolocationError) {
        console.warn('Geolocation failed, falling back to stored location:', geolocationError);
        // Handle the case if geolocation fails, possibly fallback to stored location
      }
  
      // Sending the PUT request to the backend
      const res = await fetch(`${BASE_URL}/api/chemists/visits/${visitId}/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userLatitude,
          userLongitude,
        }),
      });
      
  
      const data = await res.json();
  
      // Handle the backend response
      if (!res.ok) {
        throw new Error(data.message || 'Failed to confirm visit');
      }
  
      // Show success or failure message based on backend response
      if (data.success === "true") {
        setErrorMessage('Visit confirmed successfully!');
        setShowErrorModal(true);  // Show success modal
      } else {
        setErrorMessage(data.message || 'Failed to confirm visit');
        setShowErrorModal(true);  // Show error modal
      }
  
      // Refresh the visits after confirmation
      await fetchVisits();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to confirm visit');
      setShowErrorModal(true);  // Show error modal in case of an exception
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
                <span className="text-4xl">🧪</span>
                Chemist Visit Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Schedule and track visits to your pharmaceutical partners</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>{scheduledVisits.length} Scheduled</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{confirmedVisits.length} Confirmed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{chemists.length} Total Chemists</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Schedule New Visit
            </motion.button>
          </div>
        </div>

        {/* Enhanced Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H7a2 2 0 01-2-2V9a1 1 0 01-1-1V7a1 1 0 011-1h3z" />
                  </svg>
                  Schedule Chemist Visit
                </h2>
                <p className="text-green-100 mt-2">Plan your next pharmaceutical consultation</p>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="chemist-select" className="block text-sm font-semibold text-gray-700 mb-2">
                    Choose Chemist <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="chemist-select"
                    value={selectedChemistId}
                    onChange={(e) => setSelectedChemistId(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    aria-required="true"
                  >
                    <option value="">-- Select Chemist --</option>
                    {chemists.map((chem) => (
                      <option key={chem._id} value={chem._id}>
                        {chem.firmName} - {chem.contactPersonName || 'Contact Person'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="date-input" className="block text-sm font-semibold text-gray-700 mb-2">
                    Visit Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date-input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="notes-input" className="block text-sm font-semibold text-gray-700 mb-2">
                    Visit Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="notes-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                    placeholder="Purpose of visit, products to discuss, or consultation details..."
                    rows="4"
                    aria-required="true"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50"
                    disabled={!selectedChemistId || !date || !notes}
                  >
                    Schedule Visit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

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

        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Scheduled Visits</h3>
          {scheduledVisits.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <div className="text-4xl mb-4">📅</div>
              <p className="text-gray-600 text-lg">No scheduled visits yet</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {scheduledVisits.map((visit) => (
                <motion.div
                  key={visit._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {visit.chemist?.firmName || 'Unknown Chemist'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Mobile:</span> {visit.chemist?.mobileNo || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(visit.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Notes:</span> {visit.notes}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConfirmVisit(visit._id)}
                    className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-sm"
                  >
                    Confirm Visit
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Confirmed Visits</h3>
          {confirmedVisits.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-gray-600 text-lg">No confirmed visits yet</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {confirmedVisits.map((visit) => (
                <motion.div
                  key={visit._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-xl shadow-md p-5 border border-green-100 hover:shadow-lg transition-all duration-300"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {visit.chemist?.firmName || 'Unknown Chemist'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Mobile:</span> {visit.chemist?.mobileNo || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(visit.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Notes:</span> {visit.notes}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Confirmed at:</span> {visit.latitude}, {visit.longitude}
                  </p>
                  <div className="mt-4 flex items-center text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Confirmed
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChemistVisiting;