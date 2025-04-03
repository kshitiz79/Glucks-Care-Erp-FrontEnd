// frontend/src/components/AddPdf.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPdf } from '../../api/pdfApi';

const AddPdf = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [type, setType] = useState('');

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !pdfFile || !type) {
      alert('Title, PDF file, and type are required.');
      return;
    }
    if (pdfFile.size > MAX_FILE_SIZE) {
      setFileSizeError(true);
      return;
    }
    setLoading(true);
    setFileSizeError(false);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('pdf', pdfFile);
      formData.append('type', type);

      const data = await createPdf(formData);
      alert(`PDF uploaded! ID: ${data.pdf._id}`);
      // Reset form
      setTitle('');
      setDescription('');
      setPdfFile(null);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setFileSizeError(true);
    } else {
      setFileSizeError(false);
      setPdfFile(file);
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New PDF</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter PDF title"
            />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the PDF"
              rows="4"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
    Document Type <span className="text-red-500">*</span>
  </label>
  <select
    id="type"
    value={type}
    onChange={(e) => setType(e.target.value)}
    className="w-full border border-gray-300 rounded-md px-4 py-2"
  >
    <option value="">Select type</option>
    <option value="pdf">PDF/File</option>
    <option value="brochure">Brochure</option>
  </select>
</motion.div>


          {/* PDF File */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-1">
              PDF File <span className="text-red-500">*</span>
            </label>
            <input
              id="pdfFile"
              className="w-full"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            {pdfFile && <p className="mt-2 text-sm text-gray-600">Selected: {pdfFile.name}</p>}
            {fileSizeError && (
              <p className="mt-2 text-sm text-red-600">
                File size exceeds the maximum limit of 10MB.
              </p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            disabled={loading || fileSizeError}
          >
            {loading ? (
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Uploading...
              </div>
            ) : (
              'Upload PDF'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddPdf;
