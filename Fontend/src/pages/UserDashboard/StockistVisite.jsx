// src/components/StockistVisiting.jsx
import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from './../../context/AuthContext';
import { fetchStockists, scheduleStockistVisit, fetchStockistVisits, confirmStockistVisit } from './../../api/stockistApi';

const StockistVisiting = () => {
  const { user } = useContext(AuthContext);
  const [stockists, setStockists] = useState([]);
  const [visits, setVisits] = useState([]);
  const [scheduledVisits, setScheduledVisits] = useState([]);
  const [confirmedVisits, setConfirmedVisits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStockistId, setSelectedStockistId] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const fetchStockistsList = async () => {
    try {
      const data = await fetchStockists();
      setStockists(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to fetch stockists');
      setShowErrorModal(true);
    }
  };

  const fetchVisits = async () => {
    if (!user) return;
    try {
      const data = await fetchStockistVisits(user.id);
      setVisits(data);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to fetch visits');
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    const scheduled = visits.filter(v => !v.confirmed);
    const confirmed = visits.filter(v => v.confirmed);
    setScheduledVisits(scheduled);
    setConfirmedVisits(confirmed);
  }, [visits]);

  useEffect(() => {
    fetchStockistsList();
  }, []);

  useEffect(() => {
    if (user) fetchVisits();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStockistId || !date || !notes || !user) {
      setErrorMessage('Please fill all required fields.');
      setShowErrorModal(true);
      return;
    }

    try {
      await scheduleStockistVisit({
        stockistId: selectedStockistId,
        userId: user.id,
        date,
        notes,
      });
      await fetchVisits();
      setShowModal(false);
      setSelectedStockistId('');
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
      }

      const res = await confirmStockistVisit(visitId, { userLatitude, userLongitude });
      await fetchVisits();
      setErrorMessage('Visit confirmed successfully!');
      setShowErrorModal(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Failed to confirm visit');
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-12">
          <h2 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-indigo-600">🏢</span> Your Stockist Visits
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Schedule Stockist Visit</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Choose Stockist <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedStockistId}
                    onChange={e => setSelectedStockistId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="">-- Select Stockist --</option>
                    {stockists.map(stock => (
                      <option key={stock._id} value={stock._id}>
                        {stock.firmName}
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
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
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
              {scheduledVisits.map(visit => (
                <motion.div
                  key={visit._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {visit.stockist?.firmName || 'Unknown Stockist'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Mobile:</span> {visit.stockist?.mobileNumber || 'N/A'}
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
              {confirmedVisits.map(visit => (
                <motion.div
                  key={visit._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-xl shadow-md p-5 border border-green-100 hover:shadow-lg transition-all duration-300"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {visit.stockist?.firmName || 'Unknown Stockist'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Mobile:</span> {visit.stockist?.mobileNumber || 'N/A'}
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

export default StockistVisiting;