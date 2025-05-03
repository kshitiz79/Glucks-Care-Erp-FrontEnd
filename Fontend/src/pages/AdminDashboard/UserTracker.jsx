import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {  AnimatePresence  } from 'framer-motion';
import BASE_URL from '../../BaseUrl/baseUrl';
import { motion } from 'framer-motion';
export default function UserTracker() {
  const [groupedLocations, setGroupedLocations] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });

  useEffect(() => {
    fetch(`${BASE_URL}/api/locations`)
      .then(response => response.json())
      .then(data => {
        const grouped = {};
        data.forEach(loc => {
          const key = loc.userId ? loc.userId : "N/A";
          if (!grouped[key] || new Date(loc.timestamp) > new Date(grouped[key].timestamp)) {
            grouped[key] = loc;
          }
        });
        setGroupedLocations(grouped);
      })
      .catch(err => console.error('Error fetching locations:', err));
  }, []);

  const handleUserCardClick = (userId) => {
    const loc = groupedLocations[userId];
    if (loc) {
      setSelectedUser(userId);
      setMapCenter({ lat: loc.latitude, lng: loc.longitude });
    }
  };

  const containerStyle = { width: '100%', height: '500px' }; // Increased height for better visibility

  return (
    <div className="min-h-screen  p-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-gray-800 mb-8 text-center"
      >
        User Location Tracker
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          {Object.keys(groupedLocations).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No location data available</p>
          ) : (
            <div className="space-y-4">
              {Object.keys(groupedLocations).map(userId => {
                const loc = groupedLocations[userId];
                const isSelected = selectedUser === userId;
                return (
                  <motion.div
                    key={userId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUserCardClick(userId)}
                    className={`rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    } border shadow-sm`}
                  >
                    <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                      {loc.userName ? loc.userName : `User ${userId}`}
                    </h3>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Lat: {loc.latitude.toFixed(4)}</p>
                      <p>Lng: {loc.longitude.toFixed(4)}</p>
                      <p className="text-xs mt-1 text-gray-500">
                        Updated: {new Date(loc.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-2/3"
        >
          <div className="bg-white rounded-2xl shadow-lg p-4">
          <LoadScript googleMapsApiKey="AIzaSyCLRC2KUtUshQ7B1YX_gFaKYadrpThcM3g">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={12}
                options={{
                  mapTypeControl: true,
                  streetViewControl: false,
                  fullscreenControl: true,
                }}
              >
                <AnimatePresence>
                  {selectedUser && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Marker
                        position={mapCenter}
                        animation={window.google?.maps?.Animation?.DROP}
                        title={groupedLocations[selectedUser]?.userName || `User ${selectedUser}`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </GoogleMap>
            </LoadScript>
          </div>
        </motion.div>
      </div>
    </div>
  );
}