import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, updateUser } from '../../api/userApi';
import { fetchHeadOffices } from '../../api/headofficeApi';

const SingleUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',

    role: 'User',
    phone: '',
    headOffice: '',
  });
  const [headOffices, setHeadOffices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch user details
        const user = await fetchUserById(id);
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          headOffice: user.headOffice || '',
        
        });

        // Fetch head offices for dropdown
        const offices = await fetchHeadOffices();
        setHeadOffices(offices);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, formData);
      alert('User updated successfully!');
      navigate('/admin-dashboard/all-user');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Server error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        {/* Head Office */}
        <div>
          <label htmlFor="headOffice" className="block text-sm font-medium text-gray-700">Head Office</label>
          <select
            id="headOffice"
            name="headOffice"
            value={formData.headOffice}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">Select Head Office</option>
            {headOffices.map((office) => (
              <option key={office._id} value={office._id}>
                {office.name}
              </option>
            ))}
          </select>
        </div>
    
 
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all font-medium"
        >
          Update User
        </button>
      </form>
    </div>
  );
};



export default SingleUser;
