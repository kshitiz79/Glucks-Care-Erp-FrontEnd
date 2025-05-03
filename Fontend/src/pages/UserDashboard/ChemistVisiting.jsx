// src/components/ChemistVisiting.jsx
import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from './../../context/AuthContext';
import { fetchChemists, scheduleChemistVisit, fetchChemistVisits, confirmChemistVisit } from './../../api/chemistApi';

const BASE_URL = 'http://localhost:5050';

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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-12">
          <h2 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-indigo-600">🧪</span> Your Chemist Visits
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2"
          >
            <span className="text-lg">+</span> Schedule Visit
          </motion.button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Schedule Chemist Visit</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Choose Chemist <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedChemistId}
                    onChange={(e) => setSelectedChemistId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="">-- Select Chemist --</option>
                    {chemists.map((chem) => (
                      <option key={chem._id} value={chem._id}>
                        {chem.firmName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y"
                    placeholder="Add visit details"
                    rows="3"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                  >
                    Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
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