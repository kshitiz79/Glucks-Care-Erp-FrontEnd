// src/components/CreateUser.jsx
import React, { useState, useEffect } from 'react';
import { fetchHeadOffices } from '../../api/headofficeApi';
import { registerUser } from '../../api/authApi';

export default function CreateUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User', 
    phone: '',
    headOffice: '', 
  });

  const [headOffices, setHeadOffices] = useState([]);


  useEffect(() => {
    fetchHeadOffices()
      .then((data) => setHeadOffices(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateUser = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in name, email, and password.');
      return;
    }

    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        headOffice: formData.headOffice,
      });

      alert(`User created successfully! ID: ${data.user.id}`);

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'User',
        phone: '',
        headOffice: '',
      });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Server error. Please try again.');
    }
  };


  return (
    <div className="flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New User</h1>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="Enter user name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="Enter a secure password"
            />
          </div>

          {/* New Head Office Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="headOffice">
              Head Office
            </label>
            <select
              id="headOffice"
              name="headOffice"
              value={formData.headOffice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">Select Head Office</option>
              {headOffices.map((office) => (
                <option key={office._id} value={office._id}>
                  {office.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
              Phone (Optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="Phone number"
            />
          </div>
        </div>

        <button
          onClick={handleCreateUser}
          className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200 font-medium"
        >
          Create User
        </button>
      </div>
    </div>
  );
}
