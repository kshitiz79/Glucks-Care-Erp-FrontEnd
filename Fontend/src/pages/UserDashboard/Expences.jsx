import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './../../context/AuthContext';
import BASE_URL from '../../BaseUrl/baseUrl';

const Expenses = () => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const [formData, setFormData] = useState({
    category: 'travel',
    description: '',
    bill: '',
    status: 'pending',
    travelDetails: [{ from: '', to: '', km: '' }],
    amount: '',
    dailyAllowanceType: 'headoffice'
  });

  const [preview, setPreview] = useState('');
  const categories = [
    { value: 'travel', label: 'Travel Allowance' },
    { value: 'daily', label: 'Daily Allowance' }
  ];
  const dailyAllowanceTypes = [
    { value: 'headoffice', label: 'Head Office', amount: 150 },
    { value: 'outside', label: 'Outside Head Office', amount: 175 }
  ];

  // Fetch existing expenses for the logged-in user
  useEffect(() => {
    if (user && user.id) {
      fetch(`${BASE_URL}/api/expenses?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setExpenses(data))
        .catch(err => console.error('Error fetching expenses:', err));
    }
  }, [user]);

  // Auto-calculate amount based on category
  useEffect(() => {
    if (formData.category === 'travel') {
      const totalKm = formData.travelDetails.reduce(
        (sum, leg) => sum + (Number(leg.km) || 0),
        0
      );
      const computed = (totalKm * 2.4).toFixed(2);
      setFormData(fd => ({ ...fd, amount: computed }));
    } else if (formData.category === 'daily') {
      const allowance = dailyAllowanceTypes.find(
        type => type.value === formData.dailyAllowanceType
      );
      setFormData(fd => ({ ...fd, amount: allowance.amount }));
    }
  }, [formData.travelDetails, formData.category, formData.dailyAllowanceType]);

  // Handle bill file upload preview
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(fd => ({ ...fd, bill: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Travel leg management
  const addLeg = () => {
    setFormData(fd => {
      const lastLeg = fd.travelDetails[fd.travelDetails.length - 1];
      const newLeg = {
        from: lastLeg && lastLeg.to ? lastLeg.to : '',
        to: '',
        km: ''
      };
      return {
        ...fd,
        travelDetails: [...fd.travelDetails, newLeg]
      };
    });
  };

  const updateLeg = (idx, field, value) => {
    const details = [...formData.travelDetails];
    details[idx][field] = value;
    setFormData(fd => ({ ...fd, travelDetails: details }));
  };

  const removeLeg = idx => {
    setFormData(fd => ({
      ...fd,
      travelDetails: fd.travelDetails.filter((_, i) => i !== idx)
    }));
  };

  // Submit new expense
  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      userId: user.id,
      category: formData.category,
      description: formData.description,
      bill: formData.bill,
      status: formData.status,
      amount: formData.amount,
      travelDetails:
        formData.category === 'travel' ? formData.travelDetails : undefined,
      dailyAllowanceType:
        formData.category === 'daily' ? formData.dailyAllowanceType : undefined
    };

    try {
      const res = await fetch(`${BASE_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to submit expense');
      const newExpense = await res.json();
      setExpenses(prev => [...prev, newExpense]);
      setShowModal(false);
      setFormData({
        category: 'travel',
        description: '',
        bill: '',
        status: 'pending',
        travelDetails: [{ from: '', to: '', km: '' }],
        amount: '',
        dailyAllowanceType: 'headoffice'
      });
      setPreview('');
    } catch (err) {
      console.error(err);
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
                    {['Category', 'Amount', 'Description', 'Bill', 'Date', 'Status'].map(
                      header => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp, idx) => (
                    <tr
                      key={exp._id}
                      className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-t hover:bg-gray-50 transition-colors duration-200`}
                    >
                      <td className="px-6 py-4 capitalize text-gray-800">
                        {exp.category === 'travel' ? 'Travel Allowance' : 'Daily Allowance'}
                      </td>
                      <td className="px-6 py-4 text-gray-800">₹{exp.amount}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{exp.description}</td>
                      <td className="px-6 py-4">
                        {exp.bill && (
                          <a
                            href={exp.bill}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            View Bill
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            exp.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : exp.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              exp.status === 'approved'
                                ? 'bg-green-500'
                                : exp.status === 'rejected'
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                            }`}
                          ></span>
                          {exp.status}
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
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Add New Expense</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    {categories.map(c => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Daily Allowance Type */}
                {formData.category === 'daily' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allowance Type</label>
                    <select
                      value={formData.dailyAllowanceType}
                      onChange={e => setFormData({ ...formData, dailyAllowanceType: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      {dailyAllowanceTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Travel Details */}
                {formData.category === 'travel' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Legs</label>
                    {formData.travelDetails.map((leg, i) => (
                      <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="From"
                          value={leg.from}
                          onChange={e => updateLeg(i, 'from', e.target.value)}
                          className="p-2 border rounded"
                          required
                        />
                        <input
                          type="text"
                          placeholder="To"
                          value={leg.to}
                          onChange={e => updateLeg(i, 'to', e.target.value)}
                          className="p-2 border rounded"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Km"
                          value={leg.km}
                          onChange={e => updateLeg(i, 'km', e.target.value)}
                          className="p-2 border rounded"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeLeg(i)}
                          className="text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addLeg}
                      className="mb-4 text-indigo-600 hover:underline"
                    >
                      + Add another leg
                    </button>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (auto-calculated)</label>
                      <input
                        type="text"
                        readOnly
                        value={formData.amount}
                        className="w-full p-3 border rounded bg-gray-100"
                      />
                    </div>
                  </div>
                )}

                {/* Daily Amount (read-only) */}
                {formData.category === 'daily' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (auto-calculated)</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.amount}
                      className="w-full p-3 border rounded bg-gray-100"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    rows="3"
                    placeholder="Describe the expense"
                  />
                </div>

                {/* Bill Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Bill</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition-all"
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Bill preview"
                      className="mt-3 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                  )}
                </div>

                {/* Actions */}
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