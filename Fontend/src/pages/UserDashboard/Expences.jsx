import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './../../context/AuthContext';
import BASE_URL from '../../BaseUrl/baseUrl';

const Expenses = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    category: 'travel',
    amount: '',
    description: '',
    bill: '',
    status: 'pending'
  });
  const [preview, setPreview] = useState('');
  const categories = ['travel', 'meals', 'vehicle', 'other'];

  useEffect(() => {
    if (user && user.id) {
      fetch(`${BASE_URL}/api/expenses?userId=${user.id}`)
        .then(response => response.json())
        .then(data => setExpenses(data))
        .catch(error => console.error('Error fetching expenses:', error));
    }
  }, [user]);
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, bill: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const expenseData = {
      userId: user.id,
      ...formData,
    };

    try {
      const response = await fetch('https://medi-glucks-erp.onrender.com/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
      if (!response.ok) throw new Error('Failed to submit expense');
      const newExpense = await response.json();
      setExpenses(prev => [...prev, newExpense]);
      setShowModal(false);
      setFormData({ category: 'travel', amount: '', description: '', bill: '', status: 'pending' });
      setPreview('');
    } catch (error) {
      console.error('Error during expense submission:', error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-indigo-600">📊</span> My Expenses
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-md"
          >
            <span className="text-lg">+</span> Add Expense
          </button>
        </div>

        {/* Expense Table */}
        {expenses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">No expenses found</p>
            <p className="text-gray-500 mt-2">Add your first expense to get started!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Category', 'Amount', 'Description', 'Bill', 'Date', 'Status'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense, index) => (
                    <tr
                      key={expense._id || expense.id}
                      className={`border-t hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="px-6 py-4 capitalize text-gray-800">{expense.category}</td>
                      <td className="px-6 py-4 text-gray-800">${expense.amount}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{expense.description}</td>
                      <td className="px-6 py-4">
                        {expense.bill && (
                          <a
                            href={expense.bill}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                          >
                            View Bill
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            expense.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : expense.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              expense.status === 'approved'
                                ? 'bg-green-500'
                                : expense.status === 'rejected'
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                            }`}
                          ></span>
                          {expense.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Expense Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Add New Expense</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    rows="3"
                    placeholder="Describe the expense"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Bill</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition-all"
                    accept="image/*"
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Bill preview"
                      className="mt-3 h-24 object-cover rounded-lg border border-gray-200 shadow-sm animate-fadeIn"
                    />
                  )}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                  >
                    Submit Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;