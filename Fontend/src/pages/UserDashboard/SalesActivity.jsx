import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from './../../context/AuthContext';
import { createSale, fetchSalesByUser } from '../../api/salesApi';

const SalesActivity = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Please log in to view sales activity.</p>
      </div>
    );
  }

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    salesRep: '',
    callNotes: '',
  });

  useEffect(() => {
    const loadUserSales = async () => {
      try {
        const data = await fetchSalesByUser(user.id);
        setSales(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) loadUserSales();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, userId: user.id };
    try {
      const savedSale = await createSale(payload);
      setSales(prev => [...prev, savedSale]);
      setFormData({ doctorName: '', salesRep: '', callNotes: '' });
      setShowModal(false);
    } catch (err) {
      console.error('Error submitting sales record:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg animate-pulse">Loading sales data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
          <span className="font-semibold">Error:</span> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-indigo-600">📈</span> Sales Activity
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg 
                       hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2"
          >
            <span className="text-lg">+</span> Add Sales
          </motion.button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add Sales Activity</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    id="doctorName"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="salesRep" className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Representative
                  </label>
                  <input
                    type="text"
                    id="salesRep"
                    name="salesRep"
                    value={formData.salesRep}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="callNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Call Notes
                  </label>
                  <textarea
                    id="callNotes"
                    name="callNotes"
                    value={formData.callNotes}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    rows="4"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 
                               transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                               transition-all shadow-md"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Sales Cards */}
        {sales.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">No sales activity recorded yet</p>
            <p className="text-gray-500 mt-2">Add your first sales record above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sales.map((sale) => (
              <motion.div
                key={sale._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 
                           hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className='flex-col'>



                <h3 className="text-lg font-semibold text-gray-900 truncate">
            {sale.doctorName}
</h3>
<div >
  <span className="text-xs text-gray-500  rounded-full">
    {new Date(sale.dateTime).toLocaleString()}
  </span>
</div>
</div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Sales Rep:</span> {sale.salesRep}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Notes:</span> {sale.callNotes}
                </p>
                {/* <p className="text-xs text-gray-500 mt-3">
                  Submitted by: {sale.userName || sale.user?.name || 'Unknown'}
                </p> */}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesActivity;