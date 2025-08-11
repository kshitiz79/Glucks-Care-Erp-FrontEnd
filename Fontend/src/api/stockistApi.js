// src/api/stockistApi.js

import BASE_URL from "../BaseUrl/baseUrl";









export const fetchStockists = async () => {
  const res = await fetch(`${BASE_URL}/api/stockists`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch stockists');
  }
  return await res.json();
};

/**
 * Update an existing stockist by ID
 */
export const updateStockist = async (id, stockistData) => {
  const res = await fetch(`${BASE_URL}/api/stockists/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stockistData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update stockist');
  }
  return await res.json();
};


export const createStockist = async (stockistData) => {
  const res = await fetch(`${BASE_URL}/api/stockists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stockistData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create stockist');
  }
  return await res.json();
};





export const deleteStockist = async (id) => {
  const res = await fetch(`${BASE_URL}/api/stockists/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete stockist');
  }
  return await res.json();
};






export const scheduleStockistVisit = async (visitData) => {
  const res = await fetch(`${BASE_URL}/api/stockists/visits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visitData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to schedule visit');
  }
  return await res.json();
};






export const fetchStockistVisits = async (userId) => {
  const res = await fetch(`${BASE_URL}/api/stockists/visits/user/${userId}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch visits');
  }
  return await res.json();
};






export const confirmStockistVisit = async (visitId, locationData) => {
  const res = await fetch(`${BASE_URL}/api/stockists/visits/${visitId}/confirm`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(locationData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to confirm visit');
  }
  return await res.json();
};