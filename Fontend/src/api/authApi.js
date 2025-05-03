// authApi.js

import BASE_URL from "../BaseUrl/baseUrl";



// Login user
export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    // If server responded with an error message
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Invalid credentials');
  }

  return await response.json();
}
export async function registerUser(payload) {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Error creating user.');
  }

  return await response.json();
}