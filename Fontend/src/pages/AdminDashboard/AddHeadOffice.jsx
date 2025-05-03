// src/pages/AddHeadOffice.js
import React, { useState, useEffect } from 'react';
import { fetchDoctors } from './../../api/doctorApi';
import { fetchHeadOffices, createHeadOffice } from './../../api/headofficeApi';
import BASE_URL from '../../BaseUrl/baseUrl';
const AddHeadOffice = () => {
  const [areaName, setAreaName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [headOffices, setHeadOffices] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctorList, setDoctorList] = useState([]);

  // Fetch head offices on component mount
  useEffect(() => {
    fetchHeadOffices()
      .then((data) => setHeadOffices(data))
      .catch((err) => console.error(err));
  }, []);


  // Fetch users from the backend
  useEffect(() => {
    fetch(`${BASE_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);
  // Fetch doctors from the backend
  useEffect(() => {
    fetchDoctors()
      .then((response) => {
        const data = Array.isArray(response) ? response : response.Data || [];
        setDoctorList(data);
      })
      .catch((err) => {
        console.error(err);
        setDoctorList([]);
      });
  }, []);

  const handleChange = (e) => {
    setAreaName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the API module function to create a new head office.
      const newHeadOffice = await createHeadOffice({ name: areaName });
      setHeadOffices([...headOffices, newHeadOffice]);
      setAreaName('');
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Head Offices</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          ADD Head Office
        </button>
      </div>
      
      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Head Office Name:
                </label>
                <input
                  type="text"
                  name="areakName"
                  value={areaName}
                  onChange={handleChange}
                  placeholder="Enter head office name"
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Head Office Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {headOffices.map((office) => {
          // For users, assume user.headOffice is a string
          const assignedUsersCount = users.filter(
            user => user.headOffice === office._id
          ).length;
          // For doctors, check if headOffice is an object (populated) or a string
          const assignedDoctorsCount = doctorList.filter(doctor => {
            if (!doctor.headOffice) return false;
            if (typeof doctor.headOffice === 'object' && doctor.headOffice._id) {
              return doctor.headOffice._id.toString() === office._id.toString();
            }
            return doctor.headOffice === office._id;
          }).length;
          
          return (
            <div
              key={office._id || office.name}
              className="bg-white rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{office.name}</h3>
              <div className="mt-3">
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Assigned Users:</span> {assignedUsersCount}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Assigned Doctors:</span> {assignedDoctorsCount}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddHeadOffice;
