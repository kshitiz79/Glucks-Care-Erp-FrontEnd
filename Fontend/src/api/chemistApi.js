import BASE_URL from "../BaseUrl/baseUrl";





export const fetchChemists = async () => {
  const res = await fetch(`${BASE_URL}/api/chemists`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch chemists');
  }
  return await res.json();
};




export const createChemist = async (chemistData) => {
  const res = await fetch(`${BASE_URL}/api/chemists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chemistData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create chemist');
  }
  return await res.json();
};





export const deleteChemist = async (id) => {
  const res = await fetch(`${BASE_URL}/api/chemists/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to delete chemist');
  }
  return await res.json();
};

export const scheduleChemistVisit = async (visitData) => {
  const res = await fetch(`${BASE_URL}/api/chemists/visits`, {
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

export const fetchChemistVisits = async (userId) => {
  const res = await fetch(`${BASE_URL}/api/chemists/visits/user/${userId}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to fetch visits');
  }
  return await res.json();
};

export const confirmChemistVisit = async (visitId, locationData) => {
  const res = await fetch(`${BASE_URL}/api/chemists/visits/${visitId}/confirm`, {
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