// src/pages/AdminAddDoctor.jsx
import React, { useState, useEffect } from 'react';
import BASE_URL from '../../BaseUrl/baseUrl';

const AdminAddDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [headOffices, setHeadOffices] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    location: '',
    email: '',
    phone: '',
    registration_number: '',
    years_of_experience: '',
    date_of_birth: '',
    gender: '',
    anniversary: '',
    head_office: '',
 
  });

  // Fetch doctors from the backend on mount
  useEffect(() => {
    fetch(`${BASE_URL}/api/doctors`)
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error('Error fetching doctors:', err));
  }, []);
  
  useEffect(() => {
    fetch(`${BASE_URL}/api/headoffices`)
      .then(res => res.json())
      .then(data => setHeadOffices(data))
      .catch(err => console.error('Error fetching head offices:', err));
  }, []);

  // Fetch sales reps (users) from the backend on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://medi-glucks-erp.onrender.com/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          specialization: formData.specialization,
          location: formData.location,
          email: formData.email,
          phone: formData.phone,
          registration_number: formData.registration_number,
          years_of_experience: formData.years_of_experience,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          anniversary: formData.anniversary,
          head_office: formData.head_office,
         
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || 'Error creating doctor.');
        return;
      }
      const newDoctor = await res.json();
      setDoctors(prev => [...prev, newDoctor]);
      alert('Doctor created successfully!');
      setFormData({
        name: '',
        specialization: '',
        location: '',
        email: '',
        phone: '',
        registration_number: '',
        years_of_experience: '',
        date_of_birth: '',
        gender: '',
        anniversary: '',
        head_office: '',
     
      });
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert('Server error. Please try again.');
    }
  };

  return (
    <div className="p-8 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="md:text-3xl text-xl font-extrabold text-indigo-800 drop-shadow-lg">
          Doctors
        </h2>
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="md:px-6 md:py-2 py-1 px-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl text-xs md:text-base hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          {showForm ? 'Close Form' : '+ Add Doctor'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-500 ease-in-out scale-100 hover:scale-102"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Add New Doctor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {/* Specialization */}
            <div>
              <label htmlFor="specialization" className="block text-sm font-semibold text-gray-700 mb-2">
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {/* Registration Number */}
            <div>
              <label htmlFor="registration_number" className="block text-sm font-semibold text-gray-700 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                id="registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {/* Years of Experience */}
            <div>
              <label htmlFor="years_of_experience" className="block text-sm font-semibold text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                id="years_of_experience"
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {/* Date of Birth */}
            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>
            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Anniversary */}
            <div>
              <label htmlFor="anniversary" className="block text-sm font-semibold text-gray-700 mb-2">
                Anniversary
              </label>
              <input
                type="date"
                id="anniversary"
                name="anniversary"
                value={formData.anniversary}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            {/* Head Office Dropdown */}
            <div>
              <label htmlFor="head_office" className="block text-sm font-semibold text-gray-700 mb-2">
                Head Office
              </label>
              <select
                id="head_office"
                name="head_office"
                value={formData.head_office}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Head Office</option>
                {headOffices.map((office) => (
                  <option key={office._id} value={office._id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Sales Representative Dropdown */}
            
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              Add Doctor
            </button>
          </div>
        </form>
      )}

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-105"
            style={{ perspective: '1000px' }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3 truncate">
              {doctor.name}
            </h3>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Specialization:</strong> {doctor.specialization}
            </p>
            <p className="text-gray-600 mb-2">
              <strong className="text-indigo-700">Experience:</strong> {doctor.years_of_experience} years
            </p>
            <p className="text-gray-600">
              <strong className="text-indigo-700">Location:</strong> {doctor.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAddDoctor;
