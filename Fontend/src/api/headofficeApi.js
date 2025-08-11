// src/api/headofficeApi.js

import BASE_URL from "../BaseUrl/baseUrl";

/**
 * Fetch all head offices.
 */
export const fetchHeadOffices = async () => {
  const res = await fetch(`${BASE_URL}/api/headoffices`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch head offices');
  }
  return await res.json();
};

/**
 * Fetch head office by ID.
 */
export const fetchHeadOfficeById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/headoffices/${id}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch head office');
  }
  return await res.json();
};

/**
 * Create a new head office.
 */
export const createHeadOffice = async (data) => {
  const res = await fetch(`${BASE_URL}/api/headoffices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create head office');
  }
  return await res.json();
};

/**
 * Update an existing head office.
 */
export const updateHeadOffice = async (id, updatedData) => {
  const res = await fetch(`${BASE_URL}/api/headoffices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update head office');
  }
  return await res.json();
};

/**
 * Delete a head office.
 */
export const deleteHeadOffice = async (id) => {
  const res = await fetch(`${BASE_URL}/api/headoffices/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete head office');
  }
  return await res.json();
};
