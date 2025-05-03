import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../../context/AuthContext';
import BASE_URL from './../../BaseUrl/baseUrl';
import { FiSend, FiUser } from 'react-icons/fi';

const SendNotification = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isBroadcast, setIsBroadcast] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetching users except the current user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setUsers(data.filter(u => u._id !== user.id));  // Exclude current user
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token-based authorization
        },
        body: JSON.stringify({
          title,
          body,
          recipientIds: isBroadcast ? [] : selectedUsers,
          isBroadcast,
          senderId: user.id,  // Pass the user ID from the context
        }),
      });
  
      if (response.ok) {
        setSuccess(true);
        setTitle('');
        setBody('');
        setSelectedUsers([]);
        setTimeout(() => setSuccess(false), 3000);  // Hide success message after 3 seconds
      }
    } catch (err) {
      console.error('Error sending notification:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Send Notification</h1>
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Notification sent successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="broadcast"
            checked={isBroadcast}
            onChange={() => setIsBroadcast(!isBroadcast)}
            className="mr-2"
          />
          <label htmlFor="broadcast" className="text-gray-700">
            Send to all users
          </label>
        </div>

        {!isBroadcast && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Select Recipients</label>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded p-2">
              {users.map(user => (
                <div key={user._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`user-${user._id}`}
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleUserSelection(user._id)}
                    className="mr-2"
                  />
                  <label htmlFor={`user-${user._id}`} className="flex items-center">
                    <FiUser className="mr-2" />
                    {user.name} ({user.email})
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-3 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            {loading ? 'Sending...' : (
              <>
                <FiSend className="mr-2" />
                Send Notification
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendNotification;
