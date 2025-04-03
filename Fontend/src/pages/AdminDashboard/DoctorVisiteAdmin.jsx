import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorVisiteAdmin = () => {
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState('');
  const [visitsByUser, setVisitsByUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5050/api/doctor-visits')
      .then((res) => res.json())
      .then((data) => {
        setVisits(data);
        groupVisitsByUser(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  const groupVisitsByUser = (allVisits) => {
    const groups = {};
    allVisits.forEach((visit) => {
      if (visit.user && visit.user._id) {
        const userId = visit.user._id;
        const userName = visit.user.name || 'Unknown User';
        if (!groups[userId]) {
          groups[userId] = { userId, userName, visits: [] };
        }
        groups[userId].visits.push(visit);
      }
    });
    setVisitsByUser(groups);
  };

  const handleConfirmVisit = (visitId) => {
    fetch(`http://localhost:5050/api/doctor-visits/${visitId}/confirm`, {
      method: 'PUT',
    })
      .then((res) => res.json())
      .then((data) => {
        return fetch('http://localhost:5050/api/doctor-visits');
      })
      .then((res) => res.json())
      .then((data) => {
        setVisits(data);
        groupVisitsByUser(data);
      })
      .catch((err) => setError(err.message));
  };

  const handleUserCardClick = (userId) => {
    navigate(`/admin-dashboard/admin/visits/${userId}`);
  };

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <span className="text-indigo-600">🩺</span> Doctor Visits Dashboard
          </h1>

        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 shadow-md">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Error:</span> {error}
            </div>
          </div>
        )}

        {/* User Cards */}
        {Object.keys(visitsByUser).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-gray-600 text-lg">No visits scheduled</p>
            <p className="text-gray-500 mt-2">Check back later for new requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.values(visitsByUser).map((userGroup) => {
              const { userId, userName, visits } = userGroup;
              const confirmedCount = visits.filter((v) => v.confirmed).length;
              const totalCount = visits.length;

              return (
                <div
                  key={userId}
                  onClick={() => handleUserCardClick(userId)}
                  className="group bg-white rounded-xl shadow-md p-6 cursor-pointer 
                           transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
                           border border-gray-100"
                >
                  {/* User Avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-xl font-semibold text-indigo-600">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {userName}
                      </h2>
                      <p className="text-sm text-gray-500">ID: {userId.slice(-6)}</p>
                    </div>
                  </div>

                  {/* Visit Stats */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Scheduled Visits</span>
                      <span className="text-lg font-semibold text-indigo-600">{totalCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Confirmed</span>
                      <span className="text-lg font-semibold text-green-600">{confirmedCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending</span>
                      <span className="text-lg font-semibold text-yellow-600">
                        {totalCount - confirmedCount}
                      </span>
                    </div>
                  </div>

                  {/* Action Indicator */}
                  <div className="mt-4 text-sm text-gray-500 flex items-center justify-end">
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                    Click to view details
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorVisiteAdmin;