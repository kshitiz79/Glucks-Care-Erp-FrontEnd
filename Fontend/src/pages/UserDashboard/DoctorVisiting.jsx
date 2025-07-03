import React, { useContext, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import BASE_URL from '../../BaseUrl/baseUrl';

const DoctorVisiting = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [visits, setVisits] = useState([]);
  const [scheduledVisits, setScheduledVisits] = useState([]);
  const [confirmedVisits, setConfirmedVisits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [rescheduleVisit, setRescheduleVisit] = useState(null);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    try {
      const cachedDoctors = localStorage.getItem('doctors');
      if (cachedDoctors) {
        setDoctors(JSON.parse(cachedDoctors));
        setIsLoading(false);
        return;
      }
      const res = await fetch(`${BASE_URL}/api/doctors`);
      if (!res.ok) throw new Error('Failed to fetch doctors');
      const data = await res.json();
      setDoctors(data);
      localStorage.setItem('doctors', JSON.stringify(data));
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch doctors');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVisits = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/doctor-visits/user/${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch visits');
      const data = await res.json();
      setVisits(data);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch visits');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    if (user) fetchVisits();
  }, [user, fetchVisits]);

  useEffect(() => {
    setScheduledVisits(visits.filter((v) => !v.confirmed));
    setConfirmedVisits(visits.filter((v) => v.confirmed));
  }, [visits]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    if (!selectedDoctorId || !date || !notes || !user) {
      setErrorMessage('Please fill all required fields.');
      setShowErrorModal(true);
      return;
    }
    if (date < today) {
      setErrorMessage('Please select a future date.');
      setShowErrorModal(true);
      return;
    }
    try {
      setIsLoading(true);
      const endpoint = rescheduleVisit
        ? `${BASE_URL}/api/doctor-visits/${rescheduleVisit._id}`
        : `${BASE_URL}/api/doctor-visits`;
      const method = rescheduleVisit ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          userId: user.id,
          date,
          notes,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${rescheduleVisit ? 'reschedule' : 'schedule'} visit`);
      }
      await fetchVisits();
      setShowModal(false);
      setRescheduleVisit(null);
      setSelectedDoctorId('');
      setDate('');
      setNotes('');
      setErrorMessage(`Visit ${rescheduleVisit ? 'rescheduled' : 'scheduled'} successfully!`);
      setShowErrorModal(true);
    } catch (error) {
      setErrorMessage(error.message || `Failed to ${rescheduleVisit ? 'reschedule' : 'schedule'} visit`);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmVisit = async (visitId) => {
    setIsLoading(true);
    setErrorMessage('Fetching location...');
    setShowErrorModal(true);
    try {
      let userLatitude, userLongitude;
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        });
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
      } catch (geolocationError) {
        setErrorMessage('Unable to get location. Please allow location access.');
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }
      const res = await fetch(`${BASE_URL}/api/doctor-visits/${visitId}/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userLatitude, userLongitude }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to confirm visit');
      if (data.status) {
        setErrorMessage('Visit confirmed successfully!');
        setShowErrorModal(true);
      }
      await fetchVisits();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to confirm visit');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-12">
          <h2 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-indigo-600" aria-label="Doctor icon">🩺</span> Your Doctor Visits
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setRescheduleVisit(null);
              setShowModal(true);
            }}
            className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2"
            disabled={isLoading}
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {rescheduleVisit ? 'Reschedule Doctor Visit' : 'Schedule Doctor Visit'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="doctor-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Choose Doctor <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="doctor-select"
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    aria-required="true"
                    disabled={isLoading}
                  >
                    <option value="">-- Select Doctor --</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} ({doc.specialization})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date-input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    aria-required="true"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="notes-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="notes-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y"
                    placeholder="Add visit details"
                    rows="3"
                    aria-required="true"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : rescheduleVisit ? 'Reschedule' : 'Schedule'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setRescheduleVisit(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
                    disabled={isLoading}
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
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : scheduledVisits.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <div className="text-4xl mb-4" aria-label="Calendar icon">📅</div>
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
                    {visit.doctor?.name || 'Unknown Doctor'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Specialization:</span>{' '}
                    {visit.doctor?.specialization || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(visit.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Notes:</span> {visit.notes}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleConfirmVisit(visit._id)}
                    className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-sm"
                    disabled={isLoading}
                  >
                    Confirm Visit
                  </motion.button>
                  <button
                    onClick={() => {
                      setRescheduleVisit(visit);
                      setSelectedDoctorId(visit.doctor?._id || '');
                      setDate(visit.date.split('T')[0]);
                      setNotes(visit.notes);
                      setShowModal(true);
                    }}
                    className="mt-2 text-sm text-indigo-600 hover:underline"
                    disabled={isLoading}
                  >
                    Reschedule
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Confirmed Visits</h3>
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : confirmedVisits.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <div className="text-4xl mb-4" aria-label="Checkmark icon">✅</div>
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
                    {visit.doctor?.name || 'Unknown Doctor'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Specialization:</span>{' '}
                    {visit.doctor?.specialization || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(visit.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Notes:</span> {visit.notes}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Confirmed at:</span>{' '}
                    {visit.latitude && visit.longitude ? `${visit.latitude}, ${visit.longitude}` : 'N/A'}
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

export default DoctorVisiting;