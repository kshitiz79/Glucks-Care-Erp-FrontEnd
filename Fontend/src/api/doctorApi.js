
const BASE_URL = 'http://localhost:5050/api/doctors';


export const fetchDoctors = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to fetch doctors');
  }
  return await res.json();
};

/**
 
 * @param {Object} doctorData 
 */
export const createDoctor = async (doctorData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doctorData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to create doctor');
  }
  return await res.json();
};

/**

 * @param {string} id 
 * @param {Object} updatedData 
 */
export const updateDoctor = async (id, updatedData) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to update doctor');
  }
  return await res.json();
};

/**

 * @param {string} id 
 */
export const deleteDoctor = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to delete doctor');
  }
  return await res.json();
};
