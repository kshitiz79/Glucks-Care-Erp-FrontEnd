import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 1) Import the API functions
import { fetchUserById, updateUser, deleteUser } from '../../api/userApi';

const SingleUser = () => {
  const { id } = useParams(); // read :id from the route
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
  });

  // 2) Fetch user on mount (or when ID changes)
  useEffect(() => {
    fetchUserById(id)
      .then((data) => {
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone || '',
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  // 3) Update form state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4) Handle updating the user
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUser(id, formData);
      setUser(updatedUser);
      setIsEditing(false);
      alert('User updated successfully!');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error updating user');
    }
  };

  // 5) Handle deleting the user
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        alert('User deleted successfully');
        // After deletion, navigate back to all users
        navigate('/admin-dashboard/all-user');
      } catch (error) {
        console.error(error);
        alert(error.message || 'Error deleting user');
      }
    }
  };

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen flex flex-col items-start justify-start">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          {/* User Avatar Placeholder */}
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.phone && (
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
            )}
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            {/* Add more fields as needed */}
          </div>
        )}

        <div className="mt-6 flex space-x-4">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => navigate('/admin-dashboard/all-user')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Back to Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
