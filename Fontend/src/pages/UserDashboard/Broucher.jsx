import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPdfs, getSignedPdfUrl } from '../../api/pdfApi';

const Broucher = () => {
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrochures = async () => {
      try {
        const all = await getPdfs();
        const filtered = all.filter(doc => doc.type === 'brochure');

        const withUrls = await Promise.all(
          filtered.map(async doc => {
            const fileUrl = await getSignedPdfUrl(doc.fileKey);
            return { ...doc, fileUrl };
          })
        );

        setBrochures(withUrls);
      } catch (err) {
        console.error('Error fetching brochures:', err);
        setError('Failed to load brochures. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrochures();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading brochures...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!brochures.length) return <p className="text-center mt-10">No brochures found.</p>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Brochures</h1>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {brochures.map(({ _id, title, description, fileUrl }) => (
          <motion.div
            key={_id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-1">{title}</h2>
            <p className="text-gray-600 mb-2">{description || 'No description provided.'}</p>
            <iframe
              src={fileUrl}
              title={title}
              className="w-full h-40 border rounded"
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Broucher;
