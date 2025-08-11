// src/api/stateApi.js
import BASE_URL from "../BaseUrl/baseUrl";

// Fetch all states
export const fetchStates = async () => {
  const res = await fetch(`${BASE_URL}/api/states`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch states');
  }
  return await res.json();
};

// Create a new state
export const createState = async (stateData) => {
  const res = await fetch(`${BASE_URL}/api/states`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stateData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create state');
  }
  return await res.json();
};

// Update a state
export const updateState = async (id, stateData) => {
  const res = await fetch(`${BASE_URL}/api/states/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stateData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update state');
  }
  return await res.json();
};

// Delete a state
export const deleteState = async (id) => {
  const res = await fetch(`${BASE_URL}/api/states/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete state');
  }
  return await res.json();
};

// Get state by ID
export const fetchStateById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/states/${id}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch state');
  }
  return await res.json();
};