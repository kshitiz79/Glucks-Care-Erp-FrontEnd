import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BASE_URL from '../../BaseUrl/baseUrl';

const ExpencesAdmin = () => {
  const [groupedExpenses, setGroupedExpenses] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/expenses`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          const groups = data.reduce((acc, expense) => {
            const userId = expense.user;
            if (!acc[userId]) {
              acc[userId] = {
                userId,
                userName: expense.userName,
                expenses: []
              };
            }
            acc[userId].expenses.push(expense);
            return acc;
          }, {});
          setGroupedExpenses(Object.values(groups));
        } else {
          console.error('Error fetching expenses:', data.message);
          setGroupedExpenses([]);
        }
      })
      .catch(error => console.error('Error fetching expenses:', error));
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-indigo-600">📊</span>  Expenses Dashboard
          </h1>
       
        </div>

        {/* Stats Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groupedExpenses.map(group => (
            <Link
              key={group.userId}
              to={`/admin-dashboard/admin-expences/${group.userId}`}
              className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="p-6">
                {/* User Avatar and Name */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-xl font-semibold text-indigo-600">
                      {group.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {group.userName}
                    </h2>
                    <p className="text-sm text-gray-500">User ID: {group.userId.slice(-6)}</p>
                  </div>
                </div>

                {/* Expense Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending Requests</span>
                    <span className="text-lg font-semibold text-indigo-600">
                      {group.expenses.length}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    Click to review
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {groupedExpenses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">No expense requests found</p>
            <p className="text-gray-500 mt-2">Check back later for new submissions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpencesAdmin;