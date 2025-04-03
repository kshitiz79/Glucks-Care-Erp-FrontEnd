const API_URL = 'http://localhost:5050/api/pdfs';

export const createPdf = async (formData) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Error uplong PDF.');
  }

  return await res.json();
};

export const getPdfs = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Fad to fetch PDFs");
  }
  return await res.json();
};

export const getSignedPdfUrl = async (fileKey) => {
  const res = await fetch(`${API_URL}/signed-url/${fileKey}`);
  if (!res.ok) {
    throw new Error("Fai to geth pdf URL");
  }
  const data = await res.json();
  return data.fileUrl;
};

export const deletePdf = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Error delet.');
  }
  return await res.json();
};

export const updatePdf = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Err upda PDF.');
  }
  return await res.json();
};
