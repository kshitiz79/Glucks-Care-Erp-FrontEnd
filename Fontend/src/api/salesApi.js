// salesApi.js
const API_BASE = 'http://localhost:5050/api/sales';

// Get all sales
export async function fetchAllSales() {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Error fetching sales');
  }
  return await response.json();
}

// Get sales by user
export async function fetchSalesByUser(userId) {
  const response = await fetch(`${API_BASE}/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sales by user');
  }
  return await response.json();
}

// Create a new sales record
export async function createSale(payload) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Failed to create sales record.');
  }

  return await response.json();
}
