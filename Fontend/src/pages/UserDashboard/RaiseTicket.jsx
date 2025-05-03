import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RaiseTicket = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    status: 'IN PROGRESS', // Default status
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [fetchError, setFetchError] = useState('');

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  // Fetch user's tickets
  const fetchUserTickets = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/tickets/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch tickets');
      }

      const data = await response.json();
      // Ensure data is an array; use data.Data if API returns an object
      const ticketData = Array.isArray(data) ? data : data.Data || [];
      setTickets(ticketData);
      setFetchError('');
    } catch (err) {
      setFetchError(err.message);
    }
  };

  useEffect(() => {
    if (user) fetchUserTickets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('userName', user.name);
    formDataToSend.append('status', formData.status);
    if (user._id) formDataToSend.append('userId', user._id);
    if (formData.image) formDataToSend.append('image', formData.image);
  
    try {
      const response = await fetch('http://localhost:5050/api/tickets', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Log error response
        throw new Error(errorData.msg || 'Failed to raise ticket');
      }
  
      alert('Ticket raised successfully!');
      setFormData({ title: '', description: '', image: null, status: 'IN PROGRESS' });
      document.querySelector('input[type="file"]').value = '';
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message);
    }
  };
  
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <span className="text-indigo-600">🎫</span> Raise a Ticket
          </h2>
          <p className="mt-2 text-gray-600">Submit your issues or requests with ease.</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-12 max-w-md mx-auto"
        >
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mb-4 text-center font-medium"
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
                placeholder="Enter ticket title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-y"
                required
                placeholder="Describe your issue or request"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image (Optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <motion.button
              type="submit"
              className={`w-full bg-indigo-600 text-white p-3 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Raise Ticket'}
            </motion.button>
          </form>
        </motion.div>

        {/* Tickets Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="text-indigo-600">📋</span> Your Tickets
          </h2>
          {fetchError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mb-6 text-center font-medium"
            >
              {fetchError}
            </motion.p>
          )}
{tickets.length === 0 ? (
  <motion.div className="text-center py-12 bg-white rounded-xl shadow-md">
    <div className="text-4xl mb-4">📭</div>
    <p className="text-gray-600 text-lg">You haven't raised any tickets yet.</p>
  </motion.div>
) : (
  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {tickets.map((ticket) => (
      <motion.div
        key={ticket._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{ticket.title}</h3>
        <p className="text-gray-600 mb-3 line-clamp-3">{ticket.description}</p>
        
        {/* Display Ticket Status */}
        <div className="text-sm font-semibold text-indigo-600 mb-3">
          Status: <span className="text-gray-600">{ticket.status}</span>
        </div>

        {ticket.image ? (
          <img
            src={ticket.image}
            alt={ticket.title}
            className="w-full h-40 object-cover rounded-lg mb-3"
            onError={(e) => {
              console.error('Image load error for ticket:', ticket._id);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <p className="text-gray-500 mb-3 text-sm">No image uploaded</p>
        )}
        
        <p className="text-sm text-gray-500">
          Raised on: {new Date(ticket.createdAt).toLocaleDateString()}
        </p>
      </motion.div>
    ))}
  </motion.div>
)}

        </motion.div>
      </div>
    </div>
  );
};

export default RaiseTicket;
