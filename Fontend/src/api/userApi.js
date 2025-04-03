// src/api/userApi.js

const USER_API_BASE = 'http://localhost:5050/api/users';

// Fetch all users
export async function fetchAllUsers() {
  const response = await fetch(USER_API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return await response.json();
}

// Fetch single user by ID
export async function fetchUserById(userId) {
  const response = await fetch(`${USER_API_BASE}/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return await response.json();
}

// Update user by ID
export async function updateUser(userId, payload) {
  const response = await fetch(`${USER_API_BASE}/${userId}`, {
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
  const response = await fetch(`${USER_API_BASE}/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error deleting user');
  }
  return await response.json();
}
