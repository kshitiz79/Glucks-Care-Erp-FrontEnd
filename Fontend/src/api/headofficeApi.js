// src/api/headofficeApi.js
const BASE_URL = 'http://localhost:5050/api/headoffices';

/**
 * Fetch all head offices.
 */
export const fetchHeadOffices = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to fetch head offices');
  }
  return await res.json();
};

/**
 * Create a new head office.
 * @param {Object} data - The head office data (e.g., { name: 'Office Name' }).
 */
export const createHeadOffice = async (data) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to create head office');
  }
  return await res.json();
};

/**
 * Update an existing head office.
 * @param {string} id - The head office ID.
 * @param {Object} updatedData - The data to update.
 */
export const updateHeadOffice = async (id, updatedData) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to update head office');
  }
  return await res.json();
};

/**
 * Delete a head office.
 * @param {string} id - The head office ID.
 */
export const deleteHeadOffice = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to delete head office');
  }
  return await res.json();
};
