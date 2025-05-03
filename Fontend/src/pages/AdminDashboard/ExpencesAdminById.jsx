import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../../BaseUrl/baseUrl';

const ExpencesAdminById = () => {
  const { expenseId: userId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [loadingAction, setLoadingAction] = useState({});
  const [visibleBills, setVisibleBills] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/expenses?userId=${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Expenses not found (status: ${response.status})`);
        }
        return response.json();
      })
      .then(data => setExpenses(data))
      .catch(error => console.error('Error fetching expenses:', error));
  }, [userId]);

  const handleApprove = async (id) => {
    setLoadingAction(prev => ({ ...prev, [id]: 'approve' }));
    try {
      const response = await fetch(`${BASE_URL}/api/expenses/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!response.ok) throw new Error('Failed to approve expense');
      const updatedExpense = await response.json();
      setExpenses(prev =>
        prev.map(exp => (exp._id === updatedExpense._id ? updatedExpense : exp))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoadingAction(prev => ({ ...prev, [id]: null })), 500);
    }
  };

  const handleReject = async (id) => {
    setLoadingAction(prev => ({ ...prev, [id]: 'reject' }));
    try {
      const response = await fetch(`${BASE_URL}/api/expenses/${id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!response.ok) throw new Error('Failed to reject expense');
      const updatedExpense = await response.json();
      setExpenses(prev =>
        prev.map(exp => (exp._id === updatedExpense._id ? updatedExpense : exp))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoadingAction(prev => ({ ...prev, [id]: null })), 500);
    }
  };

  const toggleBillVisibility = (id) => {
    setVisibleBills(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (expenses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-gray-600 text-lg animate-pulse">Loading expense details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-indigo-600">💰</span> Expense Requests
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <span>←</span> Back
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {expenses.map(expense => (
            <div
              key={expense._id}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100 transition-all duration-300 hover:shadow-lg"
            >
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">User:</span> {expense.userName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Category:</span> {expense.category}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Amount:</span> ${expense.amount}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Description:</span> {expense.description}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Status:</span>{' '}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      expense.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : expense.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {expense.status}
                  </span>
                </p>
              </div>

              {expense.bill && (
                <div className="mt-4">
                  <button
                    onClick={() => toggleBillVisibility(expense._id)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors"
                  >
                    {visibleBills[expense._id] ? 'Hide Bill' : 'View Bill'}
                  </button>
                  {visibleBills[expense._id] && (
                    <div className="mt-2 animate-fadeIn">
                      <img
                        src={expense.bill}
                        alt="Expense Bill"
                        className="max-w-full h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleApprove(expense._id)}
                  disabled={loadingAction[expense._id] || expense.status !== 'pending'}
                  className={`flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all ${
                    loadingAction[expense._id] === 'approve'
                      ? 'bg-green-400 animate-pulse'
                      : 'bg-green-600 hover:bg-green-700'
                  } ${expense.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loadingAction[expense._id] === 'approve' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(expense._id)}
                  disabled={loadingAction[expense._id] || expense.status !== 'pending'}
                  className={`flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all ${
                    loadingAction[expense._id] === 'reject'
                      ? 'bg-red-400 animate-pulse'
                      : 'bg-red-600 hover:bg-red-700'
                  } ${expense.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loadingAction[expense._id] === 'reject' ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpencesAdminById;