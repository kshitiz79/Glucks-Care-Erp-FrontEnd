import BASE_URL from "../BaseUrl/baseUrl";

export const fetchDoctors = async () => {
  const res = await fetch(`${BASE_URL}/api/doctors`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch doctors');
  }
  return await res.json();
};

export const createDoctor = async (doctorData) => {
  const res = await fetch(`${BASE_URL}/api/doctors`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(doctorData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create doctor');
  }
  return await res.json();
};

export const updateDoctor = async (id, updatedData) => {
  const res = await fetch(`${BASE_URL}/api/doctors/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update doctor');
  }
  return await res.json();
};

export const deleteDoctor = async (id) => {
  const res = await fetch(`${BASE_URL}/api/doctors/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete doctor');
  }
  return await res.json();
};