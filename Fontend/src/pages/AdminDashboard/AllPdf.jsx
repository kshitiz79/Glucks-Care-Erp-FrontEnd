import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPdfs, deletePdf, updatePdf } from './../../api/pdfApi';

const AllPdf = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPdfId, setEditingPdfId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    try {
      const data = await getPdfs();
      setPdfs(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load PDFs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract file extension
  const getFileExtension = (filename) => {
    if (!filename || typeof filename !== 'string') return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PDF?')) return;
    try {
      await deletePdf(id);
      setPdfs((prev) => prev.filter((pdf) => pdf._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Server error. Please try again.');
    }
  };

  // Handle Edit
  const handleEdit = (id, currentTitle) => {
    setEditingPdfId(id);
    setEditingTitle(currentTitle);
  };

  const handleCancelEdit = () => {
    setEditingPdfId(null);
    setEditingTitle('');
  };

  const handleSaveEdit = async (id) => {
    try {
      await updatePdf(id, { title: editingTitle });
      // Update local state
      setPdfs((prev) =>
        prev.map((pdf) =>
          pdf._id === id ? { ...pdf, title: editingTitle } : pdf
        )
      );
      setEditingPdfId(null);
      setEditingTitle('');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Server error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading PDFs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">All PDFs</h1>

      {pdfs.length === 0 ? (
        <p>No PDFs available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pdfs.map((pdf) => {
            const fileExt = getFileExtension(pdf.fileUrl || '');
            const isPdf = fileExt === 'pdf';

            return (
              <motion.div
                key={pdf._id}
                className="bg-white rounded shadow p-4 border flex flex-col"
                whileHover={{ scale: 1.02 }}
              >
                {/* Title / Editing */}
                {editingPdfId === pdf._id ? (
                  <div className="mb-3">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="border p-2 w-full mb-2"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(pdf._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <h2 className="text-xl font-semibold mb-2 line-clamp-1">
                    {pdf.title}
                  </h2>
                )}

                {/* Description */}
                <p
                  className="text-gray-600 mb-4 flex-grow line-clamp-2"
                  title={pdf.description}
                >
                  {pdf.description || 'No description provided.'}
                </p>

              
                {/* Action Buttons */}
                <div className="flex space-x-2 mt-auto">
                  {editingPdfId !== pdf._id && (
                    <button
                      onClick={() => handleEdit(pdf._id, pdf.title)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit Name
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(pdf._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllPdf;
