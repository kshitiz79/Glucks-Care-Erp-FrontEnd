// src/api/userApi.js

import BASE_URL from "../BaseUrl/baseUrl";


// Fetch all users
export async function fetchAllUsers() {
  const response = await fetch(`${BASE_URL}/api/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return await response.json();
}


export async function fetchUserById(userId) {
  const response = await fetch(`${BASE_URL}/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return await response.json();
}


export async function updateUser(userId, payload) {
  const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Error updating user');
  }
  return await response.json();
}

// Delete user by ID
export async function deleteUser(userId) {
  const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error deleting user');
  }
  return await response.json();
}
